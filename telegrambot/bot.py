import os
import json
import logging
import threading
import html
import telegram
from http.server import HTTPServer, BaseHTTPRequestHandler
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, InputMediaPhoto
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from config import BOT_TOKEN, ADMIN_CHAT_ID, ADMIN_USERNAME, BANK_ACCOUNTS

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

PRICES_FILE = os.path.join(os.path.dirname(__file__), "prices.json")

ROOM_TYPES = {
    "standard": {
        "name": "Standard Room",
        "emoji": "🛏️",
        "image": "https://i.postimg.cc/MpHFnsR2/image.png",
        "default_price": "ETB 700.00/night",
    },
    "deluxe": {
        "name": "Deluxe Double Room",
        "emoji": "🌟",
        "image": "https://i.postimg.cc/t482Y9pB/image.png",
        "default_price": "ETB 1,200.00/night",
    },
    "family_suite": {
        "name": "Family Suite",
        "emoji": "👨‍👩‍👧‍👦",
        "image": "https://i.postimg.cc/cHBm9YY2/image.png",
        "default_price": "ETB 1,800.00/night",
    },
    "executive_suite": {
        "name": "Executive Suite",
        "emoji": "👑",
        "image": "https://i.postimg.cc/Hk8tGFXx/image.png",
        "default_price": "ETB 2,800.00/night",
    },
}


def load_prices() -> dict:
    if os.path.exists(PRICES_FILE):
        with open(PRICES_FILE, "r") as f:
            return json.load(f)
    return {key: room["default_price"] for key, room in ROOM_TYPES.items()}


def save_prices(prices: dict):
    with open(PRICES_FILE, "w") as f:
        json.dump(prices, f, indent=2)


CURRENT_PRICES = load_prices()


# ── Health Server ──────────────────────────────────────────────────────────────

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK")

    def log_message(self, format, *args):
        logger.info("Health check from %s - %s", self.client_address[0], format % args)


def start_health_server():
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    logger.info("Health check server running on port %d", port)
    server.serve_forever()


# ── Helpers ────────────────────────────────────────────────────────────────────

async def send_or_edit_photo(query, context, image_url: str, caption: str, keyboard):
    """Send a new photo or replace an existing one depending on current message type."""
    markup = InlineKeyboardMarkup(keyboard)
    if query.message.photo:
        await query.message.edit_media(
            InputMediaPhoto(media=image_url, caption=caption, parse_mode="HTML"),
            reply_markup=markup,
        )
    else:
        await query.message.delete()
        await context.bot.send_photo(
            chat_id=query.message.chat_id,
            photo=image_url,
            caption=caption,
            reply_markup=markup,
            parse_mode="HTML",
        )


async def edit_any_message(query, text: str, keyboard):
    """Edit caption or text depending on whether current message is a photo."""
    markup = InlineKeyboardMarkup(keyboard)
    if query.message.photo:
        await query.edit_message_caption(caption=text, reply_markup=markup, parse_mode="HTML")
    else:
        await query.edit_message_text(text, reply_markup=markup, parse_mode="HTML")


# ── /start ─────────────────────────────────────────────────────────────────────

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    user = update.effective_user
    user_name_escaped = html.escape(user.first_name)

    text = (
        f"<blockquote>🏨 <b>Welcome to Family Guest House</b></blockquote>\n"
        f"<i>Hello, {user_name_escaped}! We're delighted to have you.</i>\n\n"
        "Experience comfort, luxury, and warm hospitality in the heart of <b>Moyale</b>. "
        "Your perfect stay awaits.\n\n"
        "<b>Select a room type below to begin:</b>"
    )

    keyboard = []
    for key, room in ROOM_TYPES.items():
        keyboard.append([InlineKeyboardButton(
            f"{room['emoji']}  {room['name']}  ·  {CURRENT_PRICES[key]}",
            callback_data=f"room_type:{key}",
        )])
    keyboard.append([InlineKeyboardButton("📞 Contact Us", url=f"https://t.me/{ADMIN_USERNAME}")])

    if update.callback_query:
        query = update.callback_query
        if query.message.photo:
            await query.message.delete()
            await context.bot.send_message(
                chat_id=query.message.chat_id,
                text=text,
                reply_markup=InlineKeyboardMarkup(keyboard),
                parse_mode="HTML",
            )
        else:
            await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")


# ── Callback Router ────────────────────────────────────────────────────────────

async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data

    if data.startswith("room_type:"):
        await show_room_numbers(query, context, data)
    elif data.startswith("room_number:"):
        await show_booking_confirm(query, context, data)
    elif data == "confirm_booking":
        await ask_for_name(query, context)
    elif data.startswith("back_to_numbers:"):
        await show_room_numbers(query, context, data)
    elif data in ("back_to_types", "main_menu"):
        await start(update, context)
    elif data.startswith("payment:"):
        await show_payment_details(query, context, data)
    elif data.startswith("admin_confirm:") or data.startswith("admin_decline:"):
        await handle_admin_action(query, context, data)
    elif data == "cancel_booking":
        await cancel_booking(query, context)
    elif data.startswith("setprice:"):
        await handle_setprice_select(query, context, data)


# ── Room Flow ──────────────────────────────────────────────────────────────────

async def show_room_numbers(query, context, data):
    parts = data.split(":")
    room_type_key = parts[1]
    context.user_data["room_type"] = room_type_key
    room = ROOM_TYPES[room_type_key]
    price = CURRENT_PRICES[room_type_key]

    caption = (
        f"<blockquote>{room['emoji']} <b>{room['name']}</b></blockquote>\n"
        f"<i>Nightly rate:</i> <code>{price}</code>\n\n"
        "<b>Choose your room number:</b>\n"
        "<i>Tap a number below to select your preferred room.</i>"
    )

    keyboard = []
    row = []
    for i in range(1, 11):
        row.append(InlineKeyboardButton(str(i), callback_data=f"room_number:{room_type_key}:{i}"))
        if i % 5 == 0:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)
    keyboard.append([InlineKeyboardButton("🔙 Back to Room Types", callback_data="back_to_types")])
    keyboard.append([InlineKeyboardButton("📞 Contact Us", url=f"https://t.me/{ADMIN_USERNAME}")])

    await send_or_edit_photo(query, context, room["image"], caption, keyboard)
    context.user_data["state"] = "SELECTING_ROOM_NUMBER"


async def show_booking_confirm(query, context, data):
    parts = data.split(":")
    room_type_key = parts[1]
    room_number = parts[2]
    context.user_data["room_number"] = room_number
    room = ROOM_TYPES[room_type_key]
    price = CURRENT_PRICES[room_type_key]

    text = (
        "<blockquote>📋 <b>Booking Summary</b></blockquote>\n"
        "<i>Please review your selection before confirming.</i>\n\n"
        f"{room['emoji']} <b>Room Type:</b> {room['name']}\n"
        f"🔢 <b>Room Number:</b> <code>{room_number}</code>\n"
        f"💰 <b>Price:</b> <code>{price}</code>\n\n"
        "<i>Ready to book? Tap Confirm below.</i>"
    )

    keyboard = [
        [InlineKeyboardButton("✅  Confirm Booking", callback_data="confirm_booking")],
        [InlineKeyboardButton("🔙 Back to Room Numbers", callback_data=f"back_to_numbers:{room_type_key}")],
        [InlineKeyboardButton("🔙 Back to Room Types", callback_data="back_to_types")],
    ]

    # Message is always a photo at this point (from show_room_numbers)
    await query.edit_message_caption(
        caption=text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
    )
    context.user_data["state"] = "CONFIRMING_BOOKING"


async def ask_for_name(query, context):
    text = (
        "<blockquote>📝 <b>Guest Details</b></blockquote>\n"
        "<i>Let's get your booking started!</i>\n\n"
        "Please enter your <b>Full Name</b>:\n"
        "<i>(As it appears on your ID)</i>"
    )
    keyboard = [[InlineKeyboardButton("❌  Cancel Booking", callback_data="cancel_booking")]]

    # Message is always a photo at this point
    await query.edit_message_caption(
        caption=text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
    )
    context.user_data["state"] = "WAITING_NAME"


# ── Message Handler ────────────────────────────────────────────────────────────

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    state = context.user_data.get("state")

    if state == "WAITING_NAME":
        name = update.message.text.strip()
        if not name:
            await update.message.reply_text("⚠️ Please enter a valid name.")
            return
        context.user_data["name"] = name
        await ask_for_phone(update, context)

    elif state == "WAITING_PHONE":
        phone = update.message.text.strip()
        if not phone:
            await update.message.reply_text("⚠️ Please enter a valid phone number.")
            return
        context.user_data["phone"] = phone
        await show_payment_methods(update, context)

    elif state == "WAITING_SCREENSHOT":
        if update.message.photo:
            await process_screenshot(update, context)
        else:
            await update.message.reply_text(
                "📸 Please send a <b>screenshot</b> (photo) of your payment.", parse_mode="HTML"
            )

    elif state == "WAITING_NEW_PRICE":
        if update.effective_user.id != ADMIN_CHAT_ID:
            return

        new_price = update.message.text.strip()
        room_key = context.user_data.get("setprice_room")
        msg_id = context.user_data.get("setprice_msg_id")

        CURRENT_PRICES[room_key] = new_price
        save_prices(CURRENT_PRICES)

        try:
            await update.message.delete()
        except Exception:
            pass

        context.user_data["state"] = None
        room = ROOM_TYPES[room_key]

        updated_text = (
            "<blockquote>💰 <b>Room Price Manager</b></blockquote>\n"
            f"<i>✅ <b>{room['name']}</b> updated to <code>{new_price}</code></i>\n\n"
        )
        for key, r in ROOM_TYPES.items():
            updated_text += f"{r['emoji']} <b>{r['name']}:</b> <code>{CURRENT_PRICES[key]}</code>\n"

        keyboard = [
            [InlineKeyboardButton(f"  {r['emoji']} {r['name']}", callback_data=f"setprice:{key}")]
            for key, r in ROOM_TYPES.items()
        ]

        await context.bot.edit_message_text(
            chat_id=update.effective_chat.id,
            message_id=msg_id,
            text=updated_text,
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="HTML",
        )

    else:
        await update.message.reply_text(
            "<blockquote> <b>Family Guest House Bot</b></blockquote>\n"
            "<i>Your premium stay, just a message away.</i>\n\n"
            "Use /start to begin booking a room.",
            parse_mode="HTML",
        )


# ── Phone & Payment ────────────────────────────────────────────────────────────

async def ask_for_phone(update, context):
    name_escaped = html.escape(context.user_data["name"])
    text = (
        f"<blockquote>📞 <b>Contact Details</b></blockquote>\n"
        f"<i>Thanks, <b>{name_escaped}</b>! One more step.</i>\n\n"
        "Please enter your <b>Phone Number</b>:\n"
        "<i>(We'll use this to reach you about your booking)</i>"
    )
    keyboard = [[InlineKeyboardButton("❌  Cancel Booking", callback_data="cancel_booking")]]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
    context.user_data["state"] = "WAITING_PHONE"


async def show_payment_methods(update, context):
    text = (
        "<blockquote>💳 <b>Payment Method</b></blockquote>\n"
        "<i>Choose how you'd like to pay for your stay.</i>\n\n"
        "<b>Available payment options:</b>"
    )
    keyboard = [
        [InlineKeyboardButton("🟡  Telebirr", callback_data="payment:telebirr")],
        [InlineKeyboardButton("🔵  CBE (Commercial Bank of Ethiopia)", callback_data="payment:cbe")],
        [InlineKeyboardButton("🟢  Awash Bank", callback_data="payment:awash")],
        [InlineKeyboardButton("🟠  Abyssinia Bank", callback_data="payment:abyssinia")],
        [InlineKeyboardButton("❌  Cancel Booking", callback_data="cancel_booking")],
    ]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
    context.user_data["state"] = "SELECTING_PAYMENT"


async def show_payment_details(query, context, data):
    payment_key = data.split(":")[1]
    context.user_data["payment_method"] = payment_key
    bank_info = BANK_ACCOUNTS.get(payment_key, "Details will be provided soon.")

    text = (
        f"<blockquote>💰 <b>Payment Details</b></blockquote>\n"
        "<i>Transfer the exact amount to the account below.</i>\n\n"
        f"{bank_info}\n\n"
        "📤 After transferring, send a <b>screenshot</b> of the transaction here.\n"
        "<i>Our team will verify and confirm your booking shortly.</i>"
    )
    keyboard = [[InlineKeyboardButton("❌  Cancel Booking", callback_data="cancel_booking")]]
    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
    context.user_data["state"] = "WAITING_SCREENSHOT"


# ── Screenshot & Admin ─────────────────────────────────────────────────────────

async def process_screenshot(update, context):
    photo = update.message.photo[-1]
    file_id = photo.file_id

    room_key = context.user_data["room_type"]
    room = ROOM_TYPES[room_key]
    room_number = context.user_data["room_number"]
    name = context.user_data["name"]
    phone = context.user_data["phone"]
    payment_method = context.user_data.get("payment_method", "N/A")

    payment_names = {
        "telebirr": "Telebirr",
        "cbe": "CBE",
        "awash": "Awash Bank",
        "abyssinia": "Abyssinia Bank",
    }
    payment_display = payment_names.get(payment_method, payment_method)

    name_escaped = html.escape(name)
    phone_escaped = html.escape(phone)
    room_name_escaped = html.escape(room["name"])
    payment_display_escaped = html.escape(payment_display)
    username_escaped = html.escape(update.effective_user.username or "N/A")

    admin_text = (
        f"<blockquote>📦 <b>New Booking Request</b></blockquote>\n"
        f"<i>A guest has submitted a payment — please review.</i>\n\n"
        f"👤 <b>Name:</b> {name_escaped}\n"
        f"📞 <b>Phone:</b> <code>{phone_escaped}</code>\n"
        f"🛏️ <b>Room:</b> {room_name_escaped} — Room <code>{room_number}</code>\n"
        f"💰 <b>Price:</b> <code>{CURRENT_PRICES[room_key]}</code>\n"
        f"💳 <b>Payment:</b> {payment_display_escaped}\n"
        f"🆔 <b>User ID:</b> <code>{update.effective_user.id}</code>\n"
        f"📛 <b>Username:</b> <i>@{username_escaped}</i>"
    )

    keyboard = [[
        InlineKeyboardButton("✅ Confirm Payment", callback_data=f"admin_confirm:{update.effective_user.id}"),
        InlineKeyboardButton("❌ Decline Payment", callback_data=f"admin_decline:{update.effective_user.id}"),
    ]]

    await context.bot.send_photo(
        chat_id=ADMIN_CHAT_ID,
        photo=file_id,
        caption=admin_text,
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="HTML",
    )

    user_text = (
        "<blockquote>✅ <b>Screenshot Received!</b></blockquote>\n"
        "<i>Your payment is now under review.</i>\n\n"
        "Our team will verify your transfer and confirm your booking as soon as possible.\n\n"
        "<b>Thank you for choosing Family Guest House!</b> 🙏\n"
        "<i>We look forward to welcoming you.</i>"
    )
    keyboard = [
        [InlineKeyboardButton("🏠  Main Menu", callback_data="main_menu")],
        [InlineKeyboardButton("📞  Contact Us", url=f"https://t.me/{ADMIN_USERNAME}")],
    ]
    await update.message.reply_text(user_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
    context.user_data["state"] = "DONE"


async def handle_admin_action(query, context, data):
    parts = data.split(":")
    action = parts[0]
    user_id = int(parts[1])

    current_caption = query.message.caption or ""
    if "PAYMENT CONFIRMED" in current_caption or "PAYMENT DECLINED" in current_caption:
        try:
            await query.edit_message_reply_markup(reply_markup=None)
        except Exception:
            pass
        return

    if action == "admin_confirm":
        new_caption = (query.message.caption_html or "") + "\n\n━━━━━━━━━━━━━━━\n<code>✅ PAYMENT CONFIRMED ✅</code>"
        user_text = (
            "<blockquote>✅ <b>Payment Confirmed!</b> 🎉</blockquote>\n"
            "<i>Great news — your booking is secured!</i>\n\n"
            "Your stay at <b>Family Guest House</b> has been confirmed. "
            "We look forward to welcoming you!\n\n"
            "<i>For any questions, feel free to contact us anytime.</i>"
        )
    else:
        new_caption = (query.message.caption_html or "") + "\n\n━━━━━━━━━━━━━━━\n<code>❌ PAYMENT DECLINED ❌</code>"
        user_text = (
            "<blockquote>❌ <b>Payment Declined</b></blockquote>\n"
            "<i>Unfortunately, we could not verify your payment.</i>\n\n"
            "Please double-check your transfer and contact us for assistance.\n\n"
            "<b>We're here to help — don't hesitate to reach out!</b>"
        )

    try:
        await query.edit_message_caption(caption=new_caption, reply_markup=None, parse_mode="HTML")
    except telegram.error.BadRequest as e:
        if "Message is not modified" in str(e):
            return
        raise e

    keyboard = [[InlineKeyboardButton("📞 Contact Us", url=f"https://t.me/{ADMIN_USERNAME}")]]
    await context.bot.send_message(
        chat_id=user_id, text=user_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
    )


async def cancel_booking(query, context):
    context.user_data.clear()
    text = (
        "<blockquote>❌ <b>Booking Cancelled</b></blockquote>\n"
        "<i>Your booking has been cancelled. No charges were made.</i>\n\n"
        "Use /start to make a new booking or contact us if you need help."
    )
    keyboard = [[InlineKeyboardButton("📞  Contact Us", url=f"https://t.me/{ADMIN_USERNAME}")]]
    await edit_any_message(query, text, keyboard)


# ── Admin Price Commands ───────────────────────────────────────────────────────

def build_price_list_text(header_note: str = "") -> str:
    text = "<blockquote>💰 <b>Room Price Manager</b></blockquote>\n"
    if header_note:
        text += f"<i>{header_note}</i>\n"
    text += "<i>Tap a room below to update its price.</i>\n\n"
    for key, room in ROOM_TYPES.items():
        text += f"{room['emoji']} <b>{room['name']}:</b> <code>{CURRENT_PRICES[key]}</code>\n"
    return text


def build_price_list_keyboard() -> list:
    return [
        [InlineKeyboardButton(f" {room['emoji']} {room['name']}", callback_data=f"setprice:{key}")]
        for key, room in ROOM_TYPES.items()
    ]


async def cmd_setprice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ADMIN_CHAT_ID:
        await update.message.reply_text(
            "⛔ <b>Access denied.</b>\n<i>This command is for admins only.</i>",
            parse_mode="HTML",
        )
        return
    text = build_price_list_text()
    keyboard = build_price_list_keyboard()
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")


async def cmd_prices(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "<blockquote>🏨 <b>Room Prices</b></blockquote>\n"
        "<i>Current nightly rates at Family Guest House</i>\n\n"
    )
    for key, room in ROOM_TYPES.items():
        text += f"{room['emoji']} <b>{room['name']}:</b> <code>{CURRENT_PRICES[key]}</code>\n"
    keyboard = [[InlineKeyboardButton("📅  Book Now", callback_data="main_menu")]]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")


async def handle_setprice_select(query, context, data):
    if query.from_user.id != ADMIN_CHAT_ID:
        await query.answer("⛔ Access denied.", show_alert=True)
        return

    room_key = data.split(":")[1]
    room = ROOM_TYPES[room_key]
    context.user_data["setprice_room"] = room_key
    context.user_data["setprice_msg_id"] = query.message.message_id
    context.user_data["state"] = "WAITING_NEW_PRICE"

    text = (
        f"<blockquote> <b>Update Price</b></blockquote>\n"
        f"<i>Updating: {room['emoji']} <b>{room['name']}</b></i>\n\n"
        f"Current price: <code>{CURRENT_PRICES[room_key]}</code>\n\n"
        "Enter the <b>new price</b>:\n"
        "<i>(e.g. ETB 850.00/night)</i>"
    )
    await query.edit_message_text(text, parse_mode="HTML")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    health_thread = threading.Thread(target=start_health_server, daemon=True)
    health_thread.start()

    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("setprice", cmd_setprice))
    application.add_handler(CommandHandler("prices", cmd_prices))
    application.add_handler(CallbackQueryHandler(handle_callback))
    application.add_handler(MessageHandler(filters.TEXT | filters.PHOTO, handle_message))

    logger.info("Bot is starting...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()

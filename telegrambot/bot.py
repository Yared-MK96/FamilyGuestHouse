import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from config import BOT_TOKEN, ADMIN_CHAT_ID, BANK_ACCOUNTS

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

ROOM_TYPES = {
    "standard": {"name": "Standard Room", "emoji": "🛏️", "price": "ETB 700.00/night"},
    "deluxe": {"name": "Deluxe Double Room", "emoji": "🌟", "price": "ETB 1,200.00/night"},
    "family_suite": {"name": "Family Suite", "emoji": "👨‍👩‍👧‍👦", "price": "ETB 1,800.00/night"},
    "executive_suite": {"name": "Executive Suite", "emoji": "👑", "price": "ETB 2,800.00/night"},
}


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    user = update.effective_user

    text = (
        f"👋 Welcome to Family Guest House, {user.first_name}! 🏨\n\n"
        "Experience comfort, luxury, and warm hospitality in the heart of Moyale. "
        "Your perfect stay awaits at Family Guest House.\n\n"
        "Please select a room type below to start booking:"
    )

    keyboard = []
    for key, room in ROOM_TYPES.items():
        keyboard.append([InlineKeyboardButton(
            f"{room['emoji']} {room['name']} - {room['price']}",
            callback_data=f"room_type:{key}"
        )])
    keyboard.append([InlineKeyboardButton("📞 Contact Us", url=f"tg://user?id={ADMIN_CHAT_ID}")])

    if update.callback_query:
        await update.callback_query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))


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
    elif data == "back_to_types":
        await start(update, context)
    elif data == "main_menu":
        await start(update, context)
    elif data.startswith("payment:"):
        await show_payment_details(query, context, data)
    elif data.startswith("admin_confirm:") or data.startswith("admin_decline:"):
        await handle_admin_action(query, context, data)
    elif data == "cancel_booking":
        await cancel_booking(query, context)


async def show_room_numbers(query, context, data):
    parts = data.split(":")
    room_type_key = parts[1]
    context.user_data["room_type"] = room_type_key
    room = ROOM_TYPES[room_type_key]

    text = (
        f"{room['emoji']} *{room['name']}*\n"
        f"💰 Price: {room['price']}\n\n"
        "Please select a room number:"
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
    keyboard.append([InlineKeyboardButton("📞 Contact Us", url=f"tg://user?id={ADMIN_CHAT_ID}")])

    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "SELECTING_ROOM_NUMBER"


async def show_booking_confirm(query, context, data):
    parts = data.split(":")
    room_type_key = parts[1]
    room_number = parts[2]
    context.user_data["room_number"] = room_number
    room = ROOM_TYPES[room_type_key]

    text = (
        "📋 *Booking Summary*\n\n"
        f"{room['emoji']} *Room Type:* {room['name']}\n"
        f"🔢 *Room Number:* {room_number}\n"
        f"💰 *Price:* {room['price']}\n\n"
        "Would you like to proceed?"
    )

    keyboard = [
        [InlineKeyboardButton("✅ Confirm Booking", callback_data="confirm_booking")],
        [InlineKeyboardButton("🔙 Back to Room Numbers", callback_data=f"back_to_numbers:{room_type_key}")],
        [InlineKeyboardButton("🔙 Back to Room Types", callback_data="back_to_types")],
    ]

    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "CONFIRMING_BOOKING"


async def ask_for_name(query, context):
    text = (
        "✅ Great! Let's proceed.\n\n"
        "📝 Please enter your *Full Name*:"
    )
    keyboard = [[InlineKeyboardButton("❌ Cancel Booking", callback_data="cancel_booking")]]
    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "WAITING_NAME"


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    state = context.user_data.get("state")

    if state == "WAITING_NAME":
        name = update.message.text.strip()
        if not name:
            await update.message.reply_text("Please enter a valid name.")
            return
        context.user_data["name"] = name
        await ask_for_phone(update, context)

    elif state == "WAITING_PHONE":
        phone = update.message.text.strip()
        if not phone:
            await update.message.reply_text("Please enter a valid phone number.")
            return
        context.user_data["phone"] = phone
        await show_payment_methods(update, context)

    elif state == "WAITING_SCREENSHOT":
        if update.message.photo:
            await process_screenshot(update, context)
        else:
            await update.message.reply_text("Please send a screenshot (photo) of your payment.")

    else:
        await update.message.reply_text(
            "Welcome to Family Guest House Bot! 🏨\n"
            "Use /start to begin booking a room."
        )


async def ask_for_phone(update, context):
    text = f"👋 Thank you, {context.user_data['name']}!\n\n📞 Please enter your *Phone Number*:"
    keyboard = [[InlineKeyboardButton("❌ Cancel Booking", callback_data="cancel_booking")]]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "WAITING_PHONE"


async def show_payment_methods(update, context):
    text = (
        "💳 *Select Payment Method*\n\n"
        "Please choose your preferred payment method:"
    )
    keyboard = [
        [InlineKeyboardButton("📱 Telebirr", callback_data="payment:telebirr")],
        [InlineKeyboardButton("🏦 CBE (Commercial Bank of Ethiopia)", callback_data="payment:cbe")],
        [InlineKeyboardButton("🏦 Awash Bank", callback_data="payment:awash")],
        [InlineKeyboardButton("🏦 Abyssinia Bank", callback_data="payment:abyssinia")],
        [InlineKeyboardButton("❌ Cancel Booking", callback_data="cancel_booking")],
    ]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "SELECTING_PAYMENT"


async def show_payment_details(query, context, data):
    payment_key = data.split(":")[1]
    context.user_data["payment_method"] = payment_key
    bank_info = BANK_ACCOUNTS.get(payment_key, "Details will be provided soon.")

    text = (
        f"💰 *Payment Details*\n\n"
        f"{bank_info}\n\n"
        f"📤 After making the payment, please send a *screenshot* of the transaction here."
    )
    keyboard = [[InlineKeyboardButton("❌ Cancel Booking", callback_data="cancel_booking")]]
    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "WAITING_SCREENSHOT"


async def process_screenshot(update, context):
    photo = update.message.photo[-1]
    file_id = photo.file_id

    room_key = context.user_data["room_type"]
    room = ROOM_TYPES[room_key]
    room_number = context.user_data["room_number"]
    name = context.user_data["name"]
    phone = context.user_data["phone"]
    payment_method = context.user_data.get("payment_method", "N/A")

    payment_names = {"telebirr": "Telebirr", "cbe": "CBE", "awash": "Awash Bank", "abyssinia": "Abyssinia Bank"}
    payment_display = payment_names.get(payment_method, payment_method)

    admin_text = (
        f"📦 *New Booking Request*\n\n"
        f"👤 *Name:* {name}\n"
        f"📞 *Phone:* {phone}\n"
        f"🛏️ *Room:* {room['name']} - Room {room_number}\n"
        f"💰 *Price:* {room['price']}\n"
        f"💳 *Payment Method:* {payment_display}\n"
        f"🆔 *User ID:* {update.effective_user.id}\n"
        f"📛 *Username:* @{update.effective_user.username or 'N/A'}"
    )

    keyboard = [
        [
            InlineKeyboardButton("✅ Confirm Payment", callback_data=f"admin_confirm:{update.effective_user.id}"),
            InlineKeyboardButton("❌ Decline Payment", callback_data=f"admin_decline:{update.effective_user.id}"),
        ]
    ]

    await context.bot.send_photo(
        chat_id=ADMIN_CHAT_ID,
        photo=file_id,
        caption=admin_text,
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown",
    )

    user_text = (
        "✅ *Payment screenshot received!*\n\n"
        "Your booking request has been sent to our team for verification. "
        "You will be notified once your payment is confirmed.\n\n"
        "Thank you for choosing Family Guest House! 🙏"
    )
    keyboard = [
        [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")],
        [InlineKeyboardButton("📞 Contact Us", url=f"tg://user?id={ADMIN_CHAT_ID}")],
    ]

    await update.message.reply_text(user_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    context.user_data["state"] = "DONE"


async def handle_admin_action(query, context, data):
    parts = data.split(":")
    action = parts[0]
    user_id = int(parts[1])

    if action == "admin_confirm":
        new_caption = query.message.caption + "\n\n━━━━━━━━━━━━━━━\n✅ *PAYMENT CONFIRMED* ✅"
        user_text = (
            "✅ *Payment Confirmed!* 🎉\n\n"
            "Your booking at Family Guest House has been confirmed. "
            "We look forward to welcoming you!\n\n"
            "For any questions, feel free to contact us."
        )
    else:
        new_caption = query.message.caption + "\n\n━━━━━━━━━━━━━━━\n❌ *PAYMENT DECLINED* ❌"
        user_text = (
            "❌ *Payment Declined*\n\n"
            "Unfortunately, your payment could not be verified. "
            "Please contact us for assistance.\n\n"
            "We're here to help!"
        )

    await query.edit_message_caption(caption=new_caption, parse_mode="Markdown")
    await query.edit_message_reply_markup(reply_markup=None)

    keyboard = [[InlineKeyboardButton("📞 Contact Us", url=f"tg://user?id={ADMIN_CHAT_ID}")]]
    await context.bot.send_message(
        chat_id=user_id, text=user_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown"
    )


async def cancel_booking(query, context):
    context.user_data.clear()
    text = (
        "❌ Booking cancelled.\n\n"
        "Use /start to book again or contact us for help."
    )
    keyboard = [[InlineKeyboardButton("📞 Contact Us", url=f"tg://user?id={ADMIN_CHAT_ID}")]]
    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))


def main():
    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(handle_callback))
    application.add_handler(MessageHandler(filters.TEXT | filters.PHOTO, handle_message))

    logger.info("Bot is starting...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()

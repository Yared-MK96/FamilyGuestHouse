import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Have questions or need assistance with your booking? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {[
              { Icon: FaMapMarkerAlt, title: 'Our Location', text: 'HVC5+87M Family Guest House\nMoyale, Ethiopia' },
              { Icon: FaPhoneAlt, title: 'Phone Number', text: '+251951141620' },
              { Icon: FaEnvelope, title: 'Email Address', text: 'familyguesthouse@gmail.com' },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Icon className="text-3xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{text}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="kebede" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ali" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="[EMAIL_ADDRESS]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Subject</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your message here..."></textarea>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 px-8 rounded-md transition-colors shadow-md">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white p-4 md:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Us on the Map</h2>
          <div className="w-full h-[400px] rounded-lg overflow-hidden relative">
            <iframe
              src="https://maps.google.com/maps?q=3.536469,39.05341&t=k&z=18&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Family Guest House Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

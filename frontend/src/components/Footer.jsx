import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-between mb-6">
          {/* Contact Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Email: <a href="mailto:akashpurwar2002@gmail.com" className="text-green-400 hover:text-green-600">support@farmconnect.com</a></p>
            <p className="text-sm">Phone: +91 7081674245</p>
            <p className="text-sm">Address: Main Bazar, Kadaura, Uttar Pradesh</p>
          </div>

          {/* Social Media Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full md:w-1/3">
            <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
            <ul>
              <li><a href="/" className="text-sm text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/" className="text-sm text-gray-400 hover:text-white">Terms & Conditions</a></li>
              <li><a href="/" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="/" className="text-sm text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-600 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FarmConnect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

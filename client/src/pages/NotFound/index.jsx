import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <FaExclamationTriangle className="text-[#a58641] text-6xl mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link 
        to="/" 
        className="bg-[#a58641] hover:bg-[#8b6e32] text-white px-8 py-3 rounded-md font-medium transition-colors shadow-lg hover:shadow-xl"
      >
        Return to Home
      </Link>
    </div>
  );
}

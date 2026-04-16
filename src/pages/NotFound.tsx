import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error('404: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-gray-950 px-6">
      <div className="text-center max-w-md">
        <div className="text-9xl font-heading font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-3xl font-heading font-bold text-[#111827] dark:text-white mb-3">Page not found</h1>
        <p className="text-[#4B5563] dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-[#CF6DFC] hover:text-[#CF6DFC] transition-colors">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="flex items-center gap-2 px-5 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 shadow-lg">
            <Home size={16} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

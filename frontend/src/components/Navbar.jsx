import { Link, useLocation } from 'react-router-dom';
import { BookOpen, History, UploadCloud, Home } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'Upload', path: '/upload', icon: UploadCloud },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="font-headings font-bold text-xl tracking-tight text-gray-900">
              AutoDoc <span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              to="/"
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition",
                location.pathname === '/' ? "text-primary bg-primary/5" : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition",
                    isActive ? "text-primary bg-primary/5" : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

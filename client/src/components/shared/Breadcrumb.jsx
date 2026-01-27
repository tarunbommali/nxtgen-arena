import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 hover:text-white transition-colors group"
      >
        <Home className="w-4 h-4" />
        <span className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-primary group-hover:to-purple-400 transition-all">
          Home
        </span>
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <button
              onClick={() => navigate(item.href)}
              className="hover:text-white transition-colors font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-white font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
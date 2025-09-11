import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 px-4 bg-slate-900 border-b border-slate-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ClearPix
          </h1>
        </div>
        <p className="text-center text-gray-400 text-lg font-medium">
          AI-Powered Background Removal & Image Generation
        </p>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 px-4 bg-black border-b border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            ClearPix
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
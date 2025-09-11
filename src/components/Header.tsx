import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            ClearPix
          </h1>
        </div>
      </div>
    </header>
  );
};
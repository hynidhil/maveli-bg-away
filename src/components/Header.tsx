
import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 bg-background border-b border-green-900/20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          RemoveMaveli.AI
        </h1>
        <p className="text-center text-muted-foreground mt-2 text-lg">
          ബാക്ക്‌ഗ്രൗണ്ട് പൊടിപ്പിക്കാം!
        </p>
      </div>
    </header>
  );
};

export default Header;

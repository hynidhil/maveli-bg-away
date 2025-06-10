
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-background border-t border-green-900/20 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © 2024 RemoveMaveli.AI. Built with ❤️ for seamless background removal.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="#about" 
              className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
            >
              Contact
            </a>
            <a 
              href="#privacy" 
              className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

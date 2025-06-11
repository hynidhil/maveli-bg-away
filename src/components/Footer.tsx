
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-background border-t border-green-900/20 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © 2024 Remove.AI. Built with ❤️ for seamless background removal.
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
        
        {/* Contact Section */}
        <div id="contact" className="mt-8 pt-8 border-t border-green-900/20">
          <h3 className="text-lg font-semibold text-center mb-4">Contact Us</h3>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Mobile: <a href="tel:+916238651917" className="text-green-500 hover:text-green-400">+91 6238651917</a>
            </p>
            <p className="text-muted-foreground">
              Email: <a href="mailto:nidhiljabbar@gmail.com" className="text-green-500 hover:text-green-400">nidhiljabbar@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Privacy Section */}
        <div id="privacy" className="mt-8 pt-8 border-t border-green-900/20">
          <h3 className="text-lg font-semibold text-center mb-4">Privacy Policy</h3>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground text-sm">
              We respect your privacy. Images uploaded to Remove.AI are processed locally in your browser using AI technology. 
              We do not store, collect, or share your images or personal data. All processing happens on your device, 
              ensuring complete privacy and security of your content.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

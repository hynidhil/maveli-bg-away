
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-background border-t border-green-900/20 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm">
            © 2024 ClearPix. Built with ❤️ for seamless background removal and AI image generation.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="mb-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-muted-foreground">
            Email: <a href="mailto:nidhiljabbar@gmail.com" className="text-green-500 hover:text-green-400">nidhiljabbar@gmail.com</a>
          </p>
        </div>

        {/* Privacy Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Privacy</h3>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Your privacy is important to us. Background removal happens locally in your browser. 
            Generated images are processed securely and we do not store or share your content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

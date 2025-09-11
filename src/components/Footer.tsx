import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 md:py-16 px-4 bg-black border-t border-gray-800 mt-10 md:mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gray-300 text-sm md:text-lg">
            © 2024 ClearPix. Built with ❤️ for seamless background removal and AI image generation.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="mb-8 md:mb-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Contact</h3>
          <p className="text-gray-300 text-sm md:text-lg">
            Email: <a href="mailto:nidhiljabbar@gmail.com" className="text-green-400 hover:text-green-300 font-semibold transition-colors break-all">nidhiljabbar@gmail.com</a>
          </p>
        </div>

        {/* Privacy Section */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Privacy</h3>
          <p className="text-gray-300 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. Background removal happens locally in your browser. 
            Generated images are processed securely and we do not store or share your content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
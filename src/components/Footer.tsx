import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-16 px-4 bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-300 text-lg">
            © 2024 ClearPix. Built with ❤️ for seamless background removal and AI image generation.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Contact</h3>
          <p className="text-gray-300 text-lg">
            Email: <a href="mailto:nidhiljabbar@gmail.com" className="text-green-400 hover:text-green-300 font-semibold transition-colors">nidhiljabbar@gmail.com</a>
          </p>
        </div>

        {/* Privacy Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Privacy</h3>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. Background removal happens locally in your browser. 
            Generated images are processed securely and we do not store or share your content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
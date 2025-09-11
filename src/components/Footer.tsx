import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-4 bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-400">
            © 2024 ClearPix. Built with ❤️ for seamless background removal and AI image generation.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
          <p className="text-gray-400">
            Email: <a href="mailto:nidhiljabbar@gmail.com" className="text-green-400 hover:text-green-300 font-medium">nidhiljabbar@gmail.com</a>
          </p>
        </div>

        {/* Privacy Section */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Privacy</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your privacy is important to us. Background removal happens locally in your browser. 
            Generated images are processed securely and we do not store or share your content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-4 bg-white border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-600">
            © 2024 ClearPix. Built with ❤️ for seamless background removal and AI image generation.
          </p>
        </div>
        
        {/* Contact Section */}
        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Contact</h3>
          <p className="text-gray-600">
            Email: <a href="mailto:nidhiljabbar@gmail.com" className="text-blue-600 hover:text-blue-500 font-medium">nidhiljabbar@gmail.com</a>
          </p>
        </div>

        {/* Privacy Section */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Background removal happens locally in your browser. 
            Generated images are processed securely and we do not store or share your content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
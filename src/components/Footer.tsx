import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, Heart, Zap, Shield, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-20 px-4 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800 mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                ClearPix
              </h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              AI-powered background removal made simple. Transform your images instantly with our cutting-edge technology.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">HD Quality</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#how-it-works" className="text-gray-300 hover:text-green-400 transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-green-400 transition-colors">Pricing</a></li>
              <li><a href="#api" className="text-gray-300 hover:text-green-400 transition-colors">API Access</a></li>
              <li><a href="#blog" className="text-gray-300 hover:text-green-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#help" className="text-gray-300 hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-green-400 transition-colors">FAQ</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="mailto:support@clearpix.com" className="text-gray-300 hover:text-green-400 transition-colors">Email Support</a></li>
            </ul>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12 border-t border-gray-800 pt-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Upload Image</h4>
              <p className="text-gray-300">Drag & drop or click to upload. Supports JPG, PNG, WEBP up to 12MB.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">AI Processing</h4>
              <p className="text-gray-300">Advanced AI automatically detects and removes backgrounds in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Download Result</h4>
              <p className="text-gray-300">Get your image in multiple formats: web-ready, HD, or transparent PNG.</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <span className="text-gray-300">Follow us:</span>
              <div className="flex gap-4">
                <a href="https://facebook.com/clearpix" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="https://twitter.com/clearpix" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="https://instagram.com/clearpix" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://linkedin.com/company/clearpix" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="https://github.com/clearpix" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Github className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="mailto:support@clearpix.com" className="hover:text-green-400 transition-colors flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Terms of Service */}

        {/* Copyright */}
        <div className="text-center border-t border-gray-800 pt-6">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            © 2024 ClearPix. Made with 
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            for seamless background removal.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
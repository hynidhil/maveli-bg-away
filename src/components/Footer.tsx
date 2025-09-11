import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-8 md:py-16 px-4 bg-black border-t border-gray-800 mt-10 md:mt-20">
      <div className="max-w-6xl mx-auto">
        {/* How It Works Section */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Upload Your Image</h4>
              <p className="text-gray-300 text-sm">Simply drag and drop or click to upload your image. We support JPG, PNG, and other common formats.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Removes Background</h4>
              <p className="text-gray-300 text-sm">Our advanced AI automatically detects and removes the background in seconds with precision.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Download Your Image</h4>
              <p className="text-gray-300 text-sm">Download your processed image in multiple quality options, from web-ready to HD resolution.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">What file formats are supported?</h4>
                <p className="text-gray-300 text-sm">We support all common image formats including JPG, JPEG, PNG, WEBP, and BMP. Maximum file size is 12MB.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">What are the image size limits?</h4>
                <p className="text-gray-300 text-sm">Images can be up to 12MB in size. We support resolutions from 100x100 pixels up to 4K (4096x4096) for premium users.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Is my data safe?</h4>
                <p className="text-gray-300 text-sm">Yes! Background removal happens locally in your browser when possible. We don't store your images on our servers.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">How long does the process take?</h4>
                <p className="text-gray-300 text-sm">Most images are processed in 3-10 seconds. Processing time depends on image size and complexity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* About Us */}
          <div className="md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">About ClearPix</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
              ClearPix is a cutting-edge AI-powered background removal tool designed to make image editing simple and accessible for everyone. 
              Our mission is to democratize professional image editing through advanced artificial intelligence.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Founded by a team of AI enthusiasts and image processing experts, we're committed to providing fast, accurate, 
              and secure background removal services that help creators, businesses, and individuals bring their visual ideas to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#terms" className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base">Privacy Policy</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base">FAQ</a></li>
              <li><a href="#support" className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base">Support</a></li>
              <li><a href="#api" className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base">API Access</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                <a href="mailto:nidhiljabbar@gmail.com" className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base break-all">
                  nidhiljabbar@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mb-8 md:mb-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Follow Us</h3>
          <div className="flex justify-center gap-4 md:gap-6">
            <a href="https://facebook.com/clearpix" target="_blank" rel="noopener noreferrer" 
               className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a href="https://twitter.com/clearpix" target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a href="https://instagram.com/clearpix" target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href="https://linkedin.com/company/clearpix" target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a href="https://github.com/clearpix" target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
              <Github className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Terms of Service */}

        {/* Copyright */}
        <div className="text-center border-t border-gray-800 pt-6 md:pt-8">
          <p className="text-gray-300 text-sm md:text-base">
            © 2024 ClearPix. Built with ❤️ for seamless background removal and AI image generation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import BatchImageUploader from '@/components/BatchImageUploader';
import ImageGenerator from '@/components/ImageGenerator';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getUserPlan } from '@/utils/planManager';
import { Upload, Layers, Sparkles, Star, Zap, Shield } from 'lucide-react';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch' | 'generate'>('single');

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <h2 className="hero-title text-4xl md:text-6xl text-white leading-tight">
                Remove Image
                <span className="block bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                  Background
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                <span className="feature-badge px-4 py-2 rounded-full text-base font-semibold text-white">
                  100% Automatically and
                </span>
                <span className="green-highlight px-4 py-2 rounded-full text-base font-bold text-green-400">
                  Free
                </span>
              </div>
              <p className="hero-subtitle text-lg md:text-xl text-gray-300 leading-relaxed">
                Upload your images and let our advanced AI remove backgrounds instantly. 
                Perfect for e-commerce, social media, and professional use.
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-4">
                <div className="feature-badge flex items-center gap-2 px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className="text-white font-medium">Lightning Fast</span>
                </div>
                <div className="feature-badge flex items-center gap-2 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-white font-medium">100% Secure</span>
                </div>
                <div className="feature-badge flex items-center gap-2 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">HD Quality</span>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveMode('single')}
                  className={`px-6 py-3 text-base font-semibold rounded-full transition-all ${
                    activeMode === 'single' 
                      ? "mode-toggle active" 
                      : "mode-toggle"
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Single Image
                </Button>
                <Button
                  onClick={() => setActiveMode('batch')}
                  className={`px-6 py-3 text-base font-semibold rounded-full transition-all ${
                    activeMode === 'batch' 
                      ? "mode-toggle active" 
                      : "mode-toggle"
                  }`}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Batch Process
                </Button>
                <Button
                  onClick={() => setActiveMode('generate')}
                  className={`px-6 py-3 text-base font-semibold rounded-full transition-all ${
                    activeMode === 'generate' 
                      ? "mode-toggle active" 
                      : "mode-toggle"
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
              </div>
            </div>
            
            {/* Right Side - Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                  <p className="text-gray-300 mb-6">
                    Choose your preferred mode and start removing backgrounds from your images.
                  </p>
                  <div className="space-y-4">
                    <Button className="btn-primary w-full py-3 text-lg font-semibold rounded-full">
                      Start Creating
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="section-padding">
        {/* Content will be added here based on mode selection */}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
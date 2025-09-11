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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section section-padding">
        <div className="container-max">
          <div className="text-center mb-16 relative z-10">
            {activeMode === 'generate' ? (
              <>
                <h2 className="hero-title text-5xl md:text-7xl text-gray-900 mb-8">
                  Create Amazing Images
                  <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    with AI
                  </span>
                </h2>
                <p className="hero-subtitle text-xl md:text-2xl max-w-4xl mx-auto mb-12">
                  Generate stunning, unique images from text descriptions using advanced AI technology. 
                  Perfect for creative projects, social media, and professional use.
                </p>
              </>
            ) : (
              <>
                <h2 className="hero-title text-5xl md:text-7xl text-gray-900 mb-8">
                  Remove Image
                  <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Background
                  </span>
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                  <span className="feature-badge px-6 py-3 rounded-full text-lg font-semibold text-gray-700">
                    100% Automatically and
                  </span>
                  <span className="yellow-highlight px-6 py-3 rounded-full text-lg font-bold">
                    Free
                  </span>
                </div>
                <p className="hero-subtitle text-xl md:text-2xl max-w-4xl mx-auto mb-12">
                  Upload your images and let our advanced AI remove backgrounds instantly. 
                  Perfect for e-commerce, social media, and professional use.
                </p>
              </>
            )}
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <div className="feature-badge flex items-center gap-3 px-6 py-3 rounded-full">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">Lightning Fast</span>
              </div>
              <div className="feature-badge flex items-center gap-3 px-6 py-3 rounded-full">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-medium">100% Secure</span>
              </div>
              <div className="feature-badge flex items-center gap-3 px-6 py-3 rounded-full">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-medium">HD Quality</span>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                onClick={() => setActiveMode('single')}
                className={`px-8 py-4 text-lg font-semibold rounded-full transition-all ${
                  activeMode === 'single' 
                    ? "mode-toggle active" 
                    : "mode-toggle"
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Single Image
              </Button>
              <Button
                onClick={() => setActiveMode('batch')}
                className={`px-8 py-4 text-lg font-semibold rounded-full transition-all ${
                  activeMode === 'batch' 
                    ? "mode-toggle active" 
                    : "mode-toggle"
                }`}
              >
                <Layers className="w-5 h-5 mr-2" />
                Batch Upload {getUserPlan().type === 'free' ? '🔒' : ''}
              </Button>
              <Button
                onClick={() => setActiveMode('generate')}
                className={`px-8 py-4 text-lg font-semibold rounded-full transition-all ${
                  activeMode === 'generate' 
                    ? "btn-secondary" 
                    : "mode-toggle"
                }`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                AI Generator
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container-max px-4 pb-20">
        {activeMode === 'generate' ? (
          <ImageGenerator />
        ) : activeMode === 'batch' ? (
          <BatchImageUploader />
        ) : (
          <ImageUploader />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
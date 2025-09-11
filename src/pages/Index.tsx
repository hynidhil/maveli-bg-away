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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            {activeMode === 'generate' ? (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                  Create Amazing Images
                  <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    with AI - Free!
                  </span>
                </h2>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
                  Generate stunning, unique images from text descriptions using advanced AI technology. 
                  Perfect for creative projects, social media, and professional use!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                  Remove Image
                  <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    Background
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-lg font-semibold">
                    100% Automatically and
                  </span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 px-4 py-2 rounded-full text-lg font-bold">
                    Free
                  </span>
                </div>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
                  Upload your images and let our advanced AI remove backgrounds instantly. 
                  Perfect for e-commerce, social media, and professional use. No watermarks, no limits!
                </p>
              </>
            )}
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">HD Quality</span>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                onClick={() => setActiveMode('single')}
                variant={activeMode === 'single' ? "default" : "outline"}
                className={`px-6 py-3 text-lg font-semibold rounded-full transition-all ${
                  activeMode === 'single' 
                    ? "btn-primary" 
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Single Image
              </Button>
              <Button
                onClick={() => setActiveMode('batch')}
                variant={activeMode === 'batch' ? "default" : "outline"}
                className={`px-6 py-3 text-lg font-semibold rounded-full transition-all ${
                  activeMode === 'batch' 
                    ? "btn-primary" 
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <Layers className="w-5 h-5 mr-2" />
                Batch Upload {getUserPlan().type === 'free' ? '🔒' : ''}
              </Button>
              <Button
                onClick={() => setActiveMode('generate')}
                variant={activeMode === 'generate' ? "default" : "outline"}
                className={`px-6 py-3 text-lg font-semibold rounded-full transition-all ${
                  activeMode === 'generate' 
                    ? "btn-secondary" 
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
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
      <main className="container mx-auto px-4 pb-16">
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
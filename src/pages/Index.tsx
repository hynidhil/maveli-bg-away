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
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            {activeMode === 'generate' ? (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Create Amazing Images
                  <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    with AI - Free!
                  </span>
                </h2>
                <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
                  Generate stunning, unique images from text descriptions using advanced AI technology. 
                  Perfect for creative projects, social media, and professional use!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Remove Image
                  <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Background
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="bg-slate-800 text-white px-4 py-2 rounded-full text-lg font-semibold">
                    100% Automatically and
                  </span>
                  <span className="bg-gradient-to-r from-green-400 to-green-600 text-slate-900 px-4 py-2 rounded-full text-lg font-bold">
                    Free
                  </span>
                </div>
                <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
                  Upload your images and let our advanced AI remove backgrounds instantly. 
                  Perfect for e-commerce, social media, and professional use. No watermarks, no limits!
                </p>
              </>
            )}
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-300 font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="text-gray-300 font-medium">HD Quality</span>
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
                    : "bg-slate-800 hover:bg-slate-700 text-gray-300 border-slate-600"
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
                    : "bg-slate-800 hover:bg-slate-700 text-gray-300 border-slate-600"
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
                    : "bg-slate-800 hover:bg-slate-700 text-gray-300 border-slate-600"
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
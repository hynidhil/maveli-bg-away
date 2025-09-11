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
                    <Button className="btn-primary w-full py-3 text-lg font-semibold rounded-full">
                      Start Creating
                    </Button>
                  </div>
                ) : (
      <div className="section-padding">
        {activeMode === 'single' && (
          <div className="container-max">
            <ImageUploader />
          </div>
        )}
        {activeMode === 'batch' && (
          <div className="container-max">
            <BatchImageUploader />
          </div>
        )}
        {activeMode === 'generate' && (
          <div className="container-max">
            <ImageGenerator />
          </div>
        )}
      </section>
      
      {/* Main Content */}
      <div className="section-padding">
        {activeMode === 'single' && (
          <div className="container-max">
            <ImageUploader />
          </div>
        )}
        {activeMode === 'batch' && (
          <div className="container-max">
            <BatchImageUploader />
          </div>
        )}
        {activeMode === 'generate' && (
          <div className="container-max text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">AI Image Generator</h3>
              <h4 className="text-2xl font-semibold text-green-400 mb-6">Coming Soon</h4>
              <p className="text-xl text-gray-300 leading-relaxed">
                We're working hard to bring you an amazing AI-powered image generation feature. 
                Create stunning, unique images from simple text descriptions.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
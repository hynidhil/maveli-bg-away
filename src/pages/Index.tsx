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
      <section className="hero-section section-padding min-h-screen flex items-center">
        <div className="container-max">
          <div className="text-center relative z-10">
            {/* Left Side - Content */}
            <div className="space-y-8 max-w-4xl mx-auto">
              {activeMode === 'generate' ? (
                <>
                  <h2 className="hero-title text-4xl md:text-6xl text-white leading-tight">
                    AI Image Generator
                    <span className="block bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                      Coming Soon
                    </span>
                  </h2>
                  <p className="hero-subtitle text-lg md:text-xl text-gray-300 leading-relaxed">
                    We're working on bringing you an amazing AI image generation feature. 
                    Stay tuned for updates!
                  </p>
                </>
              ) : (
                <>
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
                </>
              )}
              
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
                  Batch Upload {getUserPlan().type === 'free' ? '🔒' : ''}
                </Button>
                <Button
                  onClick={() => setActiveMode('generate')}
                  className={`px-6 py-3 text-base font-semibold rounded-full transition-all ${
                    activeMode === 'generate' 
                      ? "btn-secondary" 
                      : "mode-toggle"
                  }`}
                  disabled={true}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generator (Coming Soon)
                </Button>
              </div>
            </div>

            {/* Right Side - Upload Box */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {activeMode === 'generate' ? (
                  <div className="card-modern p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">AI Image Generator</h3>
                    <p className="text-gray-400 mb-6">Create stunning images from text descriptions</p>
                    <Button className="btn-primary w-full py-3 text-lg font-semibold rounded-full">
                      Start Creating
                    </Button>
                  </div>
                ) : (
                  <div className="upload-area rounded-2xl p-8 cursor-pointer transition-all">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-white mb-2">Upload Image</p>
                        <p className="text-gray-400 mb-1">or drop a file,</p>
                        <p className="text-gray-500">paste image or URL</p>
                      </div>
                      <Button className="btn-primary px-8 py-3 text-lg font-semibold rounded-full">
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default Index;
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
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left Side - Content */}
            <div className="space-y-8">
              {activeMode === 'generate' ? (
                <>
                  <h2 className="hero-title text-4xl md:text-6xl text-white leading-tight">
                    Create Amazing Images
                    <span className="block bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                      with AI
                    </span>
                  </h2>
                  <p className="hero-subtitle text-lg md:text-xl text-gray-300 leading-relaxed">
                    Generate stunning, unique images from text descriptions using advanced AI technology. 
                    Perfect for creative projects, social media, and professional use.
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
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generator
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
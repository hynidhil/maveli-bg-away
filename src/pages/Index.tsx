import React, { useState } from 'react';
import Header from '@/components/Header';
import BatchImageUploader from '@/components/BatchImageUploader';
import ImageGenerator from '@/components/ImageGenerator';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getUserPlan, canUseBackgroundRemoval, incrementBackgroundRemovalUsage, getPlanLimits } from '@/utils/planManager';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import ManualEditor from '@/components/ManualEditor';
import BackgroundEffects from '@/components/BackgroundEffects';
import PlanLimitModal from '@/components/PlanLimitModal';
import PlanStatus from '@/components/PlanStatus';
import { Upload, Layers, Sparkles, Star, Zap, Shield, Loader, Download, Image as ImageIcon, AlertCircle, Pencil, Eye, EyeOff } from 'lucide-react';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch' | 'generate'>('single');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage('');
        setError('');
        setShowManualEditor(false);
        setShowBackgroundEffects(false);
        setShowComparison(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage('');
        setError('');
        setShowManualEditor(false);
        setShowBackgroundEffects(false);
        setShowComparison(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveBackground = async () => {
    if (!uploadedFile) return;
    
    if (!canUseBackgroundRemoval()) {
      setShowPlanLimitModal(true);
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const imageElement = await loadImage(uploadedFile);
      const processedBlob = await removeBackground(imageElement);
      
      if (!processedBlob || processedBlob.size === 0) {
        throw new Error('Background removal returned empty result');
      }
      
      incrementBackgroundRemovalUsage();
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
    } catch (err) {
      console.error('Error during background removal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove background';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, quality: 'low' | 'medium' | 'high') => {
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    if (quality === 'high' && !planLimits.hdDownloads) {
      setShowPlanLimitModal(true);
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      switch (quality) {
        case 'low':
          width = Math.min(width, 800);
          height = Math.min(height, 600);
          break;
        case 'medium':
          width = Math.min(width, 1920);
          height = Math.min(height, 1080);
          break;
        case 'high':
          break;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `background-removed-${quality}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    img.src = imageUrl;
  };

  const handleManualEditComplete = (editedImageUrl: string) => {
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    if (!planLimits.manualEditing) {
      setShowPlanLimitModal(true);
      return;
    }
    
    setProcessedImage(editedImageUrl);
    setShowManualEditor(false);
  };

  const handleBackgroundEffectApplied = (imageWithBackground: string) => {
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    if (!planLimits.backgroundEffects) {
      setShowPlanLimitModal(true);
      return;
    }
    
    setProcessedImage(imageWithBackground);
    setShowBackgroundEffects(false);
  };

  const resetAll = () => {
    setUploadedImage('');
    setProcessedImage('');
    setUploadedFile(null);
    setError('');
    setShowComparison(false);
  };

  if (showManualEditor && uploadedImage) {
    return (
      <ManualEditor
        imageUrl={uploadedImage}
        onComplete={handleManualEditComplete}
        onCancel={() => setShowManualEditor(false)}
      />
    );
  }

  if (showBackgroundEffects && processedImage) {
    return (
      <BackgroundEffects
        processedImageUrl={processedImage}
        originalImageUrl={uploadedImage}
        onApply={handleBackgroundEffectApplied}
        onCancel={() => setShowBackgroundEffects(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <PlanStatus onUpgradeClick={() => setShowPlanLimitModal(true)} />
      
      <PlanLimitModal
        isOpen={showPlanLimitModal}
        onClose={() => setShowPlanLimitModal(false)}
      />
      
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
                  disabled
                  className="px-6 py-3 text-base font-semibold rounded-full transition-all mode-toggle opacity-50 cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate - Coming Soon
                </Button>
              </div>
            </div>
            
            {/* Right Side - Preview */}
            <div className="relative">
              {!uploadedImage ? (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="hero-file-input"
                  />
                  
                  <div 
                    className="text-center cursor-pointer"
                    onClick={() => document.getElementById('hero-file-input')?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 hover:from-green-600 hover:to-green-700 transition-all">
                      <Upload className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                    <p className="text-gray-300 mb-6">
                      Upload your image and start removing backgrounds instantly with our AI-powered tool.
                    </p>
                    <div className="space-y-4">
                      <Button className="btn-primary w-full py-3 text-lg font-semibold rounded-full">
                        Start Creating
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      onClick={() => document.getElementById('hero-file-input')?.click()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      New
                    </Button>
                    <Button
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="w-4 h-4 mr-1 animate-spin" />
                          Processing
                        </>
                      ) : (
                        'Remove BG'
                      )}
                    </Button>
                    {processedImage && (
                      <>
                        <Button
                          onClick={() => setShowManualEditor(true)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => setShowBackgroundEffects(true)}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full"
                        >
                          Effects
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={resetAll}
                      size="sm"
                      variant="outline"
                      className="rounded-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {uploadedImage && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Original</h4>
                        <img
                          src={uploadedImage}
                          alt="Original"
                          className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                      {processedImage && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-300">Result</h4>
                          <img
                            src={processedImage}
                            alt="Processed"
                            className="w-full h-48 object-cover rounded-lg border border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-300">{error}</span>
                    </div>
                  )}

                  {/* Download Options */}
                  {processedImage && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Editing Tools</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button
                          onClick={() => setShowManualEditor(true)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Fine-tune Edges
                        </Button>
                        <Button
                          onClick={() => setShowBackgroundEffects(true)}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                        >
                          Add Background
                        </Button>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-300">Download Options</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => downloadImage(processedImage, 'low')}
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600 text-white text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Low
                        </Button>
                        <Button
                          onClick={() => downloadImage(processedImage, 'medium')}
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600 text-white text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Medium
                        </Button>
                        <Button
                          onClick={() => downloadImage(processedImage, 'high')}
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600 text-white text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          HD
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Images Gallery */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              See It In Action
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { src: '/imgi_15_person-1.png', alt: 'Person 1' },
              { src: '/imgi_16_person-2.png', alt: 'Person 2' },
              { src: 'https://i.postimg.cc/Xv9qfYy2/imgi-17-person-3.png', alt: 'Person 3' }
            ].map((image, index) => {
              const labels = [
                'Original',
                'Transparent background', 
                'New background'
              ];
              
              return (
              <div
                key={index}
                className="relative group cursor-pointer space-y-3"
                onClick={() => {
                  fetch(image.src)
                    .then(res => res.blob())
                    .then(blob => {
                      const file = new File([blob], `sample-${index + 1}.png`, { type: 'image/png' });
                      setUploadedFile(file);
                      setUploadedImage(image.src);
                      setProcessedImage('');
                      setError('');
                      setShowManualEditor(false);
                      setShowBackgroundEffects(false);
                      setShowComparison(false);
                      // Scroll to top to see the loaded image
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg border border-gray-600 group-hover:border-green-500 transition-all duration-300"
                />
                <div className="text-center">
                  <p className="text-white font-medium text-sm">{labels[index]}</p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
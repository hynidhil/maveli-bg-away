
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import BatchImageUploader from '@/components/BatchImageUploader';
import ImageGenerator from '@/components/ImageGenerator';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch' | 'generate'>('single');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          {activeMode === 'generate' ? (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Create Amazing Images with AI - Completely Free!
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                Generate stunning, unique images from text descriptions using advanced AI technology. 
                Perfect for creative projects, social media, and professional use!
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Remove Backgrounds in Seconds - Completely Free!
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                Upload your images and let our advanced AI remove backgrounds instantly. 
                Perfect for e-commerce, social media, and professional use. No watermarks, no limits!
              </p>
            </>
          )}
          
          {/* Mode Toggle */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => setActiveMode('single')}
              variant={activeMode === 'single' ? "default" : "outline"}
              className={activeMode === 'single' ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Single Image Mode
            </Button>
            <Button
              onClick={() => setActiveMode('batch')}
              variant={activeMode === 'batch' ? "default" : "outline"}
              className={activeMode === 'batch' ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Batch Upload (Up to 3 Images) {getUserPlan().type === 'free' ? '🔒' : ''}
            </Button>
            <Button
              onClick={() => setActiveMode('generate')}
              variant={activeMode === 'generate' ? "default" : "outline"}
              className={activeMode === 'generate' ? "bg-green-600 hover:bg-green-700" : ""}
            >
              AI Image Generator
            </Button>
          </div>
        </div>
        
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

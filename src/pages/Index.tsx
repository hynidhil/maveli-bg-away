
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import BatchImageUploader from '@/components/BatchImageUploader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [useBatchMode, setUseBatchMode] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Remove Backgrounds in Seconds - Completely Free!
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Upload your images and let our advanced AI remove backgrounds instantly. 
            Perfect for e-commerce, social media, and professional use. No watermarks, no limits!
          </p>
          
          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setUseBatchMode(false)}
              variant={!useBatchMode ? "default" : "outline"}
              className={!useBatchMode ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Single Image Mode
            </Button>
            <Button
              onClick={() => setUseBatchMode(true)}
              variant={useBatchMode ? "default" : "outline"}
              className={useBatchMode ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Batch Upload (Up to 3 Images)
            </Button>
          </div>
        </div>
        
        {useBatchMode ? <BatchImageUploader /> : <ImageUploader />}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

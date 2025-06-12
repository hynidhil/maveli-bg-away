
import React from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import Footer from '@/components/Footer';
import PremiumStatus from '@/components/PremiumStatus';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <PremiumStatus />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Remove Backgrounds in Seconds
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your image and let our AI-powered tool remove the background instantly. 
            Perfect for e-commerce, social media, and professional use.
          </p>
        </div>
        
        <ImageUploader />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

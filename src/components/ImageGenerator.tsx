import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Download, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for the image you want to generate');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (data.imageData) {
        // Convert base64 to blob URL for display
        const byteCharacters = atob(data.imageData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        
        setGeneratedImage(imageUrl);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image data received');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      generateImage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-green-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            AI Image Generator
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Create stunning images from text descriptions using advanced AI. 
          Describe what you want to see and watch it come to life!
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Describe Your Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Image Description
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe the image you want to generate... (e.g., 'A majestic mountain landscape at sunset with a crystal clear lake reflecting the orange sky')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Press Ctrl+Enter to generate</span>
              <span>{prompt.length}/500</span>
            </div>
          </div>

          <Button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Generated Image
              </CardTitle>
              <Button
                onClick={downloadImage}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-card rounded-lg p-4 border">
              <img
                src={generatedImage}
                alt="Generated image"
                className="w-full h-auto max-h-96 object-contain rounded-lg mx-auto"
              />
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Prompt:</strong> {prompt}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="bg-green-500/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-500 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Pro Tips for Better Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be specific and descriptive in your prompts</li>
            <li>• Include details about style, lighting, and mood</li>
            <li>• Mention specific colors, textures, or artistic styles</li>
            <li>• Use descriptive adjectives (e.g., "vibrant", "ethereal", "dramatic")</li>
            <li>• Specify the setting or environment clearly</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerator;
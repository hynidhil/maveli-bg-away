import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('Gemini API key not configured. Please check your environment configuration.');
      toast.error('API key not configured');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Use Gemini 1.5 Flash for image generation
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create a detailed, high-quality image based on this description: ${prompt.trim()}. Make it visually stunning, well-composed, and professionally rendered.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Since Gemini doesn't directly generate images, we'll create a placeholder
      // and show the generated description
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Generated Content', 256, 200);
        
        ctx.font = '16px Arial';
        const words = generatedText.split(' ');
        let line = '';
        let y = 250;
        
        for (let n = 0; n < Math.min(words.length, 50); n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > 450 && n > 0) {
            ctx.fillText(line, 256, y);
            line = words[n] + ' ';
            y += 25;
            if (y > 450) break;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 256, y);
        
        const imageUrl = canvas.toDataURL('image/png');
        setGeneratedImage(imageUrl);
        toast.success('Content generated successfully!');
      }

    } catch (err) {
      console.error('Error generating content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-content-${Date.now()}.png`;
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
            AI Content Generator
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Generate creative content and visual representations using advanced AI. 
          Describe what you want to create and watch it come to life!
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Describe Your Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Content Description
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to create... (e.g., 'A futuristic cityscape with flying cars and neon lights')"
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
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Content
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

      {/* Generated Content Display */}
      {generatedImage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Generated Content
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
                alt="Generated content"
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
            <li>• Include details about style, mood, and atmosphere</li>
            <li>• Mention specific elements you want to see</li>
            <li>• Use descriptive adjectives (e.g., "vibrant", "ethereal", "dramatic")</li>
            <li>• Specify the setting or environment clearly</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerator;
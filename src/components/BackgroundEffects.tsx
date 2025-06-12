
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Check } from 'lucide-react';

interface BackgroundEffectsProps {
  processedImageUrl: string;
  originalImageUrl: string | null;
  onApply: (imageWithBackground: string) => void;
  onCancel: () => void;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  processedImageUrl,
  originalImageUrl,
  onApply,
  onCancel
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string>('white');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const effects = [
    { id: 'white', name: 'White Background', preview: '#ffffff' },
    { id: 'blur', name: 'Blurred Original', preview: 'blur' },
    { id: 'gradient', name: 'Gradient', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'nature', name: 'Nature Background', preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
    { id: 'custom', name: 'Custom Background', preview: 'custom' },
  ];

  const handleCustomUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target?.result as string);
        setSelectedEffect('custom');
        generatePreview('custom', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePreview = async (effectId: string, customBg?: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the processed image
    const processedImg = new Image();
    processedImg.crossOrigin = 'anonymous';
    
    processedImg.onload = async () => {
      canvas.width = processedImg.naturalWidth;
      canvas.height = processedImg.naturalHeight;

      // Apply background effect
      switch (effectId) {
        case 'white':
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;

        case 'blur':
          if (originalImageUrl) {
            const originalImg = new Image();
            originalImg.crossOrigin = 'anonymous';
            originalImg.onload = () => {
              // Draw blurred original image
              ctx.filter = 'blur(20px)';
              ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
              ctx.filter = 'none';
              // Draw processed image on top
              ctx.drawImage(processedImg, 0, 0);
              setPreviewImage(canvas.toDataURL());
            };
            originalImg.src = originalImageUrl;
            return;
          }
          break;

        case 'gradient':
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;

        case 'nature':
          const natureImg = new Image();
          natureImg.crossOrigin = 'anonymous';
          natureImg.onload = () => {
            ctx.drawImage(natureImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(processedImg, 0, 0);
            setPreviewImage(canvas.toDataURL());
          };
          natureImg.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
          return;

        case 'custom':
          if (customBg) {
            const customImg = new Image();
            customImg.onload = () => {
              ctx.drawImage(customImg, 0, 0, canvas.width, canvas.height);
              ctx.drawImage(processedImg, 0, 0);
              setPreviewImage(canvas.toDataURL());
            };
            customImg.src = customBg;
            return;
          }
          break;
      }

      // Draw processed image on top
      ctx.drawImage(processedImg, 0, 0);
      setPreviewImage(canvas.toDataURL());
    };

    processedImg.src = processedImageUrl;
  };

  const handleEffectSelect = (effectId: string) => {
    setSelectedEffect(effectId);
    if (effectId === 'custom' && !customBackground) {
      fileInputRef.current?.click();
    } else {
      generatePreview(effectId, customBackground || undefined);
    }
  };

  const handleApply = () => {
    if (previewImage) {
      onApply(previewImage);
    }
  };

  // Generate initial preview
  React.useEffect(() => {
    generatePreview(selectedEffect);
  }, [processedImageUrl]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Background Effects</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Effects Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Background Effect</h3>
          <div className="grid grid-cols-1 gap-3">
            {effects.map((effect) => (
              <div
                key={effect.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedEffect === effect.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-green-500/50'
                }`}
                onClick={() => handleEffectSelect(effect.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{effect.name}</span>
                  {selectedEffect === effect.id && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="mt-2 h-12 rounded border overflow-hidden">
                  {effect.preview === 'custom' ? (
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-500" />
                    </div>
                  ) : effect.preview === 'blur' ? (
                    <div className="w-full h-full bg-gradient-to-r from-blue-200 to-purple-200 filter blur-sm"></div>
                  ) : effect.preview.startsWith('http') ? (
                    <img
                      src={effect.preview}
                      alt={effect.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: effect.preview }}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCustomUpload}
            className="hidden"
          />

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApply}
              disabled={!previewImage}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              Apply Background
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div className="relative bg-card rounded-lg p-4 border min-h-[400px] flex items-center justify-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            ) : (
              <div className="text-muted-foreground">
                Generating preview...
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BackgroundEffects;

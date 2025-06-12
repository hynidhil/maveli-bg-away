
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Save, X } from 'lucide-react';

interface ManualEditorProps {
  imageUrl: string;
  onComplete: (editedImageUrl: string) => void;
  onCancel: () => void;
}

const ManualEditor: React.FC<ManualEditorProps> = ({ imageUrl, onComplete, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      
      // Save initial state to history
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([imageData]);
      setHistoryIndex(0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    erase(e);
  };

  const erase = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onComplete(url);
      }
    }, 'image/png');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manual Background Removal</h2>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Brush Size:</label>
          <input
            type="range"
            min="5"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">{brushSize}px</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={undo}
            disabled={historyIndex <= 0}
            variant="outline"
            size="sm"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            variant="outline"
            size="sm"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Click and drag to erase the background. Use the brush size slider to adjust the eraser size.
        </p>
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={erase}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="max-w-full h-auto border rounded-lg cursor-crosshair"
            style={{ maxHeight: '70vh' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManualEditor;


import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Save, X, Trash2, RotateCcw } from 'lucide-react';

interface ManualEditorProps {
  imageUrl: string;
  onComplete: (editedImageUrl: string) => void;
  onCancel: () => void;
}

const ManualEditor: React.FC<ManualEditorProps> = ({ imageUrl, onComplete, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedAreas, setSelectedAreas] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!ctx || !overlayCtx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      overlayCanvas.width = img.naturalWidth;
      overlayCanvas.height = img.naturalHeight;
      
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

  const restoreOriginal = () => {
    if (history.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.putImageData(history[0], 0, 0);
      setHistoryIndex(0);
      clearSelection();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawSelection(e);
  };

  const drawSelection = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    const overlayCtx = overlayCanvas.getContext('2d');
    if (!overlayCtx) return;

    const rect = overlayCanvas.getBoundingClientRect();
    const scaleX = overlayCanvas.width / rect.width;
    const scaleY = overlayCanvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Draw selection overlay in red with transparency
    overlayCtx.globalCompositeOperation = 'source-over';
    overlayCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    overlayCtx.beginPath();
    overlayCtx.arc(x, y, brushSize, 0, 2 * Math.PI);
    overlayCtx.fill();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Save the overlay as selected areas
      const overlayCanvas = overlayCanvasRef.current;
      if (overlayCanvas) {
        const overlayCtx = overlayCanvas.getContext('2d');
        if (overlayCtx) {
          const overlayData = overlayCtx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height);
          setSelectedAreas(overlayData);
        }
      }
    }
  };

  const removeSelectedAreas = () => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas || !selectedAreas) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!ctx || !overlayCtx) return;

    // Get current canvas data
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const canvasPixels = canvasData.data;
    const overlayPixels = selectedAreas.data;

    // Remove pixels where overlay has red color
    for (let i = 0; i < overlayPixels.length; i += 4) {
      const red = overlayPixels[i];
      const alpha = overlayPixels[i + 3];
      
      // If there's red color in overlay (selected area)
      if (red > 0 && alpha > 0) {
        // Make corresponding canvas pixel transparent
        canvasPixels[i + 3] = 0;
      }
    }

    // Apply the changes
    ctx.putImageData(canvasData, 0, 0);
    
    // Clear overlay
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    setSelectedAreas(null);
    
    // Save to history
    saveToHistory();
  };

  const clearSelection = () => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    const overlayCtx = overlayCanvas.getContext('2d');
    if (overlayCtx) {
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      setSelectedAreas(null);
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
        <h2 className="text-2xl font-bold">Manual Background Removal Tool</h2>
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
          <Button
            onClick={restoreOriginal}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restore Original
          </Button>
        </div>

        {selectedAreas && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={removeSelectedAreas}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Selected Areas
            </Button>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
            >
              Clear Selection
            </Button>
          </div>
        )}

        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>How to use:</strong> Brush over areas you want to remove (shown in red), 
            then click "Remove Selected Areas". Use undo/redo to fine-tune your edits.
          </p>
        </div>
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto border rounded-lg absolute"
            style={{ maxHeight: '70vh' }}
          />
          <canvas
            ref={overlayCanvasRef}
            onMouseDown={startDrawing}
            onMouseMove={drawSelection}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="max-w-full h-auto border rounded-lg cursor-crosshair relative z-10"
            style={{ maxHeight: '70vh' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManualEditor;

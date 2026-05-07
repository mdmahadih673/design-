import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/Button';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We will attempt to process any image, but large ones will be optimized
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to optimize/resize if necessary
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // If the image is very large, we scale it down to ensure it fits Firestore's 1MB limit
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to optimized format (WebP or JPEG with quality reduction)
        const optimizedUrl = canvas.toDataURL('image/jpeg', 0.8);
        onChange(optimizedUrl);
        setIsUploading(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-bold text-light-text ml-1">{label}</label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-black/5">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="bg-white text-black hover:bg-white/90 border-none"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </Button>
              <button 
                type="button"
                onClick={removeImage}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer flex flex-col items-center justify-center text-light-text gap-3 group"
          >
            {isUploading ? (
              <Loader2 size={32} className="animate-spin text-accent" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Click to upload image</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">PNG, JPG up to 2MB</p>
                </div>
              </>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}

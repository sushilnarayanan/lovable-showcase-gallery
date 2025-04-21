
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageZoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt?: string;
}

const ImageZoomDialog: React.FC<ImageZoomDialogProps> = ({ open, onOpenChange, imageUrl, alt }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-black flex items-center justify-center p-0 sm:p-0">
        <img
          src={imageUrl}
          alt={alt}
          className="max-h-[80vh] max-w-full rounded shadow-lg"
          style={{ margin: "0 auto" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomDialog;

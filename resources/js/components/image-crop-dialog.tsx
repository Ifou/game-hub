import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageCropDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onCropComplete: (croppedImageBlob: Blob) => void;
    aspectRatio?: number;
    title: string;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export default function ImageCropDialog({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete,
    aspectRatio = 1, // Default to square crop
    title
}: ImageCropDialogProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspectRatio) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspectRatio));
        }
    }, [aspectRatio]);

    const getCroppedImg = useCallback((
        image: HTMLImageElement,
        crop: PixelCrop
    ): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Calculate the actual crop dimensions in the original image
        const actualCropWidth = crop.width * scaleX;
        const actualCropHeight = crop.height * scaleY;

        // For background images, ensure minimum dimensions for better quality
        const minWidth = aspectRatio > 1 ? 1200 : 400; // Wide images get higher resolution
        const minHeight = aspectRatio > 1 ? 600 : 400;

        // Use the larger of actual crop size or minimum size
        canvas.width = Math.max(actualCropWidth, minWidth);
        canvas.height = Math.max(actualCropHeight, minHeight);

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            actualCropWidth,
            actualCropHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                }
            }, 'image/jpeg', 0.95); // Increased quality from 0.9 to 0.95
        });
    }, [aspectRatio]);

    const handleCropComplete = async () => {
        if (completedCrop && imgRef.current) {
            try {
                const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
                onCropComplete(croppedImageBlob);
                onClose();
            } catch (error) {
                console.error('Error cropping image:', error);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="flex justify-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspectRatio}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imageSrc}
                            style={{ maxHeight: '400px', maxWidth: '100%' }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCropComplete} disabled={!completedCrop}>
                        Apply Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

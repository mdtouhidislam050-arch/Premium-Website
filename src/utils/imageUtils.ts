/**
 * Utility functions for handling image validation, file reading,
 * and Base64 / Data URL conversion for local browser storage.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];
export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file against allowed image formats (PNG, JPG, JPEG, WEBP)
 * and maximum size (5 MB).
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file size (5 MB limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeInMB} MB) exceeds the 5 MB limit. Please select an image under 5 MB.`,
    };
  }

  // Check MIME type or filename extension
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  const hasValidMime = ALLOWED_MIME_TYPES.includes(fileType);
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasValidMime && !hasValidExt) {
    return {
      valid: false,
      error: 'Invalid file format. Only PNG, JPG, JPEG, and WEBP images are supported.',
    };
  }

  return { valid: true };
}

/**
 * Formats byte size into human readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Converts a File into a browser-safe Base64 Data URL string.
 * Optimizes dimensions to max 512x512 to ensure localStorage quota
 * is never exceeded while maintaining crisp high-DPI app icon quality.
 */
export async function convertFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      // Optimize via offscreen canvas so storing multiple apps won't blow localStorage
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 512;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // If already smaller than 512x512, return directly
          if (width <= maxDim && height <= maxDim) {
            resolve(rawDataUrl);
            return;
          }

          // Scale down proportionally
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Choose output format based on original type
          const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(outputMime, 0.92);
          resolve(optimizedDataUrl);
        } catch (err) {
          // Fallback to raw data url if canvas security or scaling fails
          console.warn('Canvas optimization fallback to raw data URL:', err);
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        // If image fails to decode in browser, resolve with raw data URL
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}

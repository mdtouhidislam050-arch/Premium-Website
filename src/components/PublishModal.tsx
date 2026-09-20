import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  ExternalLink, 
  AlertCircle, 
  Info, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  ImageIcon, 
  RefreshCw 
} from 'lucide-react';
import { AppCategory, AppItem, FormErrors } from '../types';
import { isValidHttpUrl } from '../utils/storage';
import { validateImageFile, convertFileToDataUrl, formatFileSize } from '../utils/imageUtils';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newApp: AppItem) => void;
}

const CATEGORIES: AppCategory[] = [
  'Apps',
  'Games',
  'Tools',
  'Social',
  'Entertainment',
  'Education',
  'Other',
];

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [image, setImage] = useState<string>(''); // Base64 Data URL
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageFileSize, setImageFileSize] = useState<string>('');
  const [category, setCategory] = useState<AppCategory>('Apps');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [developer, setDeveloper] = useState('');
  const [link, setLink] = useState('');

  // Image upload state & feedback
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Optional URL fallback tab if user explicitly chooses to enter URL instead of file
  const [useUrlMode, setUseUrlMode] = useState(false);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setImageError(null);

    // Validate file type and 5MB size limit
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid image file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setIsConvertingImage(true);
      const dataUrl = await convertFileToDataUrl(file);
      setImage(dataUrl);
      setImageFileName(file.name);
      setImageFileSize(formatFileSize(file.size));
      setImageError(null);
    } catch (err) {
      console.error('Failed to process image:', err);
      setImageError('Failed to read image. Please try another file.');
    } finally {
      setIsConvertingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageFileName('');
    setImageFileSize('');
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = 'App name is required.';
    }

    if (!link.trim()) {
      errs.link = 'Download or visit link is required.';
    } else if (!isValidHttpUrl(link)) {
      errs.link = 'Must be a valid HTTP or HTTPS link (e.g. https://example.com/download)';
    }

    if (useUrlMode && image.trim() && !isValidHttpUrl(image)) {
      errs.image = 'Image URL must start with http:// or https://';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const finalImage = image.trim();

    const newApp: AppItem = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      image: finalImage,
      imageUrl: finalImage, // duplicate for backward compatibility
      category: category,
      description: description.trim(),
      version: version.trim() || '1.0.0',
      developer: developer.trim() || 'Anonymous Developer',
      link: link.trim(),
      downloadUrl: link.trim(), // duplicate for backward compatibility
      createdAt: Date.now(),
      isCustom: true,
    };

    onPublish(newApp);

    // Reset form
    setName('');
    setImage('');
    setImageFileName('');
    setImageFileSize('');
    setImageError(null);
    setCategory('Apps');
    setDescription('');
    setVersion('1.0.0');
    setDeveloper('');
    setLink('');
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="publish-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Publish New App
              </h2>
              <p className="text-xs text-slate-400">
                Upload your app icon and set external download or visit links
              </p>
            </div>
          </div>

          <button
            id="publish-modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser storage reminder */}
        <div className="px-6 py-2.5 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
          <Info className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Image data is converted to a browser-safe format and saved directly in local storage.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: App Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* App Name */}
            <div>
              <label 
                htmlFor="publish-app-name" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                App Name <span className="text-emerald-400">*</span>
              </label>
              <input
                id="publish-app-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. WhatsApp, Spotify, Retro Game"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-emerald-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label 
                htmlFor="publish-app-category" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Category <span className="text-emerald-400">*</span>
              </label>
              <select
                id="publish-app-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as AppCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: APP IMAGE UPLOAD (Direct Computer File Selection) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                App Image
              </label>
              <button
                type="button"
                onClick={() => {
                  setUseUrlMode(!useUrlMode);
                  setImageError(null);
                }}
                className="text-[11px] text-slate-400 hover:text-emerald-400 underline transition-colors cursor-pointer"
              >
                {useUrlMode ? 'Switch to Computer File Upload' : 'Or enter Image URL'}
              </button>
            </div>

            {/* Hidden native file input */}
            <input
              id="publish-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {!useUrlMode ? (
              /* Computer File Upload Area */
              <div className="space-y-3">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all ${
                    isDragOver 
                      ? 'border-emerald-400 bg-emerald-950/20' 
                      : imageError 
                      ? 'border-rose-500/80 bg-rose-950/10' 
                      : image 
                      ? 'border-emerald-500/40 bg-slate-800/40' 
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Left: Interactive Trigger Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <button
                        id="publish-choose-image-btn"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isConvertingImage}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600/80 hover:border-emerald-500/80 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isConvertingImage ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4 text-emerald-400" />
                            <span>Choose App Image</span>
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-slate-400 text-center sm:text-left">
                        PNG, JPG, JPEG, WEBP (Max 5 MB)
                      </span>
                    </div>

                    {/* Right: Selected File Info & Image Preview */}
                    {image && (
                      <div className="flex-1 w-full flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        {/* Filename & size */}
                        <div className="text-right min-w-0">
                          <p className="text-xs font-semibold text-emerald-300 truncate max-w-[160px] sm:max-w-[200px]" title={imageFileName}>
                            {imageFileName || 'Selected Image'}
                          </p>
                          {imageFileSize && (
                            <span className="text-[10px] text-slate-400 block">
                              {imageFileSize}
                            </span>
                          )}
                        </div>

                        {/* Image Preview */}
                        <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border-2 border-emerald-500/60 shadow-md">
                          <img
                            id="publish-image-preview"
                            src={image}
                            alt="App Icon Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Remove button */}
                        <button
                          id="publish-remove-image-btn"
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove selected image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message for Invalid Image */}
                {imageError && (
                  <div 
                    id="publish-image-error" 
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{imageError}</span>
                  </div>
                )}
              </div>
            ) : (
              /* URL Input Mode */
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    id="publish-app-image-url"
                    type="url"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      setImageFileName('External Link');
                      setImageError(null);
                    }}
                    placeholder="https://example.com/app-icon.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  {image && (
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                      <img
                        src={image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={() => setImageError('Failed to load image from URL.')}
                      />
                    </div>
                  )}
                </div>
                {imageError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {imageError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Row 3: Download / Visit Link (Required) */}
          <div>
            <label 
              htmlFor="publish-app-download-link" 
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Download / Visit Link <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                id="publish-app-download-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/download or https://yourapp.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border ${
                  errors.link ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-emerald-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono`}
              />
              <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            {errors.link ? (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.link}
              </p>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1 block">
                The exact URL opened when visitors click the card or button.
              </span>
            )}
          </div>

          {/* Row 4: Version & Developer Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Version */}
            <div>
              <label 
                htmlFor="publish-app-version" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Version
              </label>
              <input
                id="publish-app-version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 1.0.0 or 2.26.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Developer Name */}
            <div>
              <label 
                htmlFor="publish-app-developer" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Developer Name
              </label>
              <input
                id="publish-app-developer"
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="e.g. Acme Studio, Independent Dev"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Row 5: Short Description */}
          <div>
            <label 
              htmlFor="publish-app-description" 
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Short Description
            </label>
            <textarea
              id="publish-app-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this application does, its core highlights, and features..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Modal Footer: Cancel and Large Publish App button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              id="publish-modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="publish-modal-submit-btn"
              type="submit"
              disabled={isConvertingImage}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all duration-150 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Publish App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

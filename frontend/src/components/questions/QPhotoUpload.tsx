import React, { useState, useRef } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Upload, Camera, Crop, Trash2, CheckCircle2 } from 'lucide-react';

export const QPhotoUpload: React.FC = () => {
  const { formData, updateFormData, openCropper } = useBiodata();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePic = formData.profilePictureUrl;

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          openCropper(src, (croppedUrl, originalUrl, filterId) => {
            const rawSource = originalUrl || src;
            updateFormData({
              profilePictureUrl: croppedUrl,
              originalProfilePictureUrl: rawSource,
              profilePhotoFilter: filterId || 'normal',
            });
          }, src, 'normal');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemovePhoto = () => {
    updateFormData({
      profilePictureUrl: '',
      originalProfilePictureUrl: '',
      profilePhotoFilter: 'normal',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center text-left">
      {/* Left Column: Upload / Preview */}
      <div>
        {profilePic ? (
          /* Photo Preview Box */
          <div className="space-y-3 text-center">
            <div className="relative w-36 aspect-[4/5] mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-xl group">
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const sourceToCrop = formData.originalProfilePictureUrl || profilePic;
                    const currentFilter = formData.profilePhotoFilter || 'normal';
                    if (sourceToCrop) {
                      openCropper(sourceToCrop, (croppedUrl, originalUrl, filterId) => {
                        const rawSource = originalUrl || sourceToCrop;
                        updateFormData({
                          profilePictureUrl: croppedUrl,
                          originalProfilePictureUrl: rawSource,
                          profilePhotoFilter: filterId || 'normal',
                        });
                      }, sourceToCrop, currentFilter);
                    }
                  }}
                  className="p-2 bg-white text-gray-900 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title="Crop photo"
                >
                  <Crop size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-2 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-[450] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Camera size={12} /> Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-[450] transition flex items-center gap-1.5 cursor-pointer border border-rose-200 shadow-xs"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center justify-center gap-1.5 text-xs font-[450] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-max mx-auto">
              <CheckCircle2 size={13} /> Photo Added Successfully
            </div>
          </div>
        ) : (
          /* Dropzone Upload Box with Drag & Drop */
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`block p-6 sm:p-7 border-2 border-dashed rounded-3xl transition-all cursor-pointer select-none group text-center ${
              isDragging
                ? 'border-[#F01472] bg-rose-100/70 scale-[1.01] shadow-lg shadow-rose-500/15'
                : 'border-rose-300 bg-rose-50/40 hover:bg-rose-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className={`w-12 h-12 mx-auto mb-2.5 rounded-2xl flex items-center justify-center transition-all ${
                isDragging
                  ? 'bg-[#F01472] text-white scale-110 shadow-md'
                  : 'bg-white border border-rose-200 text-[#F01472] shadow-sm group-hover:scale-110'
              }`}
            >
              <Camera size={22} className={isDragging ? 'animate-bounce' : ''} />
            </div>
            <span className="block font-[450] text-gray-900 text-sm sm:text-base">
              {isDragging ? 'Drop Photo Here!' : 'Upload Profile Picture'}
            </span>
            <span className="block text-xs text-gray-500 mt-0.5 font-normal">
              or <span className="text-[#F01472] underline font-[450]">browse device</span> • JPG, PNG, WEBP (up to 10MB)
            </span>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 bg-[#F01472] text-white font-[450] text-xs rounded-xl shadow-xs group-hover:shadow-md transition-shadow">
              <Upload size={13} /> Select Photo
            </span>
          </div>
        )}
      </div>

      {/* Right Column: Photo Tips & Guidelines */}
      <div className="bg-rose-50/50 rounded-2xl p-4 sm:p-5 border border-rose-100/80 space-y-2.5">
        <h4 className="text-xs sm:text-sm font-[450] text-gray-800 flex items-center gap-1.5">
          <span>✨ Photo Guidelines</span>
        </h4>
        <ul className="text-xs text-gray-600 space-y-2 font-normal">
          <li className="flex items-start gap-2">
            <span className="text-[#F01472] font-[450]">•</span>
            <span>Use a clear front-facing portrait with good natural lighting.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F01472] font-[450]">•</span>
            <span>Solo photos without sunglasses or face coverings work best.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F01472] font-[450]">•</span>
            <span>You can crop and apply beauty filters immediately after selecting.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-[450]">✓</span>
            <span className="text-emerald-700 font-[450]">Profiles with photos receive up to 5x higher responses!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

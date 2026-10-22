import React, { useRef } from 'react';
import { Camera, Upload, Trash2, Image, CheckCircle2 } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';

const BRAND = '#F01472';
const BRAND_LIGHT = '#FFF0F6';
const BRAND_BORDER = '#FBBDD8';
const LABEL: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

export const Step7Uploads: React.FC = () => {
  const { formData, updateFormData, openCropper } = useBiodata();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const src = reader.result as string;
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
      e.target.value = '';
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(f => URL.createObjectURL(f));
    updateFormData({ galleryPictures: [...(formData.galleryPictures || []), ...urls] });
  };

  const removeGalleryPhoto = (idx: number) => {
    const updated = [...(formData.galleryPictures || [])];
    updated.splice(idx, 1);
    updateFormData({ galleryPictures: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <Camera style={{ width: '18px', height: '18px', color: BRAND }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Photos & Documents</h2>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Profiles with photos get 8x more responses</p>
        </div>
      </div>

      {/* Profile Photo */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
        <label style={LABEL}><Camera style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Profile Photo *</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Preview */}
          <div style={{
            width: '88px', aspectRatio: '4/5', borderRadius: '8px', overflow: 'hidden',
            border: `2px solid ${BRAND_BORDER}`, background: BRAND_LIGHT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {formData.profilePictureUrl ? (
              <img src={formData.profilePictureUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera style={{ width: '28px', height: '28px', color: BRAND_BORDER }} />
            )}
          </div>
          <div>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handleProfilePhoto} style={{ display: 'none' }} />
            <button type="button" onClick={() => photoInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: BRAND, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
              <Upload style={{ width: '13px' }} /> {formData.profilePictureUrl ? 'Change Photo' : 'Upload Photo'}
            </button>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>JPG, PNG · Max 5 MB · Min 200×200px<br/>Photo will be cropped to 4:5 portrait for Discover & profile</p>
            {formData.profilePictureUrl && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '6px' }}>
                <CheckCircle2 style={{ width: '12px' }} /> Photo uploaded successfully
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ ...LABEL, marginBottom: 0 }}><Image style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Photo Gallery (Optional)</label>
          <button type="button" onClick={() => galleryInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: BRAND_LIGHT, color: BRAND, border: `1px solid ${BRAND_BORDER}`, borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
            <Upload style={{ width: '11px' }} /> Add Photos
          </button>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
        </div>

        {(formData.galleryPictures || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', background: BRAND_LIGHT, borderRadius: '6px', border: `1.5px dashed ${BRAND_BORDER}` }}>
            <Image style={{ width: '28px', height: '28px', color: BRAND_BORDER, margin: '0 auto 6px' }} />
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>No gallery photos yet. Upload to make your profile stand out!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {(formData.galleryPictures || []).map((url: string, idx: number) => (
              <div key={idx} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', aspectRatio: '4/5', border: '1px solid #E5E7EB' }}>
                <img src={url} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => removeGalleryPhoto(idx)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '11px' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <CheckCircle2 style={{ width: '16px', color: '#059669', flexShrink: 0, marginTop: '1px' }} />
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#065F46', margin: '0 0 2px' }}>Privacy Protected</p>
          <p style={{ fontSize: '11px', color: '#059669', margin: 0 }}>Your photos are only shared with profiles you connect with. Never shared publicly.</p>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { supabase, getImageUrl } from '../../lib/supabase';

const ImageUpload = ({ folder, currentPath, onUpload }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPath ? getImageUrl(currentPath) : '');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const filePath = `${folder}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      setUploading(false);
      return;
    }

    // Delete old image if replacing
    if (currentPath) {
      await supabase.storage.from('portfolio-images').remove([currentPath]);
    }

    onUpload(filePath);
    setUploading(false);
  };

  return (
    <div className="admin-image-upload">
      {preview && (
        <img src={preview} alt="Preview" className="admin-image-upload__preview" />
      )}
      <div
        className="admin-image-upload__dropzone"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
        {uploading ? 'Uploading...' : 'Click to select image'}
      </div>
    </div>
  );
};

export default ImageUpload;

import { useState } from "react";

export const DropZone = ({ handleImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleFileChange = (e) => {
    handleImageUpload(e);
  };

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-32 h-32 border-2 ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-dashed border-gray-300'} rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="bg-orange-500 text-white px-4 py-1 rounded text-sm">
        {dragActive ? 'Drop files' : 'Upload Image'}
      </span>
    </label>
  );
};

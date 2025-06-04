import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  category: yup.string().required('Category is required'),
  duration: yup.string().required('Duration is required'),
  industry: yup.string().required('Industry is required'),
  body: yup.string().required('Body is required'),
});

const EditPostForm = ({ post, setView }) => {
  const [images, setImages] = useState([]);
  const [featured, setFeatured] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        category: post.category,
        duration: post.duration,
        industry: post.industry,
        body: post.body,
      });
      setImages(post.images || []);
      setFeatured(post.featured || false);
    }
  }, [post, reset]);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    images.forEach((image, index) => {
      if (image.file) {
        formData.append(`image${index}`, image.file);
      }
    });
    formData.append('featured', featured);
    console.log(Object.fromEntries(formData));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ url: URL.createObjectURL(file), file }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

const handleCancel = ()=>{
   setView('list')
}


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register('title')} className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input {...register('category')} className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`} />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input {...register('duration')} className={`w-full border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`} />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input {...register('industry')} className={`w-full border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`} />
            {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded text-orange-500 focus:ring-orange-500" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Post</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <Controller
            name="body"
            control={control}
            render={({ field }) => <ReactQuill {...field} theme="snow" />}
          />
          {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Media</h2>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <img src={image.url || image} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">×</button>
              </div>
            ))}
            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              <span className="bg-orange-500 text-white px-4 py-1 rounded text-sm">Upload Image</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;

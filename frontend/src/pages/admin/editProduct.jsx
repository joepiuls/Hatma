// EditProductForm.jsx
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  category: yup.string().required('Category is required'),
  sku: yup.string().required('SKU is required'),
  price: yup.number().required('Price is required').min(0),
  stock: yup.number().required('Stock is required').min(0),
  description: yup.string().required('Description is required'),
});

export default function EditProductForm({ product, setView}) {
  const [images, setImages] = useState([]);
  const [featured, setFeatured] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        category: product.category,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
      });
      setImages(product.images || []);
      setFeatured(product.featured || false);
    }
  }, [product, reset]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ url: URL.createObjectURL(file), file }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const updated = {
      ...product,
      ...data,
      images,
      featured,
    };
    onSave(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('list')}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input {...register('title')} className="w-full border px-3 py-2 rounded-md" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input {...register('sku')} className="w-full border px-3 py-2 rounded-md" />
            {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input {...register('category')} className="w-full border px-3 py-2 rounded-md" />
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" {...register('price')} className="w-full border px-3 py-2 rounded-md" />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" {...register('stock')} className="w-full border px-3 py-2 rounded-md" />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <label htmlFor="featured" className="text-sm">Featured Product</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <ReactQuill {...field} theme="snow" />}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Media</h2>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <img src={image.url || image} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >×</button>
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
}

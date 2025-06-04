import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'
import ReactQuill from 'react-quill';
import { RiDeleteBin6Line } from 'react-icons/ri';
import 'react-quill/dist/quill.snow.css';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  category: yup.string().required('Category is required'),
  subCategory: yup.string().required('Sub category is required'),
  sku: yup.string().required('SKU is required'),
  quantity: yup.number().required('Quantity is required').min(0),
  description: yup.string().required('Description is required'),
  deliveryInfo: yup.string().required('Delivery information is required'),
  price: yup.number().required('Price is required').min(0),
  discountPrice: yup.number().min(0),
  costPrice: yup.number().required('Cost price is required').min(0),
});

const ProductForm = ({setView}) => {
  const [variants, setVariants] = useState([{ optionName: '', optionValues: ['', '', ''] }]);
  const [images, setImages] = useState([]);
  const [featured, setFeatured] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price: '',
      discountPrice: '',
      costPrice: '',
      profit: '0',
    }
  });

  const price = watch('price');
  const costPrice = watch('costPrice');

  const handleAddVariant = () => {
    setVariants([...variants, { optionName: '', optionValues: ['', '', ''] }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    
    // Append basic form data
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    // Append variants
    formData.append('variants', JSON.stringify(variants));

    // Append images
    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
    });

    // Append featured status
    formData.append('featured', featured);

    console.log('Form submitted:', Object.fromEntries(formData));
  };

  const handleCancel = ()=>{
      setView('list')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add Product</h1>
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
            Save
          </button>
      </div>
      </div>

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              {...register('title')}
              className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                {...register('category')}
                className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub category</label>
              <input
                {...register('subCategory')}
                className={`w-full border ${errors.subCategory ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                {...register('sku')}
                className={`w-full border ${errors.sku ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in stock</label>
              <input
                type="number"
                {...register('quantity')}
                className={`w-full border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured Product
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                className={`${errors.description ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Variants */}
        <div>
          <h2 className="text-lg font-medium mb-4">Variants</h2>
          {variants.map((variant, index) => (
            <div key={index} className="mb-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option Name</label>
                  <input
                    type="text"
                    value={variant.optionName}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[index].optionName = e.target.value;
                      setVariants(newVariants);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="mt-6 p-2 text-gray-500 hover:text-gray-700"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Option Values</label>
                {variant.optionValues.map((value, valueIndex) => (
                  <input
                    key={valueIndex}
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[index].optionValues[valueIndex] = e.target.value;
                      setVariants(newVariants);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddVariant}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            + Add another
          </button>
        </div>

        {/* Media */}
        <div>
          <h2 className="text-lg font-medium mb-4">Media</h2>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <RiDeleteBin6Line size={16} />
                </button>
              </div>
            ))}
            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="bg-orange-500 text-white px-4 py-1 rounded text-sm">
                Upload Image
              </span>
            </label>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Information</label>
          <Controller
            name="deliveryInfo"
            control={control}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                className={`${errors.deliveryInfo ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.deliveryInfo && <p className="text-red-500 text-sm mt-1">{errors.deliveryInfo.message}</p>}
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-lg font-medium mb-4">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                {...register('price')}
                className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
              <input
                type="number"
                {...register('discountPrice')}
                className={`w-full border ${errors.discountPrice ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.discountPrice && <p className="text-red-500 text-sm mt-1">{errors.discountPrice.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input
                type="number"
                {...register('costPrice')}
                className={`w-full border ${errors.costPrice ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profit</label>
              <input
                type="number"
                value={price && costPrice ? price - costPrice : '0'}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
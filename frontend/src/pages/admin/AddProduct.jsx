import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  Loader, 
  X, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Package, 
  DollarSign, 
  Tag, 
  FileText, 
  ArrowLeft,
  Save,
  Check,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useAdminProductStore } from '../../store/useAdminProductStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Enhanced validation schema
const schema = yup.object().shape({
  name: yup.string().required('Product name is required').min(3, 'Name must be at least 3 characters'),
  category: yup.string().required('Category is required'),
  subCategory: yup.string().required('Sub category is required'),
  sku: yup.string().required('SKU is required').min(3, 'SKU must be at least 3 characters'),
  quantity: yup.number()
    .required('Quantity is required')
    .min(0, 'Quantity must be positive')
    .integer('Quantity must be a whole number'),
  description: yup.string().required('Description is required').min(50, 'Description must be at least 50 characters'),
  deliveryInfo: yup.string().required('Delivery information is required').min(20, 'Delivery info must be at least 20 characters'),
  price: yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive')
    .typeError('Price must be a valid number'),
  discountPrice: yup.number()
    .min(0, 'Discount price must be positive')
    .typeError('Discount price must be a valid number')
    .test('less-than-price', 'Discount must be less than price', function(value) {
      return value === undefined || value < this.parent.price;
    }),
  costPrice: yup.number()
    .required('Cost price is required')
    .min(0, 'Cost price must be positive')
    .typeError('Cost price must be a valid number'),
  featured: yup.boolean(),
});

const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 5;

const AddProductForm = ({ setView }) => {
  const [variants, setVariants] = useState([{ optionName: '', optionValues: [''] }]);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showProfitCalculation, setShowProfitCalculation] = useState(true);
  const [uploadError, setUploadError] = useState('');
  
  const { createProduct, loading } = useAdminProductStore();
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors }, watch, trigger, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price: undefined,
      discountPrice: undefined,
      costPrice: undefined,
      featured: false,
    }
  });

  const price = watch('price');
  const costPrice = watch('costPrice');
  const discountPrice = watch('discountPrice');

  // Calculate profit and margin with discount consideration
  const sellingPrice = discountPrice && discountPrice < price ? discountPrice : price;
  const profit = sellingPrice && costPrice ? sellingPrice - costPrice : 0;
  const margin = sellingPrice && costPrice ? ((profit / sellingPrice) * 100).toFixed(1) : 0;

  const steps = [
    { id: 1, title: 'Basic Info', icon: <Package className="w-5 h-5" /> },
    { id: 2, title: 'Details', icon: <FileText className="w-5 h-5" /> },
    { id: 3, title: 'Media', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 4, title: 'Pricing', icon: <DollarSign className="w-5 h-5" /> },
  ];

  // Handle variant operations
  const handleAddVariant = useCallback(() => {
    setVariants([...variants, { optionName: '', optionValues: [''] }]);
  }, [variants]);

  const handleRemoveVariant = useCallback((index) => {
    setVariants(variants.filter((_, i) => i !== index));
  }, [variants]);

  const addOptionValue = useCallback((variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].optionValues.push('');
    setVariants(updated);
  }, [variants]);

  const removeOptionValue = useCallback((variantIndex, valueIndex) => {
    const updated = [...variants];
    if (updated[variantIndex].optionValues.length > 1) {
      updated[variantIndex].optionValues.splice(valueIndex, 1);
      setVariants(updated);
    }
  }, [variants]);

  const handleOptionValueChange = useCallback((variantIndex, valueIndex, value) => {
    const updated = [...variants];
    updated[variantIndex].optionValues[valueIndex] = value;
    setVariants(updated);
  }, [variants]);

  // Image handling with validation
  const handleImageUpload = useCallback((files) => {
    setUploadError('');
    
    const validFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return false;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
        return false;
      }
      
      return true;
    });
    
    // Check total image count
    if (images.length + validFiles.length > MAX_IMAGES) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    
    const newImages = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, [images]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files);
    }
  }, [handleImageUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  const removeImage = useCallback((index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(images[index].url);
    setImages(prev => prev.filter((_, i) => i !== index));
  }, [images]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.url));
    };
  }, [images]);

  const onSubmit = async (data) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Append variants as JSON
      formData.append('variants', JSON.stringify(
        variants.filter(v => v.optionName && v.optionValues.some(val => val))
      ));
      
      // Append image files
      images.forEach(image => {
        formData.append('images', image.file);
      });
      
      await createProduct(formData);
      
      toast.success('Product created successfully!', {
        description: `${data.name} has been added to your inventory.`,
        action: {
          label: 'View Products',
          onClick: () => navigate('/admin/products'),
        },
      });
      
      // Reset form and navigate
      reset();
      setVariants([{ optionName: '', optionValues: [''] }]);
      setImages([]);
      setCurrentStep(1);
      setView('list');
    } catch (error) {
      toast.error('Failed to create product', {
        description: error.message || 'Please try again later.',
      });
    }
  };

  const handleCancel = () => {
    setView('list');
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['name', 'category', 'subCategory', 'sku', 'quantity'],
      2: ['description', 'deliveryInfo'],
      3: [],
      4: ['price', 'costPrice']
    };

    // Validate images for step 3
    if (currentStep === 3) {
      if (images.length === 0) {
        setUploadError('Please upload at least one image');
        return;
      }
    }

    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-gray-600 bg-clip-text text-transparent">
                  Add New Product
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Create a new product for your inventory</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary
                text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{loading ? 'Saving...' : 'Save Product'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps - Responsive */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                }`}>
                  <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'border-primary bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    ) : (
                      <div className="w-4 h-4 md:w-5 md:h-5">{step.icon}</div>
                    )}
                  </div>
                  <span className="text-sm md:text-base font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-8 md:w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-300'  
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <FormSection 
                title="Basic Information" 
                description="Enter the essential details about your product"
                icon={<Package className="w-5 h-5" />}
              >
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <FormField
                    label="Product Name"
                    error={errors.name}
                    required
                  >
                    <input
                      {...register('name')}
                      placeholder="Enter product name"
                      className={`form-input ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      label="Category"
                      error={errors.category}
                      required
                    >
                      <input
                        {...register('category')}
                        placeholder="e.g., Electronics"
                        className={`form-input ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

                    <FormField
                      label="Sub Category"
                      error={errors.subCategory}
                      required
                    >
                      <input
                        {...register('subCategory')}
                        placeholder="e.g., Smartphones"
                        className={`form-input ${errors.subCategory ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      label="SKU"
                      error={errors.sku}
                      required
                      description="Stock Keeping Unit - unique identifier"
                    >
                      <input
                        {...register('sku')}
                        placeholder="e.g., PROD-001"
                        className={`form-input ${errors.sku ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

                    <FormField
                      label="Quantity in Stock"
                      error={errors.quantity}
                      required
                    >
                      <input
                        type="number"
                        {...register('quantity', { valueAsNumber: true })}
                        placeholder="0"
                        className={`form-input ${errors.quantity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>
                  </div>

                  <div className="flex items-center space-x-3 p-3 md:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <Controller
                      name="featured"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id="featured"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 bg-white border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2"
                        />
                      )}
                    />
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                      <label htmlFor="featured" className="text-sm font-medium text-yellow-800">
                        Mark as Featured Product
                      </label>
                    </div>
                  </div>
                </div>
              </FormSection>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <FormSection 
                title="Product Details" 
                description="Provide detailed information about your product"
                icon={<FileText className="w-5 h-5" />}
              >
                <div className="space-y-4 md:space-y-6">
                  <FormField
                    label="Description"
                    error={errors.description}
                    required
                    description="Detailed description of your product"
                  >
                    <textarea
                      {...register('description')}
                      rows={4}
                      placeholder="Enter a detailed description of your product..."
                      className={`form-textarea ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <FormField
                    label="Delivery Information"
                    error={errors.deliveryInfo}
                    required
                    description="Shipping and delivery details"
                  >
                    <textarea
                      {...register('deliveryInfo')}
                      rows={3}
                      placeholder="Enter delivery information, shipping times, etc..."
                      className={`form-textarea ${errors.deliveryInfo ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  {/* Variants Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="text-base md:text-lg font-semibold text-primary">Product Variants</h3>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="flex items-center space-x-1 text-primary hover:text-dark font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant</span>
                      </button>
                    </div>
                    
                    {variants.map((variant, index) => (
                      <div key={index} className="p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                          {variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <FormField label="Option Name">
                            <input
                              type="text"
                              value={variant.optionName}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].optionName = e.target.value;
                                setVariants(newVariants);
                              }}
                              placeholder="e.g., Color, Size"
                              className="form-input"
                            />
                          </FormField>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Option Values</label>
                            {variant.optionValues.map((value, valueIndex) => (
                              <div key={`${index}-${valueIndex}`} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={value}
                                  key={`input-${index}-${valueIndex}`}
                                  onChange={(e) => handleOptionValueChange(index, valueIndex, e.target.value)}
                                  placeholder={`Value ${valueIndex + 1}`}
                                  className="form-input flex-1"
                                />
                                {variant.optionValues.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOptionValue(index, valueIndex)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                                {valueIndex === variant.optionValues.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => addOptionValue(index)}
                                    className="p-1 text-green-500 hover:bg-green-50 rounded-lg"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FormSection>
            )}

            {/* Step 3: Media */}
            {currentStep === 3 && (
              <FormSection 
                title="Product Media" 
                description="Upload images to showcase your product"
                icon={<ImageIcon className="w-5 h-5" />}
              >
                <div className="space-y-4 md:space-y-6">
                  {/* Image Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
                      dragActive 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Upload Product Images</h3>
                      <p className="text-gray-500 mb-3 text-sm">
                        Drag and drop your images here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Max {MAX_IMAGES} images • Max {MAX_FILE_SIZE_MB}MB per image • JPG, PNG, GIF
                      </p>
                      <label className="inline-flex items-center space-x-1 px-4 py-2 bg-primary hover:bg-dark text-white rounded-lg cursor-pointer transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        <span>Choose Files</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-center space-x-2 text-red-600 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{uploadError}</span>
                    </div>
                  )}

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Uploaded Images ({images.length}/{MAX_IMAGES})
                        </h4>
                        <span className="text-xs text-gray-500">
                          First image will be used as primary
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Product preview ${index + 1}`}
                              className="w-full h-28 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <FormSection 
                title="Pricing Information" 
                description="Set your product pricing and calculate profit margins"
                icon={<DollarSign className="w-5 h-5" />}
              >
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      label="Selling Price"
                      error={errors.price}
                      required
                      description="The price customers will pay"
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <input
                          type="number"
                          step="0.01"
                          {...register('price', { valueAsNumber: true })}
                          placeholder="0.00"
                          className={`form-input pl-8 ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Discount Price"
                      error={errors.discountPrice}
                      description="Optional discounted price"
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <input
                          type="number"
                          step="0.01"
                          {...register('discountPrice', { valueAsNumber: true })}
                          placeholder="0.00"
                          className={`form-input pl-8 ${errors.discountPrice ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Cost Price"
                      error={errors.costPrice}
                      required
                      description="Your cost to acquire/produce this item"
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <input
                          type="number"
                          step="0.01"
                          {...register('costPrice', { valueAsNumber: true })}
                          placeholder="0.00"
                          className={`form-input pl-8 ${errors.costPrice ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Calculated Profit"
                      description="Automatically calculated profit margin"
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                        <input
                          type="text"
                          value={profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          disabled
                          className="form-input pl-8 bg-gray-50 text-gray-700"
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Profit Analysis Card */}
                  {price && costPrice && (
                    <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base md:text-lg font-semibold text-green-900">Profit Analysis</h3>
                        <button
                          type="button"
                          onClick={() => setShowProfitCalculation(!showProfitCalculation)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          {showProfitCalculation ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                      </div>
                      
                      {showProfitCalculation && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-green-100 rounded-lg">
                            <p className="text-xs md:text-sm text-green-600 font-medium">Profit Amount</p>
                            <p className="text-base md:text-xl font-bold text-green-900">
                              ₦{profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-green-100 rounded-lg">
                            <p className="text-xs md:text-sm text-green-600 font-medium">Profit Margin</p>
                            <p className="text-base md:text-xl font-bold text-green-900">{margin}%</p>
                          </div>
                          <div className="text-center p-2 bg-green-100 rounded-lg">
                            <p className="text-xs md:text-sm text-green-600 font-medium">Markup</p>
                            <p className="text-base md:text-xl font-bold text-green-900">
                              {costPrice ? ((profit / costPrice) * 100).toFixed(1) : 0}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Discount Analysis */}
                  {discountPrice && price && discountPrice < price && (
                    <div className="p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        <h4 className="font-medium text-primary text-sm md:text-base">Discount Information</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                        <div className="flex justify-between p-2 bg-blue-100 rounded">
                          <span className="text-primary">Discount Amount:</span>
                          <span className="font-semibold text-primary">
                            ₦{(price - discountPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-blue-100 rounded">
                          <span className="text-primary">Discount Percentage:</span>
                          <span className="font-semibold text-primary">
                            {(((price - discountPrice) / price) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 md:pt-8 border-t border-gray-200 gap-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentStep >= step.id ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-1 px-4 py-2 bg-primary hover:bg-dark text-white rounded-lg font-medium transition-colors"
                >
                  <span>Next</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit(onSubmit)}
                  className="flex items-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Creating...' : 'Create Product'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Utility Components

function FormSection({ title, description, icon, children }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center space-x-3 pb-3 md:pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm md:text-base">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, children, error, required, description }) {
  return (
    <div className="space-y-1 md:space-y-2">
      <label className="block text-sm md:text-base font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-xs md:text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default AddProductForm;
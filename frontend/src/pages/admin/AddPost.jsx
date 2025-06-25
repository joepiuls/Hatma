import { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  Loader, 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Star,
  AlertCircle,
  ArrowLeft,
  Save,
  BookOpen,
  Check
} from 'lucide-react';
import { useAdminBlogStore } from '../../store/useAdminBlogStore';
import { toast } from 'sonner';

const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 5;

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  category: yup.string().required('Category is required'),
  duration: yup.string().required('Duration is required'),
  industry: yup.string().required('Industry is required'),
  body: yup.string().required('Body is required').min(100, 'Content must be at least 100 characters'),
  featured: yup.boolean(),
});

const AddPostForm = ({ setView }) => {
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, control, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { featured: false },
  });

  const { loading, createBlog } = useAdminBlogStore();

  const steps = [
    { id: 1, title: 'Post Details', icon: <FileText className="w-5 h-5" /> },
    { id: 2, title: 'Content', icon: <BookOpen className="w-5 h-5" /> },
    { id: 3, title: 'Media', icon: <ImageIcon className="w-5 h-5" /> },
  ];

  // Image handling with validation
  const handleImageUpload = useCallback((files) => {
    setUploadError('');
    
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return false;
      }
      
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
        return false;
      }
      
      return true;
    });
    
    if (images.length + validFiles.length > MAX_IMAGES) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    
    const newImages = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, [images, setUploadError]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files?.length > 0) {
      handleImageUpload(e.target.files);
    }
  }, [handleImageUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  const removeImage = useCallback((index) => {
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(index, 1);
      URL.revokeObjectURL(removed.url);
      return newImages;
    });
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.url));
    };
  }, [images]);

  const onSubmit = async (data) => {
    // Validate all steps before submitting
    const step1Valid = await trigger(['title', 'category', 'duration', 'industry']);
    const step2Valid = await trigger(['body']);
    
    if (!step1Valid) {
      setCurrentStep(1);
      return;
    }
    
    if (!step2Valid) {
      setCurrentStep(2);
      return;
    }
    
    // Validate images
    if (images.length === 0) {
      setCurrentStep(3);
      setUploadError('Please upload at least one image');
      return;
    }

    try {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append images
      images.forEach(img => {
        formData.append('images', img.file);
      });

      await createBlog(formData);
      
      toast.success('Post created successfully!', {
        description: `${data.title} has been published.`,
        action: {
          label: 'View Posts',
          onClick: () => setView('list'),
        },
      });
      
      // Reset form and navigate
      setImages([]);
      setView('list');
    } catch (error) {
      toast.error('Failed to create post', {
        description: error.message || 'Please try again later.',
      });
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['title', 'category', 'duration', 'industry'],
      2: ['body'],
    };

    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
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
                onClick={() => setView('list')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Create New Post
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Craft an engaging blog post for your audience</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className="flex items-center justify-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{loading ? 'Saving...' : 'Publish Post'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'border-blue-600 bg-blue-50' 
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
            {/* Step 1: Post Details */}
            {currentStep === 1 && (
              <FormSection 
                title="Post Details" 
                description="Set the basic information about your post"
                icon={<FileText className="w-5 h-5" />}
              >
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <FormField
                    label="Post Title"
                    error={errors.title}
                    required
                    description="Catchy title that grabs attention"
                  >
                    <input
                      {...register('title')}
                      placeholder="Enter a compelling title"
                      className={`form-input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      label="Category"
                      error={errors.category}
                      required
                      description="e.g., Technology, Business"
                    >
                      <input
                        {...register('category')}
                        placeholder="Enter category"
                        className={`form-input ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

                    <FormField
                      label="Industry"
                      error={errors.industry}
                      required
                      description="e.g., Healthcare, Finance"
                    >
                      <input
                        {...register('industry')}
                        placeholder="Enter industry"
                        className={`form-input ${errors.industry ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      label="Reading Duration"
                      error={errors.duration}
                      required
                      description="Estimated reading time"
                    >
                      <input
                        {...register('duration')}
                        placeholder="e.g., 5 min read"
                        className={`form-input ${errors.duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

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
                          Mark as Featured Post
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>
            )}

            {/* Step 2: Content */}
            {currentStep === 2 && (
              <FormSection 
                title="Post Content" 
                description="Write the body of your blog post"
                icon={<BookOpen className="w-5 h-5" />}
              >
                <div className="space-y-4 md:space-y-6">
                  <FormField
                    label="Post Content"
                    error={errors.body}
                    required
                    description="Engaging content for your readers"
                  >
                    <textarea
                      {...register('body')}
                      rows={12}
                      placeholder="Write your content here..."
                      className={`form-textarea min-h-[300px] ${errors.body ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>
                </div>
              </FormSection>
            )}

            {/* Step 3: Media */}
            {currentStep === 3 && (
              <FormSection 
                title="Post Media" 
                description="Add images to enhance your post"
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
                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Upload Post Images</h3>
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
                          Selected Images ({images.length}/{MAX_IMAGES})
                        </h4>
                        <span className="text-xs text-gray-500">
                          First image will be used as featured image
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Post preview ${index + 1}`}
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
                                Featured
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

              {currentStep < 3 ? (
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
                  <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
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
        <div className="p-2 bg-blue-50 rounded-lg text-primary">
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

export default AddPostForm;
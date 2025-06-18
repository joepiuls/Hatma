import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Package,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Check,
  AlertCircle,
  Star,
  Calendar,
  User,
  Target,
  Award,
  Users,
  TrendingUp,
  Zap,
  Loader
} from 'lucide-react';

const schema = yup.object().shape({
  title: yup.string().required('Project title is required'),
  client: yup.string().required('Client name is required'),
  category: yup.string().required('Category is required'),
  year: yup.string().required('Year is required'),
  duration: yup.string().required('Duration is required'),
  description: yup.string().required('Description is required'),
  challenge: yup.string().required('Challenge description is required'),
  solution: yup.string().required('Solution description is required'),
  testimonialText: yup.string().required('Testimonial text is required'),
  testimonialAuthor: yup.string().required('Testimonial author is required'),
  status: yup.string().required('Status is required'),
});

const EditPortfolioForm = ({ project, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [results, setResults] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, trigger, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'Draft',
      category: '',
      year: new Date().getFullYear().toString(),
    }
  });

  // Pre-populate form with project data
  useEffect(() => {
    if (project) {
      reset({
        title: project.title || '',
        client: project.client || '',
        category: project.category || '',
        year: project.year || new Date().getFullYear().toString(),
        duration: project.duration || '',
        description: project.description || '',
        challenge: project.challenge || '',
        solution: project.solution || '',
        testimonialText: project.testimonial?.text || '',
        testimonialAuthor: project.testimonial?.author || '',
        status: project.status || 'Draft',
      });

      // Set images
      if (project.image) {
        setImages([{ url: project.image, file: null }]);
      }

      // Set results
      if (project.results && project.results.length > 0) {
        setResults(project.results.map(result => ({
          metric: result.metric || '',
          value: result.value || '',
          icon: result.icon?.name || 'Award'
        })));
      } else {
        setResults([{ metric: '', value: '', icon: 'Award' }]);
      }

      // Set tags
      if (project.tags && project.tags.length > 0) {
        setTags(project.tags);
      } else {
        setTags(['']);
      }
    }
  }, [project, reset]);

  const steps = [
    { id: 1, title: 'Basic Info', icon: <Package className="w-5 h-5" /> },
    { id: 2, title: 'Details', icon: <FileText className="w-5 h-5" /> },
    { id: 3, title: 'Media & Results', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 4, title: 'Testimonial', icon: <Star className="w-5 h-5" /> },
  ];

  const categories = ['Branding', 'Digital Marketing', 'Web Development', 'Strategy', 'Design', 'Consulting'];
  const iconOptions = ['Award', 'TrendingUp', 'Target', 'Users', 'Zap', 'Star'];

  const getIconComponent = (iconName) => {
    const icons = {
      Award: Award,
      TrendingUp: TrendingUp,
      Target: Target,
      Users: Users,
      Zap: Zap,
      Star: Star
    };
    const IconComponent = icons[iconName] || Award;
    return <IconComponent size={16} />;
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setImages([...images, ...newImages]);
  };

  const handleFileChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addResult = () => {
    setResults([...results, { metric: '', value: '', icon: 'Award' }]);
  };

  const removeResult = (index) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const updateResult = (index, field, value) => {
    const newResults = [...results];
    newResults[index][field] = value;
    setResults(newResults);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const portfolioData = {
        ...project,
        ...data,
        images: images.map(img => img.file || img.url),
        results: results.filter(r => r.metric && r.value),
        tags: tags.filter(tag => tag.trim()),
        testimonial: {
          text: data.testimonialText,
          author: data.testimonialAuthor
        },
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updated Portfolio Data:', portfolioData);
      // Here you would typically send the data to your backend
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCancel(); // Return to list view
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['title', 'client', 'category', 'year', 'duration'],
      2: ['description', 'challenge', 'solution'],
      3: [],
      4: ['testimonialText', 'testimonialAuthor']
    };

    const isValid = await trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">The project you're trying to edit could not be found.</p>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Edit Portfolio Project
                </h1>
                <p className="text-gray-600 mt-1">Update your portfolio project details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 text-blue-600" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form className="p-8 space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <FormSection 
                title="Basic Information" 
                description="Update the essential details about your portfolio project"
                icon={<Package className="w-6 h-6" />}
              >
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    label="Project Title"
                    error={errors.title}
                    required
                  >
                    <input
                      {...register('title')}
                      placeholder="Enter project title"
                      className={`form-input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Client"
                      error={errors.client}
                      required
                    >
                      <input
                        {...register('client')}
                        placeholder="e.g., Tech Startup Inc."
                        className={`form-input ${errors.client ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

                    <FormField
                      label="Category"
                      error={errors.category}
                      required
                    >
                      <select
                        {...register('category')}
                        className={`form-input ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      label="Year"
                      error={errors.year}
                      required
                    >
                      <input
                        {...register('year')}
                        placeholder="2024"
                        className={`form-input ${errors.year ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

                    <FormField
                      label="Duration"
                      error={errors.duration}
                      required
                    >
                      <input
                        {...register('duration')}
                        placeholder="e.g., 3 months"
                        className={`form-input ${errors.duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </FormField>

                    <FormField
                      label="Status"
                      error={errors.status}
                      required
                    >
                      <select
                        {...register('status')}
                        className={`form-input ${errors.status ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              </FormSection>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <FormSection 
                title="Project Details" 
                description="Update detailed information about the project"
                icon={<FileText className="w-6 h-6" />}
              >
                <div className="space-y-6">
                  <FormField
                    label="Project Description"
                    error={errors.description}
                    required
                    description="Brief overview of the project"
                  >
                    <textarea
                      {...register('description')}
                      rows={4}
                      placeholder="Enter a brief description of your project..."
                      className={`form-textarea ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <FormField
                    label="Challenge"
                    error={errors.challenge}
                    required
                    description="What problem did this project solve?"
                  >
                    <textarea
                      {...register('challenge')}
                      rows={4}
                      placeholder="Describe the main challenge or problem this project addressed..."
                      className={`form-textarea ${errors.challenge ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <FormField
                    label="Solution"
                    error={errors.solution}
                    required
                    description="How did you solve the challenge?"
                  >
                    <textarea
                      {...register('solution')}
                      rows={4}
                      placeholder="Explain your approach and solution to the challenge..."
                      className={`form-textarea ${errors.solution ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  {/* Tags Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Project Tags</h3>
                      <button
                        type="button"
                        onClick={addTag}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Tag</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tags.map((tag, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => updateTag(index, e.target.value)}
                            placeholder="Enter tag"
                            className="form-input flex-1"
                          />
                          {tags.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>
            )}

            {/* Step 3: Media & Results */}
            {currentStep === 3 && (
              <FormSection 
                title="Media & Results" 
                description="Update project images and performance metrics"
                icon={<ImageIcon className="w-6 h-6" />}
              >
                <div className="space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Project Images</h3>
                    
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Project Images</h3>
                        <p className="text-gray-500 mb-4">Drag and drop your images here, or click to browse</p>
                        <label className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors">
                          <Upload className="w-5 h-5" />
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

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Project ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Project Results</h3>
                      <button
                        type="button"
                        onClick={addResult}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Result</span>
                      </button>
                    </div>
                    
                    {results.map((result, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Result {index + 1}</h4>
                          {results.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeResult(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField label="Metric Name">
                            <input
                              type="text"
                              value={result.metric}
                              onChange={(e) => updateResult(index, 'metric', e.target.value)}
                              placeholder="e.g., Conversion Rate"
                              className="form-input"
                            />
                          </FormField>
                          
                          <FormField label="Value">
                            <input
                              type="text"
                              value={result.value}
                              onChange={(e) => updateResult(index, 'value', e.target.value)}
                              placeholder="e.g., +150%"
                              className="form-input"
                            />
                          </FormField>
                          
                          <FormField label="Icon">
                            <select
                              value={result.icon}
                              onChange={(e) => updateResult(index, 'icon', e.target.value)}
                              className="form-input"
                            >
                              {iconOptions.map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                          </FormField>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FormSection>
            )}

            {/* Step 4: Testimonial */}
            {currentStep === 4 && (
              <FormSection 
                title="Client Testimonial" 
                description="Update the testimonial from your client"
                icon={<Star className="w-6 h-6" />}
              >
                <div className="space-y-6">
                  <FormField
                    label="Testimonial Text"
                    error={errors.testimonialText}
                    required
                    description="What did the client say about the project?"
                  >
                    <textarea
                      {...register('testimonialText')}
                      rows={4}
                      placeholder="Enter the client's testimonial..."
                      className={`form-textarea ${errors.testimonialText ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  <FormField
                    label="Testimonial Author"
                    error={errors.testimonialAuthor}
                    required
                    description="Who provided this testimonial?"
                  >
                    <input
                      {...register('testimonialAuthor')}
                      placeholder="e.g., John Smith, CEO"
                      className={`form-input ${errors.testimonialAuthor ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </FormField>

                  {/* Preview */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Testimonial Preview</h3>
                    <blockquote className="text-blue-800 italic mb-3">
                      "{watch('testimonialText') || 'Your testimonial will appear here...'}"
                    </blockquote>
                    <cite className="text-blue-700 font-medium">
                      — {watch('testimonialAuthor') || 'Author name'}
                    </cite>
                  </div>
                </div>
              </FormSection>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <span>Next</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Updating...' : 'Update Project'}</span>
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
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, children, error, required, description }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default EditPortfolioForm;
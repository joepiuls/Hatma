import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Bold, Italic, Underline, Link, List } from 'lucide-react';

const schema = yup.object().shape({
  title: yup.string().required(),
  projectType: yup.string().required(),
  duration: yup.string().required(),
  industry: yup.string().required(),
  section1: yup.string().required(),
  section2: yup.string().required(),
});

export default function AddInfo({onCancel}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      media1: null,
      media2: null,
    },
  });

  const onSubmit = (data) => {
    console.log('Form Submitted:', data);
  };

  const handleMediaUpload = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue(name, url);
    }
  };

  const media1 = watch('media1');
  const media2 = watch('media2');

  const TextEditor = ({ name }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 border-b pb-2">
            <button type="button" className="p-1 hover:bg-gray-100 rounded">
              <Italic size={18} />
            </button>
            <button type="button" className="p-1 hover:bg-gray-100 rounded">
              <Bold size={18} />
            </button>
            <button type="button" className="p-1 hover:bg-gray-100 rounded">
              <Underline size={18} />
            </button>
            <button type="button" className="p-1 hover:bg-gray-100 rounded">
              <Link size={18} />
            </button>
            <button type="button" className="p-1 hover:bg-gray-100 rounded">
              <List size={18} />
            </button>
          </div>
          <textarea
            {...field}
            placeholder="Placeholder"
            className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}
    />
  );

  const MediaUpload = ({ value, name }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-gray-50">
          {value ? (
            <img src={value} alt="Uploaded" className="max-w-full h-auto" />
          ) : (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMediaUpload(e, name)}
                className="hidden"
                id={name}
              />
              <label
                htmlFor={name}
                className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              >
                Upload Image
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Add Project</h1>
            <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project type</label>
                  <input
                    type="text"
                    {...register('projectType')}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.projectType && <p className="text-red-500 text-sm">{errors.projectType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    {...register('duration')}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  {...register('industry')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section 1</label>
                <TextEditor name="section1" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Media</label>
                <MediaUpload value={media1} name="media1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section 2</label>
                <TextEditor name="section2" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Media</label>
                <MediaUpload value={media2} name="media2" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

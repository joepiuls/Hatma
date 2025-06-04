import React from 'react'
import { useAdminBlogStore } from '../store/useAdminBlogStore'

const AddButton = () => {
  const {generateDummyBlogs} = useAdminBlogStore();
  return (
    <div className='z-10'>
        <button onClick={generateDummyBlogs} className='bg-green-500  text-white rounded-lg p-5'>
            Add Blogs
        </button>
    </div>
  )
}

export default AddButton
import React from 'react'

const RelatedBlogs = ({blogs}) => {
  return (
    <div className="space-y-2">
        <img
        src={blogs?.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}
        alt="Blog related image"
        className="rounded-lg w-full object-cover"
        />
        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
          {blogs?.category || "Uncategorized"}
        </span>
        <p className="text-sm text-gray-500">{blogs?.duration || "5 mins read"}</p>  
        <p className="text-md font-medium">{blogs?.title || "5 ways to know if your company needs rebranding"}</p>
    </div>
  )
}

export default RelatedBlogs
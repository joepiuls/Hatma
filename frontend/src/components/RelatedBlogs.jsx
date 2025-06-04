import React from 'react'

const RelatedBlogs = ({blogs}) => {
  return (
    <div className="space-y-2">
        <img
        src='/fjfj'
        alt="Rebrand"
        className="rounded-lg w-full object-cover"
        />
        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
        Business and Money
        </span>
        <p className="text-sm text-gray-500">5 mins read</p>
        <p className="text-md font-medium">5 ways to know if your company needs rebranding</p>
    </div>
  )
}

export default RelatedBlogs
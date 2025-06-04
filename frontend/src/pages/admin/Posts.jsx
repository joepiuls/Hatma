import { useState } from 'react';
import AddPostForm from './AddPost';
import EditPostForm from './EditPost';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const mockPosts = [
  {
    id: 1,
    name: 'Kate Morrison',
    author: 'SKU',
    category: '30',
    views: 30,
    status: 4,
    images: ['https://via.placeholder.com/150'],
  },
  {
    id: 2,
    name: 'Kate Morrison',
    author: 'SKU',
    category: '30',
    views: 30,
    status: 4,
    images: ['https://via.placeholder.com/150'],
  },
  {
    id: 3,
    name: 'Kate Morrison',
    author: 'SKU',
    category: '30',
    views: 30,
    status: 4,
    images: ['https://via.placeholder.com/150'],
  },
];

export default function PostDashboard() {
  const [view, setView] = useState('list');
  const [selectedPost, setSelectedPost] = useState(null);

  const handleDelete = (id) => {
    // Add delete logic here
    alert(`Delete post with ID ${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">Total Posts</p>
          <p className="text-2xl font-semibold">7,265</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">Total Views</p>
          <p className="text-2xl font-semibold">3,671</p>
          <p className="text-sm text-gray-400">-0.03%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">Most Viewed</p>
          <p className="text-2xl font-semibold">15</p>
        </div>
      </div>

      {view === 'list' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Posts</h2>
            <button
              onClick={() => {
                setSelectedPost(null);
                setView('add');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Add Post
            </button>
          </div>
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Author</th>
                <th className="p-3">Category</th>
                <th className="p-3">Views</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPosts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={post.images[0]}
                      alt="Thumbnail"
                      className="w-10 h-10 object-cover rounded"
                    />
                    {post.name}
                  </td>
                  <td className="p-3">{post.author}</td>
                  <td className="p-3">{post.category}</td>
                  <td className="p-3">{post.views}</td>
                  <td className="p-3 text-green-500 font-semibold">{post.status}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setView('edit');
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:underline"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-6 gap-2">
            <button className="px-3 py-1 rounded bg-gray-200">&lt;</button>
            <button className="px-3 py-1 rounded bg-gray-800 text-white">1</button>
            <button className="px-3 py-1 rounded bg-gray-200">2</button>
            <button className="px-3 py-1 rounded bg-gray-200">3</button>
            <button className="px-3 py-1 rounded bg-gray-200">&gt;</button>
          </div>
        </>
      )}

      {view === 'add' && <AddPostForm  setView={setView} />}

      {view === 'edit' && <EditPostForm post={selectedPost} setView={setView} />}
    </div>
  );
}

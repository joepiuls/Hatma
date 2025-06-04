import { useState } from 'react';
import AddProductForm from './AddProduct';
import EditProductForm from './EditPost';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const mockProducts = [
  {
    id: 1,
    name: 'Kate Morrison',
    author: 'SKU',
    category: '30',
    price: 30,
    stock: 30,
    views: 30,
    status: 'In stock',
    images: ['https://via.placeholder.com/150'],
  },
  {
    id: 2,
    name: 'Kate Morrison',
    author: 'SKU',
    category: '30',
    price: 30,
    stock: 30,
    views: 30,
    status: 'In stock',
    images: ['https://via.placeholder.com/150'],
  },
  {
    id: 3,
    name: 'Kate Morrison',
    author: 'SKU',
    category: '30',
    price: 30,
    stock: 30,
    views: 30,
    status: 'In stock',
    images: ['https://via.placeholder.com/150'],
  },
];

export default function ProductDashboard() {
  const [products, setProducts] = useState(mockProducts);
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);



  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-purple-50 p-4 text-center">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-3xl font-semibold tracking-wide">7,265</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-center">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-3xl font-semibold tracking-wide">{products.reduce((sum, p) => sum + p.views, 0)}</p>
          <p className="text-xs text-gray-400">-0.03%</p>
        </div>
        <div className="rounded-2xl bg-purple-50 p-4 text-center">
          <p className="text-sm text-gray-500">Most Viewed</p>
          <div className="flex justify-center items-center gap-2 mt-1">
            <img src={products[0].images[0]} className="w-8 h-8 rounded" />
            <span className="text-sm">Product</span>
          </div>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-center">
          <p className="text-sm text-gray-500">Least viewed</p>
          <div className="flex justify-center items-center gap-2 mt-1">
            <img src={products[0].images[0]} className="w-8 h-8 rounded" />
            <span className="text-sm">Product</span>
          </div>
        </div>
      </div>

      {view === 'list' && (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-md font-semibold text-gray-600">Portfolio</h2>
            <button onClick={() => setView('add')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">Add Product</button>
          </div>

          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Views</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="p-3 flex items-center gap-3 text-gray-700">
                    <img src={product.images[0]} alt="Thumb" className="w-10 h-10 object-cover rounded" />
                    {product.name}
                  </td>
                  <td className="p-3 text-gray-500">{product.category}</td>
                  <td className="p-3 text-gray-500">{product.price}</td>
                  <td className="p-3 text-gray-500">{product.stock}</td>
                  <td className="p-3 text-gray-500">{product.views}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setView('edit');
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6 gap-2 text-sm">
            <button className="w-8 h-8 rounded-full bg-gray-100">&lt;</button>
            <button className="w-8 h-8 rounded-full bg-gray-900 text-white">1</button>
            <button className="w-8 h-8 rounded-full bg-gray-200">2</button>
            <button className="w-8 h-8 rounded-full bg-gray-200">3</button>
            <button className="w-8 h-8 rounded-full bg-gray-100">&gt;</button>
          </div>
        </>
      )}

      {view === 'add' && <AddProductForm setView={setView} />}
      {view === 'edit' && <EditProductForm product={selectedProduct} setView={setView} />}
    </div>
  );
}
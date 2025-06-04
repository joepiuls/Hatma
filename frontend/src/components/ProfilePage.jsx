import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { EditModal } from "../components/Modal";
import { useProfileStore } from "../store/useProfileStore";
import useAuthStore from "../store/useAuthStore";
import LoadingSpinner from "./LoadingSpinner";

export default function ProfilePage() {
  const navigate = useNavigate();


  const {
    addresses,
    isModalOpen,
    deleteAddress,
    openModal,
    closeModal,
    editingAddress,
    setDefaultAddress,
    submitAddress, fetchProfile
  } = useProfileStore();


  const { user } = useAuthStore();


 useEffect(() => {
  const init = async () => {
    await fetchProfile();
    
    const authUser = useAuthStore.getState().user;
    if (!authUser || !authUser._id) {
      navigate("/login");
    }
  };
  init();
}, [navigate]);


  // Prevent rendering before user loads
  if (!user || !user._id) return null;

  return (
    <div className="px-6 md:px-20 py-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 ">My Profile</h2>
      <p className="text-sm text-gray-500 mb-8">Home / profile</p>
      {/* Profile Details */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <div className="w-full h-full rounded-full bg-primary flex items-center 
              justify-center text-white text-4xl font-semibold">
                {user?.name ? (
                  user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                ) : (
                  'U'
                )}
              </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                className="w-full border border-gray-300 rounded focus:outline-none p-2 mt-1"
                defaultValue={user.name}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                className="w-full border focus:outline-none border-gray-300 rounded p-2 mt-1"
                defaultValue={user.phoneNumber}
              />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input
                type="email"
                disabled
                className="w-full border bg-gray-100 focus:outline-none border-gray-300 rounded p-2 mt-1"
                defaultValue={user.email}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Addresses ({addresses.length})</h3>
          <button
            onClick={() => openModal()}
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            Add <span className="text-xl">+</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses?.map((addr) => (
            <div
              key={addr._id || addr.id}
              className="border rounded-lg p-4 shadow-sm relative"
            >
              {addr.isDefault ? (
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Default address
                </p>
              ) : (
                <button
                  onClick={() => setDefaultAddress(addr._id || addr.id)}
                  className="text-xs font-medium text-blue-600 mb-1 hover:underline"
                >
                  Set as default
                </button>
              )}
              <p className="font-semibold">{addr.street}, {addr.city}</p>
              <p className="text-sm text-gray-700 mt-1">{addr.state}, {addr.country}, {addr.postalCode}</p>
              <p className="text-sm text-gray-700 mt-1">{user.phoneNumber}</p>

              <div className="flex justify-between items-center mt-4">
                <button
                  className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
                  onClick={() => openModal(addr)}
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => deleteAddress(addr._id || addr.id)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitAddress}
        defaultValues={editingAddress}
      />
    </div>
  );
}

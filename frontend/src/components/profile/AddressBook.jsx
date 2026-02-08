import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { FaPlus, FaTrash, FaCheck, FaHome } from 'react-icons/fa';
import Loader from '../Loader';

const AddressBook = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const [updateProfile, { isLoading }] = useProfileMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        isDefault: false
    });

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const updatedAddresses = [...(userInfo.addresses || []), newAddress];
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                addresses: updatedAddresses
            }).unwrap();
            dispatch(setCredentials(res));
            toast.success('Address added successfully');
            setIsAdding(false);
            setNewAddress({ name: '', phoneNumber: '', address: '', city: '', postalCode: '', country: '', isDefault: false });
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = userInfo.addresses.filter(addr => addr._id !== addressId);
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    addresses: updatedAddresses
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Address deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display text-text-main">My Addresses</h2>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="btn-outline flex items-center space-x-2 text-sm py-2 px-4">
                        <FaPlus /> <span>Add New Address</span>
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="card p-6 bg-white border border-border-color shadow-md animate-fadeIn">
                    <h3 className="text-lg font-bold text-text-main mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className="input-field" required value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                            <input type="text" placeholder="Phone Number" className="input-field" required value={newAddress.phoneNumber} onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })} />
                        </div>
                        <input type="text" placeholder="Address (House No, Street, Area)" className="input-field" required value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="City" className="input-field" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                            <input type="text" placeholder="Postal Code" className="input-field" required value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                            <input type="text" placeholder="Country" className="input-field" required value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                        </div>
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" checked={newAddress.isDefault} onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="form-checkbox text-accent border-gray-300 rounded focus:ring-accent" />
                            <span className="text-text-muted text-sm">Make this my default address</span>
                        </label>
                        <div className="flex space-x-4 pt-4">
                            <button type="submit" className="btn-primary" disabled={isLoading}>Save Address</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 bg-gray-100 text-text-main rounded-lg hover:bg-gray-200 font-bold transition-all border border-border-color">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(userInfo.addresses && userInfo.addresses.length > 0) ? (
                    userInfo.addresses.map((addr, index) => (
                        <div key={index} className="card p-6 bg-white border border-border-color hover:border-accent transition-colors relative group shadow-sm">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 text-accent text-xl">
                                    <FaHome />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-bold text-text-main text-lg">{addr.name || userInfo.name}</h4>
                                        {addr.isDefault && <span className="bg-orange-100 text-accent text-xs px-2 py-0.5 rounded-full border border-orange-200 font-medium">Default</span>}
                                    </div>
                                    <div className="text-text-muted text-sm mt-2 space-y-1">
                                        <p>{addr.address}</p>
                                        <p>{addr.city}, {addr.postalCode}</p>
                                        <p>{addr.country}</p>
                                        <p className="pt-2 font-medium text-text-main">Phone: {addr.phoneNumber || userInfo.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !isAdding && (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-text-muted mb-4">No addresses saved yet.</p>
                            <button onClick={() => setIsAdding(true)} className="text-accent hover:underline font-bold">Add your first address</button>
                        </div>
                    )
                )}
            </div>
            {isLoading && <Loader />}
        </div>
    );
};

export default AddressBook;

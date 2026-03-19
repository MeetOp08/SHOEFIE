import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { FaPlus, FaTrash, FaCheck, FaHome } from 'react-icons/fa';
import Loader from '../Loader';
import '../../styles/AddressBook.css';

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
        <div className="address-container">
            <div className="address-header">
                <h2 className="address-title">My Addresses</h2>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="btn-outline address-add-btn">
                        <FaPlus /> <span>Add New Address</span>
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="address-form-card">
                    <h3 className="address-form-title">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="address-form">
                        <div className="address-form-grid-2">
                            <input type="text" placeholder="Full Name" className="input-field" required value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                            <input type="text" placeholder="Phone Number" className="input-field" required value={newAddress.phoneNumber} onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })} />
                        </div>
                        <input type="text" placeholder="Address (House No, Street, Area)" className="input-field" required value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                        <div className="address-form-grid-3">
                            <input type="text" placeholder="City" className="input-field" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                            <input type="text" placeholder="Postal Code" className="input-field" required value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                            <input type="text" placeholder="Country" className="input-field" required value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                        </div>
                        <label className="address-default-checkbox-label">
                            <input type="checkbox" checked={newAddress.isDefault} onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="form-checkbox address-default-checkbox" />
                            <span className="address-default-text">Make this my default address</span>
                        </label>
                        <div className="address-form-actions">
                            <button type="submit" className="btn-primary" disabled={isLoading}>Save Address</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="address-cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="address-grid">
                {(userInfo.addresses && userInfo.addresses.length > 0) ? (
                    userInfo.addresses.map((addr, index) => (
                        <div key={index} className="address-card text-left">
                            <div className="address-delete-wrapper">
                                <button onClick={() => handleDeleteAddress(addr._id)} className="address-delete-btn">
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="address-card-content">
                                <div className="address-icon">
                                    <FaHome />
                                </div>
                                <div className="address-details">
                                    <div className="address-name-row">
                                        <h4 className="address-name">{addr.name || userInfo.name}</h4>
                                        {addr.isDefault && <span className="address-badge-default">Default</span>}
                                    </div>
                                    <div className="address-text-block">
                                        <p className="address-text-line">{addr.address}</p>
                                        <p className="address-text-line">{addr.city}, {addr.postalCode}</p>
                                        <p className="address-text-line">{addr.country}</p>
                                        <p className="address-phone">Phone: {addr.phoneNumber || userInfo.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !isAdding && (
                        <div className="address-empty-state">
                            <p className="address-empty-text">No addresses saved yet.</p>
                            <button onClick={() => setIsAdding(true)} className="address-empty-btn">Add your first address</button>
                        </div>
                    )
                )}
            </div>
            {isLoading && <Loader />}
        </div>
    );
};

export default AddressBook;

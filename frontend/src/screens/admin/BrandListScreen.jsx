
import { useState } from 'react';
import { FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useGetBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import '../../styles/admin/BrandListScreen.css';

const BrandListScreen = () => {
    const { data: brands, isLoading, error, refetch } = useGetBrandsQuery();

    const [createBrand, { isLoading: loadingCreate }] = useCreateBrandMutation();
    const [deleteBrand, { isLoading: loadingDelete }] = useDeleteBrandMutation();

    const [name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createBrand({ name, logo, description }).unwrap();
            toast.success('Brand created successfully');
            setName('');
            setLogo('');
            setDescription('');
            setIsModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await deleteBrand(id).unwrap();
                toast.success('Brand deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container-custom admin-brand-container">
            <div className="admin-brand-header">
                <h1 className="admin-brand-title">Brands Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="admin-brand-create-btn"
                >
                    <FaPlus /> Add Brand
                </button>
            </div>

            {(loadingCreate || loadingDelete) && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <div className="admin-brand-grid">
                    {brands.map((brand) => (
                        <div key={brand._id} className="admin-brand-card">
                            <div className="admin-brand-card-inner">
                                <div className="admin-brand-logo-wrap">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} className="admin-brand-logo-img" />
                                    ) : (
                                        <span className="admin-brand-initial">{brand.name[0]}</span>
                                    )}
                                </div>
                                <div className="admin-brand-info">
                                    <h3 className="admin-brand-name">{brand.name}</h3>
                                    <p className="admin-brand-desc">{brand.description || 'No description'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteHandler(brand._id)}
                                className="admin-brand-delete-btn"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    {brands.length === 0 && (
                        <div className="admin-brand-empty">No brands found. Create one to get started.</div>
                    )}
                </div>
            )}

            {/* Create Brand Modal */}
            {isModalOpen && (
                <div className="admin-brand-modal-overlay">
                    <div className="admin-brand-modal">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="admin-brand-modal-close"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="admin-brand-modal-title">Add New Brand</h2>
                        <form onSubmit={submitHandler} className="admin-brand-form">
                            <div>
                                <label className="admin-brand-label">Brand Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="admin-brand-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-brand-label">Logo URL</label>
                                <input
                                    type="text"
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                    placeholder="/images/brands/brand.png"
                                    className="admin-brand-input"
                                />
                            </div>
                            <div>
                                <label className="admin-brand-label">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="admin-brand-input admin-brand-textarea"
                                    rows="3"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="admin-brand-submit"
                            >
                                Create Brand
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandListScreen;

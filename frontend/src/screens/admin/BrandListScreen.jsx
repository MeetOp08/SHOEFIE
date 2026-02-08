
import { useState } from 'react';
import { FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useGetBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-text-main">Brands Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map((brand) => (
                        <div key={brand._id} className="bg-white rounded-xl shadow-sm border border-border-color p-4 hover:shadow-md transition-shadow relative group">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-2xl font-bold text-text-muted">{brand.name[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">{brand.name}</h3>
                                    <p className="text-sm text-text-muted line-clamp-2">{brand.description || 'No description'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteHandler(brand._id)}
                                className="absolute top-4 right-4 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    {brands.length === 0 && (
                        <div className="col-span-full text-center text-text-muted py-12 bg-secondary/30 rounded-xl">No brands found. Create one to get started.</div>
                    )}
                </div>
            )}

            {/* Create Brand Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-text-muted hover:text-text-main"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-text-main mb-6">Add New Brand</h2>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-1">Logo URL</label>
                                <input
                                    type="text"
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                    placeholder="/images/brands/brand.png"
                                    className="w-full p-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                                    rows="3"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-accent text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
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

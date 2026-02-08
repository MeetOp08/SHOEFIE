import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaArrowLeft, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation
} from '../../slices/categoriesApiSlice';
import { toast } from 'react-toastify';

const CategoryListScreen = () => {
    const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();
    const [createCategory, { isLoading: loadingCreate }] = useCreateCategoryMutation();
    const [deleteCategory, { isLoading: loadingDelete }] = useDeleteCategoryMutation();
    const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();

    // Form Stats
    const [name, setName] = useState('');
    const [image, setImage] = useState(''); // Simple text input for now, could be file upload
    const [description, setDescription] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
                toast.success('Category deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const editHandler = (category) => {
        setEditMode(true);
        setEditId(category._id);
        setName(category.name);
        setImage(category.image);
        setDescription(category.description || '');
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditId(null);
        setName('');
        setImage('');
        setDescription('');
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateCategory({
                    id: editId,
                    name,
                    image,
                    description
                }).unwrap();
                toast.success('Category updated');
            } else {
                await createCategory({
                    name,
                    image,
                    description
                }).unwrap();
                toast.success('Category created');
            }
            refetch();
            cancelEdit();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link className='btn-outline px-4 py-2 inline-flex items-center text-sm mb-8' to='/'>
                <FaArrowLeft className="mr-2" /> Go Back
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-display font-bold text-text-main">Categories</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create/Edit Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-text-main">{editMode ? 'Edit Category' : 'Create Category'}</h2>
                            {editMode && <button onClick={cancelEdit} className="text-xs text-text-muted hover:text-accent">Cancel</button>}
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-bold text-text-main">Name</label>
                                <input
                                    type='text'
                                    placeholder='Category Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-bold text-text-main">Image URL</label>
                                <input
                                    type='text'
                                    placeholder='/images/sample.jpg'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-bold text-text-main">Description</label>
                                <textarea
                                    placeholder='Description (Optional)'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field"
                                    rows="3"
                                />
                            </div>
                            <button
                                type='submit'
                                className={`btn-primary w-full flex items-center justify-center ${editMode ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                                disabled={loadingCreate || loadingUpdate}
                            >
                                {editMode ? <><FaEdit className="mr-2" /> Update Category</> : <><FaPlus className="mr-2" /> Create Category</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-border-color text-text-muted uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.map((category) => (
                                        <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-text-main">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-text-muted max-w-xs truncate">{category.description}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => editHandler(category)}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteHandler(category._id)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                                                        disabled={loadingDelete}
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {categories.length === 0 && <div className="p-8 text-center text-text-muted">No categories found</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryListScreen;

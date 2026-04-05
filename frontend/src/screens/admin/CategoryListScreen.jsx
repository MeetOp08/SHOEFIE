import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaArrowLeft, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} from '../../slices/categoriesApiSlice';
import { toast } from 'react-toastify';
import '../../styles/admin/CategoryListScreen.css';

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
        <div className="container-custom admin-cat-container">
            <Link className="btn-outline admin-cat-back" to='/'>
                <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Go Back
            </Link>

            <div className="admin-cat-header">
                <h1 className="admin-cat-title">Categories</h1>
            </div>

            <div className="admin-cat-layout">
                {/* Create/Edit Form */}
                <div className="admin-cat-sidebar">
                    <div className="admin-cat-form-card">
                        <div className="admin-cat-form-header">
                            <h2 className="admin-cat-form-title">{editMode ? 'Edit Category' : 'Create Category'}</h2>
                            {editMode && <button onClick={cancelEdit} className="admin-cat-form-cancel">Cancel</button>}
                        </div>

                        <form onSubmit={submitHandler} className="admin-cat-form">
                            <div>
                                <label className="admin-cat-label">Name</label>
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
                                <label className="admin-cat-label">Image URL</label>
                                <input
                                    type='text'
                                    placeholder='/images/sample.jpg'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="admin-cat-label">Description</label>
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
                                className={`btn-primary admin-cat-submit ${editMode ? 'edit' : ''}`}
                                disabled={loadingCreate || loadingUpdate}
                            >
                                {editMode ? <><FaEdit style={{ marginRight: '0.5rem' }} /> Update Category</> : <><FaPlus style={{ marginRight: '0.5rem' }} /> Create Category</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="admin-cat-list-area">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <div className="admin-cat-table-card">
                            <div className="overflow-x-auto"> {/* Keep horizontal scroll */}
                                <table className="admin-cat-table">
                                    <thead className="admin-cat-thead">
                                        <tr>
                                            <th className="admin-cat-th">Image</th>
                                            <th className="admin-cat-th">Name</th>
                                            <th className="admin-cat-th">Description</th>
                                            <th className="admin-cat-th center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="admin-cat-tbody">
                                        {categories.map((category) => (
                                            <tr key={category._id} className="admin-cat-tr">
                                                <td className="admin-cat-td">
                                                    <div className="admin-cat-img-wrap">
                                                        <img src={category.image} alt={category.name} className="admin-cat-img" />
                                                    </div>
                                                </td>
                                                <td className="admin-cat-td admin-cat-td-name">{category.name}</td>
                                                <td className="admin-cat-td admin-cat-td-desc">{category.description}</td>
                                                <td className="admin-cat-td center">
                                                    <div className="admin-cat-actions">
                                                        <button
                                                            onClick={() => editHandler(category)}
                                                            className="admin-cat-btn edit"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteHandler(category._id)}
                                                            className="admin-cat-btn delete"
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
                                {categories.length === 0 && <div className="admin-cat-empty">No categories found</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryListScreen;

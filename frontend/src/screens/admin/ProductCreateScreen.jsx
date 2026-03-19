import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    useGetCategoriesQuery,
    useGetBrandsQuery,
    useCreateProductMutation
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/admin/ProductCreateScreen.css';

const ProductCreateScreen = () => {
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [gender, setGender] = useState('Unisex');
    const [material, setMaterial] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    // Arrays
    const [sizesAvailable, setSizesAvailable] = useState([]);
    const [colorsAvailable, setColorsAvailable] = useState([]);

    // Images
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Queries
    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
    const { data: brands, isLoading: loadingBrands } = useGetBrandsQuery();
    const [createProduct, { isLoading: uploading }] = useCreateProductMutation();

    // Standard Sizes/Colors Options
    const sizeOptions = [6, 7, 8, 9, 10, 11, 12];
    const colorOptions = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Grey', 'Brown', 'Navy'];

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        // Preview
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSizeChange = (size) => {
        if (sizesAvailable.includes(size)) {
            setSizesAvailable(sizesAvailable.filter(s => s !== size));
        } else {
            setSizesAvailable([...sizesAvailable, size]);
        }
    };

    const handleColorChange = (color) => {
        if (colorsAvailable.includes(color)) {
            setColorsAvailable(colorsAvailable.filter(c => c !== color));
        } else {
            setColorsAvailable([...colorsAvailable, color]);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }
        if (!category) {
            toast.error('Please select a category');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('discountPrice', discountPrice);
        formData.append('description', description);
        formData.append('brand', brand);
        formData.append('category', category); // ID
        formData.append('countInStock', countInStock);
        formData.append('gender', gender);
        formData.append('material', material);
        formData.append('isFeatured', isFeatured);

        formData.append('sizesAvailable', JSON.stringify(sizesAvailable));
        formData.append('colorsAvailable', JSON.stringify(colorsAvailable));

        // Images
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            await createProduct(formData).unwrap();
            toast.success('Product Created Successfully');
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="admin-pcreate-container">
            <Link to='/admin/productlist' className="admin-pcreate-back">
                <FaArrowLeft /> Back to Products
            </Link>

            <h1 className="admin-pcreate-title">Add New Product</h1>

            {uploading && <Loader />}

            <div className="admin-pcreate-card">
                <form onSubmit={submitHandler} className="admin-pcreate-form">

                    {/* Basic Info */}
                    <div className="admin-pcreate-grid-2">
                        <div>
                            <label className="admin-pcreate-label">Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter product name"
                                className="admin-pcreate-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="admin-pcreate-label">Brand</label>
                            {loadingBrands ? <Loader small /> : (
                                <select
                                    className="admin-pcreate-input"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    required
                                >
                                    <option value="">Select Brand</option>
                                    {brands?.map(b => (
                                        <option key={b._id} value={b.name}>{b.name}</option>
                                    ))}
                                    <option value="Other">Other (Type Manually if needed)</option>
                                </select>
                            )}
                            {/* Fallback for new brands could be added but let's stick to select */}
                        </div>
                    </div>

                    <div className="admin-pcreate-grid-2">
                        <div>
                            <label className="admin-pcreate-label">Category</label>
                            {loadingCategories ? <Loader small /> : (
                                <select
                                    className="admin-pcreate-input"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories?.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option> // Sending ID
                                    ))}
                                </select>
                            )}
                        </div>
                        <div>
                            <label className="admin-pcreate-label">Gender</label>
                            <select
                                className="admin-pcreate-input"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="Unisex">Unisex</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-pcreate-grid-3">
                        <div>
                            <label className="admin-pcreate-label">Price (₹)</label>
                            <input
                                type="number"
                                className="admin-pcreate-input"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="admin-pcreate-label">Discount Price (Overview)</label>
                            <input
                                type="number"
                                className="admin-pcreate-input"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="admin-pcreate-label">Count In Stock</label>
                            <input
                                type="number"
                                className="admin-pcreate-input"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="admin-pcreate-label">Description</label>
                        <textarea
                            rows="4"
                            className="admin-pcreate-input"
                            placeholder="Detailed product description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="admin-pcreate-grid-2">
                        <div>
                            <label className="admin-pcreate-label">Material</label>
                            <input
                                type="text"
                                className="admin-pcreate-input"
                                placeholder="e.g. Leather, Canvas, Mesh"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-pcreate-checkbox-wrap">
                            <label className="admin-pcreate-checkbox-wrap">
                                <input
                                    type="checkbox"
                                    className="admin-pcreate-checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                                <span className="admin-pcreate-checkbox-label">Mark as Featured Product</span>
                            </label>
                        </div>
                    </div>

                    {/* Sizes Multi-Select */}
                    <div>
                        <label className="admin-pcreate-label">Available Sizes</label>
                        <div className="admin-pcreate-badges-wrap">
                            {sizeOptions.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeChange(size)}
                                    className={`admin-pcreate-badge-btn ${sizesAvailable.includes(size) ? 'active' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors Multi-Select */}
                    <div>
                        <label className="admin-pcreate-label">Available Colors</label>
                        <div className="admin-pcreate-badges-wrap">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleColorChange(color)}
                                    className={`admin-pcreate-badge-btn ${colorsAvailable.includes(color) ? 'active-dark' : ''} flex items-center gap-2`}
                                >
                                    <span className="admin-pcreate-color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="admin-pcreate-label mb-4">Product Images (Upload Multiple)</label>
                        <div className="admin-pcreate-upload-area relative">
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                onChange={handleImageChange}
                                className="admin-pcreate-upload-input"
                                accept="image/*"
                            />
                            <div className="admin-pcreate-upload-content pointer-events-none">
                                <FaUpload className="admin-pcreate-upload-icon mb-3" />
                                <p className="admin-pcreate-upload-text">Drag & drop files or <span className="admin-pcreate-upload-highlight">Browse</span></p>
                                <p className="admin-pcreate-upload-hint">Supported formats: JPG, PNG, WEBP</p>
                            </div>
                        </div>

                        {/* Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="admin-pcreate-previews mt-6">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="admin-pcreate-preview-item">
                                        <img src={src} alt="Preview" className="admin-pcreate-preview-img" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="admin-pcreate-footer">
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`admin-pcreate-submit ${uploading ? 'disabled' : 'active'}`}
                        >
                            {uploading ? 'Creating Product...' : 'Create Product'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductCreateScreen;

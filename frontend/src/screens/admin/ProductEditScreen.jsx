import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    useUpdateProductMutation,
    useGetProductDetailsQuery,
    useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload, FaTrash, FaCheck } from 'react-icons/fa';
import '../../styles/admin/ProductEditScreen.css';

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [gender, setGender] = useState('Unisex'); // Added gender state
    const [discountPrice, setDiscountPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState('Published');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const availableSizes = [6, 7, 8, 9, 10, 11, 12];
    const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Grey'];

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] =
        useUploadProductImageMutation();

    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category?._id || product.category); // Handle populated or unpopulated
            setGender(product.gender || 'Unisex'); // Set gender
            setDiscountPrice(product.discountPrice || 0);
            setCountInStock(product.countInStock);
            setDescription(product.description);
            setSizes(product.sizes || []);
            setColors(product.colors || []);
            setIsFeatured(product.isFeatured);
            setIsActive(product.isActive);
            setStatus(product.status || 'Published');
            setImages(product.images || []);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                discountPrice,
                image,
                images,
                brand,
                category,
                gender,
                description,
                countInStock,
                sizes,
                colors,
                isFeatured,
                isActive,
                status
            }).unwrap();
            toast.success('Product updated');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const res = await uploadProductImage(formData).unwrap();
                uploadedUrls.push(res.image);
            }

            if (!image && uploadedUrls.length > 0) {
                setImage(uploadedUrls[0]);
            }

            setImages([...images, ...uploadedUrls]);
            toast.success('Images uploaded');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        } finally {
            setUploading(false);
        }
    };

    const handleCheckboxChange = (option, setState, state) => {
        if (state.includes(option)) {
            setState(state.filter(item => item !== option));
        } else {
            setState([...state, option]);
        }
    };

    return (
        <>
            <div className="admin-pedit-container">
                <Link to='/admin/productlist' className="admin-pedit-back">
                    <FaArrowLeft className="mr-2" /> Go Back
                </Link>

                <div className="admin-pedit-card">
                    <h1 className="admin-pedit-title">Edit Product</h1>
                    {loadingUpdate && <Loader />}
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <form onSubmit={submitHandler} className="admin-pedit-form">
                            {/* Basic Info */}
                            <div className="admin-pedit-grid-2">
                                <div className="admin-pedit-col-span-2">
                                    <label className="admin-pedit-label">Product Name</label>
                                    <input
                                        type='text'
                                        placeholder='Enter product name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="admin-pedit-label">Brand</label>
                                    <input
                                        type='text'
                                        placeholder='Enter brand'
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="admin-pedit-label">Category</label>
                                    {loadingCategories ? <Loader /> : (
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select Category</option>
                                            {categories?.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="admin-pedit-label">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="Unisex">Unisex</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>

                            {/* Pricing & Stock */}
                            <div className="admin-pedit-subcard">
                                <h3 className="admin-pedit-subtitle">Pricing & Inventory</h3>
                                <div className="admin-pedit-grid-3">
                                    <div>
                                        <label className="admin-pedit-label-muted">Price</label>
                                        <div className="admin-pedit-input-wrapper">
                                            <span className="admin-pedit-input-icon">$</span>
                                            <input
                                                type='number'
                                                placeholder='0.00'
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="input-field admin-pedit-input-pl"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="admin-pedit-label-muted">Discount Price</label>
                                        <div className="admin-pedit-input-wrapper">
                                            <span className="admin-pedit-input-icon">$</span>
                                            <input
                                                type='number'
                                                placeholder='0.00'
                                                value={discountPrice}
                                                onChange={(e) => setDiscountPrice(e.target.value)}
                                                className="input-field admin-pedit-input-pl"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="admin-pedit-label-muted">Count In Stock</label>
                                        <input
                                            type='number'
                                            placeholder='0'
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="admin-pedit-label">Images</label>
                                <div className="admin-pedit-image-area">
                                    <div className="admin-pedit-image-list">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="admin-pedit-image-item">
                                                <img
                                                    src={img}
                                                    alt="Product"
                                                    className={`admin-pedit-image-item-img ${image === img ? 'main' : ''}`}
                                                    onClick={() => setImage(img)}
                                                    title="Set as main image"
                                                />
                                                {image === img && <div className="admin-pedit-image-badge">Main</div>}
                                                <button
                                                    type="button"
                                                    className="admin-pedit-image-delete"
                                                    onClick={() => setImages(images.filter(i => i !== img))}
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="admin-pedit-upload-btn">
                                            <FaUpload className="mb-1 text-xl" />
                                            <span className="text-xs">Upload</span>
                                            <input
                                                type='file'
                                                onChange={uploadFileHandler}
                                                className="admin-pedit-upload-hidden"
                                                multiple
                                            />
                                        </label>
                                    </div>

                                    {/* Fallback text input */}
                                    {images.length === 0 && (
                                        <div className="admin-pedit-fallback-input">
                                            <input
                                                type='text'
                                                placeholder='Or enter image URL here'
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                                className="input-field text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                                {loadingUpload && <Loader />}
                            </div>

                            {/* Options */}
                            <div className="admin-pedit-grid-2">
                                <div>
                                    <label className="admin-pedit-label">Available Sizes</label>
                                    <div className="admin-pedit-badges-container">
                                        {availableSizes.map((s) => (
                                            <button
                                                type="button"
                                                key={s}
                                                className={`admin-pedit-badge-size ${sizes.includes(s) ? 'active' : ''}`}
                                                onClick={() => handleCheckboxChange(s, setSizes, sizes)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="admin-pedit-label">Available Colors</label>
                                    <div className="admin-pedit-badges-container">
                                        {availableColors.map((c) => (
                                            <button
                                                type="button"
                                                key={c}
                                                className={`admin-pedit-badge-color ${colors.includes(c) ? 'active' : ''}`}
                                                onClick={() => handleCheckboxChange(c, setColors, colors)}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="admin-pedit-label">Description</label>
                                <textarea
                                    placeholder='Enter detailed product description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field admin-pedit-textarea"
                                />
                            </div>

                            {/* Status & Visibility */}
                            <div className="admin-pedit-status-card">
                                <div className="admin-pedit-toggle-group">
                                    <label className="admin-pedit-toggle-label">
                                        <div className={`admin-pedit-toggle-track ${isFeatured ? 'active-accent' : ''}`}>
                                            <div className={`admin-pedit-toggle-thumb ${isFeatured ? 'active' : ''}`}></div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="admin-pedit-toggle-text">Featured Product</span>
                                    </label>

                                    <label className="admin-pedit-toggle-label">
                                        <div className={`admin-pedit-toggle-track ${isActive ? 'active-green' : ''}`}>
                                            <div className={`admin-pedit-toggle-thumb ${isActive ? 'active' : ''}`}></div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="admin-pedit-toggle-text">Active</span>
                                    </label>
                                </div>

                                <div className="admin-pedit-status-select-wrap">
                                    <label className="admin-pedit-status-label">Status:</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="input-field admin-pedit-status-select"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-pedit-footer">
                                <button
                                    type='submit'
                                    className="btn-primary admin-pedit-submit"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductEditScreen;

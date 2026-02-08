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

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
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
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link to='/admin/productlist' className='flex items-center text-text-muted hover:text-accent mb-6 transition-colors'>
                    <FaArrowLeft className="mr-2" /> Go Back
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-border-color p-8">
                    <h1 className="text-3xl font-display font-bold text-text-main mb-6 border-b border-border-color pb-4">Edit Product</h1>
                    {loadingUpdate && <Loader />}
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <form onSubmit={submitHandler} className="space-y-8">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-bold text-text-main">Product Name</label>
                                    <input
                                        type='text'
                                        placeholder='Enter product name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-bold text-text-main">Brand</label>
                                    <input
                                        type='text'
                                        placeholder='Enter brand'
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-bold text-text-main">Category</label>
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
                            </div>

                            {/* Pricing & Stock */}
                            <div className="card p-6 bg-gray-50 border border-border-color">
                                <h3 className="text-lg font-bold text-text-main mb-4">Pricing & Inventory</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block mb-2 font-medium text-text-muted">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-400">$</span>
                                            <input
                                                type='number'
                                                placeholder='0.00'
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="input-field pl-8"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-text-muted">Discount Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-400">$</span>
                                            <input
                                                type='number'
                                                placeholder='0.00'
                                                value={discountPrice}
                                                onChange={(e) => setDiscountPrice(e.target.value)}
                                                className="input-field pl-8"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-text-muted">Count In Stock</label>
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
                                <label className="block mb-2 font-bold text-text-main">Images</label>
                                <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group w-24 h-24">
                                                <img
                                                    src={img}
                                                    alt="Product"
                                                    className={`w-full h-full object-cover rounded-lg border-2 cursor-pointer transition-all ${image === img ? 'border-accent shadow-md' : 'border-gray-200'}`}
                                                    onClick={() => setImage(img)}
                                                    title="Set as main image"
                                                />
                                                {image === img && <div className="absolute top-1 left-1 bg-accent text-white text-[10px] px-1 rounded">Main</div>}
                                                <button
                                                    type="button"
                                                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                    onClick={() => setImages(images.filter(i => i !== img))}
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent hover:bg-white transition-all text-gray-400 hover:text-accent">
                                            <FaUpload className="mb-1 text-xl" />
                                            <span className="text-xs">Upload</span>
                                            <input
                                                type='file'
                                                onChange={uploadFileHandler}
                                                className="hidden"
                                                multiple
                                            />
                                        </label>
                                    </div>

                                    {/* Fallback text input */}
                                    {images.length === 0 && (
                                        <div className="mt-2">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block mb-3 font-bold text-text-main">Available Sizes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((s) => (
                                            <button
                                                type="button"
                                                key={s}
                                                className={`w-10 h-10 rounded-full border transition-all font-medium ${sizes.includes(s)
                                                    ? 'bg-text-main text-white border-text-main'
                                                    : 'bg-white border-gray-200 text-text-muted hover:border-text-main'}`}
                                                onClick={() => handleCheckboxChange(s, setSizes, sizes)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-3 font-bold text-text-main">Available Colors</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map((c) => (
                                            <button
                                                type="button"
                                                key={c}
                                                className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${colors.includes(c)
                                                    ? 'bg-accent/10 border-accent text-accent'
                                                    : 'bg-white border-gray-200 text-text-muted hover:border-gray-400'}`}
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
                                <label className="block mb-2 font-bold text-text-main">Description</label>
                                <textarea
                                    placeholder='Enter detailed product description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field min-h-[150px]"
                                />
                            </div>

                            {/* Status & Visibility */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isFeatured ? 'bg-accent' : 'bg-gray-300'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="font-medium text-text-main">Featured Product</span>
                                    </label>

                                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="font-medium text-text-main">Active</span>
                                    </label>
                                </div>

                                <div className="flex items-center space-x-3 w-full md:w-auto">
                                    <label className="text-text-muted font-medium">Status:</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="input-field py-1"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border-color flex justify-end">
                                <button
                                    type='submit'
                                    className="btn-primary px-8 py-3 text-lg"
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

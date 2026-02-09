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
        <div className="container mx-auto px-4 py-8">
            <Link to='/admin/productlist' className='flex items-center gap-2 text-gray-600 hover:text-accent mb-6'>
                <FaArrowLeft /> Back to Products
            </Link>

            <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

            {uploading && <Loader />}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={submitHandler} className="space-y-6">

                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter product name"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                            {loadingBrands ? <Loader small /> : (
                                <select
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
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

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            {loadingCategories ? <Loader small /> : (
                                <select
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
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

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                            <input
                                type="number"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (Overview)</label>
                            <input
                                type="number"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Count In Stock</label>
                            <input
                                type="number"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            rows="4"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            placeholder="Detailed product description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg outline-none"
                                placeholder="e.g. Leather, Canvas, Mesh"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-4 mt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-accent rounded focus:ring-accent border-gray-300"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                                <span className="font-medium text-gray-700">Mark as Featured Product</span>
                            </label>
                        </div>
                    </div>

                    {/* Sizes Multi-Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {sizeOptions.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${sizesAvailable.includes(size)
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-accent'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors Multi-Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleColorChange(color)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${colorsAvailable.includes(color)
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-800'
                                        }`}
                                >
                                    <span className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: color.toLowerCase() }}></span>
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Product Images (Upload Multiple)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-accent transition-colors relative bg-gray-50">
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                            <div className="flex flex-col items-center justify-center pointer-events-none">
                                <FaUpload className="text-3xl text-gray-400 mb-3" />
                                <p className="text-sm text-gray-500 font-medium">Drag & drop files or <span className="text-accent">Browse</span></p>
                                <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, WEBP</p>
                            </div>
                        </div>

                        {/* Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-6">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:opacity-90'
                                }`}
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

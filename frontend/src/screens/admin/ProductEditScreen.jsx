import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    useUpdateProductMutation,
    useGetProductDetailsQuery,
    useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

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

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success('Product updated');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Link to='/admin/productlist' className='flex items-center text-gray-400 hover:text-white mb-6'>
                    <FaArrowLeft className="mr-2" /> Go Back
                </Link>

                <div className="card p-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-6">Edit Product</h1>
                    {loadingUpdate && <Loader />}
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div>
                                <label className="block mb-2 font-semibold text-gray-300">Name</label>
                                <input
                                    type='text'
                                    placeholder='Enter product name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-300">Price</label>
                                    <input
                                        type='number'
                                        placeholder='Enter price'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-300">Count In Stock</label>
                                    <input
                                        type='number'
                                        placeholder='Enter stock'
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-300">Image</label>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type='text'
                                        placeholder='Enter image url'
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="input-field mb-2"
                                    />
                                    <label className="btn-outline cursor-pointer flex items-center justify-center py-2 text-sm">
                                        <FaUpload className="mr-2" /> Upload File
                                        <input
                                            type='file'
                                            onChange={uploadFileHandler}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {loadingUpload && <Loader />}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-300">Brand</label>
                                    <input
                                        type='text'
                                        placeholder='Enter brand'
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-300">Category</label>
                                    <input
                                        type='text'
                                        placeholder='Enter category'
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-300">Description</label>
                                <textarea
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field min-h-[120px]"
                                />
                            </div>

                            <button
                                type='submit'
                                className="btn-primary w-full"
                            >
                                Update Product
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductEditScreen;

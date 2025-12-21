import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
    const { pageNumber } = useParams();
    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber,
    });

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product Deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
                toast.success('Product Created');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-display font-bold text-white'>Products</h1>
                <button className='btn-primary flex items-center px-4 py-2 text-sm' onClick={createProductHandler}>
                    <FaPlus className="mr-2" /> Create Product
                </button>
            </div>

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className='min-w-full bg-gray-800 text-gray-300'>
                            <thead>
                                <tr className="bg-primary text-left text-accent uppercase text-sm tracking-wider">
                                    <th className="py-3 px-6">ID</th>
                                    <th className="py-3 px-6">NAME</th>
                                    <th className="py-3 px-6">PRICE</th>
                                    <th className="py-3 px-6">CATEGORY</th>
                                    <th className="py-3 px-6">BRAND</th>
                                    <th className="py-3 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {data.products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-700 transition-colors">
                                        <td className="py-4 px-6">{product._id}</td>
                                        <td className="py-4 px-6 font-semibold text-white">{product.name}</td>
                                        <td className="py-4 px-6">${product.price}</td>
                                        <td className="py-4 px-6">{product.category}</td>
                                        <td className="py-4 px-6">{product.brand}</td>
                                        <td className="py-4 px-6 flex space-x-4">
                                            <Link to={`/admin/product/${product._id}/edit`}>
                                                <button className='text-blue-400 hover:text-blue-300'>
                                                    <FaEdit />
                                                </button>
                                            </Link>
                                            <button
                                                className='text-red-400 hover:text-red-300'
                                                onClick={() => deleteHandler(product._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                </>
            )}
        </div>
    );
};

export default ProductListScreen;

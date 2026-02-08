import { Link, useParams, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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

    const createProductHandler = () => {
        navigate('/admin/product/create');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-display font-bold text-text-main'>Products</h1>
                <button className='btn-primary flex items-center px-5 py-2.5 text-sm shadow-lg' onClick={createProductHandler}>
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
                    <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className='min-w-full'>
                                <thead>
                                    <tr className="bg-gray-50 border-b border-border-color text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        <th className="py-4 px-6">ID</th>
                                        <th className="py-4 px-6">NAME</th>
                                        <th className="py-4 px-6">PRICE</th>
                                        <th className="py-4 px-6">CATEGORY</th>
                                        <th className="py-4 px-6">BRAND</th>
                                        <th className="py-4 px-6">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color">
                                    {data.products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-text-muted font-mono">{product._id}</td>
                                            <td className="py-4 px-6 font-medium text-text-main">{product.name}</td>
                                            <td className="py-4 px-6 text-text-main font-bold">${product.price}</td>
                                            <td className="py-4 px-6 text-text-muted">{product.category?.name}</td>
                                            <td className="py-4 px-6 text-text-muted">{product.brand}</td>
                                            <td className="py-4 px-6 flex items-center space-x-4">
                                                <Link to={`/admin/product/${product._id}/edit`}>
                                                    <button className='p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors' title="Edit">
                                                        <FaEdit />
                                                    </button>
                                                </Link>
                                                <button
                                                    className='p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors'
                                                    onClick={() => deleteHandler(product._id)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                </>
            )}
        </div>
    );
};

export default ProductListScreen;

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
        <>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold'>Products</h1>
                <button className='bg-black text-white py-2 px-4 rounded flex items-center hover:bg-gray-800' onClick={createProductHandler}>
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
                    <div className="overflow-x-auto">
                        <table className='min-w-full bg-white border border-gray-200'>
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">NAME</th>
                                    <th className="py-2 px-4 border">PRICE</th>
                                    <th className="py-2 px-4 border">CATEGORY</th>
                                    <th className="py-2 px-4 border">BRAND</th>
                                    <th className="py-2 px-4 border"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.products.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4">{product._id}</td>
                                        <td className="py-2 px-4">{product.name}</td>
                                        <td className="py-2 px-4">${product.price}</td>
                                        <td className="py-2 px-4">{product.category}</td>
                                        <td className="py-2 px-4">{product.brand}</td>
                                        <td className="py-2 px-4 flex space-x-2">
                                            <Link to={`/admin/product/${product._id}/edit`}>
                                                <button className='text-gray-600 hover:text-black'>
                                                    <FaEdit />
                                                </button>
                                            </Link>
                                            <button
                                                className='text-red-500 hover:text-red-700'
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
        </>
    );
};

export default ProductListScreen;

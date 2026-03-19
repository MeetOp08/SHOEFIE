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
import '../../styles/admin/ProductListScreen.css';

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
        <div className="container-custom admin-list-container">
            <div className="admin-list-header">
                <h1 className="admin-list-title">Products</h1>
                <button className="btn-primary admin-list-create-btn" onClick={createProductHandler}>
                    <FaPlus className="admin-list-create-icon" /> Create Product
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
                    <div className="admin-table-card">
                        <div className="admin-table-responsive">
                            <table className="admin-table">
                                <thead className="admin-table-head">
                                    <tr>
                                        <th className="admin-table-th">ID</th>
                                        <th className="admin-table-th">NAME</th>
                                        <th className="admin-table-th">PRICE</th>
                                        <th className="admin-table-th">CATEGORY</th>
                                        <th className="admin-table-th">BRAND</th>
                                        <th className="admin-table-th">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {data.products.map((product) => (
                                        <tr key={product._id} className="admin-table-tr">
                                            <td className="admin-table-td admin-table-td-id">{product._id}</td>
                                            <td className="admin-table-td admin-table-td-name">{product.name}</td>
                                            <td className="admin-table-td admin-table-td-price">${product.price}</td>
                                            <td className="admin-table-td admin-table-td-muted">{product.category?.name}</td>
                                            <td className="admin-table-td admin-table-td-muted">{product.brand}</td>
                                            <td className="admin-table-td">
                                                <div className="admin-table-actions">
                                                    <Link to={`/admin/product/${product._id}/edit`}>
                                                        <button className="admin-action-btn admin-action-btn-edit" title="Edit">
                                                            <FaEdit />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        className="admin-action-btn admin-action-btn-delete"
                                                        onClick={() => deleteHandler(product._id)}
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
                        </div>
                    </div>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                </>
            )}
        </div>
    );
};

export default ProductListScreen;

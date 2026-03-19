import { Link } from 'react-router-dom';
import { FaTrash, FaTimes, FaCheck, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import '../../styles/admin/UserListScreen.css';

const UserListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteUser(id);
                refetch();
                toast.success('User deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container-custom admin-user-container">
            <h1 className="admin-user-title">Users</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="admin-user-card">
                    <div className="admin-user-table-wrapper">
                        <table className="admin-user-table">
                            <thead className="admin-user-thead">
                                <tr>
                                    <th className="admin-user-th">ID</th>
                                    <th className="admin-user-th">NAME</th>
                                    <th className="admin-user-th">EMAIL</th>
                                    <th className="admin-user-th">ADMIN</th>
                                    <th className="admin-user-th">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="admin-user-tr">
                                        <td className="admin-user-td admin-user-td-id">{user._id}</td>
                                        <td className="admin-user-td admin-user-td-name">{user.name}</td>
                                        <td className="admin-user-td">
                                            <a href={`mailto:${user.email}`} className="admin-user-link">
                                                {user.email}
                                            </a>
                                        </td>
                                        <td className="admin-user-td">
                                            {user.isAdmin ? (
                                                <span className="admin-user-badge admin">
                                                    <FaCheck className="admin-user-badge-icon" /> Yes
                                                </span>
                                            ) : (
                                                <span className="admin-user-badge customer">
                                                    <FaTimes className="admin-user-badge-icon" /> No
                                                </span>
                                            )}
                                        </td>
                                        <td className="admin-user-td">
                                            <div className="admin-user-actions">
                                                <Link to={`/admin/user/${user._id}/edit`}>
                                                    <button className="admin-user-btn edit" title="Edit">
                                                        <FaEdit />
                                                    </button>
                                                </Link>
                                                <button
                                                    className="admin-user-btn delete"
                                                    onClick={() => deleteHandler(user._id)}
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
            )}
        </div>
    );
};

export default UserListScreen;

import { Link } from 'react-router-dom';
import { FaTrash, FaTimes, FaCheck, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-text-main mb-8">Users</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-border-color text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    <th className="py-4 px-6">ID</th>
                                    <th className="py-4 px-6">NAME</th>
                                    <th className="py-4 px-6">EMAIL</th>
                                    <th className="py-4 px-6">ADMIN</th>
                                    <th className="py-4 px-6">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-text-muted font-mono">{user._id}</td>
                                        <td className="py-4 px-6 font-medium text-text-main">{user.name}</td>
                                        <td className="py-4 px-6">
                                            <a href={`mailto:${user.email}`} className="text-text-muted hover:text-accent hover:underline transition-colors">
                                                {user.email}
                                            </a>
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.isAdmin ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheck className="mr-1" /> Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    <FaTimes className="mr-1" /> No
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 flex items-center space-x-4">
                                            <Link to={`/admin/user/${user._id}/edit`}>
                                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                                                    <FaEdit />
                                                </button>
                                            </Link>
                                            <button
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                onClick={() => deleteHandler(user._id)}
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
            )}
        </div>
    );
};

export default UserListScreen;

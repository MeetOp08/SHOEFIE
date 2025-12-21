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
            <h1 className="text-3xl font-display font-bold text-white mb-8">Users</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full bg-gray-800 text-gray-300">
                        <thead>
                            <tr className="bg-primary text-left text-accent uppercase text-sm tracking-wider">
                                <th className="py-3 px-6">ID</th>
                                <th className="py-3 px-6">NAME</th>
                                <th className="py-3 px-6">EMAIL</th>
                                <th className="py-3 px-6">ADMIN</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700 transition-colors">
                                    <td className="py-4 px-6">{user._id}</td>
                                    <td className="py-4 px-6 font-semibold text-white">{user.name}</td>
                                    <td className="py-4 px-6"><a href={`mailto:${user.email}`} className="text-blue-400 hover:underline">{user.email}</a></td>
                                    <td className="py-4 px-6">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-4 px-6 flex space-x-4">
                                        <Link to={`/admin/user/${user._id}/edit`}>
                                            <button className="text-blue-400 hover:text-blue-300">
                                                <FaEdit />
                                            </button>
                                        </Link>
                                        <button
                                            className="text-red-500 hover:text-red-400"
                                            onClick={() => deleteHandler(user._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserListScreen;

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
        <>
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">NAME</th>
                                <th className="py-2 px-4 border">EMAIL</th>
                                <th className="py-2 px-4 border">ADMIN</th>
                                <th className="py-2 px-4 border"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{user._id}</td>
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4"><a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">{user.email}</a></td>
                                    <td className="py-2 px-4">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <Link to={`/admin/user/${user._id}/edit`}>
                                            <button className="text-gray-600 hover:text-black">
                                                <FaEdit />
                                            </button>
                                        </Link>
                                        <button
                                            className="text-red-500 hover:text-red-700"
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
        </>
    );
};

export default UserListScreen;

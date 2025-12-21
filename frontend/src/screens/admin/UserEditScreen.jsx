import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const UserEditScreen = () => {
    const { id: userId } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ userId, name, email, isAdmin }).unwrap();
            toast.success('User updated');
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Link to='/admin/userlist' className='flex items-center text-gray-400 hover:text-white mb-6'>
                <FaArrowLeft className="mr-2" /> Go Back
            </Link>

            <div className="card p-8">
                <h1 className="text-3xl font-display font-bold text-white mb-6">Edit User</h1>
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
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-gray-300">Email</label>
                            <input
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="flex items-center p-4 border border-gray-700 rounded bg-gray-800/50">
                            <input
                                type='checkbox'
                                id='isAdmin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="mr-3 h-5 w-5 text-accent focus:ring-accent bg-gray-700 border-gray-600 rounded"
                            />
                            <label htmlFor='isAdmin' className="block font-semibold text-white cursor-pointer select-none">
                                Administrator Access
                            </label>
                        </div>

                        <button
                            type='submit'
                            className="btn-primary w-full"
                        >
                            Update User
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserEditScreen;

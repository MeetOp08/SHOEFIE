import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
        <div className="container mx-auto px-4 py-8 max-w-xl">
            <Link to='/admin/userlist' className='flex items-center text-text-muted hover:text-accent mb-6 transition-colors'>
                <FaArrowLeft className="mr-2" /> Go Back
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-border-color p-8">
                <h1 className="text-3xl font-display font-bold text-text-main mb-6 border-b border-border-color pb-4">Edit User</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error}</Message>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block mb-2 font-bold text-text-main">Name</label>
                            <input
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold text-text-main">Email</label>
                            <input
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:border-accent transition-colors">
                            <input
                                type='checkbox'
                                id='isAdmin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="mr-4 h-5 w-5 text-accent focus:ring-accent border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor='isAdmin' className="block font-semibold text-text-main cursor-pointer select-none">
                                Administrator Access
                                <p className="text-xs text-text-muted font-normal mt-0.5">Grants full control over products, orders, and users.</p>
                            </label>
                        </div>

                        <button
                            type='submit'
                            className="btn-primary w-full py-3"
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

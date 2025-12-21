import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

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
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3 text-blue-500 hover:underline'>
                Go Back
            </Link>
            <FormContainer>
                <h1 className="text-3xl font-bold mb-6">Edit User</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error}</Message>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-semibold">Name</label>
                            <input
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Email</label>
                            <input
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type='checkbox'
                                id='isAdmin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="mr-2 h-4 w-4"
                            />
                            <label htmlFor='isAdmin' className="block font-semibold">Is Admin</label>
                        </div>

                        <button
                            type='submit'
                            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                        >
                            Update
                        </button>
                    </form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;

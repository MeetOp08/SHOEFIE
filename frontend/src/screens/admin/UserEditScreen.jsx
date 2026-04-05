import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import '../../styles/admin/UserEditScreen.css';

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
        <div className="admin-uedit-container">
            <Link to='/admin/userlist' className="admin-uedit-back">
                <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Go Back
            </Link>

            <div className="admin-uedit-card">
                <h1 className="admin-uedit-title">Edit User</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error}</Message>
                ) : (
                    <form onSubmit={submitHandler} className="admin-uedit-form">
                        <div>
                            <label className="admin-uedit-label">Name</label>
                            <input
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="admin-uedit-label">Email</label>
                            <input
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="admin-uedit-checkbox-wrap">
                            <input
                                type='checkbox'
                                id='isAdmin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="admin-uedit-checkbox"
                            />
                            <label htmlFor='isAdmin' className="admin-uedit-checkbox-label">
                                Administrator Access
                                <p className="admin-uedit-checkbox-desc">Grants full control over products, orders, and users.</p>
                            </label>
                        </div>

                        <button
                            type='submit'
                            className="btn-primary admin-uedit-submit"
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

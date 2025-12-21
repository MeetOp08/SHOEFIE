import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <FormContainer>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-display font-bold text-white mb-2">Join SHOEFIE</h1>
                <p className="text-gray-400">Create an account to start shopping</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Name</label>
                    <input
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Email Address</label>
                    <input
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Password</label>
                    <input
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Confirm Password</label>
                    <input
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className="btn-primary w-full mt-4"
                >
                    {isLoading ? 'Creating Account...' : 'Register'}
                </button>

                {isLoading && <Loader />}
            </form>

            <div className='py-4 text-center text-sm text-gray-400'>
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-accent hover:underline font-semibold">
                    Login
                </Link>
            </div>
        </FormContainer>
    );
};

export default RegisterScreen;

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

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
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400">Sign in to access your premium account</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Email Address</label>
                    <input
                        type='email'
                        placeholder='Enter your email'
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
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className="btn-primary w-full mt-4"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {isLoading && <Loader />}
            </form>

            <div className='py-4 text-center text-sm text-gray-400'>
                New Customer?{' '}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-accent hover:underline font-semibold">
                    Register
                </Link>
            </div>
        </FormContainer>
    );
};

export default LoginScreen;

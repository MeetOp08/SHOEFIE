import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
        <div className="flex items-center justify-center min-h-[80vh] bg-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="card w-full max-w-md p-10 bg-white shadow-xl rounded-2xl border border-border-color">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-text-main mb-2">Welcome Back</h1>
                    <p className="text-text-muted text-sm">Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">Email Address</label>
                        <input
                            type='email'
                            placeholder='name@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-text-main">Password</label>
                            <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                        </div>
                        <input
                            type='password'
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className="btn-primary w-full py-3 text-base"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {isLoading && <div className="flex justify-center mt-4"><Loader /></div>}
                </form>

                <div className='mt-8 pt-6 border-t border-border-color text-center text-sm text-text-muted'>
                    <span>Not a member? </span>
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-accent font-bold hover:underline ml-1">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

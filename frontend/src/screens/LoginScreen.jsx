import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/AuthScreen.css';
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
        <div className="auth-container">
            <div className="card auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={submitHandler} className="auth-form">
                    <div>
                        <label className="auth-label">Email Address</label>
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
                        <div className="auth-label-group">
                            <label className="auth-label">Password</label>
                            <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
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
                        className="btn-primary auth-btn"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {isLoading && <div className="auth-loader-container"><Loader /></div>}
                </form>

                <div className='auth-footer'>
                    <span>Not a member? </span>
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="auth-link">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

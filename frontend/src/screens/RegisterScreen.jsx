import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
        <div className="flex items-center justify-center min-h-[80vh] bg-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="card w-full max-w-md p-10 bg-white shadow-xl rounded-2xl border border-border-color">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-text-main mb-2">Create Account</h1>
                    <p className="text-text-muted text-sm">Join Shoefie for a premium experience.</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">Full Name</label>
                        <input
                            type='text'
                            placeholder='Enter your full name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

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
                        <label className="block mb-2 text-sm font-semibold text-text-main">Password</label>
                        <input
                            type='password'
                            placeholder='Create a password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">Confirm Password</label>
                        <input
                            type='password'
                            placeholder='Confirm your password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className="btn-primary w-full py-3 text-base"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    {isLoading && <div className="flex justify-center mt-4"><Loader /></div>}
                </form>

                <div className='mt-8 pt-6 border-t border-border-color text-center text-sm text-text-muted'>
                    <span>Already have an account? </span>
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-accent font-bold hover:underline ml-1">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;

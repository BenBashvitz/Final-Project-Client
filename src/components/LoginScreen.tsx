import {useState} from 'react';
import type {UserSignInPayload, UserSignUpPayload} from '../types';
import './LoginScreen.css';
import type {LoginResponseType} from "../types/auth.ts";

interface LoginScreenProps {
    onSignIn: (user: UserSignInPayload) => Promise<LoginResponseType>;
    onSignUp: (user: UserSignUpPayload) => Promise<LoginResponseType>;
}

export function LoginScreen({onSignIn, onSignUp}: LoginScreenProps) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || (isRegister && !username)) {
            setError('Please fill in all fields');
            return;
        }

        let response: LoginResponseType;

        if (isRegister) {
            response = await onSignUp({username, email, password});
        } else {
            response = await onSignIn({email, password});
        }

        switch (response) {
            case "USERNAME_OR_PASSWORD_INCORRECT":
                setError('Email or password are incorrect');
                break;
            case "EMAIL_TAKEN":
                setError('Email is already taken');
                break;
            case "SERVER_ERROR":
                setError('An error occurred, please try again later');
                break;
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <header className="card-header">
                    <div className="logo-circle">IG</div>
                    <h1 className="card-title">
                        {isRegister ? 'Join Insta-Clone' : 'Welcome Back'}
                    </h1>
                    <p className="card-description">
                        {isRegister ? 'Create your account to start sharing' : 'Sign in to continue'}
                    </p>
                </header>

                <main className="card-content">
                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    className="form-input"
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                className="form-input"
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                className="form-input"
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-primary">
                            {isRegister ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    <div className="divider">
                        <span className="divider-text">Or continue with</span>
                    </div>

                    <button
                        type="button"
                        className="btn-outline"
                        onClick={() => {/* handle OAuth */
                        }}
                    >
                        <svg style={{width: '20px', height: '20px', marginRight: '8px'}} viewBox="0 0 24 24">
                            <path fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>

                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </main>
            </div>
        </div>
    );
}
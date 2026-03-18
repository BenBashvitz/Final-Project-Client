import styles from './Login.module.css';
import {AxiosError} from "axios";
import {useNavigate} from "react-router";
import {type FieldErrors, useForm} from 'react-hook-form';
import type {UserSignUpPayload} from "../types";
import {useState} from "react";
import {signUp} from "../services/auth-api.ts";

export function SignUp() {
    const {handleSubmit, register} = useForm<UserSignUpPayload>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null)

    const handleClick = async () => {
        navigate("/login");
    }

    const onError = (errors: FieldErrors<UserSignUpPayload>) => {
        if (errors.username) {
            setError('username is required');
        } else if (errors.password) {
            setError('password is required');
        } else if (errors.email) {
            setError('email is required');
        }
    }

    const onSubmit = async (payload: UserSignUpPayload) => {
        setError(null);

        try {
            await signUp(payload);

            navigate('/');
        } catch (error) {
            if(error instanceof AxiosError && typeof error.response?.data === 'string') {
                setError(error.response?.data);
            } else {
                setError('there was a problem trying to register. please try again.');
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <header className={styles.cardHeader}>
                    <div className={styles.logoCircle}>IG</div>
                    <h1 className={styles.cardTitle}>
                        Welcome Back
                    </h1>
                    <p className={styles.cardDescription}>
                        Sign in to continue
                    </p>
                </header>

                <main className={styles.cardContent}>
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                className={styles.formInput}
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                {...register('username', {required: true})}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                className={styles.formInput}
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                {...register('email', {required: true})}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                className={styles.formInput}
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                {...register('password', {required: true})}
                            />
                        </div>

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <button type="submit" className={styles.btnPrimary}>
                            Sign Up
                        </button>
                    </form>

                    <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={handleClick}
                    >
                        Already have an account? Sign in
                    </button>
                </main>
            </div>
        </div>
    );
}
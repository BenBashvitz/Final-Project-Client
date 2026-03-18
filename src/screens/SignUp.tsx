import styles from './Login.module.css';
import {AxiosError} from "axios";
import {useNavigate} from "react-router";
import {type FieldErrors, useForm} from 'react-hook-form';
import type {UserSignUpPayload} from "../types";
import {useState} from "react";
import {signUp} from "../services/auth-api.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignUpFormSchema} from "../schemas/signUpFormSchema.ts";
import {LoginHeader} from "../components/LoginHeader.tsx";

export function SignUp() {
    const {handleSubmit, register, formState: {errors}} = useForm<UserSignUpPayload>({
        resolver: zodResolver(SignUpFormSchema)
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null)

    const handleNavigateToSignIn = async () => {
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
                <LoginHeader description="Welcome" title="Sign Up"/>
                <main className={styles.cardContent}>
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                className={styles.formInput}
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                {...register('username')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                className={styles.formInput}
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                {...register('email')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                className={styles.formInput}
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                {...register('password')}
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
                        onClick={handleNavigateToSignIn}
                    >
                        Already have an account? Sign in
                    </button>
                </main>
            </div>
        </div>
    );
}
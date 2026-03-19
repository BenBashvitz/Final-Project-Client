import {useState} from "react";
import styles from './Login.module.css';
import {AxiosError} from "axios";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import type {UserSignInPayload} from "../types";
import {signIn} from "../services/auth-api.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignInFormSchema} from "../schemas/signInFormSchema.ts";
import {LoginHeader} from "../components/LoginHeader.tsx";
import {Button} from "../components/button/Button.tsx";
import FormFieldErrorWrapper from "../components/formFieldErrorWrapper/FormFieldErrorWrapper.tsx";

const SignIn = () => {
    const {handleSubmit, register, formState: {errors}} = useForm<UserSignInPayload>({
        resolver: zodResolver(SignInFormSchema)
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null)

    const handleNavigateToSignUp = async () => {
        navigate("/sign-up");
    }

    const onSubmit = async (payload: UserSignInPayload) => {
        setError(null);

        try {
            await signIn(payload);

            navigate('/');
        } catch (error) {
            if (error instanceof AxiosError && typeof error.response?.data === 'string') {
                setError(error.response?.data);
            } else {
                setError('there was a problem trying to register. please try again.');
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <LoginHeader description="Welcome Back" title="Sign In"/>
                <main className={styles.cardContent}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <FormFieldErrorWrapper error={errors.username?.message}>
                            <div className="formGroup">
                                <label htmlFor="username">Username</label>
                                <input
                                    className={styles.formInput}
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    {...register('username')}
                                />
                            </div>
                        </FormFieldErrorWrapper>

                        <FormFieldErrorWrapper error={errors.password?.message}>
                            <div className="formGroup">
                                <label htmlFor="password">Password</label>
                                <input
                                    className={styles.formInput}
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    {...register('password')}
                                />
                            </div>
                        </FormFieldErrorWrapper>

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <Button type="submit" className={styles.btnPrimary}>
                            Sign In
                        </Button>
                    </form>

                    <Button
                        type="button"
                        variant="outline"
                        className={styles.toggleBtn}
                        onClick={handleNavigateToSignUp}
                    >
                        Don't have an account? Sign up
                    </Button>
                </main>
            </div>
        </div>
    );
}

export default SignIn;
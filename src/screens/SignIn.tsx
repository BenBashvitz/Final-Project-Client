import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { LoginHeader } from "../components/LoginHeader/LoginHeader";
import { Button } from "../components/button/Button.tsx";
import FormFieldErrorWrapper from "../components/formFieldErrorWrapper/FormFieldErrorWrapper.tsx";
import { CurrentUserContext } from "../contexts/contexts.ts";
import useGetContext from "../hooks/useGetContext.ts";
import { SignInFormSchema } from "../schemas/signInFormSchema.ts";
import {googleSignIn, signIn} from "../services/auth-api.ts";
import type { UserSignInPayload } from "../types";
import styles from "./Login.module.css";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSignInPayload>({
    resolver: zodResolver(SignInFormSchema),
  });
  const navigate = useNavigate();
  const { setCurrentUser } = useGetContext(CurrentUserContext);
  const [error, setError] = useState<string | null>(null);

  const handleNavigateToSignUp = async () => {
    navigate("/sign-up");
  };

  const onSubmit = async (payload: UserSignInPayload) => {
    setError(null);

    try {
      const user = await signIn(payload);

      setCurrentUser(user);
      navigate("/");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        typeof error.response?.data === "string"
      ) {
        setError(error.response?.data);
      } else {
        setError("there was a problem trying to sign in. please try again.");
      }
    }
  };

  const handleGoogleLoginSuccess = async (
      credentialResponse: CredentialResponse,
  ) => {
    try {
      const user = await googleSignIn(credentialResponse);

      setCurrentUser(user);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <LoginHeader description="Welcome Back" title="Sign In" />
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
                  {...register("username")}
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
                  {...register("password")}
                />
              </div>
            </FormFieldErrorWrapper>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <Button type="submit">Sign In</Button>

            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
            />
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
};

export default SignIn;

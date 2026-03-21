import styles from "./Login.module.css";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { UserSignUpPayload } from "../types";
import { useState } from "react";
import { signUp } from "../services/auth-api.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "../schemas/signUpFormSchema.ts";
import { LoginHeader } from "../components/LoginHeader.tsx";
import { Button } from "../components/button/Button.tsx";
import FormFieldErrorWrapper from "../components/formFieldErrorWrapper/FormFieldErrorWrapper.tsx";

const SignUp = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSignUpPayload>({
    resolver: zodResolver(SignUpFormSchema),
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleNavigateToSignIn = async () => {
    navigate("/sign-in");
  };

  const onSubmit = async (payload: UserSignUpPayload) => {
    setError(null);

    try {
      await signUp(payload);

      navigate("/");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        typeof error.response?.data === "string"
      ) {
        setError(error.response?.data);
      } else {
        setError("there was a problem trying to register. please try again.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <LoginHeader description="Welcome" title="Sign Up" />
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

            <FormFieldErrorWrapper error={errors.email?.message}>
              <div className="formGroup">
                <label htmlFor="email">Email</label>
                <input
                  className={styles.formInput}
                  id="email"
                  type="text"
                  placeholder="Enter email"
                  {...register("email")}
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

            <Button type="submit">Sign Up</Button>
          </form>

          <Button
            type="button"
            className={styles.toggleBtn}
            variant="outline"
            onClick={handleNavigateToSignIn}
          >
            Already have an account? Sign in
          </Button>
        </main>
      </div>
    </div>
  );
};

export default SignUp;

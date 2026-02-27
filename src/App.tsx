import './App.css'
import {LoginScreen} from "./components/LoginScreen.tsx";
import type {UserSignInPayload, UserSignUpPayload} from "./types";
import axios from "axios";
import type {LoginSuccessResponse, LoginResponseType} from "./types/auth.ts";
import {useEffect, useRef} from "react";
import {Route, Routes, useNavigate} from 'react-router';

function App() {
    const navigate = useNavigate();
    const isRefreshing = useRef(false);

    useEffect(() => {
        //prevent accidentally refreshing twice with the same token and logging out
        if (!isRefreshing.current) {
            isRefreshing.current = true;
            axios.post<LoginSuccessResponse>(`/api/auth/refresh-token`, {}, {withCredentials: true})
                .catch(() => {
                    navigate('/login');
                })
                .finally(() => isRefreshing.current = false);
        }
    }, [])

    const onSignIn = async (payload: UserSignInPayload): Promise<LoginResponseType> => {
        try {
            await axios.post<LoginSuccessResponse>(`/api/auth/login`, payload, {withCredentials: true});

            navigate('/');
            return "SUCCESS";
        } catch {
            return "USERNAME_OR_PASSWORD_INCORRECT";
        }
    }

    const onSignUp = async (payload: UserSignUpPayload): Promise<LoginResponseType> => {
        try {
            await axios.post<LoginSuccessResponse>(`/api/auth/register`, payload, {withCredentials: true});

            navigate('/');
            return "SUCCESS";
        } catch {
            return "EMAIL_TAKEN";
        }
    }

    const onLogout = async (): Promise<void> => {
        try {
            await axios.post('/api/auth/logout', {}, {withCredentials: true});
        } finally {
            navigate('/login');
        }
    }

    return (
        <>
            <Routes>
                <Route path="/" element={
                    <>
                        <h1>
                            Home Screen Placeholder
                        </h1>
                        <button onClick={onLogout}>Logout</button>
                    </>
                }/>
                <Route path="/login"
                       element={<LoginScreen onSignIn={onSignIn} onSignUp={onSignUp}></LoginScreen>}/>
            </Routes>
        </>
    )
}

export default App

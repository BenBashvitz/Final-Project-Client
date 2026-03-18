import './App.css'
import {SignIn} from "./screens/SignIn.tsx";
import axios, {CanceledError} from "axios";
import {useEffect} from "react";
import {Route, Routes, useNavigate} from 'react-router';
import {SignUp} from "./screens/SignUp.tsx";
import {refreshToken} from "./services/auth-api.ts";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const {response, abort} = refreshToken();

        response.then(() => {
            console.log('success')
        }).catch((error) => {
            if (error instanceof CanceledError) {
                console.log('Refresh token request was cancelled.');
                return;
            }

            navigate('/login');
        });

        return abort
    }, [])

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
                       element={<SignIn/>}/>
                <Route path="/sign-up"
                       element={<SignUp/>}/>
            </Routes>
        </>
    )
}

export default App

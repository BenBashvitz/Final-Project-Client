import './App.css'
import {SignIn} from "./screens/SignIn.tsx";
import {useEffect, useRef} from "react";
import {Route, Routes, useNavigate} from 'react-router';
import {SignUp} from "./screens/SignUp.tsx";
import {logout, refreshToken} from "./services/auth-api.ts";

function App() {
    const navigate = useNavigate();
    const isRefreshing = useRef(false);

    useEffect(() => {
        if (!isRefreshing.current) {
            isRefreshing.current = true;

            const {response} = refreshToken();

            response.catch(() => {
                navigate('/login');
            }).finally(() => {
                isRefreshing.current = false;
            });
        }
    }, [])

    const onLogout = async (): Promise<void> => {
        try {
            await logout();
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

import './App.css'
import {lazy, useEffect, useRef} from "react";
import {Route, Routes, useNavigate} from 'react-router';
import {logout, refreshToken, refreshTokenOnUnauthorized} from "./services/auth-api.ts";
import {useLocation} from "react-router-dom";

const SignUp = lazy(() => import("./screens/SignUp"));
const SignIn = lazy(() => import("./screens/SignIn"));

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isRefreshing = useRef(false);

    useEffect(() => {
        refreshTokenOnUnauthorized(() => navigate('/login'));

        if (!isRefreshing.current) {
            isRefreshing.current = true;

            refreshToken().then(() => {
                if(location.pathname !== '/') navigate('/');
            }).catch(() => {
                navigate('/login');
            }).finally(() => {
                isRefreshing.current = false;
            });
        }
    }, [])

    const onLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out ', error);
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

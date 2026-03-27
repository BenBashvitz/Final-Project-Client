import {lazy} from "react";
import {Route, Routes} from "react-router";
import "./App.css";
import {UserProvider} from "./contexts/UserContext.tsx";
import {PostsProvider} from "./contexts/PostsContext.tsx";
import {Header} from "./components/header/Header.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {clientId} from "./firebase/firebase.ts";

const FeedScreen = lazy(() => import("./screens/feed/FeedScreen.tsx"));
const SignUp = lazy(() => import("./screens/SignUp"));
const SignIn = lazy(() => import("./screens/SignIn"));
const CommentsScreen = lazy(
    () => import("./screens/comments/CommentsScreen.tsx"),
);

const App = () => {
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <UserProvider>
                    <PostsProvider>
                        <Header/>
                        <Routes>
                            <Route index element={<FeedScreen/>}/>
                            <Route path="/sign-in" element={<SignIn/>}/>
                            <Route path="/sign-up" element={<SignUp/>}/>
                            <Route path="/posts/:postId/comments" element={<CommentsScreen/>}/>
                        </Routes>
                    </PostsProvider>
                </UserProvider>
            </GoogleOAuthProvider>
        </>
    );
};

export default App;

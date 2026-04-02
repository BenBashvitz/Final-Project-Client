import { lazy } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import { UserProvider } from "./contexts/UserContext.tsx";
import { PostsProvider } from "./contexts/PostsContext.tsx";
import { Header } from "./components/header/Header.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId } from "./consts.ts";

const FeedScreen = lazy(() => import("./screens/feed/FeedScreen.tsx"));
const SignUp = lazy(() => import("./screens/login/SignUp.tsx"));
const SignIn = lazy(() => import("./screens/login/SignIn.tsx"));
const CommentsScreen = lazy(
    () => import("./screens/comments/CommentsScreen.tsx"),
);
const ProfileScreen = lazy(() => import("./screens/profile/ProfileScreen"))
const SearchScreen = lazy(() => import("./screens/search/SearchScreen"));

const App = () => {
    return (
        <>
            <GoogleOAuthProvider clientId={googleClientId}>
                <UserProvider>
                    <PostsProvider>
                        <Header />
                        <Routes>
                            <Route index element={<FeedScreen />} />
                            <Route path="/sign-in" element={<SignIn />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/profile" element={<ProfileScreen />} />
                            <Route path="/search" element={<SearchScreen />} />
                            <Route path="/posts/:postId/comments" element={<CommentsScreen />} />
                        </Routes>
                    </PostsProvider>
                </UserProvider>
            </GoogleOAuthProvider>
        </>
    );
};

export default App;

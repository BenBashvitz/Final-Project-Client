import { lazy } from "react";
import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import { logout } from "./services/auth-api.ts";
import { UserProvider } from "./contexts/UserContext.tsx";

const FeedScreen = lazy(() => import("./screens/feed/FeedScreen.tsx"));
const SignUp = lazy(() => import("./screens/SignUp"));
const SignIn = lazy(() => import("./screens/SignIn"));
const CommentsScreen = lazy(
  () => import("./screens/comments/CommentsScreen.tsx"),
);

const App = () => {
  const navigate = useNavigate();

  const onLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out ", error);
    } finally {
      navigate("/sign-in");
    }
  };

  return (
    <>
      <UserProvider>
        <Routes>
          <Route index element={<FeedScreen />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/comments/:postId" element={<CommentsScreen />} />
        </Routes>
      </UserProvider>
    </>
  );
};

export default App;

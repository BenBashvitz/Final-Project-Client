import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import FeedScreen from "./screens/feed/FeedScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<FeedScreen currentUserId={1} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

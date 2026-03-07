import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import FeedScreen from "./screens/feed/FeedScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={<div>Loading ListGroup page!...</div>}>
              <FeedScreen currentUserId={1} />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

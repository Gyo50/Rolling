import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import ListPage from "./ListPage/ListPage";
import CreatePostPage from "./CreatePostPage/CreatePostPage";
import OwnerPage from "./RollingPage/OwnerPage";
import RecipientPage from "./RollingPage/RecipientPage";
import MessagePage from "./MessagePage/MessagePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/post" element={<CreatePostPage />} />
      <Route path="/post/:id" element={<RecipientPage />} />
      <Route path="/post/:id/owner" element={<OwnerPage />} />
      <Route path="/post/:id/message" element={<MessagePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

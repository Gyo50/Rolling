import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainPage from './MainPage/MainPage'
import ListPage from './ListPage/ListPage'
import CreatePostPage from './CreatePostPage/CreatePostPage'
import OwnerPage from './RollingPage/OwnerPage'
import RecentPage from './ListPage/RecentPage'
import Messagepage from './MessagePage/MessagePage'
import RecipientPage from './RollingPage/RecipientPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      <Route path="/list" element={<ListPage />} />
      <Route path="/recent" element={<RecentPage />} />
      <Route path="/post" element={<CreatePostPage />} />
      <Route path="/post/:id/owner" element={<OwnerPage />} />
      <Route path="/post/:id/message" element={<Messagepage />} />
      <Route path="/post/:id" element={<RecipientPage />} /> 
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

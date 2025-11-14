import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainPage from './MainPage/MainPage'
import ListPage from './ListPage/ListPage'
import RecentPage from './ListPage/RecentPage'
import CreatePostPage from './CreatePostPage/CreatePostPage'
import OwnerPage from './RollingPage/OwnerPage'
import Messagepage from './MessagePage/MessagePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/recent" element={<RecentPage />} />
      <Route path="/post" element={<CreatePostPage />} />
      <Route path="/post/:id" element={<Messagepage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
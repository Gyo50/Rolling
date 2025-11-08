import './App.css';
import Toast from './Toast/Toast';

function App() {
  return <Toast isOpen onClose={() => {}} message="URL이 복사 되었습니다." duration={0} />;
}

export default App;

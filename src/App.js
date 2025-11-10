import "./App.css";
import MessageHeader from "./Header/MessageHeader"
import Header from "./Header/Header"
import MobileHeader from "./Header/MobileHeader";
import OwnerPage from "./RollingPage/OwnerPage.jsx"


function App() {
  return (
    <>
    <Header/>
    <MessageHeader/>
    <MobileHeader/>
    <OwnerPage/>
    </>
  );
}

export default App;

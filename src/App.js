import './App.css';
import Option from './Option/Option.jsx';
import Header from './Header/Header.jsx'
import MessageHeader from './Header/MessageHeader.jsx'
import MobileHeader from './Header/MobileHeader.jsx'
import User from './Option/User.jsx'


function App() {
  return (
    <>
      <Option/>
      <Header/>
      <MessageHeader/>
      <MobileHeader/>
      <User/>
    </>

  );
}

export default App;

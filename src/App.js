import './App.css';
import CircleButton from './Button/CircleButton.jsx';
import DeleteButton from './Button/deleteButton.jsx';
import IconButtion from './Button/iconButton.jsx';
import LeftArrowButton from './Button/LeftArrow.jsx';
import RightArrowButton from './Button/RightArrow.jsx';
import PrimaryDelete from './Button/primaryDelete.jsx';
import PrimaryMain from './Button/primaryMain.jsx';
import PrimaryMobile from './Button/primaryMobile.jsx';
import PrimaryPC from './Button/primaryPc.jsx';
import ToggleButton from './Button/ToggleButton.jsx';


function App() {
  return (
    <> 
      <DeleteButton />
      <IconButtion />
      <LeftArrowButton />
      <RightArrowButton />
      <PrimaryDelete />
      <PrimaryMain />
      <PrimaryMobile />
      <PrimaryPC />
      <CircleButton />
      <ToggleButton />
    </>
  );
}

export default App;

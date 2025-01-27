import Homepage from './Components/Homepage/Homepage';
import Nav from './Components/Nav/Nav';
import Sidebar from './Components/Sidebar/Sidebar';
import './styles/App.css';
import React from 'react';





function App() {

  return (
    <div className="App">
        <Nav/>
        <Sidebar/>
        <Homepage/>
      

    </div>
   
  );
}

export default App;


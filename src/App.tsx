import React from 'react';
import logo from './logo.svg';
import './App.css';
import SlidersComponent from './components/Sliders/Sliders';
import Dropdown from './components/Dropdown/Dropdown';
import ToggleComponent from './components/Toggle/Toggle';
import Container from './components/Container/Container';
// TODO: Add visual representation of a failed POST request, as a list of errors

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='flex flex-col gap-10 bg-white p-10'>
          <Dropdown url="/api/v2/root/0"/>

          <p>Dials</p>
          <Container url="/api/v2/root/1" />

          <p>Rainbow</p>
          <Container url="/api/v2/root/3" />
        </div>
      </header>
    </div>
  );
}

export default App;

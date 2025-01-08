import React from 'react';
import logo from './logo.svg';
import './App.css';
import SlidersComponent from './components/Sliders/Sliders';
import DropdownComponent from './components/Dropdown/Dropdown';
import ToggleComponent from './components/Toggle/Toggle';
import Container from './components/Container/Container';
// TODO: Add visual representation of a failed POST request, as a list of errors

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='flex flex-col gap-10 bg-white p-10'>
          <DropdownComponent name="0" path="/api/v2/root"/>
          <p>Dials</p>
          {/* <SlidersComponent controlId={1} /> */}
          <Container name="1" path="/api/v2/root" />
          <p>Rainbow</p>
          {/* <SlidersComponent controlId={3} /> */}
          <Container name="3" path="/api/v2/root" />
        </div>
      </header>
    </div>
  );
}

export default App;

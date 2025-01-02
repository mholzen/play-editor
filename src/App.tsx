import React from 'react';
import logo from './logo.svg';
import './App.css';
import SlidersComponent from './components/Sliders/Sliders';
import DropdownComponent from './components/Dropdown/Dropdown';
import ToggleComponent from './components/Toggle/Toggle';

// TODO: Add visual representation of a failed POST request, as a list of errors

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='flex flex-col gap-10 bg-white p-10'>
          <DropdownComponent controlId={0} />
          <p>Dials</p>
          <SlidersComponent controlId={1} />
          <SlidersComponent controlId={2} />
          <p>Rainbow</p>
          <SlidersComponent controlId={3} />
          <SlidersComponent controlId={4} />
          <ToggleComponent controlId={5} name='Reverse' defaultValue={false} />
        </div>
      </header>
    </div>
  );
}

export default App;

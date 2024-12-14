import React from 'react';
import logo from './logo.svg';
import './App.css';
import SlidersComponent from './components/Sliders/Sliders';
import DropdownComponent from './components/Dropdown/Dropdown';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='flex flex-col gap-10 bg-white p-10'>
          <SlidersComponent />
          <DropdownComponent />
        </div>
      </header>
    </div>
  );
}

export default App;

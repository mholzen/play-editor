import React from 'react';
import logo from './logo.svg';
import './App.css';
import SlidersComponent from './components/Sliders/Sliders';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Sliders
        </p>
        <div>
          <SlidersComponent />
        </div>
      </header>
    </div>
  );
}

export default App;

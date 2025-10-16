import './App.css';
import Container from './components/Container/Container';
// TODO: Add visual representation of a failed POST request, as a list of errors

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-24 h-24" />
          <h1 className="text-2xl font-bold text-black">play-editor</h1>
        </div>
        <div className='flex flex-col gap-6 bg-gray-50 p-12 min-h-screen pt-32'>
          <Container url="/api/v2/root" />
        </div>
      </header>
    </div>
  );
}

export default App;

import './App.css';
import MapSection from './components/MapSection';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <MapSection />
      </div>
    </div>
  );
}

export default App;

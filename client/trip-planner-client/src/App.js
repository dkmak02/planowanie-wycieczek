import './App.css';
import MapSection from './components/MapSection';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Sidebar />
        <MapSection />
      </div>
    </div>
  );
}

export default App;

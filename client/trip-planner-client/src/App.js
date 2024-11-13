import './App.css';
import MapSection from "./components/MainPage/MapSection";
import Navbar from "./components/MainPage/Navbar";

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

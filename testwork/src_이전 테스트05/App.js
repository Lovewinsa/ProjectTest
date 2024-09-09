import { useOutlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import BsNavBar from './components/BsNavBar';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const currentOutlet = useOutlet();

  const [savedPlaces, setSavedPlaces] = useState([]);
  const [map, setMap] = useState(null);

  const handleSavePlace = (place) => {
    setSavedPlaces([...savedPlaces, place]);
  };

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div className="app-container">
      <BsNavBar />
      <div className="main-content">
        {currentOutlet}
      </div>
      <Footer />
    </div>
  );
}

export default App;

import { useOutlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  const currentOutlet = useOutlet();

  return (
    <div className="app-container">
      <NavBar />
      <div className="main-content">
        {currentOutlet}
      </div>
      <Footer />
    </div>
  );
}

export default App;

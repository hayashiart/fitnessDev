import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>        
        <AppRoutes />
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from './components/header';

function App() {
  return (
    <div className="App">
      <Header/>
      <a>index</a>
      <Link to="/start">Start</Link>
      <Button variant="contained">Hello World</Button>;
    </div>
  );
}

export default App;

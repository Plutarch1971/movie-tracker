import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import AppNavbar from "./components/UI/AppNavbar";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <>
    <AppNavbar />
        <Outlet />
    </>
  );
}

export default App;

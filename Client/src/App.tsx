import './App.css';
import AppNavbar from "./components/UI/AppNavbar";
import { Outlet } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import client from './utils/apolloClient'; // Import or define the client

function App() {
  return (
    <ApolloProvider client={client}>
    <>
    <AppNavbar />
        <Outlet />
    </>
    </ApolloProvider>
  );
}

export default App;

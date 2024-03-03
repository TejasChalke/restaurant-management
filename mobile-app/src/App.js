import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Logon from './pages/logon/Logon';
import Profile from './pages/profile/Profile';
import Menu from './pages/menu/Menu'
import Cart from './pages/cart/Cart'
import Reservations from './pages/reservations/Reservations'
import { UserDataContext } from './contexts/UserDataContext';
import { useState } from 'react';

function App() {
  const [userData, setUserData] = useState({
    id: -1,
    name: "",
    contact: "",
    email: "",
    address: ""
  })

  return (
      <div className="App">
        <UserDataContext.Provider value={{userData, setUserData}}>
          <BrowserRouter>
            <Routes>
                <Route element={<Logon />} path='/' index/>
                <Route element={<Menu />} path='/menu'/>
                <Route element={<Cart />} path='/cart'/>
                <Route element={<Reservations />} path='/reservations'/>
                <Route element={<Profile />} path='/profile'/>
            </Routes>
          </BrowserRouter>
        </UserDataContext.Provider>
      </div>
  );
}

export default App;

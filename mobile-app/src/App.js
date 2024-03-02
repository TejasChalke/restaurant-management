import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Logon from './pages/logon/Logon';
import Profile from './pages/profile/Profile';

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
              <Route element={<Logon />} path='/' index/>
              <Route element={<Profile />} path='/profile'/>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;

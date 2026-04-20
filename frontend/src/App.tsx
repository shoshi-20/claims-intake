import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Claims from './pages/Claims';
import NewClaim from './pages/NewClaim';
import AuthenticationCard from './pages/AuthenticationCard';
import { useState } from 'react';
import { AuthContext } from './context';

function App() {
  const [token, setToken] = useState('');

  return (
    <AuthContext.Provider value={token}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthenticationCard action='login' setUser={setToken} />} />
          <Route path='/login' element={<AuthenticationCard action='login' setUser={setToken} />} />
          <Route path='/register' element={<AuthenticationCard action='register' setUser={setToken} />} />
          <Route path='/claims' element={<Claims />} />
          <Route path='/claims/new' element={<NewClaim />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

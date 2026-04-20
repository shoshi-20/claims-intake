import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Claims from './pages/Claims';
import NewClaim from './pages/NewClaim';
import AuthenticationCard from './pages/AuthenticationCard';
import {useState} from 'react';
import {AuthContext, type AuthUser} from './context';
import {login as loginRequest} from './api/auth.api';

const getUserFromToken = (token: string): AuthUser | null => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length < 2) return null;

    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(paddedBase64)) as Record<string, unknown>;

    const rawId = payload.id ?? payload.userId;
    const rawEmail = payload.email;
    if (typeof rawId !== 'string' || typeof rawEmail !== 'string') return null;

    return {id: rawId, email: rawEmail};
  } catch {
    return null;
  }
};

function App() {
  const [token, setToken] = useState('');
  const currentUser = token ? getUserFromToken(token) : null;

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    setToken(response.token);
  };

  const logout = () => {
    setToken('');
  };

  return (
    <AuthContext.Provider value={{token, currentUser, login, logout, setToken}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthenticationCard action='login' />} />
          <Route path='/login' element={<AuthenticationCard action='login' />} />
          <Route path='/register' element={<AuthenticationCard action='register' />} />
          <Route path='/claims' element={<Claims />} />
          <Route path='/claims/new' element={<NewClaim />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

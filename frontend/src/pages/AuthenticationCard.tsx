import {useNavigate} from 'react-router-dom';
import {login, register} from '../api/auth.api';
import FormField from '../components/FormField';
import {useState} from 'react';

interface AuthenticationCardProps {
  action: 'login' | 'register';
  setUser: (user: string) => void;
}

const AuthenticationCard: React.FC<AuthenticationCardProps> = ({action, setUser}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const token = await login(email, password);
      if (token) {
        setUser(token);
        navigate('/claims');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const user = await register(email, password);
      if (user) navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Claims Intake</h1>
      <p>{action === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
      <FormField label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <FormField label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={action == 'login' ? handleLogin : handleRegister}>{action === 'login' ? 'Login' : 'Register'}</button>
      <p>
        {action === 'login' ? (
          <>
            Don't have an account? <a href='/register'>Register</a>
          </>
        ) : (
          <>
            Already have an account? <a href='/login'>Login</a>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthenticationCard;

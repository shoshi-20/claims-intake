import {Link, useNavigate} from 'react-router-dom';
import {register} from '../api/auth.api';
import FormField from '../components/FormField';
import {useContext, useState} from 'react';
import {AuthContext} from '../context';

interface AuthenticationCardProps {
  action: 'login' | 'register';
}

const AuthenticationCard: React.FC<AuthenticationCardProps> = ({action}) => {
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate('/claims');
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
  const handleSubmit: NonNullable<React.ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    if (action === 'login') {
      await handleLogin();
      return;
    }
    await handleRegister();
  };

  return (
    <main className='auth-page'>
      <form className='auth-card' onSubmit={handleSubmit}>
        <h1 className='auth-title'>Claims Intake</h1>
        <p className='auth-subtitle'>{action === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
        <FormField label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit' className='btn btn-primary auth-action'>
          {action === 'login' ? 'Login' : 'Register'}
        </button>
        <p className='auth-link-row'>
          {action === 'login' ? (
            <>
              Don't have an account? <Link to='/register'>Register</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to='/login'>Login</Link>
            </>
          )}
        </p>
      </form>
    </main>
  );
};

export default AuthenticationCard;

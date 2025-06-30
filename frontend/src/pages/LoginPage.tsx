
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Lock, Mail } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard'); // Navigate to the main app screen on success
    } catch (err: any) {
      if (err.response) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('Login failed. Please check your connection.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-quantum-black">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-soft-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Log in to continue your project</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input icon={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-solar-orange text-sm">{error}</p>}
          <button type="submit" className="w-full bg-fusion-pink text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300">
            Log In
          </button>
        </form>
         <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ion-blue hover:underline">
              Sign Up
            </Link>
          </p>
      </Card>
    </div>
  );
};

export default LoginPage;

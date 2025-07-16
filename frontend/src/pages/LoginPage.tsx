import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import logoIcon from '../assets/images/logo_icon.png';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await auth.login(email, password);
        setIsLoading(false);
        if (success) {
            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            // Error toast is handled within the AuthContext
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
             <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2">
                    <img src={logoIcon} alt="Applaude Logo" className="w-10 h-10" />
                    <span className="text-3xl font-bold text-black">Applaude</span>
                </Link>
            </div>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <LogIn className="mr-2 h-4 w-4" />}
                        Login
                    </Button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account? <Link to="/signup" className="font-medium text-ion-blue hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

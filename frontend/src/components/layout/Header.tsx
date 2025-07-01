
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageSquare } from 'lucide-react'; // Import for chat icon
import ChatWindow from '../core/ChatWindow'; // Assuming a ChatWindow component
import { Send } from 'lucide-react'; // For the ChatWindow input

const Header = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, isSubscribed } = authContext || { isAuthenticated: false, isSubscribed: false };
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { text: "Hello! I'm Applause, your AI Co-Founder. How can I assist you with your app today?", sender: 'ai' },
    ]);
    const [chatInput, setChatInput] = useState('');

    const handleSendMessage = (message: string) => {
        setChatMessages(prev => [...prev, { text: message, sender: 'user' }]);
        setChatInput('');
        // Simulate AI response
        setTimeout(() => {
            setChatMessages(prev => [...prev, { text: "Thank you for your message! Our AI team is reviewing your request and will get back to you shortly.", sender: 'ai' }]);
        }, 1500);
    };


    return (
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <Link to="/" className="flex items-center gap-2">
                <img src="/logo_icon.png" alt="Applause Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold text-soft-white">Applause</span>
            </Link>
            <nav className="space-x-6 hidden md:flex items-center"> {/* Added hidden md:flex */}
                <Link to="/about" className="text-gray-300 hover:text-ion-blue transition-colors">About</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-gray-300 hover:text-ion-blue transition-colors">Dashboard</Link>
                        {isSubscribed && (
                            <button 
                                onClick={() => setIsChatOpen(true)}
                                className="p-2 rounded-full bg-ion-blue text-white hover:bg-opacity-80 transition-all duration-300"
                                title="Chat with Applause AI"
                            >
                                <MessageSquare size={20} />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-300 hover:text-ion-blue transition-colors">Login</Link>
                        <Link to="/signup" className="px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90">
                            Sign Up
                        </Link>
                    </>
                )}
            </nav>
            <div className="md:hidden">
                <MobileNav />
            </div>

            {isChatOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative w-full max-w-2xl bg-black bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-10 overflow-hidden">
                        <button 
                            onClick={() => setIsChatOpen(false)} 
                            className="absolute top-4 right-4 text-soft-white hover:text-ion-blue z-10"
                        >
                            &times; Close
                        </button>
                         <ChatWindow 
                            messages={chatMessages} 
                            onSendMessage={handleSendMessage} 
                            input={chatInput} 
                            setInput={setChatInput} 
                            placeholder="Ask Applause about your app..."
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

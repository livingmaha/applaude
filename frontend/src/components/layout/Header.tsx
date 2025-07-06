import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageSquare } from 'lucide-react';
import ChatWindow from '../core/ChatWindow';
import logoIcon from '../../assets/images/logo_icon.png'; // Corrected Path

const Header = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("Header must be within AuthProvider");
    const {
        isAuthenticated,
        isSubscribed,
        isPaymentModalOpen,
        closePaymentConversation,
        paymentConversation,
        sendPaymentMessage
    } = authContext;

    return (
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-30">
            <Link to="/" className="flex items-center gap-2">
                <img src={logoIcon} alt="Applause Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold text-soft-white">Applause</span>
            </Link>
            <nav className="space-x-6 hidden md:flex items-center">
                <Link to="/about" className="text-gray-300 hover:text-ion-blue transition-colors">About</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-gray-300 hover:text-ion-blue transition-colors">Dashboard</Link>
                        {isSubscribed && (
                            <button
                                // onClick={() => setIsChatOpen(true)} // This can be for general support
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

            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
                    <div className="relative w-full max-w-2xl">
                         <button
                            onClick={closePaymentConversation}
                            className="absolute top-0 right-0 mt-4 mr-4 text-soft-white hover:text-ion-blue z-10 text-2xl font-bold"
                         >
                            &times;
                        </button>
                        <ChatWindow
                            messages={paymentConversation.messages}
                            onSendMessage={sendPaymentMessage}
                            input={paymentConversation.input}
                            setInput={(value) => authContext.setPaymentConversation(prev => ({ ...prev, input: value }))}
                            placeholder="Select a plan or ask a question..."
                            interactiveOptions={paymentConversation.interactiveOptions}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

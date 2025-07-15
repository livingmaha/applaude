import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';
import paymentService from '../services/paymentService';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

interface InteractiveOption {
    text: string;
    payload: any;
}

interface PaymentConversation {
    messages: Message[];
    input: string;
    interactiveOptions: InteractiveOption[];
    projectId: number | null;
}

interface AuthContextType {
    token: string | null;
    user: { email: string; userId: number; username?: string } | null;
    isAuthenticated: boolean;
    isSubscribed: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>; // Added signup
    logout: () => void;
    isPaymentModalOpen: boolean;
    openPaymentConversation: (projectId: number) => void;
    closePaymentConversation: () => void;
    paymentConversation: PaymentConversation;
    setPaymentConversation: React.Dispatch<React.SetStateAction<PaymentConversation>>;
    sendPaymentMessage: (message: string | object) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ email: string; userId: number; username?: string, is_superuser?: boolean, is_premium_subscribed?: boolean } | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

    const initialConversationState: PaymentConversation = {
        messages: [],
        input: '',
        interactiveOptions: [],
        projectId: null,
    };
    const [paymentConversation, setPaymentConversation] = useState<PaymentConversation>(initialConversationState);

    const setupAuth = (authToken: string | null) => {
        if (authToken) {
            setToken(authToken);
            apiClient.defaults.headers.common['Authorization'] = `Token ${authToken}`;
            // Fetch user data after setting up token
            apiClient.get('/users/me/').then(response => {
                const { email, id, username, is_premium_subscribed } = response.data;
                const userData = { email, userId: id, username, is_premium_subscribed };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsSubscribed(is_premium_subscribed || false);
            }).catch(err => {
                console.error("Failed to fetch user data", err);
                logout(); // Logout if token is invalid
            });
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            apiClient.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
            apiClient.get('/users/me/')
                .then(response => {
                    const { email, id, username, is_superuser, is_premium_subscribed } = response.data;
                    const userData = { email, userId: id, username, is_superuser, is_premium_subscribed };
                    setUser(userData);
                    setToken(storedToken);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    // Token is invalid, clear it
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiClient.post('/users/token/', { email, password });
        const { token: responseToken, user_id, username, is_premium_subscribed } = response.data;
        localStorage.setItem('token', responseToken);
        apiClient.defaults.headers.common['Authorization'] = `Token ${responseToken}`;
        setUser({ email, userId: user_id, username, is_premium_subscribed });
        setToken(responseToken);
        setIsAuthenticated(true);
    };

    const signup = async (username: string, email: string, password: string) => {
        await apiClient.post('/users/create/', {
            username,
            email,
            password,
        });
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsSubscribed(false);
        delete apiClient.defaults.headers.common['Authorization'];
    };

    const openPaymentConversation = (projectId: number) => {
        setPaymentConversation({
            projectId,
            input: '',
            messages: [
                { sender: 'ai', text: "I see you're ready to launch! Let's find the perfect plan for you." }
            ],
            interactiveOptions: [
                { text: "One-Time ($50)", payload: { plan: 'ONETIME' } },
                { text: "Monthly ($15/mo)", payload: { plan: 'MONTHLY' } },
                { text: "Yearly ($150/yr)", payload: { plan: 'YEARLY' } },
            ]
        });
        setPaymentModalOpen(true);
    };

    const closePaymentConversation = () => {
        setPaymentModalOpen(false);
        setPaymentConversation(initialConversationState);
    };

    const sendPaymentMessage = async (message: string | object) => {
        let userMessageText: string;
        let payload: any;

        if (typeof message === 'object') {
            payload = (message as InteractiveOption).payload;
            userMessageText = (message as InteractiveOption).text;
        } else {
            userMessageText = message;
        }

        setPaymentConversation(prev => ({
            ...prev,
            messages: [...prev.messages, { sender: 'user', text: userMessageText }],
            input: '',
            interactiveOptions: [], // Clear options after user makes a choice
        }));

        if (payload && payload.plan && paymentConversation.projectId) {
            try {
                const paymentData = await paymentService.initializePayment(paymentConversation.projectId, payload.plan, 'USD');
                setPaymentConversation(prev => ({
                    ...prev,
                    messages: [...prev.messages, { sender: 'ai', text: `Great! Redirecting you to our secure payment processor to complete your ${userMessageText} purchase.` }]
                }));
                setTimeout(() => {
                    window.location.href = paymentData.authorization_url;
                }, 2000);
            } catch (error) {
                console.error("Payment initialization failed", error);
                setPaymentConversation(prev => ({
                    ...prev,
                    messages: [...prev.messages, { sender: 'ai', text: "Sorry, I couldn't initiate the payment. Please try again or contact support." }]
                }));
            }
        } else {
             setPaymentConversation(prev => ({
                ...prev,
                messages: [...prev.messages, { sender: 'ai', text: "I'm connecting you to a specialist for that question." }]
            }));
        }
    };

    return (
        <AuthContext.Provider value={{
            token, user, isAuthenticated: !!token, isSubscribed, login, signup, logout,
            isPaymentModalOpen, openPaymentConversation, closePaymentConversation,
            paymentConversation, setPaymentConversation, sendPaymentMessage
        }}>
            {children}
        </AuthContext.Provider>
    );
};

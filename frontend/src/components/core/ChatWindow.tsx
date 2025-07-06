import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react'; // Import new icons

interface Message {
    text: string;
    sender: string;
}

interface ChatWindowProps {
    projectId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ projectId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const webSocket = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const connect = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Authentication token not found.");
            return;
        }

        const wsUrl = (import.meta.env.VITE_API_URL || 'ws://127.0.0.1:8000')
            .replace(/^http/, 'ws') + `/ws/chat/${projectId}/?token=${token}`;

        webSocket.current = new WebSocket(wsUrl);

        webSocket.current.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
            setMessages(prev => [...prev, { text: 'Connected to Applause Prime...', sender: 'system' }]);
        };

        webSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, { text: data.message, sender: data.sender }]);
        };

        webSocket.current.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsConnected(false);
            setMessages(prev => [...prev, { text: 'Connection lost. Attempting to reconnect...', sender: 'system' }]);
            setTimeout(connect, 5000); // Reconnect after 5 seconds
        };

        webSocket.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }, [projectId]);

    useEffect(() => {
        connect();
        return () => {
            webSocket.current?.close();
        };
    }, [connect]);

    const handleSend = () => {
        if (input.trim() && webSocket.current?.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify({ 'message': input }));
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[32rem] bg-black bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-10 overflow-hidden">
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${
                            msg.sender === 'user' ? 'bg-fusion-pink text-white' : 
                            msg.sender === 'system' ? 'bg-gray-800 text-gray-400 italic' :
                            'bg-gray-700 bg-opacity-50 text-soft-white'
                        }`}>
                            <span className="font-bold block text-xs">{msg.sender}</span>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black bg-opacity-30 border-t border-white border-opacity-10">
                <div className="flex items-center">
                    {/* Placeholder Icons for future features */}
                    <button className="p-2 text-gray-400 hover:text-ion-blue transition-colors" title="Attach File">
                        <Paperclip size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-ion-blue transition-colors" title="Use Voice Input">
                        <Mic size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isConnected ? "Chat with Applause Prime..." : "Connecting..."}
                        className="w-full bg-transparent text-soft-white placeholder-gray-500 focus:outline-none px-2"
                        disabled={!isConnected}
                    />
                    <button
                        onClick={handleSend}
                        className="ml-2 p-2 bg-fusion-pink rounded-full text-white hover:bg-opacity-80 transition-all duration-300"
                        disabled={!isConnected}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;


import React from 'react';
import { Send } from 'lucide-react';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    input: string;
    setInput: (value: string) => void;
    placeholder?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, input, setInput, placeholder }) => {
    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-black bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-10 overflow-hidden">
            <div className="p-6 h-96 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${msg.sender === 'user' ? 'bg-fusion-pink text-white' : 'bg-gray-700 bg-opacity-50 text-soft-white'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-black bg-opacity-30 border-t border-white border-opacity-10">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={placeholder || "Type your message..."}
                        className="w-full bg-transparent text-soft-white placeholder-gray-500 focus:outline-none"
                    />
                    <button onClick={handleSend} className="ml-4 p-2 bg-fusion-pink rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;

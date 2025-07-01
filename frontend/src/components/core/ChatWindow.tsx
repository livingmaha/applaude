import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

interface InteractiveOption {
    text: string;
    payload: any;
}

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (message: string | object) => void;
    input: string;
    setInput: (value: string) => void;
    placeholder?: string;
    interactiveOptions?: InteractiveOption[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, input, setInput, placeholder, interactiveOptions }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
        }
    };
    
    const handleOptionClick = (option: InteractiveOption) => {
        onSendMessage(option);
    };

    return (
        <div className="flex flex-col h-[32rem] bg-black bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-10 overflow-hidden">
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${msg.sender === 'user' ? 'bg-fusion-pink text-white' : 'bg-gray-700 bg-opacity-50 text-soft-white'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {interactiveOptions && interactiveOptions.length > 0 && (
                <div className="p-2 flex flex-wrap justify-center gap-2 border-t border-white border-opacity-10">
                    {interactiveOptions.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="px-4 py-2 bg-ion-blue text-white font-bold rounded-lg hover:bg-opacity-80 transition-all"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-4 bg-black bg-opacity-30 border-t border-white border-opacity-10">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={placeholder || "Type your message..."}
                        className="w-full bg-transparent text-soft-white placeholder-gray-500 focus:outline-none"
                        disabled={interactiveOptions && interactiveOptions.length > 0}
                    />
                    <button
                        onClick={handleSend}
                        className="ml-4 p-2 bg-fusion-pink rounded-full text-white hover:bg-opacity-80 transition-all duration-300"
                        disabled={interactiveOptions && interactiveOptions.length > 0}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;

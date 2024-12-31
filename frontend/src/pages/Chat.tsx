import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // TODO: Implement AI response logic
            setTimeout(() => {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'I am your AI lottery assistant. How can I help you today?',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error sending message:', error);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Layout>
            <div className="h-[calc(100vh-2rem)] p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">AI Chat</h1>
                <div className="glass-card h-[calc(100%-8rem)] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-4 rounded-lg ${
                                        message.role === 'user'
                                            ? 'bg-purple-500 bg-opacity-20 ml-auto'
                                            : 'bg-gray-700 bg-opacity-50'
                                    }`}
                                >
                                    <p className="text-white">{message.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {message.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[70%] p-4 rounded-lg bg-gray-700 bg-opacity-50">
                                    <p className="text-white">Thinking...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-4">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-purple-500 resize-none"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="btn-primary px-6"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Chat; 
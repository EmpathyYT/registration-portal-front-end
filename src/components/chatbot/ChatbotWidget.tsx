import React, { useState, useRef, useEffect } from 'react';
import { styles, inlineStyles } from './ChatbotStyles';

interface Message {
    id: number;
    sender: 'user' | 'bot';
    text: string;
}

interface ChatbotWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: string;
}

export default function ChatbotWidget({ isOpen, onClose, userRole }: ChatbotWidgetProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: 'Hi! I am the BAU Portal Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    if (!isOpen) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const url = new URL('https://ai-service-production-43ee.up.railway.app/api/chat');
            url.searchParams.append('prompt', userMsg);
            url.searchParams.append('role', userRole.toUpperCase());

            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.text();

            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: data }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay} style={inlineStyles.overlay}>
            <div className={styles.header}>
                <h6 className={styles.headerTitle}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                    Portal Assistant
                </h6>
                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close"></button>
            </div>
            <div className={styles.body} style={inlineStyles.body}>
                {messages.map(msg => (
                    <div key={msg.id} className={styles.messageRow(msg.sender === 'user')}>
                        <div className={styles.messageBubble(msg.sender === 'user')} style={inlineStyles.messageBubble}>
                            <p style={inlineStyles.messageText}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className={styles.messageRow(false)}>
                        <div className={styles.messageBubble(false)} style={inlineStyles.messageBubble}>
                            <span className="spinner-grow spinner-grow-sm text-primary" role="status" aria-hidden="true"></span>
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>
            <div className={styles.footer}>
                <form className={styles.form} onSubmit={handleSend}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Type your message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading} style={{ width: '42px', height: '42px' }}>
                        <svg style={inlineStyles.sendIcon} fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm-2.846-1.5 4.338-2.761L2.576 1.87 3.79 8.57Z"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

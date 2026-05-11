import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ChatbotWidget() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: 'Hi! I can help you find bursaries and universities. Try asking me something.',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const messagesEndRef = useRef(null);

    const suggestions = [
        'What bursaries are available?',
        'Which bursaries close soon?',
        'Show me universities in Limpopo',
        'Bursaries for computer science',
    ];

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    function sendMessage(text) {
        const msg = text || input.trim();
        if (!msg) return;

        setMessages(prev => [...prev, { from: 'user', text: msg }]);
        setInput('');
        setLoading(true);
        setResults([]);

        api.post('/chatbot/message', { message: msg })
            .then(res => {
                setMessages(prev => [...prev, { from: 'bot', text: res.data.message }]);
                if (res.data.results && res.data.results.length > 0) {
                    setResults(res.data.results);
                }
            })
            .catch(() => {
                setMessages(prev => [
                    ...prev,
                    { from: 'bot', text: 'Sorry, I could not process that. Please try again.' },
                ]);
            })
            .finally(() => setLoading(false));
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') sendMessage();
    }

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    ...s.bubble,
                    background: open ? '#8899bb' : '#b8f53c',
                }}
            >
                {open ? '✕' : '💬'}
            </button>

            {open && (
                <div style={s.window}>

                    <div style={s.header}>
                        <div style={s.headerLogo}>N</div>
                        <div>
                            <div style={s.headerTitle}>NextStep Assistant</div>
                            <div style={s.headerSub}>Ask about universities and bursaries</div>
                        </div>
                    </div>

                    <div style={s.messages}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={msg.from === 'bot' ? s.botMsg : s.userMsg}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {loading && (
                            <div style={s.botMsg}>Thinking...</div>
                        )}

                        {results.length > 0 && (
                            <div style={s.resultsBox}>
                                {results.map((r, i) => (
                                    <div key={i} style={s.resultItem}>
                                        <div style={s.resultName}>{r.name}</div>
                                        {r.subTitle && (
                                            <div style={s.resultSub}>{r.subTitle}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 1 && (
                        <div style={s.suggestions}>
                            {suggestions.map((sug, i) => (
                                <button
                                    key={i}
                                    style={s.suggestion}
                                    onClick={() => sendMessage(sug)}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={s.inputRow}>
                        <input
                            style={s.input}
                            placeholder="Ask something..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <button
                            style={s.sendBtn}
                            onClick={() => sendMessage()}
                            disabled={loading}
                        >
                            Send
                        </button>
                    </div>

                    {!user && (
                        <div style={s.guestNote}>
                            Log in for personalised recommendations
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

const s = {
    bubble: {
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: '50%',
        border: 'none',
        fontSize: 22,
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    window: {
        position: 'fixed',
        bottom: 88,
        right: 24,
        width: 320,
        maxHeight: 500,
        background: '#1a2d52',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
    },
    header: {
        background: '#b8f53c',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
    },
    headerLogo: {
        width: 30,
        height: 30,
        borderRadius: 7,
        background: '#0f1b35',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 14,
        color: '#b8f53c',
        flexShrink: 0,
    },
    headerTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: '#0f1b35',
    },
    headerSub: {
        fontSize: 10,
        color: '#2a4a0a',
    },
    messages: {
        flex: 1,
        overflowY: 'auto',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    botMsg: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px 12px 12px 12px',
        padding: '8px 12px',
        fontSize: 13,
        lineHeight: 1.5,
        color: '#e8edf8',
        maxWidth: '88%',
        whiteSpace: 'pre-line',
        alignSelf: 'flex-start',
    },
    userMsg: {
        background: '#b8f53c',
        borderRadius: '12px 4px 12px 12px',
        padding: '8px 12px',
        fontSize: 13,
        lineHeight: 1.5,
        color: '#0f1b35',
        fontWeight: 600,
        maxWidth: '88%',
        alignSelf: 'flex-end',
    },
    resultsBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignSelf: 'flex-start',
        width: '100%',
    },
    resultItem: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '7px 10px',
        cursor: 'pointer',
    },
    resultName: {
        fontSize: 12,
        fontWeight: 600,
        color: '#e8edf8',
    },
    resultSub: {
        fontSize: 11,
        color: '#8899bb',
        marginTop: 2,
    },
    suggestions: {
        padding: '0 14px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        flexShrink: 0,
    },
    suggestion: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 12,
        color: '#8899bb',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s',
    },
    inputRow: {
        display: 'flex',
        gap: 8,
        padding: '10px 12px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
    },
    input: {
        flex: 1,
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '7px 10px',
        fontSize: 13,
        color: '#e8edf8',
        outline: 'none',
    },
    sendBtn: {
        background: '#b8f53c',
        border: 'none',
        borderRadius: 8,
        padding: '7px 14px',
        fontSize: 13,
        fontWeight: 700,
        color: '#0f1b35',
        cursor: 'pointer',
    },
    guestNote: {
        textAlign: 'center',
        fontSize: 11,
        color: '#8899bb',
        padding: '6px 12px 10px',
        flexShrink: 0,
    },
};
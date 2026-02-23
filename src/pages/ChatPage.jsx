import { useState, useRef, useEffect } from 'react';
export { ChatPage };
import axiosInstance from '../components/axiosInstance.jsx';
import '../CSS/ChatPage.css';

const SUGGESTIONS = [
  'Explain Java generics with examples',
  'What is the difference between SQL JOIN types?',
  'How does React useEffect work?',
  'Best practices for REST API design',
  'Explain Big O notation simply',
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let inCode = false;
    let codeLines = [];
    let codeLang = '';

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCode) {
          elements.push(
            <pre key={`code-${i}`} className="chat-code">
              <div className="code-header">
                <span className="code-lang">{codeLang || 'code'}</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(codeLines.join('\n'))}>Copy</button>
              </div>
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
          codeLines = [];
          inCode = false;
        } else {
          inCode = true;
          codeLang = line.replace('```', '').trim();
        }
        return;
      }
      if (inCode) { codeLines.push(line); return; }

      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="chat-h4">{line.slice(4)}</h4>);
      } else if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="chat-h3">{line.slice(3)}</h3>);
      } else if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="chat-h2">{line.slice(2)}</h2>);
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        elements.push(<li key={i} className="chat-li">{formatInline(line.slice(2))}</li>);
      } else if (line.match(/^\d+\. /)) {
        elements.push(<li key={i} className="chat-li chat-oli">{formatInline(line.replace(/^\d+\. /, ''))}</li>);
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} className="chat-p">{formatInline(line)}</p>);
      }
    });
    return elements;
  };

  const formatInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="inline-code">{p.slice(1, -1)}</code>;
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
      if (p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
      return p;
    });
  };

  return (
    <div className={`message-wrap ${isUser ? 'user-wrap' : 'ai-wrap'}`}>
      {!isUser && <div className="ai-avatar">⬡</div>}
      <div className={`bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        {isUser ? (
          <p className="user-text">{msg.content}</p>
        ) : (
          <div className="ai-content">{renderMarkdown(msg.content)}</div>
        )}
        <div className="msg-time">{msg.time}</div>
      </div>
      {isUser && <div className="user-avatar">U</div>}
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hi! 👋 I'm your AI tutor on SmartPrep.\n\nAsk me anything about programming, algorithms, databases, system design, or any tech topic you're preparing for — I'm here to help you crack that interview! 🚀",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId]           = useState(() => 'chat_' + Date.now());
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const prompt = text || input.trim();
    if (!prompt || loading) return;
    setInput('');

    const userMsg = {
      role: 'user',
      content: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/chat', {
        sessionId,
        prompt,
        systemPromptType: 'general',
      });
      const aiMsg = {
        role: 'ai',
        content: data.reply || 'Sorry, I could not generate a response.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '⚠️ Failed to connect to the AI. Please check your connection and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      content: "Chat cleared! What would you like to learn today? 😊",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="chat-page">
      <div className="chat-bg">
        <div className="c-orb1" />
        <div className="c-orb2" />
      </div>

      <div className="chat-layout">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Quick Prompts</h3>
          </div>
          <div className="suggestions-list">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="sidebar-actions">
            <button className="clear-btn" onClick={clearChat}>🗑 Clear Chat</button>
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-title-group">
              <span className="chat-bot-icon">⬡</span>
              <div>
                <div className="chat-title">SmartPrep AI Tutor</div>
                <div className="chat-status">
                  <span className="status-dot" />
                  Online
                </div>
              </div>
            </div>
            <div className="chat-msg-count">{messages.length} messages</div>
          </div>

          <div className="messages-area">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <div className="message-wrap ai-wrap">
                <div className="ai-avatar">⬡</div>
                <div className="bubble ai-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask anything... (Shift+Enter for new line)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {loading ? <div className="send-spinner" /> : '↑'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
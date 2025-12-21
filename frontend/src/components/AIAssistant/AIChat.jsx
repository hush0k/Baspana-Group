import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import styles from '../../styles/AIChat.module.scss';

const AIChat = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/ai-assistant/initialize');
      setMessages([
        {
          role: 'assistant',
          content: response.data.greeting,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Ошибка инициализации чата:', error);
      setMessages([
        {
          role: 'assistant',
          content: 'Здравствуйте! Я помогу вам найти идеальное жилье. Расскажите, что вы ищете?',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai-assistant/chat', {
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationClick = (rec) => {
    window.location.href = `/apartments/${rec.id}`;
  };

  return (
    <>
      {/* Кнопка открытия чата */}
      {!isOpen && (
        <button
          className={styles.chatButton}
          onClick={() => setIsOpen(true)}
          aria-label="Открыть AI помощника"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.98 3.06 16.26L2 22L7.74 20.94C9.02 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
              fill="currentColor"
            />
            <circle cx="8" cy="12" r="1.5" fill="white" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
            <circle cx="16" cy="12" r="1.5" fill="white" />
          </svg>
          <span className={styles.badge}>AI</span>
        </button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <div className={styles.avatar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3>AI Помощник</h3>
                <span className={styles.status}>
                  {isLoading ? 'Печатает...' : 'Онлайн'}
                </span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageContent}>
                  <p>{message.content}</p>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className={styles.recommendations}>
                <h4>Рекомендованные квартиры:</h4>
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={styles.recommendationCard}
                    onClick={() => handleRecommendationClick(rec)}
                  >
                    <div className={styles.recDetails}>
                      <span className={styles.recNumber}>№{rec.number}</span>
                      <span className={styles.recType}>{rec.apartment_type}</span>
                    </div>
                    <div className={styles.recPrice}>
                      {new Intl.NumberFormat('ru-RU').format(rec.total_price)} ₸
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={styles.chatInput} onSubmit={sendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;

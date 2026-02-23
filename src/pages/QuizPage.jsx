import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance.jsx';
import '../CSS/QuizPage.css';

export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [sessionId] = useState(() => 'session_' + Date.now());

  const config = JSON.parse(sessionStorage.getItem('quizConfig') || '{"topic":"Java","count":5,"difficulty":"medium"}');

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/mcq', {
        sessionId,
        topic: config.topic,
        count: String(config.count),
        difficulty: config.difficulty,
      });
      setQuestions(data);
    } catch (e) {
      setError('Failed to load questions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // Timer
  useEffect(() => {
    if (loading || revealed || questions.length === 0) return;
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIdx, loading, questions.length]);

  const handleAutoSubmit = () => {
    if (revealed) return;
    setRevealed(true);
    const q = questions[currentIdx];
    setAnswers(prev => [...prev, { question: q, chosen: null, correct: false }]);
  };

  const handleSelect = (option) => {
    if (revealed) return;
    setSelected(option);
  };

  const handleSubmit = () => {
    if (selected === null || revealed) return;
    setRevealed(true);
    const q = questions[currentIdx];
    const isCorrect = selected === q.correctAnswer;
    setAnswers(prev => [...prev, { question: q, chosen: selected, correct: isCorrect }]);
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      const correctCount = answers.filter(a => a.correct).length;
      sessionStorage.setItem('quizResults', JSON.stringify({
        answers,
        topic: config.topic,
        total: questions.length,
        correct: correctCount,
        difficulty: config.difficulty,
        timePerQuestion: 30,
      }));
      navigate('/results');
    } else {
      setCurrentIdx(nextIdx);
      setSelected(null);
      setRevealed(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-loader">
          <div className="loader-ring" />
          <p className="loader-text">Generating questions on <strong>{config.topic}</strong>...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadQuestions}>Try Again</button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;
  const timerWarning = timeLeft <= 10;

  return (
    <div className="quiz-page">
      <div className="quiz-bg">
        <div className="bg-orb q-orb1" />
        <div className="bg-orb q-orb2" />
      </div>

      <div className="quiz-content">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-meta">
            <span className="quiz-topic-badge">{config.topic}</span>
            <span className="quiz-progress-text">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
          <div className={`quiz-timer ${timerWarning ? 'warning' : ''}`}>
            <svg viewBox="0 0 36 36" className="timer-ring">
              <path
                className="timer-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="timer-fill"
                strokeDasharray={`${(timeLeft / 30) * 100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="timer-count">{timeLeft}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <div className="progress-dots">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`dot ${i < currentIdx ? 'done' : i === currentIdx ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-num">Q{q.questionNo}</div>
          <h2 className="question-text">{q.question}</h2>

          <div className="options-grid">
            {Object.entries(q.options).map(([key, val]) => {
              let cls = 'option-btn';
              if (revealed) {
                if (key === q.correctAnswer) cls += ' correct';
                else if (key === selected) cls += ' wrong';
              } else if (key === selected) {
                cls += ' selected-opt';
              }
              return (
                <button key={key} className={cls} onClick={() => handleSelect(key)}>
                  <span className="option-key">{key}</span>
                  <span className="option-val">{val}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className={`explanation-box ${selected === q.correctAnswer ? 'correct-box' : 'wrong-box'}`}>
              <div className="exp-header">
                <span>{selected === q.correctAnswer ? '✓ Correct!' : selected === null ? '⏱ Time Up!' : '✗ Incorrect'}</span>
                <span className="correct-ans-label">Answer: <strong>{q.correctAnswer}</strong></span>
              </div>
              <p className="exp-text">{q.explanation}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="quiz-actions">
          {!revealed ? (
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={selected === null}
            >
              Submit Answer
            </button>
          ) : (
            <button className="next-btn" onClick={handleNext}>
              {currentIdx + 1 >= questions.length ? 'View Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
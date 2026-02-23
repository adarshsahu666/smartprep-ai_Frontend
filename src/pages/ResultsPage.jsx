import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance.jsx';
import '../CSS/ResultsPage.css';

export { ResultsPage };

function getRating(score) {
  if (score >= 90) return { label: 'Excellent!', color: '#00d4aa', emoji: '🏆' };
  if (score >= 70) return { label: 'Good Job!', color: '#22c55e', emoji: '⭐' };
  if (score >= 50) return { label: 'Needs Work', color: '#f59e0b', emoji: '📚' };
  return { label: 'Keep Practicing', color: '#ef4444', emoji: '💪' };
}

function ResultsPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [expanded, setExpanded] = useState(null);

  // ✅ useRef prevents the effect from firing more than once
  const hasFetched = useRef(false);

  const results = JSON.parse(sessionStorage.getItem('quizResults') || 'null');

  useEffect(() => {
    if (!results) {
      navigate('/');
      return;
    }
    // ✅ Guard: only fetch once per mount
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchFeedback();
  }, []); // ✅ Empty dependency array — runs only once on mount

  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const { data } = await axiosInstance.post('/performance', {
        sessionId: 'session_results_' + Date.now(),
        topic: results.topic,
        correct: String(results.correct),
        total: String(results.total),
        difficulty: results.difficulty,
        timePerQuestion: String(results.timePerQuestion),
      });
      setFeedback(data.feedback || '');
    } catch (e) {
      setFeedback('Unable to load AI feedback. Please try again later.');
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (!results) return null;

  const scorePercent = Math.round((results.correct / results.total) * 100);
  const rating = getRating(scorePercent);

  const renderFeedback = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} className="fb-heading">{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="fb-line">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="fb-item">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <p key={i} className="fb-numbered">{line}</p>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="fb-line">{line}</p>;
    });
  };

  return (
    <div className="results-page">
      <div className="results-bg">
        <div className="r-orb1" />
        <div className="r-orb2" />
      </div>

      <div className="results-content">
        {/* Score Hero */}
        <div className="score-hero">
          <div className="score-emoji">{rating.emoji}</div>
          <div className="score-ring-wrap">
            <svg viewBox="0 0 120 120" className="score-ring-svg">
              <circle cx="60" cy="60" r="54" className="ring-track" />
              <circle
                cx="60" cy="60" r="54"
                className="ring-fill"
                style={{
                  stroke: rating.color,
                  strokeDasharray: `${(scorePercent / 100) * 339.29} 339.29`,
                }}
              />
            </svg>
            <div className="score-inner">
              <span className="score-number">{scorePercent}<span className="score-pct">%</span></span>
              <span className="score-fraction">{results.correct}/{results.total}</span>
            </div>
          </div>
          <div className="rating-label" style={{ color: rating.color }}>{rating.label}</div>
          <div className="results-meta">
            <span className="meta-tag">{results.topic}</span>
            <span className="meta-tag">{results.difficulty}</span>
            <span className="meta-tag">{results.total} Questions</span>
          </div>
        </div>

        <div className="results-grid">
          {/* Question Review */}
          <div className="review-section">
            <h3 className="section-title">Question Review</h3>
            <div className="review-list">
              {results.answers.map((a, i) => (
                <div
                  key={i}
                  className={`review-item ${a.correct ? 'review-correct' : 'review-wrong'}`}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="review-row">
                    <span className="review-icon">{a.correct ? '✓' : '✗'}</span>
                    <span className="review-q">Q{i + 1}. {a.question.question}</span>
                    <span className="review-chevron">{expanded === i ? '▲' : '▼'}</span>
                  </div>
                  {expanded === i && (
                    <div className="review-details">
                      <p className="detail-row">
                        <span className="detail-label">Your Answer:</span>
                        <span className={`detail-val ${a.correct ? 'green' : 'red'}`}>
                          {a.chosen
                            ? `${a.chosen}: ${a.question.options[a.chosen]}`
                            : 'No answer (timed out)'}
                        </span>
                      </p>
                      {!a.correct && (
                        <p className="detail-row">
                          <span className="detail-label">Correct:</span>
                          <span className="detail-val green">
                            {a.question.correctAnswer}: {a.question.options[a.question.correctAnswer]}
                          </span>
                        </p>
                      )}
                      <p className="detail-explanation">{a.question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Feedback */}
          <div className="feedback-section">
            <h3 className="section-title">
              AI Performance Coach
              <span className="ai-badge">✨ AI</span>
            </h3>
            {loadingFeedback ? (
              <div className="fb-loading">
                <div className="loader-ring" />
                <p>Analyzing your performance...</p>
              </div>
            ) : (
              <div className="feedback-body">
                {renderFeedback(feedback)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="action-btn primary" onClick={() => navigate('/')}>
            New Quiz
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/chat')}>
            Ask AI Tutor →
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/HomePage.css';

const TOPICS = [
  'Java', 'Python', 'JavaScript', 'React', 'Spring Boot',
  'Data Structures', 'Algorithms', 'SQL', 'Machine Learning', 'Docker',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');

  // Filter suggestions based on search input
  const suggestions = searchValue.trim()
    ? TOPICS.filter(t => t.toLowerCase().includes(searchValue.toLowerCase()))
    : [];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    // If user types, treat that typed value as the selected topic
    setTopic(val.trim());
  };

  const handleChipClick = (t) => {
    setTopic(t);
    setSearchValue(t);
  };

  const handleSuggestionClick = (t) => {
    setTopic(t);
    setSearchValue(t);
    setSearchFocused(false);
  };

  const handleStart = () => {
    const finalTopic = topic.trim();
    if (!finalTopic) return;
    sessionStorage.setItem('quizConfig', JSON.stringify({ topic: finalTopic, count, difficulty }));
    navigate('/quiz');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchFocused(false);
      e.target.blur();
    }
  };

  return (
    <div className="home-page">
      <div className="home-bg">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-grid" />
      </div>

      <div className="home-content">
        <div className="hero-section">
          <div className="hero-badge">AI-Powered Learning</div>
          <h1 className="hero-title">
            Master Any Topic<br />
            <span className="hero-highlight">One Quiz at a Time</span>
          </h1>
          <p className="hero-sub">
            Generate intelligent MCQs, track your performance, and get personalized AI coaching.
          </p>
        </div>

        <div className="config-card">
          <h2 className="card-title">Configure Your Quiz</h2>

          {/* ── Search Bar ── */}
          <div className="form-group">
            <label className="form-label">Search or Type a Topic</label>
            <div className="search-wrap">
              <div className={`search-box ${searchFocused ? 'focused' : ''} ${topic ? 'has-value' : ''}`}>
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="e.g., Kubernetes, GraphQL, Java..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  onKeyDown={handleSearchKeyDown}
                />
                {searchValue && (
                  <button
                    className="search-clear"
                    onClick={() => { setSearchValue(''); setTopic(''); }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dropdown suggestions */}
              {searchFocused && suggestions.length > 0 && (
                <div className="search-dropdown">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      className="dropdown-item"
                      onMouseDown={() => handleSuggestionClick(s)}
                    >
                      <span className="dropdown-icon">⬡</span>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* No matches hint — show option to use typed value */}
              {searchFocused && searchValue.trim() && suggestions.length === 0 && (
                <div className="search-dropdown">
                  <div className="dropdown-custom">
                    <span className="dropdown-icon">✦</span>
                    Using custom topic: <strong>{searchValue.trim()}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Selected topic indicator */}
            {topic && (
              <div className="selected-topic-hint">
                Selected: <span className="selected-topic-name">{topic}</span>
              </div>
            )}
          </div>

          {/* ── Quick Pick Chips ── */}
          <div className="form-group">
            <label className="form-label">Quick Pick</label>
            <div className="topic-grid">
              {TOPICS.map(t => (
                <button
                  key={t}
                  className={`topic-chip ${topic === t ? 'selected' : ''}`}
                  onClick={() => handleChipClick(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Count + Difficulty ── */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Number of Questions</label>
              <div className="count-selector">
                {[5, 10, 15, 20].map(n => (
                  <button
                    key={n}
                    className={`count-btn ${count === n ? 'selected' : ''}`}
                    onClick={() => setCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <div className="diff-selector">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    className={`diff-btn diff-${d} ${difficulty === d ? 'selected' : ''}`}
                    onClick={() => setDifficulty(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className="start-btn"
            disabled={!topic.trim()}
            onClick={handleStart}
          >
            <span>Start Quiz</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        <div className="features-row">
          {[
            { icon: '🧠', title: 'AI-Generated', desc: 'Smart questions tailored to your topic' },
            { icon: '⚡', title: 'Instant Feedback', desc: 'Know what you got right immediately' },
            { icon: '📊', title: 'Performance Coach', desc: 'AI analyzes and guides your learning' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
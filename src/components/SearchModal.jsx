// src/components/SearchModal.jsx — POLISHED EDITION
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { categories } from '../assets/data';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate   = useNavigate();
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [selected, setSelected] = useState(-1);
  const inputRef   = useRef(null);
  const listRef    = useRef(null);

  const getAllProducts = () => {
    const all = [];
    categories.forEach(cat => {
      cat.products?.forEach(p => all.push({ ...p, category: cat.name }));
    });
    return all;
  };

  const runSearch = (q) => {
    if (q.length < 2) { setResults([]); return; }
    const term = q.toLowerCase().trim();
    const all  = getAllProducts();
    const matches = all.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.name.toLowerCase().replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))
    );
    setResults(matches.slice(0, 8));
    setSelected(-1);
  };

  const goTo = (product) => {
    navigate('/product', { state: { product } });
    onClose();
    setQuery('');
    setResults([]);
  };

  const handleKey = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(p => Math.min(p + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(p => Math.max(p - 1, -1)); }
    if (e.key === 'Enter' && selected >= 0) { e.preventDefault(); goTo(results[selected]); }
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (selected >= 0 && listRef.current) {
      listRef.current.children[selected]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selected]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
      setSelected(-1);
    }
  }, [isOpen]);

  const suggestions = ['T-Shirts', 'Shorts', 'Hats', 'Jackets', 'Tracksuits'];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="sm-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="sm-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sm-header">
          <div>
            <p className="sm-header__label">Search</p>
            <h2 className="sm-header__heading">Find what you're looking for</h2>
          </div>
          <button className="sm-close" onClick={onClose} aria-label="Close search">
            <FaTimes size={14} />
          </button>
        </div>

        {/* Input */}
        <div className="sm-input-wrap">
          <svg className="sm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); runSearch(e.target.value); }}
            onKeyDown={handleKey}
            placeholder="Search products, categories…"
            className="sm-input"
          />
          {query && (
            <button className="sm-input-clear" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}>
              <FaTimes size={11} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="sm-body">

          {/* Results */}
          {results.length > 0 && (
            <div ref={listRef} className="sm-results">
              {results.map((p, i) => (
                <div
                  key={i}
                  className={`sm-result ${i === selected ? 'sm-result--active' : ''}`}
                  onClick={() => goTo(p)}
                >
                  <div className="sm-result__img-wrap">
                    <img src={p.image} alt={p.name} className="sm-result__img" />
                  </div>
                  <div className="sm-result__detail">
                    <p className="sm-result__name">{p.name}</p>
                    <p className="sm-result__cat">{p.category}</p>
                  </div>
                  <p className="sm-result__price">R {p.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && results.length === 0 && (
            <div className="sm-empty">
              <p className="sm-empty__text">No results for "{query}"</p>
              <p className="sm-empty__hint">Try one of these:</p>
              <div className="sm-suggestions">
                {suggestions.map(s => (
                  <button
                    key={s}
                    className="sm-suggestion"
                    onClick={() => { setQuery(s); runSearch(s); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Initial state */}
          {query.length === 0 && (
            <div className="sm-idle">
              <p className="sm-idle__label">Popular</p>
              <div className="sm-suggestions sm-suggestions--idle">
                {suggestions.map(s => (
                  <button
                    key={s}
                    className="sm-suggestion"
                    onClick={() => { setQuery(s); runSearch(s); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Short query hint */}
          {query.length === 1 && (
            <p className="sm-hint">Type one more character…</p>
          )}

        </div>

        {/* Keyboard hint */}
        {results.length > 0 && (
          <div className="sm-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> select</span>
            <span><kbd>Esc</kbd> close</span>
          </div>
        )}

      </div>

      <style jsx>{`
        /* TOKENS */
        :root {
          --ink:        #1A1A1A;
          --ink-mid:    #555555;
          --ink-soft:   #999999;
          --paper:      #F7F5F2;
          --paper-dark: #EDEAE5;
          --border:     #E0DBD5;
          --white:      #FFFFFF;
        }

        /* BACKDROP */
        .sm-backdrop {
          position: fixed; inset: 0; z-index: 9100;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(3px);
          animation: sm-fade .2s ease;
        }
        @keyframes sm-fade { from { opacity: 0; } to { opacity: 1; } }

        /* PANEL */
        .sm-panel {
          position: fixed; top: 0; left: 50%; z-index: 9101;
          transform: translateX(-50%);
          width: 100%; max-width: 640px;
          max-height: 85vh;
          background: var(--white);
          display: flex; flex-direction: column;
          animation: sm-drop .3s cubic-bezier(.22,1,.36,1);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
        }
        @keyframes sm-drop { from { opacity: 0; transform: translateX(-50%) translateY(-16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @media (max-width: 680px) { .sm-panel { max-width: 100%; } }

        /* HEADER */
        .sm-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 28px 28px 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .sm-header__label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink-soft);
          border-bottom: 1px solid var(--border); padding-bottom: 6px;
          display: inline-block; margin-bottom: 10px;
        }
        .sm-header__heading {
          font-family: 'Georgia', serif;
          font-size: 20px; font-weight: 400; letter-spacing: -0.01em;
          color: var(--ink); margin: 0;
        }
        .sm-close {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: none; border: 1px solid var(--border); cursor: pointer;
          color: var(--ink-soft); transition: border-color .2s, color .2s;
          flex-shrink: 0; margin-top: 4px;
        }
        .sm-close:hover { border-color: var(--ink); color: var(--ink); }

        /* INPUT */
        .sm-input-wrap {
          position: relative; flex-shrink: 0;
          padding: 16px 28px;
          border-bottom: 1px solid var(--border);
        }
        .sm-input-icon {
          position: absolute; left: 42px; top: 50%; transform: translateY(-50%);
          width: 16px; height: 16px; color: var(--ink-soft); pointer-events: none;
        }
        .sm-input {
          width: 100%; padding: 12px 40px 12px 36px;
          border: 1px solid var(--border); background: var(--paper);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px; color: var(--ink); /* 16px = no iOS auto-zoom (this input auto-focuses) */
          outline: none; transition: border-color .2s;
        }
        .sm-input:focus { border-color: var(--ink); }
        .sm-input::placeholder { color: var(--ink-soft); }
        .sm-input-clear {
          position: absolute; right: 42px; top: 50%; transform: translateY(-50%);
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--paper-dark); border: none; cursor: pointer;
          color: var(--ink-soft); transition: background .2s;
        }
        .sm-input-clear:hover { background: var(--border); }

        /* BODY */
        .sm-body { flex: 1; overflow-y: auto; padding: 8px 0; min-height: 180px; }

        /* RESULTS */
        .sm-results { display: flex; flex-direction: column; }
        .sm-result {
          display: grid; grid-template-columns: 60px 1fr auto;
          gap: 14px; align-items: center;
          padding: 14px 28px;
          cursor: pointer;
          transition: background .15s;
          border-bottom: 1px solid var(--border);
        }
        .sm-result:last-child { border-bottom: none; }
        .sm-result:hover,
        .sm-result--active { background: var(--paper); }
        .sm-result__img-wrap {
          background: var(--paper-dark); border: 1px solid var(--border);
          aspect-ratio: 1; overflow: hidden;
        }
        .sm-result__img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sm-result__name {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
          color: var(--ink); margin: 0 0 3px; text-transform: uppercase;
        }
        .sm-result__cat {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; color: var(--ink-soft); letter-spacing: 0.1em;
          text-transform: uppercase; margin: 0;
        }
        .sm-result__price {
          font-family: 'Georgia', serif;
          font-size: 14px; color: var(--ink); white-space: nowrap;
        }

        /* EMPTY */
        .sm-empty {
          padding: 36px 28px; text-align: center;
        }
        .sm-empty__text {
          font-family: 'Georgia', serif;
          font-size: 16px; color: var(--ink-mid); margin: 0 0 16px;
        }
        .sm-empty__hint {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--ink-soft); margin: 0 0 14px;
        }

        /* IDLE */
        .sm-idle { padding: 28px 28px; }
        .sm-idle__label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink-soft);
          border-bottom: 1px solid var(--border); padding-bottom: 6px;
          display: inline-block; margin-bottom: 16px;
        }

        /* SUGGESTIONS */
        .sm-suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .sm-suggestions--idle { justify-content: flex-start; }
        .sm-suggestion {
          padding: 8px 16px;
          border: 1px solid var(--border); background: var(--paper);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink-mid);
          cursor: pointer; transition: border-color .2s, color .2s, background .2s;
        }
        .sm-suggestion:hover { border-color: var(--ink); color: var(--ink); background: var(--white); }

        /* HINT */
        .sm-hint {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; color: var(--ink-soft);
          padding: 24px 28px; margin: 0;
        }

        /* FOOTER */
        .sm-footer {
          display: flex; gap: 20px; justify-content: center;
          padding: 12px 28px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .sm-footer span {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; color: var(--ink-soft);
          display: flex; align-items: center; gap: 4px;
        }
        .sm-footer kbd {
          padding: 2px 6px;
          border: 1px solid var(--border);
          background: var(--paper); color: var(--ink-mid);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 9px; border-radius: 0;
        }
      `}</style>
    </>
  );
};

export default SearchModal;
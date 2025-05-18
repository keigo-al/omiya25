// src/pages/TopPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TopPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>スマホ表示メニュー</h1>
    <Link to="/" style={style}>通常表示</Link>
    <br />
    <Link to="/log" style={style}>ログ一覧</Link>
    <br />
    <Link to="/animations" style={style}>全アニメ再生</Link>
  </div>
);

const style = {
  display: 'inline-block',
  margin: '1rem',
  padding: '1rem 2rem',
  backgroundColor: '#eee',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '1.2rem'
};

export default TopPage;

// src/Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
        <Link to="/" style={style}>通常表示</Link>
        <Link to="/still" style={style}>静止画表示</Link>
        <Link to="/animations" style={style}>全アニメ</Link>
      </nav>
      <Outlet />
    </div>
  );
};

const style = {
  marginRight: '1rem',
  textDecoration: 'none',
  color: '#333',
};

export default Layout;

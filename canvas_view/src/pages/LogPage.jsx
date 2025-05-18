// === LogPage.jsx ===
import React, { useEffect, useState } from 'react';

const LogPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/get_sketches')
      .then(res => res.json())
      .then(setLogs)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>ログ一覧</h1>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            ID: {log.id} / {new Date(log.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogPage;


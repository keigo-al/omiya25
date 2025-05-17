import React, { useEffect, useState } from 'react';
import Canvas from './Canvas';

const App = () => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/get_all_sketch_lines')
      .then(res => res.json())
      .then(data => setLines(data))
      .catch(err => console.error("全描画データの取得に失敗:", err));
  }, []);

  return (
    <div>
      <h1>全スケッチ描画</h1>
      <Canvas lines={lines} />
    </div>
  );
};

export default App;

// src/pages/StillPage.jsx
import React, { useEffect, useState } from 'react';
import CanvasLayered from '../components/CanvasLayered';

const StillPage = () => {
  const [sketches, setSketches] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/get_all_sketch_lines')
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(line => {
          const id = line.sketch_id;
          if (!grouped[id]) grouped[id] = [];
          grouped[id].push(line);
        });

        const sketchList = Object.keys(grouped).map(id => ({
          sketch_id: id,
          lines: grouped[id],
          animate: false // すべて静止画
        }));

        setSketches(sketchList);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>静止画のみ表示</h1>
      <CanvasLayered sketches={sketches} />
    </div>
  );
};

export default StillPage;

// === HomePage.jsx ===
import React, { useEffect, useState } from 'react';
import CanvasLayered from '../components/CanvasLayered';

const HomePage = () => {
  const [sketches, setSketches] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  useEffect(() => {
    let timeoutId;
    const fetchLines = () => {
      fetch('http://localhost:5000/api/get_all_sketch_lines')
        .then(res => res.json())
        .then(data => {
          const grouped = {};
          data.forEach(line => {
            const id = line.sketch_id;
            if (!grouped[id]) grouped[id] = [];
            grouped[id].push(line);
          });
          const sortedIds = Object.keys(grouped).map(Number).sort((a, b) => b - a).slice(0, 30);
          const sketchList = sortedIds.map((id, index) => ({
            sketch_id: id,
            lines: grouped[id],
            animate: index < 10
          }));
          setSketches(sketchList);
          timeoutId = setTimeout(() => setTriggerUpdate(prev => prev + 1), 5000);
        })
        .catch(err => {
          console.error("取得失敗:", err);
          timeoutId = setTimeout(() => setTriggerUpdate(prev => prev + 1), 5000);
        });
    };
    fetchLines();
    return () => clearTimeout(timeoutId);
  }, [triggerUpdate]);

  return (
    <div>
      <h1>展示と同じ表示</h1>
      <CanvasLayered sketches={sketches} />
    </div>
  );
};

export default HomePage;


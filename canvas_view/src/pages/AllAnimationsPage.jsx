// === AllAnimationsPage.jsx ===
import React, { useEffect, useState } from 'react';
import Canvas from '../components/Canvas';

const AllAnimationsPage = () => {
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
          animate: true
        }));
        setSketches(sketchList);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        position: 'relative',
        backgroundColor: '#fff8dc',
        border: '12px solid #8b5e3c',
        padding: '0px',
        boxSizing: 'content-box',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        width: 800,
        height: 600
      }}>
        <Canvas sketches={sketches} />
      </div>
    </div>
  );
};

export default AllAnimationsPage;

import React, { useEffect, useState } from 'react';
import Canvas from './Canvas';

const App = () => {
  const [lines, setLines] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(0); // 更新トリガー用

  useEffect(() => {
    let timeoutId;

    const fetchLines = () => {
      fetch('http://localhost:5000/api/get_all_sketch_lines')
        .then(res => res.json())
        .then(data => {
          setLines(data);

          // 描画時間 + 余白（例えば2秒後）に次回実行を予約
          timeoutId = setTimeout(() => {
            setTriggerUpdate(prev => prev + 1); // 次の fetch トリガー
          }, 5000); // 5秒待って次の取得
        })
        .catch(err => {
          console.error("取得失敗:", err);
          // エラー時も少し待ってリトライ
          timeoutId = setTimeout(() => {
            setTriggerUpdate(prev => prev + 1);
          }, 5000);
        });
    };

    fetchLines();

    // クリーンアップ（画面が切り替わった時など）
    return () => clearTimeout(timeoutId);
  }, [triggerUpdate]); // ← ここがポイント：描画完了→次の fetch を制御

  return (
    <div>
      <h1>再生付きスケッチ（間隔制御）</h1>
      <Canvas lines={lines} />
    </div>
  );
};

export default App;

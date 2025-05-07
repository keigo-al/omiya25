import React,{ useEffect, useState } from 'react';
import Canvas from './Canvas';

const App = () => {
  const[posts, setPosts] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:3001/api/drawings')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error fetching drawings:",err));
  },[]);

  return(
    <div>
      <h1>キャンバス表示</h1>
      <Canvas posts = {posts}/>
    </div>
  );
};


export default App;
import React from "react";
import PostForm from "./components/PostForm"; // PostForm.jsx を読み込む

function App() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">お絵かき投稿</h1>
      <PostForm />
    </div>
  );
}

export default App;

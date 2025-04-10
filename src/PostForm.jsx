import React, { useState} from 'react';

function PostForm(){
  const[text, setText] = useState("");
  const[posts, setPosts] = useState([]);

  const handleSubmit = (e) =>{
    e.preventDefault();
    if (text.trim()==='') return;
  
    const newPost = {
      id: Date.now(),
      content: text,
    };
    setPosts([newPost, ...posts]);
    setText('');
  };

  return(
    <div className = "p-4 max-w-md mx-auto">
      <form onSubmit = {handleSubmit} className = "space-y-2">
        <textarea
          className = "w-full p-2 border rounded"
          placeholder = "write something"
          value = {text}
          onChange = {(e) => setText(e.target.value)}
        />
        <button 
          className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          type = "submit"
        >
          投稿
        </button> 
      </form>

      <div className = "mt-6 space-y-2">
        {posts.map((post) => (
          <div key = {post.id} className = "p-3 border rounded bg-gray-50">
            {post.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostForm;

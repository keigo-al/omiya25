export const sendPostToServer = async(postData) => {//外から使えるようにexport，asyncは非同期処理
  const response = await fetch("https://example.com/api/posts",{//await　サーバからの返事を待つ
    method: "POST",
    headers: {
      "Content-Type":"application/json",
    },
    body: JSON.stringify(postData),
  });

  if(!response.ok){
    throw new Error("サーバへの送信に失敗しました");
  }

  return await response.json();//オブジェクトとして取り出す
};

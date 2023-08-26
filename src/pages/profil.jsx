import React, { useState } from 'react';
import '../sass/Profile.scss';

function Profil() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() !== '') {
      setPosts([...posts, { content: newPost, likes: 0 , dislikes: 0 }]);
      setNewPost('');
    }
  };

  const handleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes += 1;
    setPosts(updatedPosts);
  };

  const handleDislike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].dislikes += 1;
    setPosts(updatedPosts);
  };

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <img className='profile-cover' src='https://placekitten.com/1500/300' alt='Cover' />
        <img className='profile-picture' src='https://placekitten.com/200/200' alt='Profile' />
        <div className='profile-info'>
          <h1>John Doe</h1>
          <p>Web Developer</p>
        </div>
      </div>
      <div className='profile-content'>
        <div className='post-form'>
          <textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button onClick={handlePostSubmit}>Post</button>
        </div>
        <div className='posts'>
          {posts.map((post, index) => (
            <div key={index} className='post'>
              <p>{post.content}</p>
              <div className='post-actions'>
                <button onClick={() => handleLike(index)}>
                  <span role='img' aria-label='Like'>👍</span> {post.likes}
                </button>
                <button onClick={() => handleDislike(index)}>
                  <span role='img' aria-label='Dislike'>👎</span> {post.dislikes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profil;

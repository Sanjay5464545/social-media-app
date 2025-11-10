import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, createPost, likePost, commentOnPost } from '../services/api';
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content && !newPost.imageUrl) {
      alert('Please add content or image URL');
      return;
    }

    setLoading(true);
    try {
      await createPost(newPost);
      setNewPost({ content: '', imageUrl: '' });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchPosts(); // Refresh to show updated likes
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    try {
      await commentOnPost(postId, text);
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  return (
    <div className="feed-container">
      {/* Header */}
      <header className="feed-header">
        <h1>Social Feed</h1>
        <div className="header-right">
          <span>Welcome, {currentUser?.username}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      {/* Create Post Section */}
      <div className="create-post-section">
        <h2>Create Post</h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows="4"
          />
         <input
  type="text"
  placeholder="Image URL (optional) - e.g., https://i.imgur.com/abc.jpg"
  value={newPost.imageUrl}
  onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
/>
<small style={{display: 'block', color: '#666', fontSize: '13px', marginTop: '5px'}}>
  💡 Tip: Upload image to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" style={{color: '#667eea'}}>Imgur</a> and paste link here
</small>

          <button type="submit" className="btn-post" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        <h2>Recent Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-user">
                  <div className="user-avatar">
                    {post.userId?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="username">{post.userId?.username || 'Unknown User'}</span>
                </div>
                <span className="post-time">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="post-content">
                {post.content && <p>{post.content}</p>}
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post" className="post-image" />
                )}
              </div>

              <div className="post-actions">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`btn-action ${post.likes?.some(like => like._id === currentUser?.id) ? 'liked' : ''}`}
                >
                  ❤️ {post.likes?.length || 0}
                </button>
                <button 
                  onClick={() => toggleComments(post._id)}
                  className="btn-action"
                >
                  💬 {post.comments?.length || 0}
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {post.comments?.map((comment, index) => (
                      <div key={index} className="comment">
                        <strong>{comment.userId?.username || 'Unknown'}:</strong>
                        <span>{comment.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText({
                        ...commentText,
                        [post._id]: e.target.value
                      })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleComment(post._id);
                      }}
                    />
                    <button onClick={() => handleComment(post._id)}>Send</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;

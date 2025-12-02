import { MessageCircle, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

// Helper function to format date (simple)
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(false); // TODO: Sync with Backend

  // Check if the post belongs to the current user to show the delete button
  const isMyPost = user?.username === post.author.username;

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.delete(`/api/posts/${post.id}/like`);
        setLikes((prev) => prev - 1);
      } else {
        await axios.post(`/api/posts/${post.id}/like`);
        setLikes((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking the post', error);
    }
  };

  return (
    <div className="border-b border-spotter-border p-4 hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* AVATAR */}
        <div className="shrink-0">
          <img
            src={post.author.avatarUrl}
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Post Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold text-spotter-text">
                {post.author.username}
              </span>
              <span className="text-spotter-textGray">
                @{post.author.username}
              </span>
              <span className="text-spotter-textGray">·</span>
              <span className="text-spotter-textGray hover:underline">
                {formatDate(post.createdAt)}
              </span>
            </div>

            {/* Delete Button (Only if it's my post) */}
            {isMyPost && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent clicking delete from opening the post
                  onDelete(post.id);
                }}
                className="text-spotter-textGray hover:text-spotter-red p-1 rounded-full hover:bg-spotter-red/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Post Text */}
          <Link to={`/post/${post.id}`}>
            <p className="mt-1 text-spotter-text text-base whitespace-pre-wrap">
              {post.content}
            </p>
          </Link>

          {/* Action Footer (Likes, Comments) */}
          <div className="flex items-center gap-10 mt-3 text-spotter-textGray">
            {/* Comments */}
            <div className="flex items-center gap-2 group cursor-pointer hover:text-spotter-blue transition-colors">
              <div className="p-2 rounded-full group-hover:bg-spotter-blue/10">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{post._count?.children || 0}</span>
            </div>

            {/* Likes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-2 group transition-colors ${
                isLiked ? 'text-spotter-red' : 'hover:text-spotter-red'
              }`}
            >
              <div className={`p-2 rounded-full group-hover:bg-spotter-red/10`}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

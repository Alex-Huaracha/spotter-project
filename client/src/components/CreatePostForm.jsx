import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export const CreatePostForm = ({
  onPostCreated,
  parentId = null,
  placeholder,
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = watch('content', '');
  const charCount = content.length;
  const isOverLimit = charCount > 280;

  const onSubmit = async (data) => {
    if (isOverLimit) return;
    setIsSubmitting(true);
    try {
      await axios.post('/api/posts', { ...data, parentId });
      reset();
      if (onPostCreated) onPostCreated(); // Notify parent to reload the feed
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-b border-spotter-border p-4 flex gap-4">
      {/* Current user's avatar */}
      <img
        src={user?.avatarUrl || 'https://i.imgur.com/6VBx3io.png'}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        <textarea
          {...register('content', { required: true })}
          placeholder={placeholder || "What's happening at the gym?"}
          rows="2"
          className="w-full bg-transparent text-xl text-spotter-text placeholder-spotter-textGray border-none focus:ring-0 resize-none outline-none"
        ></textarea>

        <div className="flex justify-between items-center mt-3 border-t border-spotter-border pt-3">
          {/* Character counter */}
          <span
            className={`text-xs ${
              isOverLimit ? 'text-spotter-red' : 'text-spotter-blue'
            }`}
          >
            {charCount}/280
          </span>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting || isOverLimit}
            className="bg-spotter-blue hover:bg-spotter-blueHover disabled:opacity-50 text-white font-bold py-1.5 px-4 rounded-full transition-colors"
          >
            {isSubmitting ? 'Sending...' : parentId ? 'Reply' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

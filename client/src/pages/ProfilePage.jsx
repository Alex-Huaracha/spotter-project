import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PostCard } from '../components/PostCard';
import { ProfileHeader } from '../components/ProfileHeader';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRes = await axios.get(`/api/users/${username}`);
        setProfileUser(userRes.data);

        const postsRes = await axios.get(`/api/users/${username}/posts`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [username]);

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-spotter-red">User not found 🤷‍♂️</div>
    );

  return (
    <div className="min-h-screen pb-20">
      {/* Header Sticky */}
      <div className="sticky top-0 bg-spotter-base/80 backdrop-blur-md border-b border-spotter-border px-4 py-3 z-10 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-spotter-dark rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-xl leading-none">
            {profileUser.username}
          </h1>
          <span className="text-xs text-spotter-textGray">
            {posts.length} posts
          </span>
        </div>
      </div>

      <ProfileHeader profileUser={profileUser} />

      {/* Post List */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={() => {}} />
        ))
      ) : (
        <div className="p-8 text-center text-spotter-textGray">
          @{profileUser.username} hasn't posted anything yet.
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

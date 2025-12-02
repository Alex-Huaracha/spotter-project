import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export const WhoToFollow = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get('/api/users/suggestions');
        setUsers(res.data);
      } catch (error) {
        console.error('Error loading suggestions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading)
    return (
      <div className="text-sm text-spotter-textGray">
        Looking for gym buddies...
      </div>
    );
  if (users.length === 0) return null; // If you follow everyone, show nothing

  return (
    <div className="bg-spotter-dark rounded-xl p-4 sticky top-4 border border-spotter-border">
      <h2 className="font-bold text-xl mb-4 text-spotter-text">
        Who to follow
      </h2>

      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            {/* User Info */}
            <Link
              to={`/u/${user.username}`}
              className="flex items-center gap-2 group min-w-0"
            >
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="truncate">
                <p className="font-bold text-sm group-hover:underline truncate">
                  {user.username}
                </p>
                <p className="text-xs text-spotter-textGray truncate">
                  {user.gymGoals || 'Gymrat'}
                </p>
              </div>
            </Link>

            {/* Go to Profile Button (Simplified) */}
            <Link
              to={`/u/${user.username}`}
              className="bg-white text-black p-2 rounded-full hover:bg-white/90 transition-colors"
              title="View profile"
            >
              <UserPlus className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

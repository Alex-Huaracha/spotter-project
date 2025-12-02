import { Calendar, Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

export const ProfileHeader = ({ profileUser }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    profileUser.isFollowedByMe || false
  );
  const [followersCount, setFollowersCount] = useState(
    profileUser._count.followedBy
  );

  const isMe = currentUser?.username === profileUser.username;

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/api/users/${profileUser.id}/follow`);
        setFollowersCount((prev) => prev - 1);
      } else {
        await axios.post(`/api/users/${profileUser.id}/follow`);
        setFollowersCount((prev) => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 border-b border-spotter-border">
      {/* Cover (Gray for now) */}
      <div className="h-32 bg-spotter-border rounded-lg -mb-10"></div>

      {/* Main Info */}
      <div className="flex justify-between items-end px-4">
        {/* Avatar */}
        <img
          src={profileUser.avatarUrl}
          alt={profileUser.username}
          className="w-24 h-24 rounded-full border-4 border-black object-cover"
        />

        {/* Action Button */}
        {isMe ? (
          <button className="border border-spotter-border text-spotter-text font-bold py-1.5 px-4 rounded-full hover:bg-white/10 transition-colors">
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleFollowToggle}
            className={`font-bold py-1.5 px-6 rounded-full transition-colors ${
              isFollowing
                ? 'border border-spotter-red text-spotter-red hover:bg-spotter-red/10'
                : 'bg-spotter-text text-black hover:bg-white/90'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className="mt-3 px-1">
        <h2 className="font-bold text-xl leading-tight">
          {profileUser.username}
        </h2>
        <p className="text-spotter-textGray text-sm">@{profileUser.username}</p>

        <p className="mt-3 text-base">
          {profileUser.bio || 'No bio available...'}
        </p>

        {/* Metadata (Level, Goals) */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-spotter-textGray text-sm">
          {profileUser.gymGoals && (
            <div className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              <span>Goal: {profileUser.gymGoals}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Joined on {new Date(profileUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Counters */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-spotter-text">
              {profileUser._count.following}
            </span>
            <span className="text-spotter-textGray ml-1">Following</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-spotter-text">
              {followersCount}
            </span>
            <span className="text-spotter-textGray ml-1">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

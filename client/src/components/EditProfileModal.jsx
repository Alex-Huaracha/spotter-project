import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';
import axios from 'axios';
import { useState } from 'react';

export const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const { updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: currentUser.bio || '',
      gymGoals: currentUser.gymGoals || '',
      avatarUrl: currentUser.avatarUrl || '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const res = await axios.patch('/api/users/profile', data);
      const updatedUser = res.data.user;

      updateUser(updatedUser);

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      onClose();
    } catch (error) {
      console.error(error);
      setApiError(error.response?.data?.message || 'Error saving changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className="bg-spotter-red/20 text-spotter-red p-3 rounded text-sm text-center">
            {apiError}
          </div>
        )}

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-bold text-spotter-textGray mb-1">
            Profile Picture (URL)
          </label>
          <input
            type="text"
            {...register('avatarUrl')}
            className="w-full bg-spotter-dark border border-spotter-border rounded-lg p-3 text-white focus:border-spotter-blue outline-none"
            placeholder="https://..."
          />
          <p className="text-xs text-spotter-textGray mt-1">
            Currently, we only support image URLs.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-bold text-spotter-textGray mb-1">
            Bio
          </label>
          <textarea
            {...register('bio', { maxLength: 160 })}
            className="w-full bg-spotter-dark border border-spotter-border rounded-lg p-3 text-white focus:border-spotter-blue outline-none resize-none"
            rows="3"
            placeholder="Tell us about yourself..."
          ></textarea>
          {errors.bio && (
            <p className="text-spotter-red text-xs">Maximum 160 characters</p>
          )}
        </div>

        {/* Gym Goals */}
        <div>
          <label className="block text-sm font-bold text-spotter-textGray mb-1">
            Fitness Goal
          </label>
          <select
            {...register('gymGoals')}
            className="w-full bg-spotter-dark border border-spotter-border rounded-lg p-3 text-white focus:border-spotter-blue outline-none appearance-none"
          >
            <option value="">Select a goal...</option>
            <option value="Hypertrophy">Hypertrophy (Muscle Mass)</option>
            <option value="Strength">Strength (Powerlifting)</option>
            <option value="Fat Loss">Fat Loss</option>
            <option value="Endurance">Endurance / Cardio</option>
            <option value="Calisthenics">Calisthenics</option>
            <option value="Crossfit">Crossfit</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-spotter-text text-black font-bold py-3 rounded-full hover:bg-white/90 transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
};

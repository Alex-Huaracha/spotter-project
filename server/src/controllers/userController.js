import { prisma } from '../../prisma/client.js';

export const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id; // ME (The logged-in user)
    const followingId = req.params.id; // THE OTHER (The user I want to follow)

    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ message: 'You are already following this user.' });
    }

    await prisma.follows.create({
      data: {
        followerId,
        followingId,
      },
    });

    res
      .status(200)
      .json({ message: `You are now following ${targetUser.username}` });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    try {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId, // Me
            followingId, // The user I want to unfollow
          },
        },
      });

      res.status(200).json({ message: 'You have unfollowed the user.' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res
          .status(400)
          .json({ message: 'You are not following this user.' });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        gymGoals: true,
        avatarUrl: true,
        _count: {
          select: {
            followedBy: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

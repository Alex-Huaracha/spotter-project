import { prisma } from '../../prisma/client.js';

export const createPost = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;
    const authorId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content cannot be empty' });
    }

    if (content.length > 280) {
      return res
        .status(400)
        .json({ message: 'You exceeded 280 characters, gymbro.' });
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        authorId,
        parentId: parentId || null, // If null, it's a normal post; if it has an ID, it's a reply
      },
      include: {
        author: {
          select: { username: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    // Convert the array of objects to a simple array of IDs
    // From [{ followingId: "id1" }, { followingId: "id2" }] to ["id1", "id2"]
    const followingIdsList = following.map((f) => f.followingId);

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...followingIdsList, userId], // Include my own posts
        },
        parentId: null, // Only main posts (no loose comments) in the feed
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // Basic pagination
      include: {
        author: {
          select: { username: true, avatarUrl: true, gymGoals: true },
        },
        _count: {
          select: { likes: true, children: true }, // Count likes and replies
        },
      },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

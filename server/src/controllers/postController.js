import { prisma } from '../../prisma/client.js';
import { createPostSchema } from '../schemas/postSchema.js';

export const createPost = async (req, res, next) => {
  try {
    const validatedData = createPostSchema.parse(req.body);

    const { content, parentId } = validatedData;
    const authorId = req.user.id;

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

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params; // Comes from the URL: /api/posts/:id
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this post' });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post successfully deleted' });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content cannot be empty' });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to edit this post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
      include: {
        author: { select: { username: true, avatarUrl: true } },
      },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { username: true, avatarUrl: true, gymGoals: true },
        },
        _count: {
          select: { likes: true, children: true },
        },
        children: {
          orderBy: { createdAt: 'asc' }, // Older comments first (forum style)
          include: {
            author: {
              select: { username: true, avatarUrl: true },
            },
            _count: {
              select: { likes: true },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

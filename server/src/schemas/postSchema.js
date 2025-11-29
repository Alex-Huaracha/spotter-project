import { z } from 'zod';

export const createPostSchema = z
  .object({
    content: z
      .string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string',
      })
      .min(1, 'The post cannot be empty')
      .max(280, 'You exceeded the 280-character limit'), // Twitter rule

    // parentId is optional, but if provided, MUST be a UUID string
    parentId: z.uuid({ message: 'Parent ID must be a valid UUID' }).optional(),
  })
  .strict();

import { z } from 'zod';

export const UserProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, { error: 'First name is too short' })
    .max(50, { error: 'First name is too long' })
    .nullable(),
  last_name: z
    .string()
    .trim()
    .min(2, { error: 'Last name is too short' })
    .max(50, { error: 'Last name is too long' })
    .nullable(),
  email: z.email({ error: 'Enter a valid email address' }).nullable(),
  avatar_file: z.optional(
    z.file().refine(
      (file) => {
        if (file === null || file === undefined || typeof file === 'string')
          return true;
        return (
          file.size <= 5 * 1024 * 1024 &&
          ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
            file.type
          )
        );
      },
      {
        message:
          'Avatar must be an image file (jpeg, png, gif, webp) and less than 5MB',
      }
    )
  ),
});

export type UserProfileFormValues = z.infer<typeof UserProfileSchema>;

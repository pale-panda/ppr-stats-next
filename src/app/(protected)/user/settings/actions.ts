'use server';

import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { UserProfileFormValues } from '@/schemas/user.schema';
import { UserDAL } from '@/db/user.dal';
import { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const db: SupabaseClient = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

export async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  const db: SupabaseClient = await createClient();

  const userProfile = await UserDAL.getUserProfileById(db, user.id);
  return userProfile;
}

export async function deleteUserAvatar(url: string) {
  const user = await getCurrentUser();
  const db: SupabaseClient = await createClient();

  const avatarPath = url.split('/avatars/')[1].split('?')[0];
  const { error } = await db.storage.from('avatars').remove([avatarPath]);
  if (error) throw error;

  await UserDAL.updateUserProfile(db, user.id, {
    avatar_url: null,
  });

  const updatedUser = await UserDAL.updateUserMetadata(db, {
    avatar_url: null,
  });

  if (!updatedUser) throw new Error('Failed to update user metadata');

  revalidateTag(`user-profile-${user.id}`, 'max');
  return { success: true };
}

export async function updateUserProfile(values: UserProfileFormValues) {
  const user = await getCurrentUser();
  const db: SupabaseClient = await createClient();

  const userProfile = await UserDAL.getUserProfileById(db, user.id);

  const parsedData = {
    email: values.email || userProfile.email,
    first_name: values.first_name || undefined,
    last_name: values.last_name || undefined,
    avatar_file: values.avatar_file,
    avatar_url: userProfile.avatar_url,
  };

  const input = parsedData;
  const inputMutable = { ...parsedData };

  Object.keys(inputMutable).forEach((key) => {
    if (inputMutable[key as keyof UserProfileFormValues] === null) {
      delete inputMutable[key as keyof UserProfileFormValues];
    }
  });

  const { avatar_file } = input;

  let avatarUrl = userProfile.avatar_url;
  if (avatar_file) {
    const fileExt = avatar_file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await db.storage
      .from('avatars')
      .upload(filePath, avatar_file, {
        cacheControl: '3600',
        upsert: true,
        contentType: avatar_file.type,
      });
    if (uploadError) throw uploadError;

    const { data } = db.storage
      .from('avatars')
      .getPublicUrl(uploadData.path || '');
    if (!data.publicUrl) throw new Error('Failed to get public URL for avatar');

    avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
  }

  const profileUpdate = {
    ...userProfile,
    ...inputMutable,
    avatar_url: avatarUrl,
  };

  await UserDAL.updateUserProfile(db, user.id, {
    email: profileUpdate.email,
    first_name: profileUpdate.first_name,
    last_name: profileUpdate.last_name,
    avatar_url: avatarUrl,
  });

  const updatedMetadata = {
    first_name: profileUpdate.first_name,
    last_name: profileUpdate.last_name,
    full_name:
      [profileUpdate.first_name, profileUpdate.last_name]
        .filter(Boolean)
        .join(' ') || undefined,
    avatar_url: avatarUrl,
  };

  const updatedUser = await UserDAL.updateUserMetadata(db, updatedMetadata);

  if (!updatedUser) throw new Error('Failed to update user metadata');

  revalidateTag(`user-profile-${user.id}`, 'max');

  return {
    success: true,
    user: updatedUser,
  };
}

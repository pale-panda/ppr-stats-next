'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { createClient } from '@/lib/supabase/client';
import { setUser } from '@/state/reducers/user/user.reducer';
import { AppDispatch } from '@/state/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { type User } from '@supabase/supabase-js';
import { XCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const accountFormSchema = z.object({
  first_name: z.string().trim().max(50, 'First name is too long').nullable(),
  last_name: z.string().trim().max(50, 'Last name is too long').nullable(),
  avatar_file: z
    .instanceof(File || null, { message: 'Avatar must be a file' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      'Avatar file size must be less than 5MB'
    )
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          file.type
        ),
      'Unsupported file type'
    )
    .nullable(),
  avatar_url: z.string().max(2048, 'URL is too long').nullable(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { refresh } = useRouter();

  const initials = useMemo(() => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    if (!fullName) return '';
    return fullName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }, [firstName, lastName]);

  const getProfile = useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, last_name, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      throw new Error('Error loading user data!', { cause: error as Error });
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarFile]);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      first_name: firstName ?? '',
      last_name: lastName ?? '',
      avatar_file: null,
      avatar_url: avatarUrl ?? '',
    },
    mode: 'onTouched',
  });

  const deleteStoredAvatar = async (url: string) => {
    const avatarPath = url.split('/avatars/')[1].split('?')[0];
    const { error } = await supabase.storage
      .from('avatars')
      .remove([avatarPath]);
    if (error) throw error;
  };

  const handleDeleteAvatar = async () => {
    if (!user?.id || !avatarUrl) return;
    try {
      setLoading(true);

      await deleteStoredAvatar(avatarUrl);

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      });
      if (upsertError) throw upsertError;

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      });
      if (authError) throw authError;

      setAvatarUrl(null);
      form.setValue('avatar_url', null, { shouldDirty: false });
      toast.success('Avatar deleted successfully');
      refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: AccountFormValues) => {
    try {
      setLoading(true);

      if (avatarPreviewUrl && avatarUrl) {
        await deleteStoredAvatar(avatarUrl);
      }

      let nextAvatarUrl = values.avatar_url || avatarUrl;
      const nextAvatarFile = values.avatar_file || avatarFile;
      const nextFirstName = values.first_name || firstName;
      const nextLastName = values.last_name || lastName;
      const nextFullName =
        `${nextFirstName || ''} ${nextLastName || ''}`.trim() || null;

      if (nextAvatarFile && user?.id) {
        const fileExt =
          nextAvatarFile.name.split('.').pop()?.toLowerCase() || 'png';
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, nextAvatarFile, {
            upsert: true,
            contentType: nextAvatarFile.type || undefined,
          });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        if (!data.publicUrl) throw new Error('Failed to generate avatar URL');
        nextAvatarUrl = `${data.publicUrl}?t=${Date.now()}`;
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        first_name: nextFirstName,
        last_name: nextLastName,
        avatar_url: nextAvatarUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      const {
        data: { user: updatedUser },
        error: authError,
      } = await supabase.auth.updateUser({
        data: {
          first_name: nextFirstName,
          last_name: nextLastName,
          full_name: nextFullName,
          avatar_url: nextAvatarUrl,
        },
      });
      if (authError) throw authError;

      if (typeof nextAvatarUrl === 'string') {
        setAvatarUrl(nextAvatarUrl);
        form.setValue('avatar_url', nextAvatarUrl, { shouldDirty: false });
      }

      if (updatedUser) {
        dispatch(setUser(updatedUser));
      }

      toast.success('Profile updated successfully');
      refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      form.reset();
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className='max-w-lg mx-auto p-0'>
        <CardContent className='p-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className='space-y-6'>
              <div className='flex flex-col items-center gap-2 text-center pb-3'>
                <h1 className='text-2xl font-bold'>Update your account</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                  Enter your details below to update your account
                </p>
              </div>

              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Avatar className='size-24 rounded-xl border border-border bg-muted'>
                    <AvatarImage
                      src={avatarPreviewUrl ?? avatarUrl ?? undefined}
                      alt={initials}
                    />
                    <AvatarFallback className='rounded-lg'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {avatarUrl && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          className='absolute -top-1.5 -left-1.5 border-0 rounded-full cursor-pointer size-4 text-foreground hover:text-foreground/80 bg-background/70 hover:bg-background'
                          onClick={handleDeleteAvatar}>
                          <XCircleIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        Delete current avatar
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name='avatar_file'
                  render={({ field: { ref, name, onBlur, onChange } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            type='file'
                            ref={ref}
                            accept='image/*'
                            name={name}
                            onBlur={onBlur}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setAvatarFile(file ? file : null);
                              onChange(file ? file : null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='text'
                        placeholder='First Name'
                        value={field.value || firstName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='text'
                        placeholder='Last Name'
                        value={field.value || lastName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='avatar_url'
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <FormLabel className='hidden'>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='hidden'
                        placeholder='Avatar URL'
                        value={field.value || avatarUrl || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={loading}
                className='cursor-pointer'>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

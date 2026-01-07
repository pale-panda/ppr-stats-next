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
import type { User } from '@supabase/supabase-js';
import { XCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  UserProfileFormValues,
  UserProfileSchema,
} from '@/schemas/user.schema';
import { z } from 'zod';

interface AccountFormProps {
  user: User | null;
  onDeleteAvatar: (url: string) => Promise<{ success: boolean }>;
  onUpdateProfile: (
    values: UserProfileFormValues
  ) => Promise<{ success: boolean; user?: User | null }>;
}

export default function AccountForm({
  user,
  onDeleteAvatar,
  onUpdateProfile,
}: AccountFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
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
        .select(`email, first_name, last_name, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setEmail(data.email);
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
  }, [avatarFile, refresh]);

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      first_name: firstName || null,
      last_name: lastName || null,
      avatar_file: undefined,
      email: email || null,
    },
    mode: 'onTouched',
  });

  const handleDeleteAvatar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user?.id || !avatarUrl) return;
    try {
      const { success } = await onDeleteAvatar(avatarUrl);
      if (!success) throw new Error('Failed to delete avatar');

      setAvatarUrl(null);
      return toast.success('Avatar deleted successfully');
    } catch (error: unknown) {
      return toast.error(
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  };

  const handleUpdateUserProfile = async (values: UserProfileFormValues) => {
    try {
      setLoading(true);
      const valuesParsed = await UserProfileSchema.safeParseAsync(values);
      if (!valuesParsed.success) {
        throw new Error(z.prettifyError(valuesParsed.error));
      }

      const res = await onUpdateProfile(valuesParsed.data);
      if (!res || !res.success || !res.user) {
        throw new Error('Failed to update profile');
      }

      const { user: updatedUser } = res;

      dispatch(setUser(updatedUser));

      return toast.success('Profile updated successfully');
    } catch (error: unknown) {
      return toast.error(
        error instanceof Error ? error.message : 'An error occurred'
      );
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
              onSubmit={form.handleSubmit(handleUpdateUserProfile)}
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            type='file'
                            accept='image/*'
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const file = e.target.files[0];
                                setAvatarFile(file);
                                field.onChange(file);
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2'>
                <div className='flex flex-col md:flex-row items-center justify-center md:gap-4 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='py-2 w-full'>
                        <FormLabel className='text-muted-foreground'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={String(field.value ?? email ?? '')}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <span className='py-2 w-full text-xs text-muted-foreground'>
                    Changing your email address is currently disabled. and will
                    require email verification.
                  </span>
                </div>
                <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='first_name'
                    render={({ field }) => (
                      <FormItem className='py-2 w-full'>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={String(field.value ?? firstName ?? '')}
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
                      <FormItem className='py-2 w-full'>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={String(field.value ?? lastName ?? '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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

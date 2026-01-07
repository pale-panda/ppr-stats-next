'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  email: z
    .email({ error: 'Enter a valid email address' })
    .max(320, 'Email is too long'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: 'idle',
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState({ status: 'submitting' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(body?.error ?? 'Failed to send message');
      }

      form.reset();
      setSubmitState({ status: 'success' });
    } catch (error: unknown) {
      setSubmitState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>
          We’ll get back to you as soon as we can.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            {submitState.status === 'success' && (
              <Alert>
                <AlertTitle>Message sent</AlertTitle>
                <AlertDescription>
                  Thanks for reaching out. We’ll respond soon.
                </AlertDescription>
              </Alert>
            )}

            {submitState.status === 'error' && (
              <Alert variant='destructive'>
                <AlertTitle>Couldn’t send message</AlertTitle>
                <AlertDescription>{submitState.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='name'
                      placeholder='Your name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      autoComplete='email'
                      placeholder='you@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='How can we help?'
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className='justify-end mt-8'>
            <Button
              type='submit'
              disabled={
                submitState.status === 'submitting' ||
                form.formState.isSubmitting
              }>
              {submitState.status === 'submitting'
                ? 'Sending…'
                : 'Send message'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

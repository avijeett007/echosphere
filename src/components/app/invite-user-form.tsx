'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  brandTemplates: z.array(z.string()).optional(),
});

// Placeholder data
const availableTemplates = [
    { id: 'template1', name: 'Default Brand' },
    { id: 'template2', name: 'New Campaign' },
    { id: 'template3', name: 'Social Buzz' },
];

export function InviteUserForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      brandTemplates: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'User Invited!',
      description: 'This is a placeholder. Functionality to be implemented.',
    });
    form.reset();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandTemplates"
              render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel>Assign Brand Templates</FormLabel>
                    </div>
                    {availableTemplates.map((template) => (
                        <FormField
                        key={template.id}
                        control={form.control}
                        name="brandTemplates"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={template.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(template.id)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), template.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== template.id
                                            )
                                        );
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                 {template.name}
                                </FormLabel>
                            </FormItem>
                            );
                        }}
                        />
                    ))}
                    <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Invite
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

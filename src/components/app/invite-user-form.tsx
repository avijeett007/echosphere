
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
import React, { useEffect, useState } from 'react';
import { BrandTemplate } from '@/lib/types';
import { collection, onSnapshot, query, doc, updateDoc, getDocs, where, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  brandTemplates: z.array(z.string()).optional(),
});


export function InviteUserForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<BrandTemplate[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'brandTemplates'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const templates: BrandTemplate[] = [];
        querySnapshot.forEach(doc => {
            templates.push({ id: doc.id, ...doc.data() } as BrandTemplate);
        });
        setAvailableTemplates(templates);
    });
    return () => unsubscribe();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      brandTemplates: [],
    },
  });

 async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", values.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Note: This only assigns templates. User needs to be created via registration.
            toast({
                variant: 'destructive',
                title: 'User not found',
                description: 'This user has not registered yet. Please ask them to sign up first.',
            });
            return;
        }

        const batch = writeBatch(db);
        querySnapshot.forEach(userDoc => {
            const userRef = doc(db, 'users', userDoc.id);
            batch.update(userRef, {
                assignedBrandTemplates: values.brandTemplates || []
            });
        });
        await batch.commit();

        toast({
            title: 'User Updated!',
            description: `Assigned ${values.brandTemplates?.length || 0} templates to ${values.email}.`,
        });
        form.reset();

    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Error updating user',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
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
                  <FormLabel>User's Email Address</FormLabel>
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
                    <div className="space-y-2">
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
                                    {template.brandName}
                                    </FormLabel>
                                </FormItem>
                                );
                            }}
                            />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Update User Assignments
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

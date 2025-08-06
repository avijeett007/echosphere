
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
import { Loader, Upload } from 'lucide-react';
import React from 'react';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const formSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  slogan: z.string().optional(),
  color: z.string().optional(),
  logo: z.instanceof(File).optional(),
});

const defaultBrandColor = '#F2994A';

export function BrandTemplateForm({ onTemplateCreated }: { onTemplateCreated: () => void }) {
  const { toast } = useToast();
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: '',
      slogan: '',
      color: defaultBrandColor,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        let logoUrl = '';
        if (values.logo) {
            const storageRef = ref(storage, `logos/${Date.now()}_${values.logo.name}`);
            const snapshot = await uploadBytes(storageRef, values.logo);
            logoUrl = await getDownloadURL(snapshot.ref);
        }

      await addDoc(collection(db, 'brandTemplates'), {
        brandName: values.brandName,
        slogan: values.slogan,
        color: values.color,
        logoUrl: logoUrl,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: 'Brand Template Saved!',
        description: 'Your new brand template is now available.',
      });
      form.reset();
      setFileName(null);
      onTemplateCreated();
    } catch (error: any) {
        console.error("Error creating template: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not save the brand template. Please try again.',
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
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slogan</FormLabel>
                  <FormControl>
                    <Input placeholder="Innovate. Create. Inspire." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Color</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="text" {...field} />
                      <input
                        type="color"
                        className="absolute top-0 right-0 h-full w-10 p-2 bg-transparent border-none cursor-pointer"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        {fileName ? (
                                            <p className="font-semibold text-primary">{fileName}</p>
                                        ) : (
                                            <p className="mb-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">PNG, JPG or SVG (MAX. 800x400px)</p>
                                    </div>
                                    <Input 
                                        id="dropzone-file" 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                field.onChange(file);
                                                setFileName(file.name);
                                            }
                                        }}
                                        accept="image/png, image/jpeg, image/svg+xml"
                                    />
                                </label>
                            </div> 
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save Template
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


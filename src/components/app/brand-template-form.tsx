
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
import { Upload } from 'lucide-react';
import React from 'react';

const formSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  slogan: z.string().optional(),
  color: z.string().optional(),
  logo: z.any().optional(),
});

const defaultBrandColor = '#F2994A';

export function BrandTemplateForm() {
  const { toast } = useToast();
  const [fileName, setFileName] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: '',
      slogan: '',
      color: defaultBrandColor,
      logo: null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Brand Template Saved!',
      description: 'This is a placeholder. Functionality to be implemented.',
    });
    form.reset();
    setFileName(null);
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
                                            field.onChange(file);
                                            setFileName(file?.name || null);
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
            <Button type="submit" className="w-full">
              Save Template
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

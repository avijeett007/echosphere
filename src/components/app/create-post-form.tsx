
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Post, socialPlatforms, SocialPlatform, BrandTemplate } from '@/lib/types';
import { socialIconMap } from '@/components/icons/social-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Upload, Link as LinkIcon, Bot, Terminal, Loader } from 'lucide-react';
import React, { useTransition, useEffect, useState } from 'react';
import Image from 'next/image';
import { improveWritingAndAddHashtags } from '@/ai/flows/improve-writing-and-add-hashtags';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-from-prompt';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const formSchema = z.object({
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one platform.',
  }),
  text: z.string().min(1, { message: 'Post content cannot be empty.' }),
  hashtags: z.string().optional(),
  brandTemplateId: z.string().min(1, { message: 'Please select a brand template.' }),
  imagePrompt: z.string().optional(),
  videoUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});


export function CreatePostForm() {
  const { toast } = useToast();
  const { user, userData, isAdmin } = useAuth();
  const [posts, setPosts] = useLocalStorage<Post[]>('post-history', []);
  const [isImproving, startImproving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<string | null>(null);
  const [brandTemplates, setBrandTemplates] = useState<BrandTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    const fetchBrandTemplates = async () => {
        if (!user || !userData) return;
        setLoadingTemplates(true);
        try {
            let templatesQuery;
            if (isAdmin) {
                // Admin gets all templates
                templatesQuery = query(collection(db, "brandTemplates"));
            } else {
                // Regular user gets only assigned templates
                const assignedIds = userData.assignedBrandTemplates || [];
                if (assignedIds.length === 0) {
                    setBrandTemplates([]);
                    setLoadingTemplates(false);
                    return;
                }
                templatesQuery = query(collection(db, "brandTemplates"), where('__name__', 'in', assignedIds));
            }

            const querySnapshot = await getDocs(templatesQuery);
            const templates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BrandTemplate));
            setBrandTemplates(templates);
        } catch (error) {
            console.error("Error fetching brand templates: ", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch brand templates.',
            });
        } finally {
            setLoadingTemplates(false);
        }
    };

    fetchBrandTemplates();
}, [user, userData, isAdmin, toast]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platforms: ['X'],
      text: '',
      hashtags: '',
      brandTemplateId: '',
      imagePrompt: '',
      videoUrl: '',
    },
  });
  
  const textValue = form.watch('text');

  const handleImproveWriting = () => {
    const text = form.getValues('text');
    const selectedPlatforms = form.getValues('platforms');
    if (!text) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter some text to improve.',
      });
      return;
    }

    startImproving(async () => {
      try {
        const result = await improveWritingAndAddHashtags({ text, platform: selectedPlatforms.join(', ') });
        form.setValue('text', result.improvedText, { shouldValidate: true });
        form.setValue('hashtags', result.hashtags, { shouldValidate: true });
        toast({
          title: 'Content Improved',
          description: 'Your post has been enhanced with AI.',
        });
      } catch (error) {
        console.error('AI Error:', error);
        toast({
          variant: 'destructive',
          title: 'AI Error',
          description: 'Could not improve writing. Please try again.',
        });
      }
    });
  };

  const handleGenerateImage = () => {
    let prompt = form.getValues('imagePrompt');
    const brandTemplateId = form.getValues('brandTemplateId');
    const brandTemplate = brandTemplates.find(t => t.id === brandTemplateId);
    
    if (!textValue) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter some text for the post first.' });
      return;
    }
     if (!brandTemplateId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a brand template first.' });
      return;
    }


    if (!prompt) {
        prompt = `Create a visually appealing graphic for a social media post for "${brandTemplate?.brandName}". The content is about: "${textValue}". The brand's slogan is "${brandTemplate?.slogan}". The primary brand color is ${brandTemplate?.color}. Make it modern and engaging.`;
        form.setValue('imagePrompt', prompt, { shouldValidate: true });
    }

    startGenerating(async () => {
        setGeneratedImageUrl(null);
        try {
            const result = await generateImageFromPrompt({ prompt });
            setGeneratedImageUrl(result.image);
            toast({
              title: 'Image Generated',
              description: 'Your new image is ready!',
            });
        } catch (error) {
            console.error('Image Generation Error:', error);
            toast({
              variant: 'destructive',
              title: 'Image Generation Error',
              description: 'Could not generate image. Please try again.',
            });
        }
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    
    const newPostData = {
      userId: user.uid,
      platforms: values.platforms,
      text: values.text,
      hashtags: values.hashtags || '',
      imageUrl: generatedImageUrl || '',
      imagePrompt: values.imagePrompt || '',
      videoUrl: values.videoUrl || '',
      brandTemplateId: values.brandTemplateId,
      submittedAt: new Date().toISOString(),
    };

    try {
        const docRef = await addDoc(collection(db, 'posts'), newPostData);
        
        // Also update local storage for quick history view, though this could be fully Firestore-driven
        const postForLocalStorage: Post = {
            id: docRef.id,
            platforms: values.platforms as SocialPlatform[],
            ...newPostData
        };
        setPosts([postForLocalStorage, ...posts]);
        
        toast({
          title: 'Post Submitted!',
          description: 'Your post has been saved to the database.',
        });
        form.reset();
        setGeneratedImageUrl(null);
    } catch (error: any) {
        console.error("Error submitting post: ", error);
         toast({
          variant: 'destructive',
          title: 'Submission Error',
          description: 'Could not save your post. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-2">Create a New Post</h1>
      <p className="text-muted-foreground mb-8">Craft your message, engage your audience, and let AI do the heavy lifting.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between items-center">
                          <span>Your Thoughts</span>
                          <span className="text-xs text-muted-foreground">{field.value.length} / 2200</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="What's on your mind?" className="min-h-[180px] resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="button" onClick={handleImproveWriting} disabled={isImproving || !textValue}>
                      {isImproving ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Improving...</> : <><Wand2 className="mr-2 h-4 w-4" />Improve with AI</>}
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="hashtags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hashtags</FormLabel>
                        <FormControl>
                          <Input placeholder="#socialmedia #marketing #ai" {...field} />
                        </FormControl>
                        <FormDescription>AI-suggested or manually entered hashtags.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="generate"><Bot className="mr-2 h-4 w-4" /> Generate</TabsTrigger>
                      <TabsTrigger value="upload" disabled><Upload className="mr-2 h-4 w-4" /> Upload</TabsTrigger>
                      <TabsTrigger value="link"><LinkIcon className="mr-2 h-4 w-4" /> Link Video</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generate" className="pt-4">
                      <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="imagePrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={`A blue robot writing on a vintage typewriter, digital art... or leave blank to auto-generate from post text.`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button type="button" onClick={handleGenerateImage} disabled={isGenerating || !textValue || !form.getValues('brandTemplateId')}>
                            {isGenerating ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />{ form.getValues('imagePrompt') ? 'Generate Image' : 'Generate from Text' }</>}
                        </Button>
                        {isGenerating && (
                            <div className="space-y-2 pt-2">
                                <Progress value={50} className="h-2" />
                                <p className="text-sm text-muted-foreground">Generating your image, please wait...</p>
                            </div>
                        )}
                        {generatedImageUrl && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Generated Image:</p>
                                <Image src={generatedImageUrl} alt="Generated image" width={512} height={512} className="rounded-lg border" />
                            </div>
                        )}
                        {!generatedImageUrl && !isGenerating && (
                           <div className="mt-4 rounded-lg border border-dashed aspect-video w-full max-w-md flex items-center justify-center bg-muted/20">
                               <div className="text-center text-muted-foreground">
                                   <Terminal className="mx-auto h-12 w-12" />
                                   <p className="mt-2">Your generated image will appear here</p>
                               </div>
                           </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-not-allowed bg-muted/20">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">Upload feature coming soon</p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                                </div>
                                <Input id="dropzone-file" type="file" className="hidden" disabled />
                            </label>
                        </div> 
                    </TabsContent>
                    <TabsContent value="link" className="pt-4">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube or Loom URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="platforms"
                    render={() => (
                      <FormItem className="space-y-4">
                        {socialPlatforms.map((platform) => {
                          const Icon = socialIconMap[platform];
                          return (
                            <FormField
                              key={platform}
                              control={form.control}
                              name="platforms"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={platform}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(platform)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, platform])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== platform
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal flex items-center gap-2">
                                      {Icon && <Icon className="h-5 w-5" />}
                                      {platform}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          )
                        })}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brand Template</CardTitle>
                </CardHeader>
                <CardContent>
                   <FormField
                    control={form.control}
                    name="brandTemplateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Brand</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={loadingTemplates}>
                              <SelectValue placeholder={loadingTemplates ? "Loading brands..." : "Select a brand template"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!loadingTemplates && brandTemplates.length === 0 && (
                                <SelectItem value="no-brand" disabled>No brand templates available.</SelectItem>
                            )}
                            {brandTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.brandName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Submit Post
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

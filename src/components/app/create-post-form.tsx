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
import { BrandTemplate, Post, socialPlatforms, SocialPlatform } from '@/lib/types';
import { socialIconMap } from '@/components/icons/social-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Upload, Link as LinkIcon, Bot, Terminal } from 'lucide-react';
import React, { useTransition } from 'react';
import Image from 'next/image';
import { improveWritingAndAddHashtags } from '@/ai/flows/improve-writing-and-add-hashtags';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-from-prompt';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { GlitchLoader } from '@/components/ui/glitch-loader';

const formSchema = z.object({
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one platform.',
  }),
  text: z.string().min(1, { message: 'Post content cannot be empty.' }),
  hashtags: z.string().optional(),
  brandName: z.string().optional(),
  brandTitle: z.string().optional(),
  brandSlogan: z.string().optional(),
  brandColor: z.string().optional(),
  imagePrompt: z.string().optional(),
  videoUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

const defaultBrandColor = '#4285F4';

export function CreatePostForm() {
  const { toast } = useToast();
  const [posts, setPosts] = useLocalStorage<Post[]>('post-history', []);
  const [isImproving, startImproving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platforms: [],
      text: '',
      hashtags: '',
      brandName: 'EchoSphere',
      brandTitle: 'AI-Powered Socials',
      brandSlogan: 'Amplify Your Voice',
      brandColor: defaultBrandColor,
      imagePrompt: '',
      videoUrl: '',
    },
  });
  
  const textValue = form.watch('text');
  const brandNameValue = form.watch('brandName');
  const selectedPlatforms = form.watch('platforms');

  const handleImproveWriting = () => {
    const text = form.getValues('text');
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
    if (!prompt) {
        prompt = `Create a visually appealing graphic for a social media post. The content is about: "${textValue}". The brand is "${brandNameValue}". Make it modern and engaging.`;
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const brandTemplate: BrandTemplate = {
      brandName: values.brandName || '',
      title: values.brandTitle || '',
      slogan: values.brandSlogan || '',
      color: values.brandColor || defaultBrandColor,
    };
    
    const newPost: Post = {
      id: new Date().toISOString(),
      platforms: values.platforms as SocialPlatform[],
      text: values.text,
      hashtags: values.hashtags || '',
      imageUrl: generatedImageUrl || undefined,
      imagePrompt: values.imagePrompt,
      videoUrl: values.videoUrl,
      brandTemplate: (brandTemplate.brandName || brandTemplate.title || brandTemplate.slogan) ? brandTemplate : undefined,
      submittedAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    
    toast({
      title: 'Post Submitted!',
      description: 'Your post has been sent to the N8N workflow and saved to history.',
    });
    form.reset();
    setGeneratedImageUrl(null);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 relative scanline-animation">
      <h1 className="font-headline text-3xl font-bold mb-2 glitch" data-text="Create a New Post">Create a New Post</h1>
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
                      {isImproving ? <GlitchLoader text="Improving..." /> : <><Wand2 className="mr-2 h-4 w-4" />Improve with AI</>}
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
                      <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" /> Upload</TabsTrigger>
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
                         <Button type="button" onClick={handleGenerateImage} disabled={isGenerating || !textValue}>
                            {isGenerating ? <GlitchLoader text="Generating..." /> : <><Wand2 className="mr-2 h-4 w-4" />{ form.getValues('imagePrompt') ? 'Generate Image' : 'Generate from Text' }</>}
                        </Button>
                        {isGenerating && <div className="flex items-center text-sm text-muted-foreground"><GlitchLoader text="Generating your image, please wait..." /></div>}
                        {generatedImageUrl && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Generated Image:</p>
                                <Image src={generatedImageUrl} alt="Generated image" width={512} height={512} className="rounded-lg border" />
                            </div>
                        )}
                        {!generatedImageUrl && !isGenerating && (
                           <div className="mt-4 rounded-lg border border-dashed aspect-square w-full max-w-md flex items-center justify-center bg-muted/50">
                               <div className="text-center text-muted-foreground">
                                   <Terminal className="mx-auto h-12 w-12" />
                                   <p className="mt-2">Awaiting image generation...</p>
                               </div>
                           </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <Input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div> 
                        <FormDescription className="text-center mt-2">Image/Video upload is for demonstration purposes.</FormDescription>
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
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="brandName" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl><Input placeholder="Your Company" {...field} /></FormControl>
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="brandTitle" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl><Input placeholder="Product Launch" {...field} /></FormControl>
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="brandSlogan" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Slogan</FormLabel>
                          <FormControl><Input placeholder="Innovate. Create. Inspire." {...field} /></FormControl>
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="brandColor" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Brand Color</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Input type="text" {...field} />
                                <input type="color" className="absolute top-0 right-0 h-full w-10 p-2 bg-transparent border-none cursor-pointer" value={field.value} onChange={e => field.onChange(e.target.value)} />
                            </div>
                          </FormControl>
                      </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full font-bold">
                Submit Post
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

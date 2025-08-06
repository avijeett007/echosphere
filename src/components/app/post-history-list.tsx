
'use client';

import { useEffect, useState } from 'react';
import { Post, BrandTemplate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { socialIconMap } from '@/components/icons/social-icons';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { FileQuestion, Library, Loader } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, getDocs, DocumentData } from 'firebase/firestore';


export function PostHistoryList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [brandTemplates, setBrandTemplates] = useState<Map<string, BrandTemplate>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    // Fetch all brand templates once
    const fetchBrandTemplates = async () => {
        const templatesCollection = collection(db, 'brandTemplates');
        const templateSnapshot = await getDocs(templatesCollection);
        const templatesMap = new Map<string, BrandTemplate>();
        templateSnapshot.forEach(doc => {
            templatesMap.set(doc.id, { id: doc.id, ...doc.data() } as BrandTemplate);
        });
        setBrandTemplates(templatesMap);
    };

    fetchBrandTemplates().then(() => {
       const q = query(collection(db, 'posts'), where('userId', '==', user.uid), orderBy('submittedAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData: Post[] = [];
            querySnapshot.forEach(doc => {
                postsData.push({ id: doc.id, ...(doc.data() as Omit<Post, 'id'>) });
            });
            setPosts(postsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching posts: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    });

  }, [user]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-200px)]">
            <Loader className="h-16 w-16 text-muted-foreground animate-spin" />
            <h2 className="mt-6 text-xl font-semibold font-headline">Loading Post History...</h2>
        </div>
    )
  }

  if (posts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-200px)]">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold font-headline">No Posts Yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your submitted posts will appear here. Go ahead and create your first one!</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const submittedAt = new Date(post.submittedAt);
        const brand = post.brandTemplateId ? brandTemplates.get(post.brandTemplateId) : undefined;

        return (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-lg">Post to {post.platforms.join(', ')}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(submittedAt, { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.platforms.map((p) => {
                        const Icon = socialIconMap[p];
                        return Icon ? <Icon key={p} className="h-5 w-5 text-muted-foreground" /> : null;
                    })}
                  </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.imageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image src={post.imageUrl} alt={post.imagePrompt || 'Post image'} layout="fill" objectFit="cover" />
                </div>
              )}
               {post.videoUrl && (
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Video Link:</p>
                    <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm break-all hover:underline">
                        {post.videoUrl}
                    </a>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{post.text}</p>
              {post.hashtags && (
                <div className="flex flex-wrap gap-2">
                    {post.hashtags.split(' ').map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                </div>
              )}
            </CardContent>
            {brand && (
                <CardFooter>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Library className="h-3 w-3" />
                        <span>{brand.brandName}</span>
                        <span style={{color: brand.color}}>●</span>
                    </div>
                </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
}

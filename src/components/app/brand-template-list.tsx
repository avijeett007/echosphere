
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Loader } from 'lucide-react';
import { collection, onSnapshot, orderBy, query, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { BrandTemplate } from '@/lib/types';

export function BrandTemplateList({ refreshKey }: { refreshKey: number }) {
    const [templates, setTemplates] = useState<BrandTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'brandTemplates'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const templatesData: BrandTemplate[] = [];
            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data();
                templatesData.push({
                    id: doc.id,
                    brandName: data.brandName,
                    slogan: data.slogan,
                    color: data.color,
                    logoUrl: data.logoUrl,
                } as BrandTemplate);
            });
            setTemplates(templatesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (templates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full rounded-lg border-2 border-dashed">
                <FileQuestion className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold font-headline">No Brand Templates Yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">Create your first brand template to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {templates.map((template) => (
                <Card key={template.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        {template.logoUrl && (
                            <div className="w-12 h-12 relative">
                                <Image src={template.logoUrl} alt={`${template.brandName} logo`} layout="fill" objectFit="contain" />
                            </div>
                        )}
                        <div>
                            <CardTitle>{template.brandName}</CardTitle>
                            <CardDescription>{template.slogan}</CardDescription>
                        </div>
                        <div className="w-4 h-4 rounded-full ml-auto" style={{ backgroundColor: template.color }} />
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}

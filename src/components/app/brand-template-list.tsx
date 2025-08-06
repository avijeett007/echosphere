
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

// This is a placeholder component.
// In the future, it will fetch and display brand templates from Firebase.
export function BrandTemplateList() {
    const templates: any[] = []; // Placeholder

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
                    <CardHeader>
                        <CardTitle>{template.brandName}</CardTitle>
                        <CardDescription>{template.slogan}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}

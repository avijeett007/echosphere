'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

// Placeholder data
const users = [
    { id: 'user1', email: 'avijeett007@gmail.com', role: 'Admin', templates: ['Default Brand', 'New Campaign', 'Social Buzz'] },
    { id: 'user2', email: 'jane.doe@example.com', role: 'User', templates: ['Default Brand'] },
    { id: 'user3', email: 'john.smith@example.com', role: 'User', templates: ['New Campaign'] },
];

export function UserList() {

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div className='flex flex-col'>
                                <div className="font-medium">{user.email}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {user.templates.join(', ')}
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

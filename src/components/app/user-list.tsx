
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { collection, onSnapshot, query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BrandTemplate } from '@/lib/types';


interface UserData extends DocumentData {
    id: string;
    email: string;
    role: string;
    name: string;
    assignedBrandTemplates: string[];
}

export function UserList() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [brandTemplates, setBrandTemplates] = useState<Map<string, BrandTemplate>>(new Map());
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchBrandTemplates = async () => {
            const templatesCollection = collection(db, 'brandTemplates');
            const templatesSnapshot = await onSnapshot(templatesCollection, (snapshot) => {
                const templatesMap = new Map<string, BrandTemplate>();
                snapshot.forEach(doc => {
                    templatesMap.set(doc.id, { id: doc.id, ...doc.data() } as BrandTemplate);
                });
                setBrandTemplates(templatesMap);
            });
            return templatesSnapshot;
        };
        const unsubscribeTemplates = fetchBrandTemplates();

        const q = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(q, (querySnapshot) => {
            const usersData: UserData[] = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() } as UserData);
            });
            setUsers(usersData);
            setLoading(false);
        });

        return () => {
            unsubscribeUsers();
            // This is a bit of a hack to get around the fact that onSnapshot returns a function
            // and we are in an async function.
            Promise.resolve(unsubscribeTemplates).then(unsub => unsub());
        };
    }, []);

    if (loading) {
        return (
             <Card>
                <CardContent className="pt-6 flex justify-center items-center">
                   <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div className='flex flex-col'>
                                <div className="font-medium">{user.name} ({user.email})</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Assigned: {user.assignedBrandTemplates?.map(id => brandTemplates.get(id)?.brandName).filter(Boolean).join(', ') || 'None'}
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


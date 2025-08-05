import { PostHistoryList } from '@/components/app/post-history-list';

export default function HistoryPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
        <h1 className="font-headline text-3xl font-bold mb-2">Post History</h1>
        <p className="text-muted-foreground mb-8">A log of all your previously submitted posts.</p>
        <PostHistoryList />
    </div>
  );
}

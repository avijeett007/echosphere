
import { BrandTemplateForm } from '@/components/app/brand-template-form';
import { BrandTemplateList } from '@/components/app/brand-template-list';
import { Separator } from '@/components/ui/separator';

export default function BrandTemplatesPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-2">Brand Templates</h1>
      <p className="text-muted-foreground mb-8">
        Create and manage your brand assets. These will be available for all users.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="font-headline text-xl font-semibold mb-4">Create New Template</h2>
          <BrandTemplateForm />
        </div>
        <div className="lg:col-span-2">
           <h2 className="font-headline text-xl font-semibold mb-4">Existing Templates</h2>
           <BrandTemplateList />
        </div>
      </div>
    </div>
  );
}

import type { SVGProps } from 'react';
import { Facebook, Instagram, Youtube, Twitter as XIcon } from 'lucide-react';

export const socialIconMap: Record<string, React.ComponentType<any>> = {
    Facebook: (props: SVGProps<SVGSVGElement>) => <Facebook {...props} />,
    Instagram: (props: SVGProps<SVGSVGElement>) => <Instagram {...props} />,
    TikTok: (props: SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16.5 6.5a4.5 4.5 0 1 0 4.5 4.5V17a4 4 0 1 1-4-4h-1.5A4.5 4.5 0 1 0 11 6.5v8.5a4 4 0 1 0 4 4" />
      </svg>
    ),
    X: (props: SVGProps<SVGSVGElement>) => <XIcon {...props} />,
    Discord: (props: SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.79 0 3.48-.46 4.97-1.29a.997.997 0 0 0 .58-1.45 7.965 7.965 0 0 1-1.45-3.59c1.92.44 3.53-1.21 3.53-1.21a9.006 9.006 0 0 0-1.63-1.74c-.23-.17-.48-.31-.73-.42A9.917 9.917 0 0 0 12 5c-3.17 0-5.83 1.6-6.83 3.32-.01 0-1.61 1.65 3.53 1.21-.4 1.39-.93 2.65-1.45 3.59a.997.997 0 0 0 .58 1.45A10.02 10.02 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zM8.5 14c-.83 0-1.5-.67-1.5-1.5S7.67 11 8.5 11s1.5.67 1.5 1.5S9.33 14 8.5 14zm7 0c-.83 0-1.5-.67-1.5-1.5S14.67 11 15.5 11s1.5.67 1.5 1.5S16.33 14 15.5 14z" />
      </svg>
    ),
    YouTube: (props: SVGProps<SVGSVGElement>) => <Youtube {...props} />,
};

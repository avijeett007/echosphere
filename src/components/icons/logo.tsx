import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M169.54 152.46a8 8 0 0 1-11.32 0L128 122.34l-30.22 30.12a8 8 0 0 1-11.32-11.32l30.12-30.22l-30.12-30.22a8 8 0 0 1 11.32-11.32L128 100.1l30.22-30.12a8 8 0 0 1 11.32 11.32L139.66 111.7l30.12 30.22a8 8 0 0 1-0.24 10.54Z" />
      </g>
    </svg>
  );
}

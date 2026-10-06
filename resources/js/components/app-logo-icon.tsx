import type { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            {...props}
            className={`inline-flex items-center justify-center rounded-md bg-teal-700 px-1 font-sans text-[0.55em] font-bold leading-none tracking-[0.08em] text-white dark:bg-teal-500 dark:text-stone-950 ${className ?? ''}`}
            aria-label="SHIBUST"
        >
            S
        </span>
    );
}

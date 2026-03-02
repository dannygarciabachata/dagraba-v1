import { ReactNode } from 'react';

// Since we have a `[locale]` layout, this root layout is just a wrapper
// that Next.js requires for the App Router.
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}

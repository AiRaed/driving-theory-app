import type { Metadata } from 'next';
import DownloadClient from './DownloadClient';

export const metadata: Metadata = {
  title: 'LingoTheory App | UK Driving Theory Practice',
  description:
    'Download LingoTheory and practise the UK Driving Theory Test in your language.',
  openGraph: {
    title: 'LingoTheory App | UK Driving Theory Practice',
    description:
      'Download LingoTheory and practise the UK Driving Theory Test in your language.',
    url: 'https://www.lingotheory.org/download',
    siteName: 'LingoTheory',
    type: 'website',
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}

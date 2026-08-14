import type { Metadata } from 'next';
import ProtectedAdmin from './ProtectedAdmin';

export const metadata: Metadata = {
  title: 'Owner Dashboard',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <ProtectedAdmin />;
}

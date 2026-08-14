import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)]">Page not found</h1>
      <p className="mt-4 text-ink-muted">The page you were looking for isn&rsquo;t here.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/book" className="btn-outline">
          Book an appointment
        </Link>
      </div>
    </div>
  );
}

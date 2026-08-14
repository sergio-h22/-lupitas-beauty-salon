'use client';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-ink/10 bg-cream-deep pb-16 pt-20">
      <div className="shell text-center">
        <p className="eyebrow">{eyebrow}</p>
        <div className="rule-gold mx-auto mt-4" />
        <h1 className="mt-6 text-[clamp(2.2rem,6vw,3.8rem)]">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-ink-muted">{subtitle}</p>}
      </div>
    </section>
  );
}

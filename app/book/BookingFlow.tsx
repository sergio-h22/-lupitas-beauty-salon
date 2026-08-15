'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useT, useLocalized, useLang } from '@/lib/i18n';
import { SERVICES, serviceById } from '@/lib/services';
import { SPECIALISTS, ANY_SPECIALIST } from '@/lib/specialists';
import { BUSINESS, ADDRESS_LINE, isClosedOn } from '@/lib/business';
import { StripePaymentForm } from '@/components/StripePaymentForm';
import { paymentsAvailable } from '@/components/StripeProvider';
import {
  Appointment,
  availableSlots,
  loadAppointments,
  saveAppointment,
  loadBlocked,
  formatDateKey,
  parseLocalDate,
  formatTime,
  formatDuration,
  calendarUrl,
} from '@/lib/booking';

const STEPS = 5;
const DAYS_AHEAD = 60;

export default function BookingFlow() {
  const t = useT();
  const L = useLocalized();
  const { lang } = useLang();
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [specialistId, setSpecialistId] = useState(ANY_SPECIALIST);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);

  // Sourced from the provider so the flag and the publishable key can never
  // disagree — asking for payment with no key configured would dead-end the
  // customer at the last step of the booking.
  const paymentsEnabled = paymentsAvailable;
  const depositCents = parseInt(process.env.NEXT_PUBLIC_DEPOSIT_CENTS || '0', 10);

  useEffect(() => {
    setAppointments(loadAppointments());
    setBlocked(loadBlocked());
  }, []);

  // Deep links from service cards and specialist cards.
  useEffect(() => {
    const s = params.get('service');
    const sp = params.get('specialist');
    if (s && serviceById(s)) {
      setServiceId(s);
      setStep(2);
    }
    if (sp && SPECIALISTS.some((x) => x.id === sp)) {
      setSpecialistId(sp);
      if (s && serviceById(s)) setStep(3);
    }
  }, [params]);

  const service = serviceById(serviceId);

  const dates = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (!isClosedOn(day.getDay())) out.push(day);
    }
    return out;
  }, []);

  const slots = useMemo(() => {
    if (!date || !serviceId) return [];
    return availableSlots(date, serviceId, specialistId, appointments, blocked);
  }, [date, serviceId, specialistId, appointments, blocked]);

  /** Dates with nothing bookable are disabled rather than leading to an empty step. */
  const fullyBooked = useMemo(() => {
    if (!serviceId) return new Set<string>();
    const out = new Set<string>();
    for (const d of dates) {
      const key = formatDateKey(d);
      if (availableSlots(key, serviceId, specialistId, appointments, blocked).length === 0) {
        out.add(key);
      }
    }
    return out;
  }, [dates, serviceId, specialistId, appointments, blocked]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('booking.required');
    const digits = form.phone.replace(/\D/g, '');
    if (!digits) e.phone = t('booking.required');
    else if (digits.length < 10) e.phone = t('booking.invalidPhone');
    if (!form.email.trim()) e.email = t('booking.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = t('booking.invalidEmail');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function createAppointment() {
    if (!service) return;
    const appt: Appointment = {
      id: crypto.randomUUID(),
      serviceId,
      specialistId,
      date,
      time,
      minutes: service.minutes,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveAppointment(appt);
    setAppointments((a) => [...a, appt]);
    setConfirmed(appt);
  }

  function handlePaymentSuccess() {
    createAppointment();
  }

  function submit() {
    if (!validate() || !service) return;

    // If payments are enabled and there's an amount due, show payment form
    if (paymentsEnabled && depositCents > 0) {
      setShowPaymentForm(true);
      return;
    }

    // Otherwise create appointment immediately
    createAppointment();
  }

  // Each step change reveals new content above the fold; without this the user
  // stays scrolled where the previous step's buttons were.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, confirmed]);

  if (confirmed) {
    return <Confirmation appt={confirmed} onAnother={() => window.location.assign('/book')} />;
  }

  const canContinue =
    (step === 1 && !!serviceId) ||
    (step === 2 && !!specialistId) ||
    (step === 3 && !!date) ||
    (step === 4 && !!time);

  return (
    <div className="shell-narrow max-w-3xl py-section">
      {/* Progress as a run of hairlines rather than numbered bubbles — it reads
          as a measure of how far through you are, which is the only thing the
          control is actually for. */}
      <ol
        className="mb-12 flex items-center gap-1.5"
        aria-label={`${t('booking.step')} ${step} ${t('booking.of')} ${STEPS}`}
      >
        {Array.from({ length: STEPS }).map((_, i) => {
          const n = i + 1;
          return (
            <li key={n} className="flex-1">
              <span
                aria-current={n === step ? 'step' : undefined}
                className={`block h-0.5 w-full transition-colors duration-600 ease-luxe ${
                  n < step ? 'bg-gold' : n === step ? 'bg-ink' : 'bg-ink/12'
                }`}
              />
            </li>
          );
        })}
      </ol>

      <p className="eyebrow">
        {t('booking.step')} {step} {t('booking.of')} {STEPS}
      </p>
      <h2 className="mt-4 text-display-md">{t(`booking.step${step}` as string)}</h2>

      <div className="mt-10">
        {step === 1 && (
          <fieldset>
            <legend className="sr-only">{t('booking.step1')}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 border p-5 transition-colors duration-400 ease-luxe ${
                    serviceId === s.id ? 'border-ink bg-white' : 'border-ink/12 hover:border-ink'
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={serviceId === s.id}
                    onChange={() => {
                      setServiceId(s.id);
                      setTime('');
                    }}
                    className="mt-1.5 h-4 w-4 flex-none accent-[#7A5F18]"
                  />
                  <span>
                    <span className="block font-display text-[1.15rem] text-ink">{L(s.name)}</span>
                    <span className="mt-1.5 block font-body text-label font-medium uppercase text-ink-faint">
                      {formatDuration(s.minutes, lang)} · {s.price || t('services.quote')}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="sr-only">{t('booking.step2')}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 border p-5 transition-colors duration-400 ease-luxe ${
                  specialistId === ANY_SPECIALIST ? 'border-ink bg-white' : 'border-ink/12 hover:border-ink'
                }`}
              >
                <input
                  type="radio"
                  name="specialist"
                  checked={specialistId === ANY_SPECIALIST}
                  onChange={() => {
                    setSpecialistId(ANY_SPECIALIST);
                    setTime('');
                  }}
                  className="mt-1.5 h-4 w-4 flex-none accent-[#7A5F18]"
                />
                <span>
                  <span className="block font-display text-[1.15rem] text-ink">{t('booking.anyone')}</span>
                  <span className="mt-1.5 block font-body text-label font-medium uppercase text-ink-faint">{t('booking.anyoneNote')}</span>
                </span>
              </label>

              {SPECIALISTS.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 border p-5 transition-colors duration-400 ease-luxe ${
                    specialistId === s.id ? 'border-ink bg-white' : 'border-ink/12 hover:border-ink'
                  }`}
                >
                  <input
                    type="radio"
                    name="specialist"
                    checked={specialistId === s.id}
                    onChange={() => {
                      setSpecialistId(s.id);
                      setTime('');
                    }}
                    className="mt-1.5 h-4 w-4 flex-none accent-[#7A5F18]"
                  />
                  <span>
                    <span className="block font-display text-[1.15rem] text-ink">{s.name}</span>
                    <span className="mt-1.5 block font-body text-label font-medium uppercase text-ink-faint">{L(s.role)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {dates.map((d) => {
              const key = formatDateKey(d);
              const selected = key === date;
              const unavailable = fullyBooked.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={unavailable}
                  onClick={() => {
                    setDate(key);
                    setTime('');
                  }}
                  aria-pressed={selected}
                  className={`min-h-[84px] border p-3.5 text-left transition-colors duration-400 ease-luxe ${
                    unavailable
                      ? 'cursor-not-allowed border-ink/10 text-ink-faint/50 line-through'
                      : selected
                        ? 'cursor-pointer border-ink bg-ink text-cream'
                        : 'cursor-pointer border-ink/12 hover:border-ink'
                  }`}
                >
                  <span className="block font-body text-label font-medium uppercase opacity-65">
                    {d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'short' })}
                  </span>
                  <span className="mt-1.5 block font-display text-[1.45rem] leading-none">
                    {d.getDate()}
                  </span>
                  <span className="mt-1.5 block font-body text-label font-medium uppercase opacity-65">
                    {d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {step === 4 && (
          <>
            {slots.length === 0 ? (
              <p className="border border-rose/50 bg-rose/10 p-5 text-sm text-ink">{t('booking.noSlots')}</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    aria-pressed={time === s}
                    className={`min-h-[52px] cursor-pointer border font-body text-sm tabular-nums transition-colors duration-400 ease-luxe ${
                      time === s ? 'border-ink bg-ink text-cream' : 'border-ink/12 hover:border-ink'
                    }`}
                  >
                    {formatTime(s, lang)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="grid gap-6"
          >
            <Summary serviceName={service ? L(service.name) : ''} specialistId={specialistId} date={date} time={time} />

            {!showPaymentForm ? (
              <>
                <Field
                  id="name"
                  label={t('booking.name')}
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  id="phone"
                  type="tel"
                  label={t('booking.phone')}
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Field
                  id="email"
                  type="email"
                  label={t('booking.emailLabel')}
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                  autoComplete="email"
                />

                <div>
                  <label htmlFor="notes" className="field-label">
                    {t('booking.notes')}
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    aria-describedby="notes-hint"
                    className="field-input"
                  />
                  <p id="notes-hint" className="mt-2 text-xs text-ink-muted">
                    {t('booking.notesHint')}
                  </p>
                </div>

                <button type="submit" className="btn-primary w-full">
                  {t('booking.confirm')}
                </button>
              </>
            ) : (
              <>
                <div className="border border-ink/10 bg-cream-deep p-4">
                  <p className="text-sm font-medium text-ink-muted">
                    Payment for {service ? L(service.name) : 'your appointment'}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-ink">
                    ${(depositCents / 100).toFixed(2)}
                  </p>
                </div>

                {paymentError && (
                  <p className="rounded border border-rose-text/30 bg-rose/10 p-3 text-sm font-medium text-rose-text">
                    {paymentError}
                  </p>
                )}

                <StripePaymentForm
                  amount={depositCents}
                  description={`${service ? L(service.name) : 'Appointment'} - ${form.name}`}
                  email={form.email}
                  name={form.name}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => setPaymentError(error)}
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setPaymentError('');
                  }}
                  className="btn-outline w-full"
                >
                  {t('booking.back')}
                </button>
              </>
            )}
          </form>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-outline">
            {t('booking.back')}
          </button>
        ) : (
          <span />
        )}
        {step < STEPS && (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-35"
          >
            {t('booking.next')}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field-input ${error ? 'border-rose-text' : ''}`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-rose-text">
          {error}
        </p>
      )}
    </div>
  );
}

function Summary({
  serviceName,
  specialistId,
  date,
  time,
}: {
  serviceName: string;
  specialistId: string;
  date: string;
  time: string;
}) {
  const t = useT();
  const { lang } = useLang();
  const specialist = SPECIALISTS.find((s) => s.id === specialistId);

  return (
    <div className="border-y border-ink/12 bg-cream-deep px-6 py-7">
      <p className="eyebrow">{t('booking.summary')}</p>
      <p className="mt-4 text-display-sm text-ink">{serviceName}</p>
      <p className="mt-2 text-sm text-ink-muted">
        {parseLocalDate(date).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}{' '}
        · {formatTime(time, lang)}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        {t('booking.with')} {specialist ? specialist.name : t('booking.anyone').toLowerCase()}
      </p>
    </div>
  );
}

function Confirmation({ appt, onAnother }: { appt: Appointment; onAnother: () => void }) {
  const t = useT();
  const L = useLocalized();
  const { lang } = useLang();
  const service = serviceById(appt.serviceId);
  const specialist = SPECIALISTS.find((s) => s.id === appt.specialistId);

  return (
    <div className="shell-narrow max-w-2xl py-section text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-gold-text"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="mt-9 text-display-lg">{t('booking.done')}</h2>
      <p className="mx-auto mt-5 max-w-prose text-ink-muted">{t('booking.doneBody')}</p>

      <dl className="mx-auto mt-11 max-w-md divide-y divide-ink/10 border-y border-ink/10 text-left">
        <Row label={t('booking.labelService')} value={service ? L(service.name) : ''} />
        <Row
          label={t('booking.labelDate')}
          value={parseLocalDate(appt.date).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        />
        <Row label={t('booking.labelTime')} value={formatTime(appt.time, lang)} />
        <Row label={t('booking.labelSpecialist')} value={specialist ? specialist.name : t('booking.anyone')} />
      </dl>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href={calendarUrl(appt, `${service ? L(service.name) : 'Appointment'} — ${BUSINESS.name}`, ADDRESS_LINE)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          {t('booking.addCalendar')}
        </a>
        <button type="button" onClick={onAnother} className="btn-outline">
          {t('booking.another')}
        </button>
      </div>

      <p className="mx-auto mt-11 max-w-md border-l border-gold bg-cream-deep p-5 text-left text-xs leading-relaxed text-ink-muted">
        {t('booking.demoNotice')}
      </p>

      <Link href="/" className="mt-8 inline-block text-sm underline underline-offset-4">
        {t('nav.home')}
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-3">
      <dt className="font-body text-label font-medium uppercase text-ink-faint">{label}</dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  );
}

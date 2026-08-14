'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useT, useLocalized, useLang } from '@/lib/i18n';
import { SERVICES, serviceById } from '@/lib/services';
import { SPECIALISTS, ANY_SPECIALIST } from '@/lib/specialists';
import { BUSINESS, ADDRESS_LINE, isClosedOn } from '@/lib/business';
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

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);

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

  function submit() {
    if (!validate() || !service) return;
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
    <div className="shell max-w-3xl py-section">
      <ol className="mb-12 flex items-center gap-2" aria-label={`${t('booking.step')} ${step} ${t('booking.of')} ${STEPS}`}>
        {Array.from({ length: STEPS }).map((_, i) => {
          const n = i + 1;
          return (
            <li key={n} className="flex flex-1 items-center gap-2">
              <span
                aria-current={n === step ? 'step' : undefined}
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border text-xs font-semibold ${
                  n < step
                    ? 'border-gold-text bg-gold-text text-cream'
                    : n === step
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/25 text-ink-muted'
                }`}
              >
                {n < step ? '✓' : n}
              </span>
              {n < STEPS && <span className={`h-px flex-1 ${n < step ? 'bg-gold-text' : 'bg-ink/15'}`} />}
            </li>
          );
        })}
      </ol>

      <p className="eyebrow">
        {t('booking.step')} {step} {t('booking.of')} {STEPS}
      </p>
      <h2 className="mt-3 text-[clamp(1.6rem,4vw,2.4rem)]">
        {t(`booking.step${step}` as string)}
      </h2>

      <div className="mt-10">
        {step === 1 && (
          <fieldset>
            <legend className="sr-only">{t('booking.step1')}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 border p-5 transition-colors duration-250 ${
                    serviceId === s.id ? 'border-ink bg-white' : 'border-ink/15 hover:border-ink/40'
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
                    <span className="block font-display text-[1.1rem] text-ink">{L(s.name)}</span>
                    <span className="mt-1 block text-xs text-ink-muted">
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
                className={`flex cursor-pointer items-start gap-3 border p-5 transition-colors duration-250 ${
                  specialistId === ANY_SPECIALIST ? 'border-ink bg-white' : 'border-ink/15 hover:border-ink/40'
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
                  <span className="block font-display text-[1.1rem] text-ink">{t('booking.anyone')}</span>
                  <span className="mt-1 block text-xs text-ink-muted">{t('booking.anyoneNote')}</span>
                </span>
              </label>

              {SPECIALISTS.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 border p-5 transition-colors duration-250 ${
                    specialistId === s.id ? 'border-ink bg-white' : 'border-ink/15 hover:border-ink/40'
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
                    <span className="block font-display text-[1.1rem] text-ink">{s.name}</span>
                    <span className="mt-1 block text-xs text-ink-muted">{L(s.role)}</span>
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
                  className={`min-h-[76px] border p-3 text-left transition-colors duration-250 ${
                    unavailable
                      ? 'cursor-not-allowed border-ink/10 text-ink-muted/40 line-through'
                      : selected
                        ? 'cursor-pointer border-ink bg-ink text-cream'
                        : 'cursor-pointer border-ink/15 hover:border-ink/40'
                  }`}
                >
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.14em] opacity-70">
                    {d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'short' })}
                  </span>
                  <span className="mt-1 block font-display text-[1.3rem]">{d.getDate()}</span>
                  <span className="block text-[0.62rem] uppercase tracking-[0.12em] opacity-70">
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
                    className={`min-h-[48px] cursor-pointer border text-sm font-medium transition-colors duration-250 ${
                      time === s ? 'border-ink bg-ink text-cream' : 'border-ink/15 hover:border-ink/40'
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
    <div className="border border-gold/50 bg-cream-deep p-6">
      <p className="eyebrow">{t('booking.summary')}</p>
      <p className="mt-3 font-display text-[1.25rem] text-ink">{serviceName}</p>
      <p className="mt-1 text-sm text-ink-muted">
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
    <div className="shell max-w-2xl py-section text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold-text" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="mt-8 text-[clamp(2rem,5vw,3rem)]">{t('booking.done')}</h2>
      <p className="mt-4 text-ink-muted">{t('booking.doneBody')}</p>

      <dl className="mx-auto mt-10 max-w-md divide-y divide-ink/10 border-y border-ink/10 text-left">
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

      <p className="mx-auto mt-10 max-w-md border border-gold/50 bg-cream-deep p-4 text-xs leading-relaxed text-ink-muted">
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
      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

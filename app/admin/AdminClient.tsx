'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang, useLocalized } from '@/lib/i18n';
import { serviceById } from '@/lib/services';
import { SPECIALISTS } from '@/lib/specialists';
import { signOut, getCurrentUser } from '@/lib/supabase';
import { addAuditLog } from '@/lib/audit-log';
import {
  Appointment,
  loadAppointments,
  updateAppointment,
  loadBlocked,
  saveBlocked,
  blockKey,
  parseLocalDate,
  formatDateKey,
  formatTime,
} from '@/lib/booking';

type Filter = 'upcoming' | 'all' | 'pending' | 'cancelled';

export default function AdminClient() {
  const router = useRouter();
  const { lang } = useLang();
  const L = useLocalized();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('10:00');
  const [loggingOut, setLoggingOut] = useState(false);

  const [userEmail, setUserEmail] = useState('');

  async function handleLogout() {
    setLoggingOut(true);
    try {
      addAuditLog('LOGOUT', userEmail, true);
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    setAppts(loadAppointments());
    setBlocked(loadBlocked());

    // Get current user email for audit logging
    async function getUser() {
      try {
        const user = await getCurrentUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (err) {
        console.error('Failed to get user:', err);
      }
    }

    getUser();
  }, []);

  const todayKey = formatDateKey(new Date());

  const shown = useMemo(() => {
    const sorted = [...appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    if (filter === 'all') return sorted;
    if (filter === 'pending') return sorted.filter((a) => a.status === 'pending');
    if (filter === 'cancelled') return sorted.filter((a) => a.status === 'cancelled');
    return sorted.filter((a) => a.date >= todayKey && a.status !== 'cancelled');
  }, [appts, filter, todayKey]);

  const stats = useMemo(() => {
    const active = appts.filter((a) => a.status !== 'cancelled');
    return {
      total: active.length,
      pending: appts.filter((a) => a.status === 'pending').length,
      upcoming: active.filter((a) => a.date >= todayKey).length,
      minutes: active.reduce((sum, a) => sum + a.minutes, 0),
    };
  }, [appts, todayKey]);

  function setStatus(id: string, status: Appointment['status']) {
    const appt = appts.find((a) => a.id === id);
    setAppts(updateAppointment(id, { status }));

    // Log the action
    const action = status === 'approved' ? 'APPOINTMENT_APPROVED' : 'APPOINTMENT_CANCELLED';
    addAuditLog(action as any, userEmail, true, {
      appointmentId: id,
      customerName: appt?.name,
      newStatus: status,
    });
  }

  function addBlock() {
    if (!blockDate) return;
    const key = blockKey(blockDate, blockTime);
    if (blocked.includes(key)) return;
    const next = [...blocked, key];
    setBlocked(next);
    saveBlocked(next);

    addAuditLog('TIME_BLOCKED', userEmail, true, {
      date: blockDate,
      time: blockTime,
    });
  }

  function removeBlock(key: string) {
    const next = blocked.filter((k) => k !== key);
    setBlocked(next);
    saveBlocked(next);

    addAuditLog('TIME_UNBLOCKED', userEmail, true, {
      blockedSlot: key,
    });
  }

  return (
    <div className="shell py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)]">Appointments</h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn-outline disabled:cursor-not-allowed disabled:opacity-35"
        >
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

      <div className="border border-ink/15 bg-cream-deep p-5">
        <p className="text-sm text-ink-muted">
          Appointments are saved to browser local storage. Before launching, connect to a real database so bookings persist across devices and browsers.
        </p>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Upcoming" value={String(stats.upcoming)} />
        <Stat label="Awaiting approval" value={String(stats.pending)} />
        <Stat label="Total booked" value={String(stats.total)} />
        <Stat label="Booked hours" value={(stats.minutes / 60).toFixed(1)} />
      </dl>

      <div className="mt-10 flex flex-wrap gap-2">
        {(['upcoming', 'pending', 'all', 'cancelled'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`min-h-[44px] cursor-pointer border px-5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-250 ${
              filter === f ? 'border-ink bg-ink text-cream' : 'border-ink/20 text-ink hover:border-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 border border-dashed border-ink/20 p-10 text-center text-ink-muted">
          No appointments yet. Book one from the booking page to see it appear here.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/20 text-left text-[0.68rem] uppercase tracking-[0.14em] text-ink-muted">
                <th scope="col" className="py-3 pr-4">When</th>
                <th scope="col" className="py-3 pr-4">Client</th>
                <th scope="col" className="py-3 pr-4">Service</th>
                <th scope="col" className="py-3 pr-4">Specialist</th>
                <th scope="col" className="py-3 pr-4">Status</th>
                <th scope="col" className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => {
                const service = serviceById(a.serviceId);
                const specialist = SPECIALISTS.find((s) => s.id === a.specialistId);
                return (
                  <tr key={a.id} className="border-b border-ink/10 align-top">
                    <td className="py-4 pr-4">
                      <span className="block font-medium text-ink">
                        {parseLocalDate(a.date).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-ink-muted">{formatTime(a.time, lang)}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="block font-medium text-ink">{a.name}</span>
                      <a href={`tel:${a.phone}`} className="block text-ink-muted underline underline-offset-2">
                        {a.phone}
                      </a>
                      <span className="block break-all text-xs text-ink-muted">{a.email}</span>
                      {a.notes && <span className="mt-1 block text-xs italic text-ink-muted">{a.notes}</span>}
                    </td>
                    <td className="py-4 pr-4">
                      {service ? L(service.name) : a.serviceId}
                      <span className="block text-xs text-ink-muted">{a.minutes} min</span>
                    </td>
                    <td className="py-4 pr-4">{specialist ? specialist.name : 'Any'}</td>
                    <td className="py-4 pr-4">
                      <StatusPill status={a.status} />
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {a.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => setStatus(a.id, 'approved')}
                            className="min-h-[36px] cursor-pointer border border-ink/25 px-3 text-xs font-semibold hover:border-ink"
                          >
                            Approve
                          </button>
                        )}
                        {a.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => setStatus(a.id, 'cancelled')}
                            className="min-h-[36px] cursor-pointer border border-rose-text/40 px-3 text-xs font-semibold text-rose-text hover:border-rose-text"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-16">
        <h2 className="text-[1.5rem]">Block time off</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Blocked slots disappear from the booking calendar.
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="block-date" className="field-label">Date</label>
            <input
              id="block-date"
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="block-time" className="field-label">Time</label>
            <input
              id="block-time"
              type="time"
              step={1800}
              value={blockTime}
              onChange={(e) => setBlockTime(e.target.value)}
              className="field-input"
            />
          </div>
          <button type="button" onClick={addBlock} className="btn-primary">
            Block
          </button>
        </div>

        {blocked.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {blocked.map((k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => removeBlock(k)}
                  className="min-h-[36px] cursor-pointer border border-ink/25 px-3 text-xs hover:border-rose-text hover:text-rose-text"
                  aria-label={`Remove block ${k}`}
                >
                  {k.replace('T', ' · ')} ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/15 bg-white/60 p-6">
      <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</dt>
      <dd className="mt-2 font-display text-[2rem] text-ink">{value}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: Appointment['status'] }) {
  const styles: Record<Appointment['status'], string> = {
    pending: 'border-gold-text/50 text-gold-text',
    approved: 'border-ink/30 text-ink',
    cancelled: 'border-rose-text/40 text-rose-text',
  };
  return (
    <span className={`inline-block border px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] ${styles[status]}`}>
      {status}
    </span>
  );
}

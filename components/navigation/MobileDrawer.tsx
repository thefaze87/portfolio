'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Submark } from '@/components/brand/Submark';
import { RoleLine } from '@/components/navigation/RoleLine';
import { type NavLink } from '@/lib/nav';

/**
 * MobileDrawer — hamburger trigger + full-screen navigation dialog.
 *
 * Rendered by the Header below the `md` breakpoint. Hand-built (not a
 * shadcn/Radix Sheet) so it stays token-pure and dependency-free, while
 * still meeting the dialog a11y contract:
 *   - role="dialog" + aria-modal, labelled.
 *   - Focus moves into the panel on open, is trapped within it (Tab /
 *     Shift+Tab cycle), and returns to the trigger on close.
 *   - Escape closes; body scroll is locked while open.
 *
 * Client Component — it owns open state and keyboard/scroll side effects.
 * Entrance motion is intentionally minimal and inherits the global
 * prefers-reduced-motion reset.
 */

interface MobileDrawerProps {
  links: readonly NavLink[];
  className?: string;
}

export function MobileDrawer({ links, className }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];
    focusables[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = prevOverflow;
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cn('inline-flex items-center justify-center', className)}
        style={{
          width: 'var(--space-7)',
          height: 'var(--space-7)',
          color: 'var(--color-text)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50"
          style={{ background: 'var(--color-bg)' }}
        >
          <div
            ref={panelRef}
            className="mx-auto flex h-full flex-col"
            style={{
              maxWidth: 'var(--container-default)',
              paddingInline: 'var(--container-gutter)',
              paddingBlock: 'var(--space-5)',
            }}
          >
            <div className="flex items-center justify-end">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center"
                style={{
                  width: 'var(--space-7)',
                  height: 'var(--space-7)',
                  color: 'var(--color-text)',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>

            <nav
              aria-label="Primary"
              className="flex flex-1 flex-col justify-center"
              style={{ gap: 'var(--space-5)' }}
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--color-text)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div
              className="flex flex-col"
              style={{
                gap: 'var(--space-4)',
                paddingTop: 'var(--space-6)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <RoleLine />
              <Submark name="topology" size={20} aria-label="Mark Fasel systems mark" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

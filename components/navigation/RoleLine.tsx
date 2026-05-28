import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { SITE_ROLES } from '@/lib/nav';

/**
 * RoleLine — the three-part role tagline, rendered so it can only ever
 * break *between* roles.
 *
 * Each "role + trailing ·" is one nowrap unit, separated by ordinary
 * (breakable) spaces. Consequences:
 *   - A role never splits mid-phrase ("Engineering"/"Leader").
 *   - The · always rides at the end of a line, never the start of a
 *     wrapped one.
 *
 * mono-label / muted treatment. Server-safe (no hooks) so it composes into
 * both the server Footer and the client MobileDrawer.
 */
export function RoleLine({ className }: { className?: string }) {
  return (
    <p
      className={cn('type-mono-label', className)}
      style={{ color: 'var(--color-text-muted)', margin: 0 }}
    >
      {SITE_ROLES.map((role, i) => (
        <Fragment key={role}>
          {i > 0 ? ' ' : ''}
          <span style={{ whiteSpace: 'nowrap' }}>
            {role}
            {i < SITE_ROLES.length - 1 ? ' ·' : ''}
          </span>
        </Fragment>
      ))}
    </p>
  );
}

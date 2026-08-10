import { cn } from '@/lib/utils';

/**
 * Form field primitives.
 *
 * The accessibility contract is enforced by construction rather than left to
 * each call site: <Field> owns the id wiring, so a control is always
 * associated with its label, and its description + error are always reachable
 * via aria-describedby. Consumers supply a name and content; they cannot
 * accidentally ship an unlabelled input.
 *
 *   <Field name="email" label="Email" required error={errors.email?.message}>
 *     {(p) => <Input type="email" {...p} {...register('email')} />}
 *   </Field>
 *
 * The render-prop shape exists so the control receives the generated ids
 * without <Field> having to know which control it wraps (input vs textarea
 * vs select) or how it's registered.
 *
 * Server-safe — these are presentational. The contact form's Client Component
 * supplies the register/state.
 */

export interface FieldControlProps {
  id: string;
  name: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
}

interface FieldProps {
  name: string;
  label: string;
  children: (props: FieldControlProps) => React.ReactNode;
  /** Helper text below the label. Announced with the control. */
  description?: string;
  /** Validation message. Presence switches the field into its error state. */
  error?: string;
  required?: boolean;
  className?: string;
}

export function Field({
  name,
  label,
  children,
  description,
  error,
  required = false,
  className,
}: FieldProps) {
  const id = `field-${name}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col', className)} style={{ gap: 'var(--space-2)' }}>
      <label htmlFor={id} className="type-body-sm" style={{ color: 'var(--color-text)' }}>
        {label}
        {!required && (
          <span style={{ color: 'var(--color-text-dim)' }}>
            {' '}
            <span aria-hidden="true">·</span> optional
          </span>
        )}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="type-body-sm"
          style={{ color: 'var(--color-text-muted)', margin: 0 }}
        >
          {description}
        </p>
      )}

      {children({
        id,
        name,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}

      {error && (
        <p
          id={errorId}
          className="type-body-sm"
          style={{ color: 'var(--color-danger)', margin: 0 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ============================================================================
 * Controls
 *
 * All three share `.field-control` (globals.css) so border, background,
 * radius, focus, and error styling are defined once. The error state is
 * driven off `aria-invalid`, which <Field> already sets — no separate
 * `error` prop to keep in sync.
 * ========================================================================== */

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn('field-control type-body', className)} />;
}

export function Textarea({
  className,
  rows = 6,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={rows} className={cn('field-control type-body', className)} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn('field-control type-body', className)}>
      {children}
    </select>
  );
}

/**
 * Honeypot — a field real users never see and never focus, but naive bots
 * fill in. Submissions with a value here are silently discarded server-side.
 *
 * Deliberately NOT `display: none`: some bots skip hidden fields. It's pulled
 * off-screen instead, plus aria-hidden and tabIndex -1 so assistive tech and
 * keyboard users never reach it, and autoComplete off so password managers
 * don't populate it.
 */
export function HoneypotField({
  name,
  ...props
}: { name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div aria-hidden="true" className="honeypot">
      <label htmlFor={`field-${name}`}>Do not fill this in</label>
      <input
        {...props}
        id={`field-${name}`}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

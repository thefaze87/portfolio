'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Field, HoneypotField, Input, Select, Textarea } from '@/components/ui/Field';
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  TIMELINES,
  contactSchema,
  type ContactFormValues,
} from '@/lib/schemas/contact';
import { submitContact } from '../actions';

/**
 * ContactForm — the site's only Client Component beyond the mobile drawer.
 *
 * State model (the four states the styleguide documents):
 *   idle       → fields editable, submit enabled
 *   submitting → submit disabled + busy label, aria-busy on the form
 *   success    → form replaced by a confirmation, focus moved to it
 *   error      → banner above the form, focus moved to it, **all entered
 *                values preserved** because react-hook-form owns them and we
 *                never reset on failure
 *
 * Validation runs on submit, then re-validates on change once a field has
 * errored — so a visitor isn't scolded mid-typing but does get immediate
 * confirmation when they fix something.
 *
 * The action is called directly rather than via `<form action>`: RHF holds the
 * values, which is what makes error-state preservation automatic. The
 * trade-off is that the form needs JS — acceptable, since RHF requires it
 * regardless.
 */
export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      message: '',
      company: '',
      role: '',
      projectType: '',
      budget: '',
      timeline: '',
      website: '',
    },
  });

  /**
   * Move focus to whichever outcome just rendered.
   *
   * This runs in an effect rather than inside the submit handler because the
   * target element doesn't exist until after the status change has committed
   * — and reading a ref during the handler that triggers the render is
   * exactly the pattern the react-hooks/refs rule flags.
   *
   * Without it, a screen-reader user is left focused on a submit button that
   * may no longer exist, with no announcement of what happened.
   */
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus('submitting');
    setFormError(null);

    const result = await submitContact(values);

    if (result.ok) {
      setStatus('success');
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ContactFormValues, { type: 'server', message });
      }
    }
    setFormError(result.error);
    setStatus('error');
  });

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        style={{
          padding: 'var(--space-7)',
          border: 'var(--stroke-thin) solid var(--color-accent)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <h2 className="type-h2">Message sent.</h2>
        <p
          className="type-body-lg"
          style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
        >
          Thanks — it&apos;s in my inbox. I read every message personally and reply within two
          business days.
        </p>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting}>
      {formError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="type-body"
          style={{
            marginBottom: 'var(--space-6)',
            padding: 'var(--space-4) var(--space-5)',
            color: 'var(--color-text)',
            border: 'var(--stroke-thin) solid var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {formError}
        </div>
      )}

      <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
        {/* Required-field legend. Placed BEFORE the first field, in DOM order,
         * so a screen-reader user meets the convention before the first
         * asterisk rather than after the last one. The asterisk here is not
         * aria-hidden — unlike the ones on the labels, this is the single
         * place where the glyph itself is the subject of the sentence. */}
        <p className="type-body-sm" style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          <span style={{ color: 'var(--color-accent)' }}>*</span> indicates a required field
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--space-6)' }}>
          <Field name="name" label="Name" required error={errors.name?.message}>
            {(p) => <Input {...p} {...register('name')} type="text" autoComplete="name" />}
          </Field>

          <Field name="email" label="Email" required error={errors.email?.message}>
            {(p) => <Input {...p} {...register('email')} type="email" autoComplete="email" />}
          </Field>

          <Field name="company" label="Company" error={errors.company?.message}>
            {(p) => (
              <Input {...p} {...register('company')} type="text" autoComplete="organization" />
            )}
          </Field>

          <Field name="role" label="Role" error={errors.role?.message}>
            {(p) => (
              <Input {...p} {...register('role')} type="text" autoComplete="organization-title" />
            )}
          </Field>

          {/* The three qualification selects.
           *
           * Each placeholder is `disabled` so it cannot be chosen again once
           * the visitor has answered — a required field whose empty state is
           * re-selectable invites exactly the error the requirement exists to
           * prevent. It stays rendered (not removed) because it is what shows
           * "nothing chosen yet" on first paint.
           *
           * Every list ends with a genuine uncertainty option, so requiring an
           * answer never forces an invented one. See lib/schemas/contact.ts. */}
          <Field
            name="projectType"
            label="Project type"
            required
            error={errors.projectType?.message}
          >
            {(p) => (
              <Select {...p} {...register('projectType')}>
                <option value="" disabled>
                  Select one
                </option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field name="budget" label="Budget range" required error={errors.budget?.message}>
            {(p) => (
              <Select {...p} {...register('budget')}>
                <option value="" disabled>
                  Select one
                </option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field name="timeline" label="Timeline" required error={errors.timeline?.message}>
            {(p) => (
              <Select {...p} {...register('timeline')}>
                <option value="" disabled>
                  Select one
                </option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field
          name="message"
          label="Message"
          required
          description="What are you working on, and what's the outcome you're after?"
          error={errors.message?.message}
        >
          {(p) => <Textarea {...p} {...register('message')} rows={7} />}
        </Field>

        {/* Registered with RHF so its value travels with the payload the
         * action receives — an unregistered input would never be submitted. */}
        <HoneypotField {...register('website')} />

        <div>
          <Button type="submit" variant="primary" size="lg" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </Button>
        </div>
      </div>
    </form>
  );
}

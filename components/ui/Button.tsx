import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Button — the site's single interactive affordance.
 *
 * Replaces the previous pattern of applying a bare `.cta-*` global class and
 * passing padding inline at each call site, which had already produced three
 * different button sizes with no size scale.
 *
 * Variants:
 *   - `primary` — orange fill, near-black label. **The one orange interactive
 *     element per viewport.** If a viewport already has a primary Button, the
 *     next one must be ghost. This is a brand rule, not a preference.
 *   - `ghost`   — bordered, transparent. The default for secondary actions.
 *   - `text`    — label only, accent on hover. For editorial "read more" links
 *     where a bordered control would be too loud.
 *
 * Sizes: sm (nav) · md (default) · lg (page-level CTAs, form submits).
 *
 * Renders as:
 *   - `next/link` when `href` is internal
 *   - `<a>` when `href` is external (adds rel + a visually-hidden
 *     "(opens in a new tab)" cue automatically)
 *   - `<button>` otherwise
 *
 * Server Component — no client JS unless a consumer passes handlers, in which
 * case the consumer is already a Client Component.
 */

export type ButtonVariant = 'primary' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'cta-primary',
  ghost: 'cta-ghost',
  text: 'cta-text',
};

/** Size owns both the padding and the label's type scale. Keeping them
 *  together prevents the mismatch that arises when a caller overrides one
 *  and not the other. */
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'btn-sm type-body-sm',
  md: 'btn-md type-body',
  lg: 'btn-lg type-body',
};

type CommonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Stretch to the width of the parent — used by the contact form submit. */
  fullWidth?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    href: string;
    /** Force the external treatment (new tab + rel + SR cue). Inferred from
     *  the href for absolute URLs, so this is only needed for edge cases. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { children, variant = 'ghost', size = 'md', className, fullWidth, ...rest } = props;

  const classes = cn(
    VARIANT_CLASS[variant],
    // `text` carries no box, so it takes no size padding — just the type.
    variant === 'text' ? 'type-body' : SIZE_CLASS[size],
    'inline-flex items-center justify-center',
    fullWidth && 'w-full',
    className,
  );

  if (rest.href === undefined) {
    const { href: _href, ...buttonProps } = rest as ButtonAsButton;
    return (
      <button type="button" {...buttonProps} className={classes}>
        {children}
      </button>
    );
  }

  const { href, external, ...anchorProps } = rest as ButtonAsLink;
  const isExternal = external ?? /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a {...anchorProps} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link {...anchorProps} href={href} className={classes}>
      {children}
    </Link>
  );
}

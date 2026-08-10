import { cn } from '@/lib/utils';

/**
 * Card — the bordered, flat content block.
 *
 * Consolidates a pattern that had already been hand-rolled in four places
 * (ArchitecturePhilosophy, ExperiencePrinciples, SelectedWork,
 * ExperienceRecommendations) with three different paddings. Padding is now a
 * prop with a fixed scale, so a fifth consumer can't invent a sixth value.
 *
 * No shadows — depth comes from the border and background layering, per the
 * design system. `as` lets a card be an <article>, <li>, or <figure> without
 * losing the styling, so semantics aren't sacrificed for looks.
 *
 * Server Component.
 */

type CardPadding = 'md' | 'lg';

const PADDING: Record<CardPadding, string> = {
  md: 'var(--space-6)',
  lg: 'var(--space-7)',
};

interface CardProps {
  children: React.ReactNode;
  as?: 'div' | 'article' | 'li' | 'figure' | 'section';
  padding?: CardPadding;
  /** Adds a hover affordance. Only for cards that are themselves a link. */
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({
  children,
  as: Tag = 'div',
  padding = 'md',
  interactive = false,
  className,
  style,
}: CardProps) {
  return (
    <Tag
      className={cn('flex flex-col', interactive && 'card-interactive', className)}
      style={{
        padding: PADDING[padding],
        border: 'var(--stroke-hairline) solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        height: '100%',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

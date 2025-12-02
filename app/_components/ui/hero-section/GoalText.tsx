import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { HERO_CONTENT } from '@/app/_constants/hero';

interface GoalTextProps {
  mounted: boolean;
  transitionDelay: number;
  className?: string;
}

/**
 * GoalText Component
 * 
 * Displays the goal text with emphasis on key phrases.
 * 
 * @param mounted - Whether the component is mounted and should animate
 * @param transitionDelay - Delay for the entrance animation in milliseconds
 * @param className - Additional CSS classes
 */
export const GoalText: React.FC<GoalTextProps> = React.memo(({ 
  mounted, 
  transitionDelay,
  className = '' 
}) => {
  if (typeof transitionDelay !== 'number' || transitionDelay < 0) {
    console.error('GoalText: transitionDelay debe ser un número positivo');
    return null;
  }

  return (
    <p
      className={`text-base text-gray-400 leading-relaxed ${ANIMATION_CLASSES.FADE_IN_FROM_BOTTOM(mounted)} ${className}`}
      style={{ transitionDelay: mounted ? `${transitionDelay}ms` : '0ms' }}
    >
      {HERO_CONTENT.GOAL_TEXT.PREFIX} <span className="font-bold">{HERO_CONTENT.GOAL_TEXT.EMPHASIS_1}</span>
      <br />
      {HERO_CONTENT.GOAL_TEXT.CONNECTOR} <span className="font-bold">{HERO_CONTENT.GOAL_TEXT.EMPHASIS_2}</span> {HERO_CONTENT.GOAL_TEXT.SUFFIX}
    </p>
  );
});

GoalText.displayName = 'GoalText';


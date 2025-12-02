import React from 'react';
import { ProjectButton } from './ProjectButton';
import { ArrowButton } from './ArrowButton';
import { GoalText } from './GoalText';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';

interface MobileLayoutProps {
  mounted: boolean;
}

/**
 * MobileLayout Component
 * 
 * Mobile layout for the hero section with title, subtitle, goal text, and buttons.
 * 
 * @param mounted - Whether the component is mounted and should animate
 */
export const MobileLayout: React.FC<MobileLayoutProps> = React.memo(({ mounted }) => {
  return (
    <div className="lg:hidden flex flex-col">
      <h1
        aria-label="Full-stack"
        className={`text-4xl md:text-6xl font-semibold leading-none mb-4 ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(mounted)}`}
        style={{ transitionDelay: mounted ? `${ANIMATION_DELAYS.TITLE_DELAY}ms` : '0ms' }}
      >
        Full-stack
      </h1>

      <h2
        className={`text-4xl md:text-6xl font-semibold leading-none mb-6 ${ANIMATION_CLASSES.FADE_IN_FROM_LEFT(mounted)}`}
        style={{ transitionDelay: mounted ? `${ANIMATION_DELAYS.TITLE_DELAY + ANIMATION_DELAYS.MOBILE_DEVELOPER_OFFSET}ms` : '0ms' }}
      >
        Developer
      </h2>

      <GoalText 
        mounted={mounted} 
        transitionDelay={ANIMATION_DELAYS.GOAL_TEXT_DELAY + ANIMATION_DELAYS.MOBILE_GOAL_TEXT_OFFSET}
        className="mb-6 text-sm md:text-base"
      />

      <div className="flex items-center gap-4">
        <ProjectButton
          href="/projects"
          mounted={mounted}
          transitionDelay={ANIMATION_DELAYS.BUTTON_DELAY + ANIMATION_DELAYS.MOBILE_BUTTON_OFFSET}
        >
          <span className="italic">Projects</span>
        </ProjectButton>

        <ArrowButton
          href="/projects"
          mounted={mounted}
          transitionDelay={ANIMATION_DELAYS.ARROW_DELAY + ANIMATION_DELAYS.MOBILE_ARROW_OFFSET}
          size="md"
        />
      </div>
    </div>
  );
});

MobileLayout.displayName = 'MobileLayout';


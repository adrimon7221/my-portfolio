import React from 'react';
import { ProjectButton } from './ProjectButton';
import { ArrowButton } from './ArrowButton';
import { GoalText } from './GoalText';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';

interface DesktopLayoutProps {
  mounted: boolean;
}

/**
 * DesktopLayout Component
 * 
 * Desktop layout for the hero section with title, buttons, goal text, and subtitle.
 * 
 * @param mounted - Whether the component is mounted and should animate
 */
export const DesktopLayout: React.FC<DesktopLayoutProps> = React.memo(({ mounted }) => {
  return (
    <div className="hidden lg:block">
      <div className="flex items-center justify-between mb-8">
        <h1
          aria-label="Full-stack"
          className={`text-xl lg:text-[8rem] font-semibold leading-none ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(mounted)}`}
          style={{ transitionDelay: mounted ? `${ANIMATION_DELAYS.TITLE_DELAY}ms` : '0ms' }}
        >
          Full-stack
        </h1>

        <div className="flex items-center gap-4 self-center">
          <ProjectButton
            href="/projects"
            mounted={mounted}
            transitionDelay={ANIMATION_DELAYS.BUTTON_DELAY}
          >
            <span className="italic">Projects</span>
          </ProjectButton>

          <ArrowButton
            href="/projects"
            mounted={mounted}
            transitionDelay={ANIMATION_DELAYS.ARROW_DELAY}
            size="lg"
          />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="max-w-xs">
          <GoalText 
            mounted={mounted} 
            transitionDelay={ANIMATION_DELAYS.GOAL_TEXT_DELAY}
          />
        </div>

        <h2
          className={`text-8xl lg:text-[8rem] font-semibold leading-none ${ANIMATION_CLASSES.FADE_IN_FROM_LEFT(mounted)}`}
          style={{ transitionDelay: mounted ? `${ANIMATION_DELAYS.DEVELOPER_DELAY}ms` : '0ms' }}
        >
          Developer
        </h2>
      </div>
    </div>
  );
});

DesktopLayout.displayName = 'DesktopLayout';


import React, { useState, useRef, ReactNode } from 'react';
import cx from 'classnames';

import { Text } from '@kit';

import s from './index.module.scss';

export type TooltipProps = {
  children: ReactNode;
  content: string;
  className?: string;
};

export const Tooltip: React.FC<React.HTMLProps<HTMLDivElement> & TooltipProps> = React.memo(
  (props) => {
    const [hover, setHover] = useState(false);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      hoverTimeout.current = setTimeout(() => {
        setHover(true);
      }, 300);
    };

    const handleMouseLeave = () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
        hoverTimeout.current = null;
      }
      setHover(false);
    };

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex flex-col items-center"
      >
        {hover && (
          <div className="absolute left-0 top-24 mx-auto flex w-full items-center justify-center z-10 min-w-[290rem]">
            <div className="mx-auto flex flex-col items-center justify-center">
              <div
                className={cx(
                  'rounded-[6rem] bg-white-10 px-16 py-8 w-full border border-white-10',
                  s.bg,
                  props.className
                )}
              >
                <Text message={props.content} size="r14" />
              </div>
            </div>
          </div>
        )}
        {props.children}
      </div>
    );
  }
);

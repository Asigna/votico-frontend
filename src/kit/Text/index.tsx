import React from 'react';
import cx from 'classnames';

import { textSizes, colors } from '@/kit/util/constants.ts';

export type TextSize = (typeof textSizes)[number];
export type TextColor = (typeof colors)[number];

export type TextProps = {
  tag?: string;
  href?: string;
  target?: string;
  size?: TextSize;
  sizeSm?: TextSize;
  html?: boolean;
  className?: string;
  font?: 'inter' | 'titillium';
  color?: TextColor;
  message: string | number;
  type?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const Text = React.memo(
  React.forwardRef<HTMLElement, TextProps>((props, ref) => {
    const {
      className,
      tag = 'div',
      font = 'inter',
      message,
      size = 'r14',
      sizeSm = '',
      color = 'white',
      html,
      onClick,
      ...otherProps
    } = props;

    if (onClick && tag !== 'button') {
      throw new Error(
        'You can\'t use "onClick" without passing tag === "button". Create components ADA friendly!'
      );
    }

    const rootClassName = cx(
      sizeSm ? [`text-${sizeSm} sm:text-${size}`] : [`text-${size}`],
      [`text-font-${font}`],
      [`text-${color}`],
      className
    );
    // const rootClassName = cx([`text-${size}`], [`text-font-${font}`], [`text-${color}`], className);
    const htmlProps = {
      ...otherProps,
      ref,
      onClick,
      className: rootClassName,
    };

    if (html) {
      return React.createElement(tag, {
        ...htmlProps,
        dangerouslySetInnerHTML: {
          __html: message,
        },
      });
    }

    return React.createElement(tag, htmlProps, message);
  })
);

Text.displayName = 'Text';

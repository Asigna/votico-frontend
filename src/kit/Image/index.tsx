import React, { useMemo, forwardRef, CSSProperties } from 'react';
import cx from 'classnames';

import { colors } from '../util/constants.ts';

import s from './index.module.scss';

export type Color = (typeof colors)[number];

type Sizes = {
  w: number;
  h: number;
};

export type ImageProps = {
  className?: string;
  src: React.ReactNode;
  size: number | Sizes;
  color?: Color;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  alt?: string;
};

export const Image = React.memo(
  forwardRef<HTMLDivElement, ImageProps>((props, ref) => {
    const { className, src, color, size, style, fullWidth, ...rest } = props;

    const styles = useMemo(() => {
      const isNum = typeof size === 'number';

      const width = fullWidth ? '100%' : isNum ? `${size}rem` : `${size.w}rem`;
      const height = isNum ? `${size}rem` : `${size.h}rem`;

      const dimensions: CSSProperties = {
        width,
        height,
        minWidth: width,
      };

      const imageUrl = `url(${src})`;

      if (color) {
        return {
          ...dimensions,
          maskImage: imageUrl,
          WebkitMaskImage: imageUrl,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center center',
          WebkitMaskSize: 'contain',
        };
      }

      return {
        ...dimensions,
        backgroundImage: imageUrl,
        ...style,
      };
    }, [src, size, color, style, fullWidth]);

    if (!src) {
      console.error('You must pass the image src');
      return null;
    }

    return (
      <span
        ref={ref}
        {...rest}
        className={cx(className, s.image, 'inline-block', {
          [`bg-${color}`]: Boolean(color),
        })}
        style={styles}
      />
    );
  })
);

Image.displayName = 'Image';

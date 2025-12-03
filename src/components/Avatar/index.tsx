import React, { useRef, useEffect, useState } from 'react';
import cx from 'classnames';

import { Image as ImageComponent } from '@kit';
import liquidium from '@images/logo/liquidium.png';
import { renderIcon } from './util';

import s from './index.module.scss';

export type AvatarProps = {
  className?: string;
  src?: string;
  uniqueString: string;
  size: number;
};

export const Avatar: React.FC<AvatarProps> = React.memo((props) => {
  const { className, uniqueString, size, src } = props;
  const [hasError, setError] = useState(false);

  const avatarCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (avatarCanvas.current && uniqueString && hasError) {
      renderIcon({ seed: uniqueString, size: 8, scale: 15 }, avatarCanvas.current);
    }
  }, [uniqueString, hasError]);

  useEffect(() => {
    const img = new Image();
    img.src = src || '';

    const handleError = () => {
      setError(true);
    };

    img.onerror = handleError;
  }, [src]);

  if (uniqueString === '661d495505ffada5d66388d5') {
    //TODO: temporary for project liquidium
    return (
      <div
        className={cx(className, 'relative overflow-hidden bg-white-20 rounded-[50%]')}
        style={{ width: size, height: size }}
      >
        <img className="absolute top-0 left-0 w-full h-full" src={liquidium} alt="" />
      </div>
    );
  } else if (hasError || !src) {
    return (
      <div
        className={cx(className, 'relative overflow-hidden bg-white-20 rounded-[50%]')}
        style={{ width: size, height: size }}
      >
        <canvas
          className={cx(s.avatar, 'absolute top-0 left-0 w-full h-full')}
          ref={avatarCanvas}
        />
      </div>
    );
  }

  return <ImageComponent className="bg-white-20 rounded-[50%]" size={size} src={src} />;
});

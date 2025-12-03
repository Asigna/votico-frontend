import React, { startTransition, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Image, Button } from '@kit';
import ufoImage from '@images/ufo.png';
import paths from '@constants/paths';

export const NotFound404: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    startTransition(() => {
      navigate(`/${paths.EXPLORE}`);
    });
  }, [navigate]);

  return (
    <div className="flex items-center flex-col gap-32 mt-[144rem]">
      <div className="flex items-center flex-col gap-[56rem]">
        <Image src={ufoImage} size={{ w: 176, h: 80 }} />
        <Text size="s22" message="Page not found" font="titillium" />
      </div>
      <Button
        className="max-w-[336rem] w-full"
        message="Go Home"
        size="md"
        onClick={handleGoHome}
      />
    </div>
  );
};

import React, { startTransition, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Image, Button } from '@kit';
import keyboardImage from '@images/keyboard.png';
import paths from '@constants/paths';

export const ErrorElement: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    startTransition(() => {
      navigate(`/${paths.EXPLORE}`);
    });
  }, [navigate]);

  return (
    <div className="flex items-center flex-col gap-32 mt-[144rem]">
      <div className="flex items-center flex-col gap-[56rem]">
        <Image src={keyboardImage} size={{ w: 164, h: 144 }} />
        <Text size="s22" message="Something went wrong" font="titillium" />
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

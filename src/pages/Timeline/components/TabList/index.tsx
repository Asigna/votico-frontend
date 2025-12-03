import React from 'react';
import cx from 'classnames';
import { Link, useParams } from 'react-router-dom';

import { Text } from '@kit';
import paths from '@constants/paths.ts';

export type TabListProps = {
  activeTab: 'proposal' | 'about' | 'assets';
};

export const TabList: React.FC<TabListProps> = React.memo((props) => {
  const { activeTab } = props;
  const { projectId } = useParams();

  return (
    <div className="flex items-center gap-4 sm:gap-8">
      <Link
        to={`/${paths.TIMELINE}/${projectId}`}
        className={cx(
          'border flex w-fit px-8 sm:px-20 rounded-[21rem] h-[40rem] sm:h-[48rem] items-center',
          activeTab === 'proposal' ? 'border-white  bg-white-5' : 'bg-white-3 border-white-3'
        )}
      >
        <Text message="Proposals" size="m14" sizeSm="r13" />
      </Link>
      <Link
        to={`/${paths.TIMELINE}/${projectId}/about`}
        className={cx(
          'border bg-white-5 flex w-fit px-8 sm:px-20 rounded-[21rem] h-[40rem] sm:h-[48rem] items-center',
          activeTab === 'about' ? 'border-white  bg-white-5' : 'bg-white-3 border-white-3'
        )}
      >
        <Text message="About" size="m14" sizeSm="r13" />
      </Link>
      <Link
        to={`/${paths.TIMELINE}/${projectId}/assets`}
        className={cx(
          'border bg-white-5 flex w-fit px-8 sm:px-20 rounded-[21rem] h-[40rem] sm:h-[48rem] items-center',
          activeTab === 'assets' ? 'border-white  bg-white-5' : 'bg-white-3 border-white-3'
        )}
      >
        <Text message="Assets Tracked" size="m14" sizeSm="r13" />
      </Link>
    </div>
  );
});

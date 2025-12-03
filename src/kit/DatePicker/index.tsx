import React from 'react';
import cx from 'classnames';

import { Text } from '../Text';
import { Image } from '../Image';
import calendarIcon from '@images/calendar.svg';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/airbnb.css';
import '../../scss/calendar.scss';
import s from './index.module.scss';
import { Instance } from 'flatpickr/dist/types/instance';

type DatePickerProps = {
  label?: string;
  value?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (dates: Date[], currentDateString: string, self: Instance, data?: never) => void;
  className?: string;
  addHour?: number;
};

export const DatePicker: React.FC<DatePickerProps> = React.memo((props) => {
  const { label, value, placeholder, disabled, error, onChange, className, addHour = 0 } = props;

  return (
    <div
      className={cx(
        'relative flex flex-col items-start max-w-[456rem] gap-8',
        {
          [s.disabled]: disabled,
        },
        className
      )}
    >
      {label && <Text message={label} size="m14" color="regular" />}

      <div className={cx('h-[48rem] relative flex items-center w-full max-w-[456rem]', className)}>
        <Flatpickr
          placeholder={placeholder || ''}
          data-enable-time
          options={{
            dateFormat: 'Y-m-d H:i',
            time_24hr: true,
            minuteIncrement: 1,
            // minDate: new Date(),
            minDate: new Date(Date.now() + addHour * 60 * 60 * 1000),
          }}
          value={value ? +new Date(+value) : +new Date()}
          onClose={onChange}
          className={cx(s.input, 'h-full w-full text-m16 rounded-[8rem] px-16 pr-44 z-10')}
        />
        <Image src={calendarIcon} size={20} className="absolute right-16 z-0" />
      </div>
      {error && <Text message={error} size="m14" color="red" />}
    </div>
  );
});

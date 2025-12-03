import React from 'react';

import { Text, Button, Input, TextArea, Toggle, Dropdown } from '@kit';
import { Project } from '@pages/utils/types';
import { Controller } from 'react-hook-form';
import useGeneral from './utils/useGeneral';

const initialTags = ['DAO', 'Community', 'Swap'];

type GeneralProps = {
  project: Project;
};

export const General: React.FC<GeneralProps> = React.memo((props) => {
  const { project } = props;
  const { textAreaValue, onSubmit, register, handleSubmit, control, errors, reset, isDirty } =
    useGeneral(project);

  const handleResetForm = () => {
    reset();
  };

  return (
    <div className="flex flex-col gap-24 animate-bottom-top">
      <div className="container">
        <Text size="s22" font="titillium" message="Profile" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            placeholder="Name"
            className="w-full mt-24"
            {...register('name', { required: 'Field name is required' })}
            error={errors.name?.message}
          />
          <TextArea
            label="About"
            placeholder="What is your project about?"
            className="w-full mt-24"
            limit={1000}
            value={textAreaValue}
            error={errors.about?.message}
            {...register('about', {
              required: 'Field about is required',
              validate: (value) => {
                if (value.length > 1000) {
                  return `Max length > 1000 characters`;
                }
                return true;
              },
            })}
          />
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Dropdown
                selected={field.value}
                items={initialTags}
                label="Tags"
                placeHolder="Select your tags"
                isMultiple
                onChange={(newSelected) => {
                  field.onChange(newSelected);
                }}
                className="min-w-[140rem] w-full mt-24"
              />
            )}
          />
          <Input
            label="Website"
            placeholder="https://example.com"
            className="w-full mt-24"
            {...register('website')}
          />
          <Input
            label="Terms of service"
            placeholder="Paste link here"
            className="w-full mt-24"
            {...register('termsLink')}
          />
          <div className="mt-16 flex items-center">
            <Controller
              control={control}
              name="isHidden"
              render={({ field }) => (
                <Toggle
                  isActive={field.value}
                  onClick={() => {
                    field.onChange(!field.value);
                  }}
                />
              )}
            />
            <Text size="m14" message="Hide project from homepage" className="ml-16" />
          </div>

          <div className="mt-16 pt-16 border-t border-white-10">
            <Text size="s22" font="titillium" message="Socials" />
            <div className="grid grid-cols-2 gap-16 mt-16">
              <Input
                label="X (Twitter)"
                placeholder="Paste link here"
                className="w-full"
                {...register('socials.twitter')}
              />
              <Input
                label="Github"
                placeholder="Paste link here"
                className="w-full"
                {...register('socials.github')}
              />
              <Input
                label="CoinGecko"
                placeholder="Paste link here"
                className="w-full"
                {...register('socials.coingecko')}
              />
              <Input
                label="Telegram"
                placeholder="Paste link here"
                className="w-full"
                {...register('socials.telegram')}
              />
              <Input
                label="Discord"
                placeholder="Paste link here"
                className="w-full"
                {...register('socials.discord')}
              />
            </div>
          </div>
        </form>
        <div className="flex mt-24 gap-16 justify-end">
          <Button
            className="min-w-[112rem] sm:min-w-[148rem]"
            message="Cancel edits"
            size="sm"
            colorType="secondary"
            onClick={handleResetForm}
          />
          <Button
            className="min-w-[112rem] sm:min-w-[148rem]"
            message="Save"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty}
          />
        </div>
      </div>
    </div>
  );
});

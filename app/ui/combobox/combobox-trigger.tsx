PopoverTrigger;
import { PopoverTriggerProps } from '@radix-ui/react-popover';
import React from 'react';
import { PopoverTrigger } from '../popover';
import { ComboboxMultipleTriggerImpl } from './combobox-multiple-trigger-impl';
import { ComboboxSingleTriggerImpl } from './combobox-single-trigger-impl';
import { useCombobox } from './index';

export interface ComboboxTriggerProps extends PopoverTriggerProps {
	placeholder?: string;
}

export const ComboboxTrigger = React.forwardRef<
	HTMLButtonElement,
	ComboboxTriggerProps
>((rest, ref) => {
	const { type, label, error, helpText } = useCombobox();

	return (
		<PopoverTrigger ref={ref} {...rest} className="flex flex-col w-full">
			{label && (
				<label className="text-gray-900 font-medium text-sm mb-1">
					{label}
				</label>
			)}
			{type === 'single' ? (
				<ComboboxSingleTriggerImpl />
			) : (
				<ComboboxMultipleTriggerImpl />
			)}

			{error && <small className="text-red-500 cursor-default">{error}</small>}
			{helpText && (
				<small className="text-gray-500 cursor-default">{helpText}</small>
			)}
		</PopoverTrigger>
	);
});

ComboboxTrigger.displayName = "ComboboxTrigger"
import { CheckIcon } from '@heroicons/react/20/solid';
import React, { ComponentProps } from 'react';
import { useCombobox } from './';
import { cn } from '@/app/utils/cn';

interface ComboboxItemProps<TOptionData>
	extends Omit<ComponentProps<'li'>, 'value'> {
	option: TOptionData;
}

export const ComboboxItem = <TOptionData,>({
	option,
	className,
	...rest
}: ComboboxItemProps<TOptionData>) => {
	const {
		selectedOptions,
		type,
		keyExtractor,
		displayValueGetter,
		onDeselect,
		onMultipleSelect,
		onSingleSelect,
	} = useCombobox();

	const isDataSelected = React.useMemo(() => {
		return !!selectedOptions.find((selectedOption) => {
			const selectedOptionKey = keyExtractor(selectedOption);
			const optionKey = keyExtractor(option);
			return selectedOptionKey === optionKey;
		});
	}, [selectedOptions, option]);

	const optionLabel = React.useMemo(() => displayValueGetter(option), [option]);

	function handleOptionClick() {
		if (isDataSelected) {
			return onDeselect(option);
		}

		if (type === 'multiple') {
			return onMultipleSelect(option);
		}

		onSingleSelect(option);
	}

	return (
		<li
			className={cn(
				'relative flex justify-between select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-indigo-50 cursor-pointer',
				isDataSelected
					? 'text-white bg-indigo-600 hover:bg-indigo-600/80'
					: 'text-gray-900',
				className,
			)}
			onClick={handleOptionClick}
			{...rest}
		>
			{optionLabel}
			{isDataSelected && <CheckIcon className="h-4 w-4" />}
		</li>
	);
};

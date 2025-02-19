import { cn } from '@/app/utils/cn';
import React from 'react';
import { useCombobox } from './index';

interface ComboboxViewToggleProps extends React.ComponentProps<'div'> {}

export const ComboboxViewToggle = React.forwardRef<
	HTMLDivElement,
	ComboboxViewToggleProps
>(({ className, ...rest }, ref) => {
	const { selectedOptions, optionsSource, setOptionsSource, type } =
		useCombobox();

	function handleButtonClick() {
		setOptionsSource((mode) => {
			if (mode === 'all' || mode === 'searched') {
				return 'selected';
			}

			return 'all';
		});
	}

	if (type !== 'multiple' || selectedOptions.length === 0) {
		return null;
	}

	return (
		<div ref={ref} className={cn('border-t p-1 mt-1', className)} {...rest}>
			<button
				className="w-full text-sm h-9 rounded-md shadow-sm bg-white hover:bg-gray-200 disabled:hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-500  transition-colors active:cursor-pointer"
				onClick={handleButtonClick}
			>
				Mostrar {optionsSource === 'all' ? 'apenas os selecionados' : 'todos'}
			</button>
		</div>
	);
});

ComboboxViewToggle.displayName = "ComboboxViewToggle"
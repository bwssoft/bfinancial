import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import React, { ComponentProps } from 'react';
import { useCombobox } from './';
import { useDebounce } from '@/app/hook/use-debounce';
import { cn } from '@/app/utils/cn';

interface ComboboxMultipleSearchProps extends ComponentProps<'input'> {}

export const ComboboxMultipleSearch = React.forwardRef<
	HTMLInputElement,
	ComboboxMultipleSearchProps
>(({ className, ...props }, ref) => {
	const {
		setQuery,
		optionsSource,
		setOptionsSource,
		selectedOptions,
		onSearchChange,
		type,
		useSearchChangeDebounce,
		searchChangeDebounceDelay,
	} = useCombobox();

	const handleInputChangeDebounce = useDebounce(
		handleInputChange,
		searchChangeDebounceDelay || 500,
	);

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (optionsSource === 'all') {
			setOptionsSource('searched');
		}

		if (optionsSource !== 'selected' && onSearchChange) {
			onSearchChange(event.target.value, selectedOptions);
		}

		setQuery(event.target.value);
	}

	if (type !== 'multiple') {
		return null;
	}

	return (
		<div className="flex items-center border-b px-3 group">
			<MagnifyingGlassIcon className="w-4 h-4 mr-2 shrink-0 opacity-50" />
			<input
				autoFocus
				ref={ref}
				placeholder="Pesquisar item..."
				onChange={(event) => {
					if (useSearchChangeDebounce) {
						handleInputChangeDebounce(event);
					} else {
						handleInputChange(event);
					}
				}}
				className={cn(
					'flex h-10 border-0 w-full rounded-md bg-transparent focus-visible:ring-0 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				{...props}
			/>
		</div>
	);
});

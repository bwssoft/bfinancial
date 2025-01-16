import {
	ArrowPathIcon,
	ChevronDownIcon,
	XMarkIcon,
} from '@heroicons/react/20/solid';
import { cn } from '@/app/utils/cn';
import React from 'react';
import { useCombobox } from './index';
import { useDebounce } from '@/app/hook/use-debounce';

interface ComboboxSingleTriggerProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ComboboxSingleTriggerImpl = ({
	className,
	...rest
}: ComboboxSingleTriggerProps) => {
	const {
		isLoading,
		isOptionsOpened,
		selectedOptions,
		setSelectedOptions,
		setIsOptionsOpened,
		behavior,
		query,
		setQuery,
		optionsSource,
		setOptionsSource,
		onReset,
		placeholder,
		onSearchChange,
		disabled,
		useSearchChangeDebounce,
		searchChangeDebounceDelay,
		error,
	} = useCombobox();

	const hasSelectedItem = React.useMemo(() => {
		if (selectedOptions.length === 1) {
			return true;
		}

		return false;
	}, [selectedOptions]);

	const handleInputFocus = () => {
		if (!isOptionsOpened) {
			setIsOptionsOpened(true);

			if (behavior === 'search' && optionsSource !== 'all') {
				setOptionsSource('all');
			}
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (behavior == 'select' && selectedOptions) {
			setSelectedOptions?.([]);
		}

		if (optionsSource === 'all') {
			setOptionsSource('searched');
		}

		onSearchChange?.(event.target.value, selectedOptions);
	};

	const handleToggleClick = () => {
		setIsOptionsOpened((opened) => !opened);
	};

	const handleInputChangeDebounce = useDebounce(
		handleInputChange,
		searchChangeDebounceDelay || 500,
	);

	return (
		<div
			className={cn(
				'w-full flex items-center group gap-2 rounded-md',
				disabled && 'bg-gray-100',
			)}
		>
			<div
				className={cn(
					'flex h-9 items-center border border-gray-300 group-focus-within:ring-2 group-focus-within:ring-indigo-500 w-full rounded-md',
					error && 'border-red-500',
				)}
			>
				<input
					{...rest}
					type="text"
					disabled={disabled}
					placeholder={placeholder}
					value={query}
					onFocus={handleInputFocus}
					onChange={(event) => {
						setQuery(event.target.value);
						if (useSearchChangeDebounce) {
							handleInputChangeDebounce(event);
						} else {
							handleInputChange(event);
						}
					}}
					className={cn(
						'w-full h-full bg-transparent border-0 text-sm focus-visible:outline-none px-2 rounded-md border-gray-200 rounded-r-none border-r-0 focus-visible:ring-0',
						className,
					)}
				/>

				{hasSelectedItem && behavior !== 'search' && (
					<button
						type="button"
						onClick={onReset}
						className=" h-full px-3 hover:bg-gray-100 group-focus:ring-2 group-focus:ring-ring/20 focus-visible:border-primary/70 animate-in slide-in-from-right-3 duration-200"
					>
						<XMarkIcon className="h-3.5 w-3.5" />
					</button>
				)}

				<div className="h-4 w-[1px] bg-gray-300" />

				<button
					type="button"
					disabled={disabled}
					onClick={handleToggleClick}
					className="px-3 h-full border-gray-200 hover:bg-gray-100 transition-colors rounded-l-none rounded-r-md"
				>
					{isLoading ? (
						<ArrowPathIcon className="animate-spin h-4 w-4" />
					) : (
						<ChevronDownIcon
							className={cn(
								'transition-transform duration-200 h-4 w-4',
								isOptionsOpened ? 'rotate-180' : 'rotate-0',
							)}
						/>
					)}
				</button>
			</div>
		</div>
	);
};

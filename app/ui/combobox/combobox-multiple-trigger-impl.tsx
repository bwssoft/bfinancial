import React from 'react';
import { useCombobox } from './';

import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { motion } from 'framer-motion';
import { cn } from '@/app/utils/cn';

interface ComboboxMultipleTriggerImplProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ComboboxMultipleTriggerImpl = <TData,>({
	className,
	...rest
}: ComboboxMultipleTriggerImplProps) => {
	const {
		isOptionsOpened,
		setIsOptionsOpened,
		displayValueGetter,
		isLoading,
		disabled,
		selectedOptions,
		placeholder,
		onDeselect,
	} = useCombobox();

	const multipleInputRef = React.useRef<HTMLButtonElement>(null);

	function handleComboboxClick(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		if (!isOptionsOpened) {
			return setIsOptionsOpened(true);
		}

		event.stopPropagation();
	}

	function handleOptionClick(
		option: TData,
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		onDeselect(option);
		event.stopPropagation();
	}

	function handleToggleClick() {
		setIsOptionsOpened((opened) => !opened);
	}

	return (
		<div
			className={cn(
				'flex w-full border border-gray-300 rounded-md items-center h-9',
				isOptionsOpened && 'ring-2 ring-indigo-500',
				disabled && 'bg-gray-100',
			)}
		>
			<button
				type="button"
				disabled={disabled}
				ref={multipleInputRef}
				onClick={handleComboboxClick}
				className={cn(
					'flex gap-1 relative items-center h-full w-full overflow-hidden bg-transparent py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-primary/70',
					className,
				)}
				{...rest}
			>
				{selectedOptions.length === 0 && placeholder ? (
					<span className="px-3 text-gray-400">{placeholder}</span>
				) : (
					<motion.div
						drag="x"
						className="absolute flex items-center gap-1 px-3"
						dragConstraints={multipleInputRef}
					>
						{selectedOptions.map((data, index) => (
							<div
								key={index}
								className="flex items-center animate-in slide-in-from-left-2"
							>
								<div className="border px-2 h-6 cursor-pointer font-semibold text-xs rounded-md rounded-r-none border-r-0 flex items-center whitespace-nowrap text-indigo-800 bg-indigo-200/70">
									{displayValueGetter(data)}
								</div>
								<button
									type="button"
									onClick={(event) => handleOptionClick(data, event)}
									className="border px-2 h-6 font-semibold hover:bg-indigo-200 text-xs rounded-md rounded-l-none transition-all border-r-0 flex items-center whitespace-nowrap text-gray-800 bg-indigo-200/70"
								>
									<XMarkIcon className="w-3.5 h-3.5" />
								</button>
							</div>
						))}
					</motion.div>
				)}
			</button>

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
	);
};

import { ArrowPathIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useCombobox } from './';
import { cn } from '@/app/utils/cn';

interface ComboboxLoadingProps extends React.ComponentProps<'div'> {}

export const ComboboxLoading = React.forwardRef<
	HTMLDivElement,
	ComboboxLoadingProps
>(({ className, ...rest }, ref) => {
	const { isLoading, options, selectedOptions, type } = useCombobox();

	if (!isLoading || (options?.length !== 0 && selectedOptions?.length !== 0)) {
		return null;
	}

	if (type !== 'multiple' && options.length !== 0) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn(
				'p-2 flex flex-col h-32 gap-2 text-gray-500 items-center justify-center',
				className,
			)}
			{...rest}
		>
			<ArrowPathIcon className="animate-spin h-4 w-4" />
			<span className="text-sm">Buscando opções disponíveis</span>
		</div>
	);
});

ComboboxLoading.displayName = "ComboboxLoading"
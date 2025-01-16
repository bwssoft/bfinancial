import React from 'react';
import { useCombobox } from './';
import { cn } from '@/app/utils/cn';

interface ComboboxEmptyProps extends React.ComponentProps<'div'> {}

export const ComboboxEmpty = React.forwardRef<
	HTMLDivElement,
	ComboboxEmptyProps
>(({ className, ...rest }, ref) => {
	const { options, behavior, isLoading } = useCombobox();

	if ((options && options.length !== 0) || isLoading) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn(
				'flex p-2 items-center h-28 justify-center',
				behavior === 'search' && 'flex-col h-32',
				className,
			)}
			{...rest}
		>
			{behavior === 'search' ? (
				<span className="text-gray-500 text-sm px-4 text-center">
					Nenhuma sugestão encontrada. Utilizaremos o texto inserido no campo.
				</span>
			) : (
				<span className="text-gray-500 text-sm">Nenhum item encontrado</span>
			)}
		</div>
	);
});

ComboboxEmpty.displayName = 'ComboboxEmpty';

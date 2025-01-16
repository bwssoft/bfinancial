import { useCombobox } from './';
import { ComboboxItem } from './combobox-item';

export const ComboboxContent = () => {
	const { behavior, options } = useCombobox();
	return (
		<div className="overflow-y-auto h-full p-1 z-[500]">
			<ul className="space-y-0.5">
				{behavior === 'search' && (
					<li className="px-2 py-1.5 text-xs text-gray-500">
						<span>Sugestões de auto-preenchimento</span>
					</li>
				)}

				{options?.map((option) => (
					<ComboboxItem key={option.id} option={option} />
				))}
			</ul>
		</div>
	);
};

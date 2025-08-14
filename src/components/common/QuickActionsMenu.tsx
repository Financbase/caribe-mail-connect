import React from 'react';
import { Plus, Scan, Bell, UserPlus, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface QuickActionsMenuProps {
	onAction?: (action: 'scan' | 'notify' | 'customer' | 'search') => void;
}

export function QuickActionsMenu({ onAction }: QuickActionsMenuProps) {
	const { language } = useLanguage();
	const [open, setOpen] = React.useState(false);
	const listRef = React.useRef<HTMLDivElement>(null);
	const isSpanish = language === 'es';

	const actions = [
		{ id: 'scan', label: isSpanish ? 'Escanear' : 'Scan', icon: <Scan className="h-5 w-5" /> },
		{ id: 'notify', label: isSpanish ? 'Notificar' : 'Notify', icon: <Bell className="h-5 w-5" /> },
		{ id: 'customer', label: isSpanish ? 'Cliente' : 'Customer', icon: <UserPlus className="h-5 w-5" /> },
		{ id: 'search', label: isSpanish ? 'Buscar' : 'Search', icon: <Search className="h-5 w-5" /> },
	] as const;

	const handleAction = (id: typeof actions[number]['id']) => () => {
		onAction?.(id);
		setOpen(false);
	};

	const menuId = 'quick-actions-menu';

	const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!listRef.current) return;
		const items = Array.from(listRef.current.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]'));
		const active = document.activeElement as HTMLButtonElement | null;
		const index = items.findIndex((el) => el === active);
		if (e.key === 'Escape') {
			setOpen(false);
			(document.getElementById(menuId + '-trigger') as HTMLButtonElement | null)?.focus();
			e.preventDefault();
			return;
		}
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
			let nextIndex = index;
			if (e.key === 'Home') nextIndex = 0;
			else if (e.key === 'End') nextIndex = items.length - 1;
			else nextIndex = (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
			items[nextIndex]?.focus();
			e.preventDefault();
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
			{/* Expanded actions */}
			{open && (
			<div className="transition-all duration-200 origin-bottom-right opacity-100 translate-y-0">
				<div
					id={menuId}
					ref={listRef}
					role="menu"
					aria-label={isSpanish ? 'Acciones rápidas' : 'Quick actions'}
					aria-orientation="vertical"
					className="mb-3 flex flex-col items-end gap-2"
					onKeyDown={onMenuKeyDown}
				>
					{actions.map((a) => (
						<button
							key={a.id}
							type="button"
							onClick={handleAction(a.id)}
							className="h-12 px-3 rounded-full shadow-lg bg-white text-gray-900 hover:bg-gray-50 flex items-center gap-2 min-w-[44px]"
							role="menuitem"
							aria-label={a.label}
						>
							<span className="sr-only">{a.label}</span>
							{a.icon}
							<span className="text-sm font-medium min-w-[84px] text-right">{a.label}</span>
						</button>
					))}
				</div>
			</div>
			)}

			{/* FAB */}
			<Button
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-label={open ? (isSpanish ? 'Cerrar acciones rápidas' : 'Close quick actions') : (isSpanish ? 'Abrir acciones rápidas' : 'Open quick actions')}
				aria-haspopup="menu"
				aria-controls={menuId}
				id={menuId + '-trigger'}
				className="rounded-full h-14 w-14 shadow-xl flex items-center justify-center"
				style={{ backgroundColor: '#FF6B35' }}
			>
				<Plus className={`h-7 w-7 text-white transition-transform ${open ? 'rotate-45' : ''}`} />
			</Button>
		</div>
	);
}

export default QuickActionsMenu;

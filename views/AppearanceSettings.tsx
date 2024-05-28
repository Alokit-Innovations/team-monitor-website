import React, { useState } from 'react';
import Select from '../components/Select';
import { Theme } from '../utils/theme';

type ThemeOptions = Theme | 'system';

const AppearanceSettings: React.FC = () => {
	const [theme, setTheme] = useState<ThemeOptions>(localStorage.getItem('preferredTheme') as ThemeOptions || 'system');

	const handleThemeChange = (newTheme: ThemeOptions) => {
		setTheme(newTheme);
		localStorage.setItem('preferredTheme', newTheme);

		window.location.reload();
	};

	const options: { value: ThemeOptions, label: string }[] = [
		{ value: 'system', label: 'System default' },
		{ value: 'dark', label: 'Dark mode' },
		{ value: 'light', label: 'Light mode' },
	];

	return (
		<div className='flex w-full gap-2 p-4 items-center'>
			<h2 className='grow'>Choose your theme</h2>
			<Select
				optionsType="theme"
				options={options}
				onValueChange={handleThemeChange}
				defaultValue={theme}
				className='min-w-48'
			/>
		</div>
	);
};

export default AppearanceSettings;

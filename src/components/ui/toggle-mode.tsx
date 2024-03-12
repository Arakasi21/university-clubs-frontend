'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

    useEffect(() => {
        setIsDarkMode(theme === 'dark');
    }, [theme]);

    const handleToggle = (newCheckedState) => {
        const newTheme = newCheckedState ? 'dark' : 'light';
        setTheme(newTheme);
    };



    return (
        <div className="flex items-center space-x-2">
            <Switch id="theme-mode" checked={isDarkMode} onCheckedChange={handleToggle} />

            {
                isDarkMode ? (
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                ) : (
                    <Label htmlFor="theme-mode">White Mode</Label>
                )
            }


        </div>
    );
}

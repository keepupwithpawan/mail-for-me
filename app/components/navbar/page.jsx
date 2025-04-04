'use client';

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
    const [theme, setTheme] = useState('light');

    // Effect to initialize theme from localStorage and apply system preference
    useEffect(() => {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme');

        // If no saved theme, check system preference
        if (!savedTheme) {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDarkMode ? 'dark' : 'light';
            setTheme(initialTheme);
            applyTheme(initialTheme);
        } else {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    // Function to apply theme
    const applyTheme = (selectedTheme) => {
        // Remove existing theme classes
        document.documentElement.classList.remove('light', 'dark');

        // Add selected theme class
        document.documentElement.classList.add(selectedTheme);

        // Save to localStorage
        localStorage.setItem('theme', selectedTheme);
    };

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    return (
        <div className="top-0 w-[90%] h-[13vh] m-auto flex items-center justify-between">
            <li className="list-none">MFM</li>
            <ul className="flex w-[25%] justify-between items-center list-none">
                <li className="about cursor-pointer">About</li>
                <li className="contact cursor-pointer">Contact</li>
                <li
                    className="theme cursor-pointer"
                    onClick={toggleTheme}
                >
                    {theme === 'light' ? <Moon /> : <Sun />}
                </li>
            </ul>
        </div>
    );
}
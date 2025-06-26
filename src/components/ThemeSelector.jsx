import { useThemeContext } from '../theme/ThemeContext';
import { useState } from 'react';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import ComputerRoundedIcon from '@mui/icons-material/ComputerRounded';
import '../styles/ThemeSelector.css';

export default function ThemeSelector({ fontSize = '1em'}) {
  const { theme, setTheme } = useThemeContext();

  return (
    <div className="theme-selector">
      <div className={`selector-bg ${theme}`} />
      <button
        className={`light-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => setTheme('light')}
        aria-label="Light mode"
      >
        <LightModeRoundedIcon sx={{fontSize}}/>
      </button>
      <button
        className={`system-btn ${theme === 'system' ? 'active' : ''}`}
        onClick={() => setTheme('system')}
        aria-label="System mode"
      >
        <ComputerRoundedIcon sx={{fontSize}}/>
      </button>
      <button
        className={`dark-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
        aria-label="Dark mode"
      >
        <DarkModeRoundedIcon sx={{fontSize}}/>
      </button>
    </div>
  );
}
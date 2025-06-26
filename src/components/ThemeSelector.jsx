import { useState } from 'react';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import ComputerRoundedIcon from '@mui/icons-material/ComputerRounded';
import '../styles/ThemeSelector.css';

export default function ThemeSelector({ fontSize = '1em'}) {
  const [theme, setTheme] = useState('system'); // 'light', 'system', 'dark'

  return (
    <div className="theme-selector">
      <div className={`selector-bg ${theme}`} />
      <button
        className={`light-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => setTheme('light')}
      >
        <LightModeRoundedIcon sx={{fontSize: {fontSize} }}/>
      </button>
      <button
        className={`system-btn ${theme === 'system' ? 'active' : ''}`}
        onClick={() => setTheme('system')}
      >
        <ComputerRoundedIcon sx={{fontSize: {fontSize}}}/>
      </button>
      <button
        className={`dark-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
      >
        <DarkModeRoundedIcon sx={{fontSize: {fontSize}}}/>
      </button>
    </div>
  );
}
'use client';

import { useApp } from '@/context/AppContext';

export default function Logo({ variant = 'header', height = '50px' }) {
  const { theme } = useApp();

  // 1. Icon-Only Version (e.g. for small widgets)
  if (variant === 'icon') {
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ height, width: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="24" fill="#0B1F3A"/>
        <rect x="45" y="80" width="40" height="10" rx="2" fill="#F4A300"/>
        <rect x="45" y="98" width="60" height="10" rx="2" fill="#E63946"/>
        <rect x="45" y="116" width="80" height="10" rx="2" fill="#FAF9F6"/>
        <polygon points="130,75 130,135 170,105" fill="#E63946"/>
      </svg>
    );
  }

  // 2. Dark Mode / Reverse Version (for dark navy background in footer, or when dark theme is enabled in header)
  if (variant === 'dark' || (variant === 'header' && theme === 'dark')) {
    return (
      <svg width="600" height="180" viewBox="0 0 600 180" style={{ height, width: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect x="15" y="60" width="35" height="8" rx="2" fill="#F4A300"/>
          <rect x="15" y="76" width="55" height="8" rx="2" fill="#E63946"/>
          <rect x="15" y="92" width="75" height="8" rx="2" fill="#FAFAFA"/>
          <polygon points="95,55 95,105 130,80" fill="#E63946"/>
        </g>
        <text x="150" y="100" fontFamily="'Playfair Display', Georgia, serif" fontSize="48" fontWeight="700" fill="#FFFFFF">
          TRUTH<tspan fill="#FF6B6B">VELOCITY</tspan>
        </text>
        <text x="152" y="125" fontFamily="'Roboto Condensed', Arial, sans-serif" fontSize="13" letterSpacing="3" fill="#CCCCCC">
          NEWS THAT MOVES FAST
        </text>
        <rect x="152" y="132" width="330" height="3" fill="#F4A300"/>
      </svg>
    );
  }

  // 3. Primary Horizontal Logo (Default light theme)
  return (
    <svg width="600" height="180" viewBox="0 0 600 180" style={{ height, width: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect x="15" y="60" width="35" height="8" rx="2" fill="#F4A300"/>
        <rect x="15" y="76" width="55" height="8" rx="2" fill="#E63946"/>
        <rect x="15" y="92" width="75" height="8" rx="2" fill="#0B1F3A"/>
        <polygon points="95,55 95,105 130,80" fill="#E63946"/>
      </g>
      <text x="150" y="100" fontFamily="'Playfair Display', Georgia, serif" fontSize="48" fontWeight="700" fill="#0B1F3A">
        TRUTH<tspan fill="#E63946">VELOCITY</tspan>
      </text>
      <text x="152" y="125" fontFamily="'Roboto Condensed', Arial, sans-serif" fontSize="13" letterSpacing="3" fill="#666666">
        NEWS THAT MOVES FAST
      </text>
      <rect x="152" y="132" width="330" height="3" fill="#F4A300"/>
    </svg>
  );
}

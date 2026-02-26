/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Greens — primary palette
        soil:         '#2d5a27',
        'soil-mid':   '#3d7a35',
        'soil-light': '#4a9040',
        leaf:         '#5fb84a',
        sprout:       '#89d46f',
        mint:         '#c0e8b4',
        meadow:       '#d4f0ca',
        // Whites & surfaces
        cream:        '#ffffff',
        parchment:    '#fffef8',
        mist:         '#f4fbf0',
        dew:          '#edf6e8',
        fog:          '#f0f8ec',
        // Warm earth
        wheat:        '#f0e4b8',
        grain:        '#ead9a0',
        bark:         '#7c5c2a',
        mud:          '#a07840',
        amber:        '#c47d15',
        // Borders
        border:       '#d4e8cc',
        'border-strong': '#a8d49a',
        // Status
        danger:       '#dc2626',
        'danger-light': '#fff1f0',
        caution:      '#d97706',
        'caution-light': '#fffbeb',
        success:      '#16a34a',
        'success-light': '#f0fdf4',
        // Text
        ink:          '#1a2e16',
        'ink-mid':    '#2e4a28',
        'ink-soft':   '#4a6840',
        'ink-muted':  '#7a9470',
        'ink-faint':  '#a8bca0',
      },
      fontFamily: {
        display: ['"Yeseva One"', '"Playfair Display"', 'serif'],
        body:    ['"Nunito"', 'system-ui', 'sans-serif'],
        hindi:   ['"Noto Sans Devanagari"', 'sans-serif'],
        lora:    ['"Lora"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        field: '16px',
        pill:  '999px',
      },
      boxShadow: {
        leaf:      '0 2px 12px rgba(45,90,39,0.08), 0 1px 3px rgba(45,90,39,0.05)',
        'leaf-lg': '0 8px 40px rgba(45,90,39,0.14)',
        'leaf-xl': '0 16px 60px rgba(45,90,39,0.18)',
        inner:     'inset 0 2px 8px rgba(45,90,39,0.07)',
        warm:      '0 4px 20px rgba(124,92,42,0.12)',
        card:      '0 2px 12px rgba(45,90,39,0.07), 0 1px 3px rgba(45,90,39,0.04)',
      },
    },
  },
  plugins: [],
}

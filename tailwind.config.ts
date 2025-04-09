import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				netflix: {
					background: '#141414',
					red: '#E50914',
					black: '#000000',
					dark: '#181818',
					gray: '#808080',
					white: '#E5E5E5',
					hover: '#333333'
				},
				spotify: {
					dark: '#121212',
					card: '#181818',
					light: '#282828',
					green: '#1DB954',
					accent: '#9b87f5',
					border: '#333333',
					text: '#FFFFFF',
					subtext: '#B3B3B3',
					bright: {
						background: '#FFFFFF',
						card: '#F8F8F8',
						accent: '#1DB954',
						text: '#121212',
						subtext: '#6A6A6A',
						border: '#E0E0E0',
						hover: '#EFEFEF'
					}
				},
				modern: {
					dark: '#0A0A0A',
					card: '#121212',
					accent: '#E50914',
					secondary: '#FF3B30',
					border: '#E5091433',
					tag: '#121212',
					highlight: '#E50914',
					text: '#FFFFFF',
					subtext: '#9e9e9e',
					overlay: 'rgba(0, 0, 0, 0.85)',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'card-hover': {
					'0%': { transform: 'scale(1.0)' },
					'100%': { transform: 'scale(1.05)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 0 0px rgba(29, 185, 84, 0)', 
						background: 'rgba(29, 185, 84, 0.6)' 
					},
					'50%': { 
						boxShadow: '0 0 20px 5px rgba(29, 185, 84, 0.3)', 
						background: 'rgba(29, 185, 84, 0.8)' 
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-500px 0' },
					'100%': { backgroundPosition: '500px 0' },
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'ping-slow': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'75%, 100%': { transform: 'scale(1.8)', opacity: '0' },
				},
				'rotate-glow': {
					'0%': { transform: 'rotate(0deg)', boxShadow: '0 0 10px rgba(29, 185, 84, 0.5)' },
					'50%': { transform: 'rotate(180deg)', boxShadow: '0 0 20px rgba(29, 185, 84, 0.7)' },
					'100%': { transform: 'rotate(360deg)', boxShadow: '0 0 10px rgba(29, 185, 84, 0.5)' },
				},
				'slide-in': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'pop': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 8px 2px rgba(29, 185, 84, 0.4)' },
					'50%': { boxShadow: '0 0 16px 4px rgba(29, 185, 84, 0.6)' },
				},
				'section-slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'card-hover': 'card-hover 0.3s ease-in-out forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
				'rotate-glow': 'rotate-glow 5s linear infinite',
				'slide-in': 'slide-in 0.4s ease-out forwards',
				'pop': 'pop 0.3s cubic-bezier(0.17, 0.67, 0.48, 1.32) forwards',
				'glow-pulse': 'glow-pulse 2s infinite',
				'section-slide-in': 'section-slide-in 0.5s ease-out forwards'
			},
			boxShadow: {
				'neon': '0 0 10px rgba(29, 185, 84, 0.7), 0 0 20px rgba(29, 185, 84, 0.4)',
				'neon-hover': '0 0 15px rgba(29, 185, 84, 0.8), 0 0 30px rgba(29, 185, 84, 0.5)',
				'neon-green': '0 0 10px rgba(46, 213, 115, 0.7), 0 0 20px rgba(46, 213, 115, 0.4)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

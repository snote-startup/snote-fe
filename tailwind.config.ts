const config = {
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#490aad',
                    foreground: '#ffffff',
                    deep: '#3a0186',
                    light: '#a171ff',
                    lightest: '#F7F6FF',
                },
                secondary: {
                    DEFAULT: '#F7F6FF',
                    foreground: '#030213',
                },
                accent: {
                    DEFAULT: '#F7F6FF',
                    foreground: '#030213',
                },
                ring: '#7a3dd4',
                border: 'rgba(73, 10, 173, 0.1)',
                sidebar: {
                    DEFAULT: '#FAFAFA',
                    primary: '#490aad',
                    accent: '#F7F6FF',
                    border: 'rgba(73, 10, 173, 0.08)',
                    ring: '#7a3dd4',
                },
            },
            borderRadius: {
                sm: 'calc(var(--radius) - 4px)',
                md: 'calc(var(--radius) - 2px)',
                lg: 'var(--radius)',
                xl: 'calc(var(--radius) + 4px)',
            },
            fontWeight: {
                normal: 'var(--font-weight-normal)',
                medium: 'var(--font-weight-medium)',
            },
        },
    },
};

export default config;

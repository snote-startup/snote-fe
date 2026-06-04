export const getApiUrl = (): string => {
    return (
        process.env.NEXT_PUBLIC_API_URL ??
        process.env.API_URL ??
        'http://localhost:8080'
    );
};

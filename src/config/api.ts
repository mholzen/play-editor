// In development, the proxy in package.json handles routing /api to the backend
// In production (Docker), we'll proxy /api to host.docker.internal:1300 using serve
export const API_BASE_URL = '/api';

// Utility function to build API URLs
export const buildApiUrl = (path: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Remove /api prefix if present to avoid double prefixing
    const withoutApiPrefix = cleanPath.startsWith('api/') ? cleanPath.slice(4) : cleanPath;
    return `${API_BASE_URL}/${withoutApiPrefix}`;
};

// Utility function for making GET requests
export const apiGet = async (path: string) => {
    const response = await fetch(buildApiUrl(path));
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Utility function for making POST requests
export const apiPost = async (path: string, data?: any) => {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data !== undefined) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(buildApiUrl(path), options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
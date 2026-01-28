import axios from 'axios';

// Automatically switch between localhost (dev) and relative paths (production).
// In production, leaving this empty allows the request to be relative (e.g., /api/pastes),
// which avoids CORS issues if served from the same domain or proxied correctly.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createPaste = async (data) => {
    // Send the paste content and settings to the backend to generate a unique ID
    const response = await api.post('/pastes', data);
    return response.data;
};

export const getPaste = async (id) => {
    // Fetch the specific paste data by its ID
    const response = await api.get(`/pastes/${id}`);
    return response.data;
};
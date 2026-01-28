import { useState } from 'react';
import { createPaste } from '../services/api';

export default function CreatePaste() {
    // Group form inputs together to keep state clean
    const [formData, setFormData] = useState({ content: '', ttl: '', views: '' });

    // Manage UI states (loading, error, success) separately from data
    const [status, setStatus] = useState({ loading: false, error: '', result: null });

    const handleSubmit = async (e) => {
        // Prevent default browser form submission (page reload)
        e.preventDefault();
        setStatus({ loading: true, error: '', result: null });

        try {
            // Transform the data before sending:
            // Inputs return strings, so we convert them to numbers.
            // Empty strings become 'undefined' so the backend treats them as optional fields.
            const payload = {
                content: formData.content,
                ttl_seconds: formData.ttl ? parseInt(formData.ttl) : undefined,
                max_views: formData.views ? parseInt(formData.views) : undefined,
            };

            const data = await createPaste(payload);
            setStatus({ loading: false, error: '', result: data });
        } catch (err) {
            // Safely extract the error message from the Axios response object
            const msg = err.response?.data?.error || err.response?.data?.details?.[0] || 'Failed to create paste';
            setStatus({ loading: false, error: msg, result: null });
        }
    };

    // If we have a result, show the "Success" view instead of the form
    if (status.result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center max-w-lg w-full">
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Paste Created!</h2>
                    <p className="text-gray-600 mb-4">Share this link:</p>

                    {/* Dynamically construct the full URL using the browser's current location */}
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm break-all select-all mb-6">
                        {window.location.origin}/p/{status.result.id}
                    </div>

                    <button
                        onClick={() => {
                            // Reset state to allow creating another paste immediately
                            setStatus({ loading: false, error: '', result: null });
                            setFormData({ content: '', ttl: '', views: '' });
                        }}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Create Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Pastebin Lite</h1>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                    <textarea
                        required
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-mono text-sm bg-gray-50"
                        placeholder="Paste your code or text here..."
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">TTL (Seconds)</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                            placeholder="e.g. 3600"
                            value={formData.ttl}
                            onChange={e => setFormData({ ...formData, ttl: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Views</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                            placeholder="e.g. 5"
                            value={formData.views}
                            onChange={e => setFormData({ ...formData, views: e.target.value })}
                        />
                    </div>
                </div>

                {status.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                        Error: {status.error}
                    </div>
                )}

                <button
                    disabled={status.loading}
                    className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50"
                >
                    {status.loading ? 'Creating...' : 'Create Paste'}
                </button>
            </form>
        </div>
    );
}
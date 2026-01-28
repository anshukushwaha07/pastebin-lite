import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaste } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

export default function ViewPaste() {
    // Get the paste ID from the URL (e.g. /p/abc12345)
    const { id } = useParams();

    // State management for fetching data
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch the paste data whenever the ID changes
    useEffect(() => {
        getPaste(id)
            .then(setData) // Success: store the paste content
            .catch(() => setError(true)) // Failure: show 404 if not found or expired
            .finally(() => setLoading(false)); // Always stop loading spinner
    }, [id]);

    // Show loading spinner while waiting for the backend
    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

    // Show 404 Error screen if paste is missing or expired
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-xl text-gray-600">This paste is unavailable or expired.</p>
                <Link to="/" className="mt-6 text-blue-600 hover:underline">Create New Paste</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex justify-center">
            {/* Main Card Container */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 flex flex-col">

                {/* Header: Contains ID, Navigation, and Metadata */}
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center text-sm">

                    {/* Left Side: Paste ID & 'New' Button */}
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900 text-base">Paste Id: {id}</span>

                        <Link
                            to="/"
                            className="bg-black text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800 transition"
                        >
                            + New
                        </Link>
                    </div>

                    {/* Right Side: Metadata (Views & Expiry) */}
                    <div className="flex gap-6 text-gray-600 mt-2 sm:mt-0">
                        {/* Only show views if the user set a limit */}
                        {data.remaining_views !== null && (
                            <span className="text-blue-600 font-semibold">
                                {data.remaining_views} views left
                            </span>
                        )}
                        {/* Show human-readable expiry time (e.g. "expires in 5 minutes") */}
                        {data.expires_at && (
                            <span>Expires {formatDistanceToNow(new Date(data.expires_at), { addSuffix: true })}</span>
                        )}
                    </div>
                </div>

                {/* Content Area: <pre> tag preserves line breaks and spacing */}
                {/* ensures the box doesn't look collapsed if content is short */}
                <pre className="p-6 md:p-8 overflow-auto whitespace-pre-wrap font-mono text-sm text-gray-800 bg-white min-h-75">
                    {data.content}
                </pre>
            </div>
        </div>
    );
}
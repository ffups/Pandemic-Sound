
import React, { useState, useEffect } from 'react';
import usePostRequest from "../../../../../Hooks/usePostRequest";
import { usePlaylists } from '../../../../../Hooks/PlaylistsProvider';
import "./addToPlaylistButton.css"
const AddToPlaylistButton = ({ track, activeTrackId, toggleDropdown, dropdownRef }) => {
    const { playlists, fetchPlaylists } = usePlaylists();
    const { sendPostRequest, isLoading, error: requestError } = usePostRequest();
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const handleAddToPlaylist = async (event, playlistId) => {
        event.preventDefault();
        event.stopPropagation();
        setError(null);
        try {
            await sendPostRequest(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                { uris: [track.uri] }
            );
            setShowSuccess(true);
            toggleDropdown(null);
            setTimeout(() => setShowSuccess(false), 3000);
            fetchPlaylists();
        } catch (err) {
            setError('Failed to add track to playlist');
            console.error('Failed to add track:', err);
            alert('Failed to add track. Please check the console for more details.');
        }

    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}
      
        >
            <button
                className="dropdown-button"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(track.id);
                }}
                aria-label="Add to playlist"

                disabled={isLoading}
            >

                               {isLoading ? '...' : 
                 showSuccess ? '✓ ' : 
                 isMobile ? '+' : 'Add to Playlist'}            </button>

            {activeTrackId === track.id && (
                <div className="dropdown-menu">
                    {playlists.slice(0, 30).map(playlist => (
                        <div
                            key={playlist.id}
                            className="dropdown-item"
                            onClick={(e) => handleAddToPlaylist(e, playlist.id)}
                        >
                            {playlist.name}
                        </div>
                    ))}
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {requestError && <div className="error-message">{requestError}</div>}
        </div>
    );
};


export default AddToPlaylistButton;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {useProfile} from "../../../../Hooks/Profile";
import useGetRequest from "../../../../Hooks/useGetRequest";
import usePutRequest from "../../../../Hooks/usePutRequest";
import AddToSavedTracks from "../PlaylistPage/AddTrackToPlaylist/AddToSavedTracks";
import AddToPlaylistButton from "../PlaylistPage/AddTrackToPlaylist/AddToPlaylistButton";
import { usePlaylists } from "../../../../Hooks/PlaylistsProvider";
import "./songPage.css";

const Song = () => {
  const [accessToken] = useState(localStorage.getItem("access_token"));
  const profile = useProfile();
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [embedUrl, setEmbedUrl] = useState();
  const { trackId } = useParams();
  const { data: trackData, error: trackError } = useGetRequest(`https://api.spotify.com/v1/tracks/${trackId}`, accessToken);
  const {playlists} = usePlaylists();
  const { error } = usePutRequest();

  useEffect(() => {  
    if (trackData) {
      fetch("https://open.spotify.com/oembed?url=" + trackData.external_urls.spotify)
        .then((resp) => resp.json())
        .then((json) => setEmbedUrl(json.iframe_url))
        .catch((err) => console.error(err));
    }
  }, [trackData, trackId, accessToken]);

  const toggleDropdown = (trackId) => {
    setActiveTrackId(prevId => prevId === trackId ? null : trackId);
  };

  if(!profile) return <div>Loading...</div>
  
  if (error || trackError) {
    return <div>Error: {error || trackError}</div>;
  }
  
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  
  return (
    <main className="songContainer">
      {trackData && (
        <div className="trackDetails">
          <div className="trackInfo">
            <h2 className="trackName">{trackData.name}</h2>
            <h3 className="trackArtistName">{trackData.artists[0].name}</h3>
            <p className="trackLength">
              Duration: {formatDuration(trackData.duration_ms)}
            </p>
          <div className="buttons-container">
            <AddToSavedTracks
                        track={trackData}
                        playlists={playlists}
                        activeTrackId={activeTrackId}
                      />
      {error && <p>Error: {error}</p>}
            <AddToPlaylistButton
              track={trackData}
              activeTrackId={activeTrackId}
              toggleDropdown={toggleDropdown}
            />
          </div>
          <div className="iframe-container">
            {embedUrl &&
              <iframe src={embedUrl} title="Spotify Embed"></iframe>
            }
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Song;
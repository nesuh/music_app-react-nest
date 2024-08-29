/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SongForm from './SongForm';
import { fetchSongs, deleteSong } from '../slices/songSlice';

// Emotion styles
const containerStyle = css`
  padding: 20px;
`;

const buttonStyle = css`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const listStyle = css`
  list-style: none;
  padding: 0;
`;

const listItemStyle = css`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const imgStyle = css`
  margin-left: 10px;
  max-width: 100px;
  border-radius: 5px;
  object-fit: cover;
`;

const SongList = () => {
  const dispatch = useDispatch();
  const { songs, loading, error } = useSelector((state) => state.songs);
  const [editingSong, setEditingSong] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  const handlePlay = (song) => {
    if (playingSong && playingSong.id === song.id) {
      audioRef.current.pause();
      setPlayingSong(null);
    } else {
      if (playingSong) {
        audioRef.current.pause();
      }
      setPlayingSong(song);
      const audioUrl = `http://localhost:3000${song.audioPath}`;
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
  };

  const handleCloseForm = () => {
    setEditingSong(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteSong(id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div css={containerStyle}>
      <button css={buttonStyle} onClick={() => setEditingSong({})}>Add New Song</button>
      {editingSong && <SongForm songToEdit={editingSong} onClose={handleCloseForm} />}
      <ul css={listStyle}>
        {songs.map((song) => (
          <li key={song.id} css={listItemStyle}>
            <span>{song.title} - {song.artist}</span>
            {song.imagePath && (
              <img
                src={`http://localhost:3000${song.imagePath}`}
                alt={song.title}
                css={imgStyle}
                onError={(e) => e.target.style.display = 'none'} // Hide broken images
              />
            )}
            <button css={buttonStyle} onClick={() => handlePlay(song)}>
              {playingSong && playingSong.id === song.id ? 'Pause' : 'Play'}
            </button>
            <button css={buttonStyle} onClick={() => handleEdit(song)}>Edit</button>
            <button css={buttonStyle} onClick={() => handleDelete(song.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <audio ref={audioRef} controls style={{ display: 'none' }} />
    </div>
  );
};

export default SongList;

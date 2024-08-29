// src/components/SongForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addSong, updateSong } from '../slices/songSlice';
import axios from 'axios';

const SongForm = ({ songToEdit, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [duration, setDuration] = useState('');
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (songToEdit) {
      setTitle(songToEdit.title || '');
      setArtist(songToEdit.artist || '');
      setAlbum(songToEdit.album || '');
      setDuration(songToEdit.duration || '');
    }
  }, [songToEdit]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImgChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !artist) {
      setError('Title and Artist are required');
      return;
    }

    // Create FormData instance
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('duration', duration);

    if (img) {
      formData.append('image', img);
    }

    if (file) {
      formData.append('audio', file);
    }

    try {
      const response = await axios.post('http://localhost:3000/songs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Extract file URLs from response
      const { imagePath, audioPath } = response.data;
      const songData = { title, artist, album, duration, img: imagePath, mp3: audioPath };

      if (songToEdit) {
        dispatch(updateSong({ id: songToEdit.id, updates: songData }));
      } else {
        dispatch(addSong(songData));
      }
      onClose();
    } catch (error) {
      setError('Failed to save the song.');
    }
  };

  return (
    <div>
      <h2>{songToEdit ? 'Edit Song' : 'Add Song'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="artist">Artist:</label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="album">Album:</label>
          <input
            type="text"
            id="album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="duration">Duration:</label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="img">Image:</label>
          <input
            type="file"
            id="img"
            accept="image/*"
            onChange={handleImgChange}
          />
        </div>
        <div>
          <label htmlFor="file">MP3 File:</label>
          <input
            type="file"
            id="file"
            accept="audio/mpeg"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">{songToEdit ? 'Update Song' : 'Add Song'}</button>
      </form>
    </div>
  );
};

export default SongForm;

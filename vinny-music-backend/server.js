const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend domain
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500', // Your frontend URL
    credentials: true
}));

// Serve static files from your frontend (optional)
app.use(express.static('public'));

// Store your music files in a protected directory
const MUSIC_DIR = path.join(__dirname, 'protected-music');

// Track configuration (this could be in a database in production)
const TRACKS = {
    'track1': {
        file: 'song1.m4a',
        format: 'm4a'
        title: 'Thank You',
        artist: 'Vinny Virtuoso',
        previewStart: 44,  // Start preview at 44 seconds
        previewDuration: 30
    },
    'track2': {
        file: 'song2.mp3',
        title: 'Your Song Title 2',
        artist: 'Vinny Virtuoso',
        previewStart: 45,
        previewDuration: 30
    },
    'track3': {
        file: 'song3.mp3',
        title: 'Your Song Title 3',
        artist: 'Vinny Virtuoso',
        previewStart: 30,
        previewDuration: 30
    }
};

// Basic authentication middleware (optional)
const checkAuth = (req, res, next) => {
    // You can add authentication logic here if needed
    // For now, we'll allow all requests
    next();
};

// Endpoint to get track metadata
app.get('/api/tracks', (req, res) => {
    // Send track info without file paths
    const trackInfo = {};
    Object.keys(TRACKS).forEach(id => {
        trackInfo[id] = {
            title: TRACKS[id].title,
            artist: TRACKS[id].artist,
            format: TRACKS[id].format,
            previewStart: TRACKS[id].previewStart || TRACKS[id].startTime,
            previewDuration: TRACKS[id].previewDuration,
            startTime: TRACKS[id].previewStart || 0
        };
    });
    res.json(trackInfo);
});

// Streaming endpoint
app.get('/api/stream/:trackId', checkAuth, (req, res) => {
    const trackId = req.params.trackId;
    const track = TRACKS[trackId];
    
    if (!track) {
        return res.status(404).json({ error: 'Track not found' });
    }
    
    const filePath = path.join(MUSIC_DIR, track.file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Determine MIME type based on file format
    let mimeType = 'audio/mpeg'; // default for mp3
    if (track.format === 'm4a' || track.file.endsWith('.m4a')) {
        mimeType = 'audio/mp4'; // M4A uses the audio/mp4 MIME type
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
        // Handle range requests for seeking
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType, // use determined MIME type
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': mimeType, // Use determined MIME type
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

// Update the metadata endpoint to include format info
app.get('/api/tracks', (req, res) => {
    const trackInfo = {};
    Object.keys(TRACKS).forEach(id => {
        trackInfo[id] = {
            title: TRACKS[id].title,
            artist: TRACKS[id].artist,
            format: TRACKS[id].format,
            previewStart: TRACKS[id].previewStart,
            previewDuration: TRACKS[id].previewDuration
        };
    });
    res.json(trackInfo);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Music streaming API available at http://localhost:${PORT}/api/stream/:trackId`);
});
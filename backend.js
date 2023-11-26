const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

const accessToken = 'ebe5ee4da347b0d8f8ee6191f9f3b222';

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('video'), async (req, res) => {
    const videoPath = req.file.path;

    try {
        // Загрузка видео на Vimeo
        const uploadUrl = await getUploadUrl();
        await uploadVideoToVimeo(uploadUrl, videoPath);

        // Удаление временного файла
        fs.unlinkSync(videoPath);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getUploadUrl() {
    const initiateUploadUrl = 'https://api.vimeo.com/me/videos';
    const response = await fetch(initiateUploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upload: { approach: 'post' } }),
    });

    const data = await response.json();
    return data.upload.upload_link;
}

async function uploadVideoToVimeo(uploadUrl, videoPath) {
    const videoFile = fs.readFileSync(videoPath);

    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'video/*',
        },
        body: videoFile,
    });

    if (!response.ok) {
        throw new Error('Error uploading video to Vimeo: ' + response.statusText);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

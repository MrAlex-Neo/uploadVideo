const accessToken = 'ebe5ee4da347b0d8f8ee6191f9f3b222';
const folderName = 'DesCloud';
let folderId;
let userId; // Определите переменную userId

function checkFolderExistenceAndUploadVideo() {
    // Проверяем существование папки
    checkFolderExistence(folderName)
        .then(folder => {
            if (folder) {
                // Папка существует, загружаем видео в эту папку
                folderId = folder.resource_key;
                userId = folder.user.resource_key;
                console.log(folderId);
                console.log(userId);
                initiateVideoUpload(folderId, userId);
            } else {
                // Папка не существует, создаем новую папку и загружаем видео после ее создания
                createFolder(folderName)
                    .then(newFolder => {
                        folderId = newFolder.resource_key;
                        userId = newFolder.user.resource_key;
                        initiateVideoUpload(folderId, userId);
                    })
                    .catch(error => alert('Error creating folder: ' + error));
            }
        })
        .catch(error => alert('Error checking folder existence: ' + error));
}

function checkFolderExistence(folderName) {
    return new Promise((resolve, reject) => {
        const checkFolderUrl = 'https://api.vimeo.com/me/projects';

        fetch(checkFolderUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                const folder = Array.isArray(data.data) ? data.data.find(item => item.name === folderName) : null;
                console.log(folder);
                resolve(folder);
            })
            .catch(error => reject(error));
    });
}

function createFolder(folderName) {
    return new Promise((resolve, reject) => {
        const createFolderUrl = 'https://api.vimeo.com/me/projects';

        fetch(createFolderUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: folderName }),
        })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

function initiateVideoUpload(folderId, userId) {
    const videoInput = document.getElementById('videoInput');
    const videoFile = videoInput.files[0];

    if (!videoFile) {
        alert('Please select a video file.');
        return;
    }

    const initiateUploadUrl = 'https://api.vimeo.com/me/videos';

    fetch(initiateUploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upload: { approach: 'post', size: videoFile.size }, name: videoFile.name, folder: folderId }),
    })
        .then(response => response.json())
        .then(data => {
            const uploadUrl = data.upload.upload_link;

            // Загружаем видео
            console.log(folderId);
            uploadVideoFile(uploadUrl, videoFile, data.uri, folderId, userId);
        })
        .catch(error => alert('Error initiating upload: ' + error));
}

function uploadVideoFile(uploadUrl, videoFile, videoUri, folderId, userId) {
    fetch(uploadUrl, {
        method: 'PUT',
        body: videoFile,
    })
        .then(response => {
            if (response.ok) {
                alert('Video uploaded successfully!');
                document.getElementById('videoInput').value = '';
                // Добавляем загруженное видео в папку DesCloud
                console.log(folderId);
                addToFolder(videoUri, folderId, userId);
            } else {
                alert('Error uploading video: ' + response.statusText);
            }
        })
        .catch(error => alert('Error uploading video: ' + error));
}

function addToFolder(videoUri, folderId, userId) {
    console.log(folderId);
    console.log(videoUri);
    const addToFolderUrl = `https://api.vimeo.com/users/${userId}/projects/${folderId}/items`;
    // const addToFolderUrl = `https://api.vimeo.com${videoUri}/projects/${folderId}/items`;

    fetch(addToFolderUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [{ uri: videoUri }] }),
    })
        .then(response => {
            if (response.ok) {
                alert('Video added to folder successfully!');
            } else {
                alert('Error adding video to folder: ' + response.statusText);
            }
        })
        .catch(error => alert('Error adding video to folder: ' + error));
}

checkFolderExistenceAndUploadVideo();

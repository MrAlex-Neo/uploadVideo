const KINESCOPE_AUTH_TOKEN = 'your_kinescope_auth_token';
const PARENT_ID = 'your_parent_id';
const TITLE = 'your_video_title';
const DESCRIPTION = 'your_video_description';

function uploadVideo() {
    const videoInput = document.getElementById('videoInput');
    const videoFile = videoInput.files[0];

    if (!videoFile) {
        alert('Please select a video file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', videoFile);

    const xhr = new XMLHttpRequest();
    const url = 'https://cors-anywhere.herokuapp.com/https://uploader.kinescope.io/v2/video';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + KINESCOPE_AUTH_TOKEN);
    xhr.setRequestHeader('X-Parent-ID', PARENT_ID);
    xhr.setRequestHeader('X-Video-Title', TITLE);
    xhr.setRequestHeader('X-Video-Description', DESCRIPTION);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                if (response.id) {
                    alert('Video uploaded successfully! Video ID: ' + response.id);

                    // Отправить videoId на ваш бекенд
                    sendVideoIdToBackend(response.id);
                } else {
                    alert('Error: Video ID not found in the response.');
                }
            } else {
                alert('Error uploading video: ' + xhr.statusText);
            }
        }
    };

    xhr.send(formData);
}

function sendVideoIdToBackend(videoId) {
    // Здесь вы можете использовать fetch или другой метод для отправки videoId на ваш бекенд
    // использование fetch:
    fetch('your_backend_endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId: videoId }),
    })
        .then(response => response.json())
        .then(data => console.log('Video ID sent to backend:', data))
        .catch(error => console.error('Error sending video ID to backend:', error));
}


// const accessToken = 'YOUR_ACCESS_TOKEN';

// function uploadVideo() {
//     const videoInput = document.getElementById('videoInput');
//     const videoFile = videoInput.files[0];

//     if (!videoFile) {
//         alert('Please select a video file.');
//         return;
//     }

//     const xhr = new XMLHttpRequest();
//     const url = 'https://api.vimeo.com/me/videos';

//     xhr.open('POST', url, true);
//     xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 const response = JSON.parse(xhr.responseText);
//                 const uploadUrl = response.upload.link;

//                 // Загрузка видео
//                 const uploadXhr = new XMLHttpRequest();
//                 uploadXhr.open('PUT', uploadUrl, true);
//                 uploadXhr.setRequestHeader('Content-Type', 'video/*');

//                 uploadXhr.onreadystatechange = function () {
//                     if (uploadXhr.readyState === 4) {
//                         if (uploadXhr.status === 200) {
//                             alert('Video uploaded successfully!');
//                         } else {
//                             alert('Error uploading video: ' + uploadXhr.statusText);
//                         }
//                     }
//                 };

//                 uploadXhr.send(videoFile);
//             } else {
//                 alert('Error initiating upload: ' + xhr.statusText);
//             }
//         }
//     };

//     xhr.send(JSON.stringify({ upload: { approach: 'post' } }));
// }



// Из соображений безопасности, выполнение запросов на загрузку файлов
// на стороне клиента(в браузере) с использованием чистого JavaScript 
// ограничивается политиками Same - Origin Policy(SOP) и CORS(Cross - Origin Resource Sharing).
// Это предотвращает отправку запросов к другим доменам из JavaScript на стороне клиента без соответствующих заголовков CORS на сервере.

// Однако, вы можете использовать сторонние сервисы, предоставляющие прокси для обхода политики CORS. Один из таких сервисов — CORS Anywhere.
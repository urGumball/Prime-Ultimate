// --- CONFIGURATION ---
        const API_KEY = 'AIzaSyBqyj6k5Nd_Zg6el75mOITECEclI3Eko1I'; 
        const UPLOADS_PLAYLIST_ID = 'UU34SFOOp9QiG_h8IbJA0CUQ';
        // ---------------------

        // Extract Channel ID from the Uploads Playlist ID (e.g., UUabc -> UCabc)
        const CHANNEL_ID = 'UC' + UPLOADS_PLAYLIST_ID.slice(2);

        async function initChannelFeed() {
            await fetchChannelInfo();
            await loadChannelVideos();
        }

        // 1. Fetch Channel Icon and Name
        async function fetchChannelInfo() {
            try {
                const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    const snippet = data.items[0].snippet;
                    document.getElementById('channel-title').innerText = snippet.title;
                    
                    const iconImg = document.getElementById('channel-icon');
                    iconImg.src = snippet.thumbnails.default.url;
                    iconImg.style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching channel info:', error);
                document.getElementById('channel-title').innerText = 'Channel Feed';
            }
        }

        // 2. Fetch Channel Videos
        async function loadChannelVideos() {
            try {
                const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=6&key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    renderVideos(data.items);
                    
                    // Automatically load the very first video into the player on start
                    const firstVideoId = data.items[0].snippet.resourceId.videoId;
                    document.getElementById('main-player').src = `https://www.youtube.com/embed/${firstVideoId}`;
                } else {
                    document.getElementById('video-container').innerHTML = '<p>No videos found.</p>';
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
                document.getElementById('video-container').innerHTML = '<p>Error loading videos.</p>';
            }
        }

        // 3. Render Grid & Handle In-Site Playback Click
        function renderVideos(videos) {
            const container = document.getElementById('video-container');
            container.innerHTML = '';

            videos.forEach(item => {
                const snippet = item.snippet;
                const videoId = snippet.resourceId.videoId;
                const title = snippet.title;
                const thumbnail = snippet.thumbnails.medium.url;

                const card = document.createElement('div');
                card.className = 'video-card';
                card.innerHTML = `
                    <img src="${thumbnail}" alt="${title}">
                    <h4>${title}</h4>
                `;

                // When a video card is clicked, change the player iframe source instantly without leaving the page
                card.addEventListener('click', () => {
                    document.getElementById('main-player').src = `https://www.youtube.com/embed/${videoId}`;
                    // Scroll wrapper back to top smoothly so the player is visible
                    document.querySelector('.video-wrapper').scrollTo({ top: 0, behavior: 'smooth' });
                });

                container.appendChild(card);
            });
        }

        initChannelFeed();
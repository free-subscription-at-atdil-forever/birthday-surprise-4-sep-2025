console.log('Starting The JS');

// Base path for GitHub Pages - handles both project sites and user/organization sites
const pathParts = window.location.pathname.split('/').filter(part => part && !part.endsWith('.html'));
let basePath = '';
if (pathParts.length > 1 && pathParts[0] !== 'Spotify---Web-Player-Music-for-everyone') {
    basePath = '/' + pathParts[0] + '/';
}

let currentsong = new Audio();
let songs = [];
let currentFolder = '';
let currentLibButton = null;
let lastVolume = 0.5;
currentsong.volume = 0.5;

// Cache common elements
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('previous');
const volumeIcon = document.getElementById('volume');
const volumeSlider = document.querySelector('.volumeRange');
const seekbar = document.querySelector('.seekbar');
const circle = document.querySelector('.circle');

// Fallback songs data in case JSON loading fails
const fallbackSongs = {
    'songs/A Special Birthday Surprise': {
        files: [
            'Birthday Voice note.mp3'
        ],
        info: {
            title: 'Birthday Special',
            description: 'Special birthday songs for you!',
            cover: 'songs/A Special Birthday Surprise/cover.jpg'
        }
    },
    'songs/A Your Birthday Songs': {
        files: [
            'Atika Meri Jaan .mp3',
            'Meri Jaan Atika.mp3'
        ],
        info: {
            title: 'Your Birthday Songs',
            description: 'Wonderful birthday collection',
            cover: 'songs/A Your Birthday Songs/cover.jpg'
        }
    },
    'songs/pashto': {
        files: [
            'DA ZRA GHAMUNA.mp3',
            'Che Jahan Tyara Tyara She Ghani Khan Poetry.mp3',
            'Charta Ye - Ay Husan darey - Slow_Reverb Pashto song - Tiktok viral song slow version - اے حسن داری.mp3'
        ],
        info: {
            title: 'Pashto Songs',
            description: 'Beautiful Pashto music',
            cover: 'songs/pashto/cover.jpg'
        }
    }
};

// Will be populated from songs.json or fallback
let predefinedSongs = {};
let albumInfo = {};

// Load songs configuration
async function loadSongsConfig() {
    try {
        const response = await fetch(basePath + 'songs.json');
        if (!response.ok) {
            throw new Error('songs.json not found, using fallback data');
        }
        const config = await response.json();
        
        // Extract songs and album info from config
        for (const folder in config) {
            predefinedSongs[folder] = config[folder].files;
            albumInfo[folder] = config[folder].info;
        }
        
        console.log('Successfully loaded songs configuration');
        return true;
    } catch (error) {
        console.warn('Error loading songs configuration, using fallback:', error);
        
        // Use fallback data
        for (const folder in fallbackSongs) {
            predefinedSongs[folder] = fallbackSongs[folder].files;
            albumInfo[folder] = fallbackSongs[folder].info;
        }
        
        return false;
    }
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getCurrentEncodedTrack() {
    return currentsong.src.split('/').slice(-1)[0];
}

function resetLibButtons() {
    document.querySelectorAll('.libPlayButton').forEach(btn => btn.src = basePath + 'img/play.svg');
}

function findLibButtonByTrack(encodedTrack) {
    let btn = null;
    document.querySelectorAll('.songslist li').forEach(li => {
        if (li.dataset.track === encodedTrack) {
            btn = li.querySelector('.libPlayButton');
        }
    });
    return btn;
}

function bindLibraryItemEvents() {
    Array.from(document.querySelectorAll('.songslist li')).forEach(li => {
        li.addEventListener('click', () => {
            const leftPanel = document.querySelector('.left');
            if (leftPanel) {
                leftPanel.style.left = '-100%';
                leftPanel.style.transition = 'left 1s';
            }

            const trackEncoded = li.dataset.track;
            const btn = li.querySelector('.libPlayButton');
            playmusic(trackEncoded, btn);
        });
    });
}

async function getsongs(folder) {
    currentFolder = folder;
    localStorage.setItem('lastFolder', folder);

    // Use predefined songs from config or fallback
    songs = predefinedSongs[folder] || [];

    const songslist = document.querySelector('.songslist ul');
    songslist.innerHTML = '';
    
    for (const element of songs) {
        songslist.innerHTML += `
            <li class="libcard bg-black pointer p-1 m-1" data-track="${element}">
                <img class="invert pointer" src="${basePath}img/music.svg" alt="Music">
                <div class="musicinfo pointer">
                    <div>${element.replaceAll('%20', ' ').replace('.mp3', '')}</div>
                    <div>AK Kakar</div>
                </div>
                <span class="pointer">Play now</span>
                <img class="libPlayButton invert pointer" src="${basePath}img/play.svg" alt="play">
            </li>`;
    }

    bindLibraryItemEvents();
    currentLibButton = null;

    return songs;
}

function playmusic(trackEncoded, libButton = null, pause = false) {
    currentsong.src = basePath + currentFolder + '/' + trackEncoded;

    const songInfoEl = document.querySelector('.songinfo');
    const songTimeEl = document.querySelector('.songtime');
    if (songInfoEl) songInfoEl.textContent = decodeURI(trackEncoded).replace('.mp3', '');
    if (songTimeEl) songTimeEl.textContent = '00:00 / 00:00';

    resetLibButtons();

    const btn = libButton || findLibButtonByTrack(trackEncoded);
    currentLibButton = btn || null;

    if (!pause) {
        currentsong.play().catch(error => {
            console.error("Playback failed:", error);
            if (playBtn) playBtn.src = basePath + 'img/play.svg';
            if (currentLibButton) currentLibButton.src = basePath + 'img/play.svg';
        });
        if (playBtn) playBtn.src = basePath + 'img/pause.svg';
        if (currentLibButton) currentLibButton.src = basePath + 'img/pause.svg';
    } else {
        if (playBtn) playBtn.src = basePath + 'img/play.svg';
        if (currentLibButton) currentLibButton.src = basePath + 'img/play.svg';
    }
}

async function getAlbums() {
    // Use predefined albums from config or fallback
    const albums = Object.keys(predefinedSongs);
    
    for (const folder of albums) {
        const info = albumInfo[folder] || { 
            title: folder.split('/').pop(), 
            description: 'Music collection',
            cover: basePath + folder + '/cover.jpg'
        };

        document.querySelector('.cardsarea').innerHTML += `
            <div data-folder="${folder}" class="cardcontainer pointer rounded">
                <div class="card">
                    <div class="play"> 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" /> 
                        </svg>
                    </div>
                    <img class="pointer rounded" src="${basePath + info.cover}" alt="${info.title}" onerror="this.src='${basePath}img/music.svg'">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>
            </div>`;
    }

    Array.from(document.getElementsByClassName('cardcontainer')).forEach(card => {
        card.addEventListener('click', async (item) => {
            const folder = item.currentTarget.dataset.folder;
            await getsongs(folder);

            if (songs.length > 0) {
                const firstTrack = songs[0];
                const firstBtn = document.querySelector('.songslist li .libPlayButton');
                playmusic(firstTrack, firstBtn);
            }
        });
    });
}

async function main() {
    // Load songs configuration first
    await loadSongsConfig();
    
    // Load last selected folder (or default)
    const lastFolder = localStorage.getItem('lastFolder') || 'songs/A Special Birthday Surprise';
    await getsongs(lastFolder);

    await getAlbums();

    // Load first song but DO NOT autoplay (due to browser restrictions)
    if (songs.length > 0) {
        playmusic(songs[0], null, true);
    }

    /* ---------- Play/Pause (playbar button) ---------- */
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (currentsong.paused) {
                currentsong.play().catch(error => {
                    console.error("Playback failed:", error);
                    playBtn.src = basePath + 'img/play.svg';
                });
                playBtn.src = basePath + 'img/pause.svg';

                if (!currentLibButton) {
                    const btn = findLibButtonByTrack(getCurrentEncodedTrack());
                    if (btn) {
                        resetLibButtons();
                        btn.src = basePath + 'img/pause.svg';
                        currentLibButton = btn;
                    }
                } else {
                    resetLibButtons();
                    currentLibButton.src = basePath + 'img/pause.svg';
                }
            } else {
                currentsong.pause();
                playBtn.src = basePath + 'img/play.svg';
                if (currentLibButton) currentLibButton.src = basePath + 'img/play.svg';
            }
        });
    }

    /* ---------- Time / Seekbar ---------- */
    currentsong.addEventListener('timeupdate', () => {
        const cur = secondsToMinutesSeconds(currentsong.currentTime);
        const dur = secondsToMinutesSeconds(currentsong.duration);
        document.querySelector('.songtime').textContent = `${cur}/${dur}`;
        if (circle && !isNaN(currentsong.duration) && currentsong.duration > 0) {
            circle.style.left = (currentsong.currentTime / currentsong.duration) * 98 + '%';
        }
    });

    if (seekbar) {
        seekbar.addEventListener('click', (e) => {
            const width = e.target.getBoundingClientRect().width;
            const percent = (e.offsetX / width) * 100;
            if (circle) circle.style.left = percent + '%';
            if (!isNaN(currentsong.duration)) {
                currentsong.currentTime = (percent * currentsong.duration) / 100;
            }
        });
    }

    /* ---------- Auto-play next on end ---------- */
    currentsong.addEventListener('ended', () => {
        const i = songs.indexOf(getCurrentEncodedTrack());
        if (i >= 0 && i + 1 < songs.length) {
            const nextTrack = songs[i + 1];
            const btn = findLibButtonByTrack(nextTrack);
            playmusic(nextTrack, btn);
        } else {
            if (playBtn) playBtn.src = basePath + 'img/play.svg';
            if (currentLibButton) currentLibButton.src = basePath + 'img/play.svg';
        }
    });

    /* ---------- Next / Previous (buttons) ---------- */
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const i = songs.indexOf(getCurrentEncodedTrack());
            if (i >= 0 && i + 1 < songs.length) {
                const nextTrack = songs[i + 1];
                const btn = findLibButtonByTrack(nextTrack);
                playmusic(nextTrack, btn);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const i = songs.indexOf(getCurrentEncodedTrack());
            if (i > 0) {
                const prevTrack = songs[i - 1];
                const btn = findLibButtonByTrack(prevTrack);
                playmusic(prevTrack, btn);
            }
        });
    }

    /* ---------- Keyboard controls ---------- */
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            if (currentsong.paused) {
                currentsong.play().catch(error => {
                    console.error("Playback failed:", error);
                    if (playBtn) playBtn.src = basePath + 'img/play.svg';
                });
                if (playBtn) playBtn.src = basePath + 'img/pause.svg';

                if (!currentLibButton) {
                    const btn = findLibButtonByTrack(getCurrentEncodedTrack());
                    if (btn) {
                        resetLibButtons();
                        btn.src = basePath + 'img/pause.svg';
                        currentLibButton = btn;
                    }
                } else {
                    resetLibButtons();
                    currentLibButton.src = basePath + 'img/pause.svg';
                }
            } else {
                currentsong.pause();
                if (playBtn) playBtn.src = basePath + 'img/play.svg';
                if (currentLibButton) currentLibButton.src = basePath + 'img/play.svg';
            }
        }

        if (event.key === 'ArrowLeft') {
            const i = songs.indexOf(getCurrentEncodedTrack());
            if (i > 0) {
                const prevTrack = songs[i - 1];
                const btn = findLibButtonByTrack(prevTrack);
                playmusic(prevTrack, btn);
            }
        }

        if (event.key === 'ArrowRight') {
            const i = songs.indexOf(getCurrentEncodedTrack());
            if (i >= 0 && i + 1 < songs.length) {
                const nextTrack = songs[i + 1];
                const btn = findLibButtonByTrack(nextTrack);
                playmusic(nextTrack, btn);
            }
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            let v = currentsong.volume;
            v += (event.key === 'ArrowUp' ? 0.1 : -0.1);
            v = Math.max(0, Math.min(1, v));
            currentsong.volume = v;
            lastVolume = v > 0 ? v : lastVolume;

            if (volumeSlider) volumeSlider.value = Math.round(v * 100);
            if (volumeIcon) volumeIcon.src = v === 0 ? basePath + 'img/mute.svg' : basePath + 'img/volume.svg';
        }
    });

    /* ---------- Volume slider ---------- */
    if (volumeSlider) {
        const applyVol = (e) => {
            const vol = Math.max(0, Math.min(1, parseInt(e.target.value, 10) / 100));
            currentsong.volume = vol;
            if (vol > 0) lastVolume = vol;
            if (volumeIcon) volumeIcon.src = vol <= 0 ? basePath + 'img/mute.svg' : basePath + 'img/volume.svg';
        };
        volumeSlider.addEventListener('change', applyVol);
        volumeSlider.addEventListener('input', applyVol);
    }

    /* ---------- Volume icon (mute/unmute) ---------- */
    if (volumeIcon) {
        volumeIcon.addEventListener('click', () => {
            if (currentsong.volume > 0) {
                lastVolume = currentsong.volume;
                currentsong.volume = 0;
                volumeIcon.src = basePath + 'img/mute.svg';
                if (volumeSlider) volumeSlider.value = 0;
            } else {
                currentsong.volume = lastVolume || 0.5;
                volumeIcon.src = basePath + 'img/volume.svg';
                if (volumeSlider) volumeSlider.value = Math.round(currentsong.volume * 100);
            }
        });
    }

    /* ---------- Sidebar (hamburger/close) ---------- */
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const left = document.querySelector('.left');
            if (left) {
                left.style.left = 0;
                hamburger.style.filter = 'invert(1) brightness(1.5)';
            }
        });
    }

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const left = document.querySelector('.left');
            if (left) {
                left.style.left = '-100%';
                left.style.transition = 'left 1s';
            }
        });
    }

    // Volume control with mouse wheel
    const volumeControl = document.querySelector(".volumeRange");
    if (volumeControl) {
        volumeControl.addEventListener("wheel", (e) => {
            e.preventDefault();
            let step = 0.05;
            if (e.deltaY < 0) {
                currentsong.volume = Math.min(1, currentsong.volume + step);
            } else {
                currentsong.volume = Math.max(0, currentsong.volume - step);
            }

            volumeControl.value = currentsong.volume * 100;
        });
    }
}

// Start the application
main();

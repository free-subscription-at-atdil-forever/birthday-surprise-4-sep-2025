const emojis = ['🎉', '🥳', '✨', '🎊', '💥', '🎈'];
// Show interaction button at start
document.addEventListener('DOMContentLoaded', function () {
    // Hide timer card initially
    if (timerDiv) timerDiv.style.display = 'none';
    // Create overlay for button
    let overlay = document.createElement('div');
    overlay.id = 'ready-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'linear-gradient(120deg,#ffaf7b 0%,#d76d77 100%)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '999999';
    // Create button
    let readyBtn = document.createElement('button');
    readyBtn.id = 'ready-btn';
    readyBtn.innerText = 'Are U Ready Birthday Girl?';
    readyBtn.style.padding = '28px 64px';
    readyBtn.style.fontSize = '2.2em';
    readyBtn.style.fontWeight = '800';
    readyBtn.style.color = '#fff';
    readyBtn.style.background = 'linear-gradient(90deg,#43cea2 0%,#185a9d 100%)';
    readyBtn.style.border = 'none';
    readyBtn.style.borderRadius = '40px';
    readyBtn.style.boxShadow = '0 8px 32px rgba(255,78,80,0.18),0 2px 8px rgba(249,212,35,0.12)';
    readyBtn.style.cursor = 'pointer';
    readyBtn.style.transition = 'background 0.3s, transform 0.2s';
    readyBtn.style.outline = 'none';
    readyBtn.style.letterSpacing = '2px';
    readyBtn.onmouseover = function() {
        readyBtn.style.background = 'linear-gradient(90deg,#ffaf7b 0%,#d76d77 100%)';
        readyBtn.style.transform = 'scale(1.07)';
    };
    readyBtn.onmouseout = function() {
        readyBtn.style.background = 'linear-gradient(90deg,#43cea2 0%,#185a9d 100%)';
        readyBtn.style.transform = 'scale(1)';
    };
    overlay.appendChild(readyBtn);
    document.body.appendChild(overlay);
    readyBtn.onclick = function() {
        console.log('Ready button clicked');
        // Remove overlay and show timer card
        overlay.remove();
        if (timerDiv) timerDiv.style.display = '';
        userInteracted = true;
        console.log('userInteracted set to true');
        // Preload and prepare the audio object based on time left
        const now = new Date();
        const diff = birthday - now;
        const secondsLeft = Math.floor(diff / 1000);
        let audioFile = 'audio/1.mp3';
        if (secondsLeft < 13) {
            audioFile = 'audio/2.mp3';
        }
        if (!birthdayAudio) {
            birthdayAudio = new Audio(audioFile);
            birthdayAudio.loop = true;
            birthdayAudio.volume = 0.7;
            birthdayAudio.load();
            console.log('Audio object created and loaded:', birthdayAudio, 'file:', audioFile);
            // If less than 13 seconds left, play immediately
            if (secondsLeft < 13) {
                birthdayAudio.play().then(() => {
                    console.log('Audio playback started immediately');
                }).catch((err) => {
                    console.log('Audio playback error:', err);
                });
                musicStarted = true;
            }
        }
    };
});

function dropEmoji() {
    const emoji = document.createElement('div');
    emoji.className = 'emoji';
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * window.innerWidth + 'px';
    emoji.style.top = '-40px';
    document.getElementById('emoji-container').appendChild(emoji);

    const duration = 3000 + Math.random() * 2000;
    emoji.animate([
        { transform: `translateY(0)` },
        { transform: `translateY(${window.innerHeight + 40}px)` }
    ], {
        duration: duration,
        easing: 'ease-in'
    });

    setTimeout(() => emoji.remove(), duration);
}

let emojiInterval = null;
function startEmojiDrop() {
    if (!emojiInterval) {
        emojiInterval = setInterval(dropEmoji, 200);
    }
}
function stopEmojiDrop() {
    if (emojiInterval) {
        clearInterval(emojiInterval);
        emojiInterval = null;
    }
}

// Birthday countdown timer for 4 September 2025
// Music control variables
let birthdayAudio = null;
let musicStarted = false;
let userInteracted = false;
const birthday = new Date('2025-09-04T00:00:00');
const timerDiv = document.getElementById('timer');

// Color palettes for timer units (removed green for visibility)
const dayColors = ["#ffaf7b", "#f7971e", "#ffd200", "#ff4e50", "#d76d77", "#f9d423"];
const hourColors = ["#ff4e50", "#f9d423", "#ffaf7b", "#d76d77", "#f7971e", "#ffd200"];
const minColors = ["#f7971e", "#ffd200", "#ff4e50", "#f9d423", "#ffaf7b", "#d76d77"];
const secColors = ["#d76d77", "#ffaf7b", "#f7971e", "#ffd200", "#ff4e50", "#f9d423"];
const bgGradients = [
    "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
    "linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)",
    "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)"
];

let surpriseTimeout = null;
let surpriseShown = false;
let waitInterval = null;
let originalBirthdayMsg = null;

function showSurpriseButton() {
    timerDiv.innerHTML = `<button id='surprise-btn' class='surprise-btn'>🎁 Ready for the Surprise! 🎉</button>`;
    surpriseShown = true;
    const birthdayMsgDiv = document.querySelector('.birthday-message');
    if (birthdayMsgDiv && originalBirthdayMsg) {
        birthdayMsgDiv.innerHTML = originalBirthdayMsg;
    }
}

function showWaitMessage() {
    let secondsLeft = 8;
    const birthdayMsgDiv = document.querySelector('.birthday-message');
    if (!originalBirthdayMsg && birthdayMsgDiv) {
        originalBirthdayMsg = birthdayMsgDiv.innerHTML;
    }
    if (birthdayMsgDiv) {
        birthdayMsgDiv.innerHTML = `Wait <span id='wait-seconds'>${secondsLeft}</span> sec more  My Baby Girl for Surprise 😘`;
    }
    waitInterval = setInterval(() => {
        secondsLeft--;
        if (birthdayMsgDiv) {
            birthdayMsgDiv.innerHTML = `Wait <span id='wait-seconds'>${secondsLeft}</span> sec more  My Baby Girl for Surprise 😘`;
        }
        if (secondsLeft <= 0) {
            clearInterval(waitInterval);
        }
    }, 1000);
}

function updateTimer() {
    if (surpriseShown) return; // Stop updating timer after button is shown
    const now = new Date();
    const diff = birthday - now;
    const secondsLeft = Math.floor(diff / 1000);
    // Debug info for timer and music
    if (secondsLeft < 20) {
        console.log('Seconds left:', secondsLeft, 'musicStarted:', musicStarted, 'userInteracted:', userInteracted, 'audio:', birthdayAudio);
    }
    // Start music when 12 seconds left and user has interacted and audio is ready
    if (secondsLeft === 12 && !musicStarted && userInteracted && birthdayAudio) {
        console.log('Attempting to play audio at 12 seconds left');
        birthdayAudio.play().then(() => {
            console.log('Audio playback started');
        }).catch((err) => {
            console.log('Audio playback error:', err);
        });
        musicStarted = true;
    }
// Listen for first user interaction to allow music playback
window.addEventListener('click', function () {
    userInteracted = true;
});
window.addEventListener('keydown', function () {
    userInteracted = true;
});
    if (diff <= 0) {
        timerDiv.style.background = "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)";
        timerDiv.innerHTML = `<div class=\"countdown\">
            <span class=\"days\" style=\"color:#d76d77\">0 <span>Days</span></span>
            <span class=\"hours\" style=\"color:#ffaf7b\">0 <span>Hours</span></span>
            <span class=\"minutes\" style=\"color:#ffd200\">0 <span>Minutes</span></span>
            <span class=\"seconds\" style=\"color:#f7971e\">0 <span>Seconds</span></span>
            <span class=\"love\">💖</span>
        </div>`;
        startEmojiDrop();
        if (!surpriseTimeout) {
            setTimeout(showWaitMessage, 2000); // After 2 seconds, show wait message
            surpriseTimeout = setTimeout(showSurpriseButton, 10000); // After 10 seconds, show button
        }
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Dynamic color selection
    const dayColor = dayColors[(Math.floor(now.getHours()) % dayColors.length)];
    const hourColor = hourColors[(now.getHours() % hourColors.length)];
    const minColor = minColors[(now.getMinutes() % minColors.length)];
    const secColor = secColors[(now.getSeconds() % secColors.length)];
    // Fixed green gradient background
    timerDiv.style.background = "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)";
    timerDiv.innerHTML = `
        <div class="countdown">
            <span class="days" style="color:${dayColor}">${days} <span>Days</span></span>
            <span class="hours" style="color:${hourColor}">${hours} <span>Hours</span></span>
            <span class="minutes" style="color:${minColor}">${minutes} <span>Minutes</span></span>
            <span class="seconds" style="color:${secColor}">${seconds} <span>Seconds</span></span>
            <span class="love">💖</span>
        </div>
    `;
}

setInterval(updateTimer, 1000);
updateTimer();

// Rotating loving/funny lines for 3 lines
// Replace your current lines array and updateLines function with this:

const lines = [
    "Turning 20, but forever young at heart! 🥳",
    "To the most amazing friend and love of my life! 💖",
    "May your day be filled with laughter and cake! 🎂",
    "You make every moment brighter! ✨",
    "Happy Birthday to my favorite human! 😍",
    "20 years of awesomeness and counting! 🎉",
    "You deserve all the happiness in the world! 🌍",
    "Here's to more adventures together! 🚀",
    "You are the reason for my smile! 😊",
    "Best friend, soulmate, and birthday queen! 👑",
    "Your laughter is my favorite melody! 🎶",
    "Wishing you endless joy and love! 💕",
    "You light up every room you enter! 💡",
    "Cheers to your beautiful soul! 🥂",
    "You make ordinary days extraordinary! 🌈",
    "Happy 20th to the girl who stole my heart! 💘",
    "May your dreams come true this year! 🌠",
    "You are my sunshine on a cloudy day! ☀️",
    "Life is better with you in it! 🌻",
    "Here's to more silly selfies together! 🤳",
    "You are the sparkle in my life! ✨",
    "May your birthday be as sweet as you! 🍬",
    "You are my favorite adventure! 🗺️",
    "Your kindness inspires me every day! 🌷",
    "Happy birthday to my forever person! 💞",
    "You make my heart skip a beat! 💓",
    "Let's dance like nobody's watching! 💃",
    "You are the peanut butter to my jelly! 🥪",
    "May your year be filled with magic! 🪄",
    "You are the reason I believe in love! 💝",
    "Happy birthday to my partner in crime! 🕵️‍♀️",
    "You are the queen of my heart! 👸",
    "May your smile never fade! 😁",
    "You are the best gift life gave me! 🎁",
    "Here's to more late-night talks! 🌙",
    "You are my favorite story! 📖",
    "Happy birthday, beautiful! 🌹",
    "Meri Jaan, you mean the world to me! 🌎",
    "Brown Sugar, your sweetness brightens my days! 🍯",
    "Meri Guria, my precious doll! 🎀",
    "Meri Jaan, my heart beats only for you! 💓",
    "Brown Sugar, you're the sweetest thing in my life! 🧁",
    "Meri Guria, you're more beautiful than any princess! 👑",
    "Meri Jaan, every moment with you is a treasure! 💎",
    "Brown Sugar, you make life delicious! 🍭",
    "Meri Guria, your smile is my favorite view! 😊",
    "Meri Jaan, I'm so lucky to have you! 🍀",
    "Brown Sugar, you're irresistible! 🍫",
    "Meri Guria, you're the star of my life! ⭐",
    "Meri Jaan, my love for you grows every day! 🌱",
    "Brown Sugar, you make everything better! 🌈",
    "Meri Guria, you're my dream come true! 💭",
    "Meri Jaan, you're the music to my soul! 🎵",
    "Brown Sugar, you're my favorite addiction! ❤️",
    "Meri Guria, you're perfect in every way! 🌟",
    "Meri Jaan, you complete me! 💑",
    "Brown Sugar, you're sweeter than honey! 🐝",
    "Your eyes sparkle brighter than the stars! ✨",
    "I fall in love with you more every day! 💘",
    "Your smile could light up the darkest night! 😊",
    "You're the missing piece I've been searching for! 🧩",
    "My heart belongs to you, now and forever! 💞",
    "You make my soul feel at home! 🏡",
    "Every love song reminds me of you! 🎶",
    "Your love is the greatest gift I've ever received! 🎁",
    "I cherish every moment we share! ⏳",
    "You're the reason I believe in fairy tales! 🏰",
    "Your touch sends shivers down my spine! 💫",
    "I'm addicted to your love! 💕",
    "You're my today and all my tomorrows! 📅",
    "Your voice is my favorite sound! 🎤",
    "I love you more than words can express! 📝",
    "You're the best decision I never made! ❤️",
    "My world is brighter with you in it! 🌞",
    "You're the poetry my heart writes! 📜",
    "Your love is my safe haven! 🏖️",
    "I'm forever yours! 💍",
    "I'll always be here to wipe your tears! 😢",
    "Your happiness is my priority! 😊",
    "I'll protect you from all the storms! ⛈️",
    "Your well-being means everything to me! 💪",
    "I'll always be your shoulder to lean on! 🤗",
    "Your dreams are my dreams too! 🌙",
    "I'll support you in everything you do! 📚",
    "Your comfort is my concern! 🛋️",
    "I'll always make time for you! ⏰",
    "Your peace of mind is important to me! 🧘",
    "I'll be your rock when you need strength! 🪨",
    "Your success is my celebration! 🎉",
    "I'll always listen to your heart! 👂",
    "Your safety is my responsibility! 🛡️",
    "I'll keep you warm when you're cold! 🧣",
    "Your health is my concern! 🍎",
    "I'll be your calm in the chaos! 🌪️",
    "Your growth is my inspiration! 🌱",
    "I'll always encourage your passions! 🎨",
    "Your heart is my home! 🏠",
    "I love you more than pizza! And that's saying a lot! 🍕",
    "You're the WiFi to my internet! 📶",
    "You must be a magician because whenever I look at you, everyone else disappears! 🎩",
    "Are you a bank loan? Because you have my interest! 💰",
    "You're like a fine wine - you get better with age! 🍷",
    "If you were a vegetable, you'd be a 'cute-cumber'! 🥒",
    "You're the cheese to my macaroni! 🧀",
    "Is your name Google? Because you have everything I'm searching for! 🔍",
    "You must be made of copper and tellurium because you're Cu-Te! ⚗️",
    "Are you a camera? Because every time I look at you, I smile! 📸",
    "You're the bacon to my eggs! 🥓",
    "If beauty were time, you'd be an eternity! ⏳",
    "You're the salsa to my chips! 🌶️",
    "Are you a parking ticket? Because you've got FINE written all over you! 🚗",
    "You're the marshmallow to my hot chocolate! ☕",
    "If you were a fruit, you'd be a fine-apple! 🍎",
    "You're the Netflix to my chill! 📺",
    "Are you a cat? Because you're purr-fect! 🐱",
    "You're the avocado to my toast! 🥑",
    "If you were a triangle, you'd be acute one! 🔺",
    "Meri Jaan, you're my favorite hello and hardest goodbye! 👋",
    "Brown Sugar, you make my heart melt! 🧊",
    "Meri Guria, you're more precious than diamonds! 💎",
    "Meri Jaan, my love for you is infinite! ♾️",
    "Brown Sugar, you're the sweetness in my bitter days! ☕",
    "Meri Guria, you're the doll I never want to put down! 🧸",
    "Meri Jaan, you're the oxygen I breathe! 💨",
    "Brown Sugar, you're my favorite dessert! 🍮",
    "Meri Guria, you're the princess of my heart! 👑",
    "Meri Jaan, you're my forever and always! 💑",
    "Brown Sugar, you're my guilty pleasure! 🍫",
    "Meri Guria, you're the beauty in my world! 🌸",
    "Meri Jaan, you're the calm in my storm! 🌧️",
    "Brown Sugar, you're the honey in my tea! 🍵",
    "Meri Guria, you're the sparkle in my eye! ✨",
    "Meri Jaan, you're the beat in my heart! 💓",
    "Brown Sugar, you're the flavor in my life! 🍭",
    "Meri Guria, you're the ribbon on my gift! 🎀",
    "Meri Jaan, you're the song in my heart! 🎵",
    "Brown Sugar, you're the sugar in my bowl! 🍯",
    "Your love is the anchor that keeps me grounded! ⚓",
    "In your arms is where I belong! 🤗",
    "You're the missing chapter in my story! 📖",
    "My soul recognized yours from the very beginning! 👁️",
    "You're the home my heart always searched for! 🏡",
    "Your love is the greatest adventure of my life! 🗺️",
    "I didn't choose you, my heart did! ❤️",
    "You're the dream I never want to wake up from! 💤",
    "Your love transformed my ordinary life into extraordinary! 🌟",
    "You're the answer to every prayer I never said! 🙏",
    "With you, I've found my forever! ⏳",
    "Your love is the light that guides me! 💡",
    "You're the melody to my lyrics! 🎶",
    "My heart found its missing piece in you! 🧩",
    "You're the peace in my chaos! 🕊️",
    "Your love is my favorite place to be! 📍",
    "You're the rainbow after my storm! 🌈",
    "My love for you is deeper than the ocean! 🌊",
    "You're the stars in my night sky! 🌌",
    "Your love is the greatest story ever told! 📜",
    "Are you a time traveler? Because I can see you in my future! ⏱️",
    "You must be a high score because I want to play with you all day! 🎮",
    "If you were a triangle, you'd be acute one! 📐",
    "Are you a campfire? Because you're hot and I want s'more! 🔥",
    "You must be a snowflake because you're one of a kind! ❄️",
    "Are you a keyboard? Because you're just my type! ⌨️",
    "If you were a fruit, you'd be a fine-apple! 🍏",
    "You must be a star because when I look at you, everyone else disappears! 🌟",
    "Are you a bank loan? Because you have my interest! 💵",
    "If you were a vegetable, I'd visit you in the hospital! 🥦",
    "You must be a dream because I don't want to wake up! 💭",
    "Are you a candle? Because you light up my life! 🕯️",
    "If you were a pizza, you'd be a great one! 🍕",
    "You must be a magnet because you're attracting me! 🧲",
    "Are you a dictionary? Because you add meaning to my life! 📖",
    "If you were a chicken, you'd be impeccable! 🐔",
    "You must be a camera because every time I see you, I smile! 📷",
    "Are you a broom? Because you swept me off my feet! 🧹",
    "If you were a planet, you'd be the brightest! 🪐",
    "You must be a thief because you stole my heart! 🦹",
    "Meri Jaan, you're my today, tomorrow, and forever! 📅",
    "Brown Sugar, you're the treat I never get tired of! 🍬",
    "Meri Guria, you're the most beautiful doll in my collection! 🪆",
    "Meri Jaan, my heart whispers your name! 💓",
    "Brown Sugar, you're the sweetness that never fades! 🍯",
    "Meri Guria, you're the precious gem in my treasure! 💎",
    "Meri Jaan, you're the rhythm of my heart! 💗",
    "Brown Sugar, you make everything in life sweeter! 🧁",
    "Meri Guria, you're the angel in my life! 👼",
    "Meri Jaan, you're the dream I never want to end! 🌙",
    "Brown Sugar, you're my favorite flavor! 🍦",
    "Meri Guria, you're the beauty in my chaos! 🦋",
    "Meri Jaan, you're the peace in my storm! ⛅",
    "Brown Sugar, you're the honey to my bee! 🐝",
    "Meri Guria, you're the star in my sky! 🌠",
    "Meri Jaan, you're the breath in my lungs! 💨",
    "Brown Sugar, you're the sugar in my tea! 🫖",
    "Meri Guria, you're the ribbon that ties my heart! 🎗️",
    "Meri Jaan, you're the music in my silence! 🎼",
    "Brown Sugar, you're the dessert after my meal! 🍰",
    "Meri Guria, you're the precious pearl in my ocean! 🐚",
    "Meri Jaan, you're the light in my darkness! 💡",
    "Brown Sugar, you're the candy I can't resist! 🍭",
    "Meri Guria, you're the doll I'll always cherish! 🪅",
    "Meri Jaan, you're the heartbeat in my chest! ❤️",
    "Brown Sugar, you're the sweetness of my life! 🧋",
    "Meri Guria, you're the beauty I never knew existed! 🌹",
    "Meri Jaan, you're the love of my life! 💞",
    "Brown Sugar, you're the treat I always crave! 🍫",
    "Meri Guria, you're the precious gift I'll always protect! 🎁",
    "Your love is the greatest treasure I've found! 💰",
    "I would choose you in every lifetime! 🔄",
    "Your smile is my favorite sight! 😊",
    "You're the reason my heart beats! 💓",
    "Your love is my safe harbor! ⚓",
    "I'm forever grateful for you! 🙏",
    "You're my happy place! 🏝️",
    "Your love completes me! 💑",
    "You're my greatest adventure! 🗺️",
    "I love you more than yesterday, less than tomorrow! 📅"
];

// Function to get random indices without repetition
// ... (keep all your existing code until the lines array)

// Remove the duplicate lines array declaration and replace with this:

// Define the line elements first
const lineDiv1 = document.getElementById('birthday-line1');
const lineDiv2 = document.getElementById('birthday-line2');
const lineDiv3 = document.getElementById('birthday-line3');

// Function to get random indices without repetition
function getRandomIndices(count, max) {
    const indices = [];
    while (indices.length < count) {
        const randomIndex = Math.floor(Math.random() * max);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}

// Update the lines function to show random lines
function updateLines() {
    // Check if line elements exist
    if (!lineDiv1 || !lineDiv2 || !lineDiv3) return;
    
    // Get three unique random indices
    const randomIndices = getRandomIndices(3, lines.length);
    
    // Update each line with a random message
    lineDiv1.innerHTML = `<span class='line-text'>${lines[randomIndices[0]]}</span>`;
    lineDiv2.innerHTML = `<span class='line-text'>${lines[randomIndices[1]]}</span>`;
    lineDiv3.innerHTML = `<span class='line-text'>${lines[randomIndices[2]]}</span>`;
}

// Set interval to update lines randomly
setInterval(updateLines, 4000);

// Make sure to call updateLines after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial update of lines
    setTimeout(updateLines, 100);
});

// ... (keep the rest of your code, but REMOVE the duplicate lines array declaration)
// The rest of your JavaScript code remains the same...

function showBirthdaySequence() {
    // Hide main card content with fade out
    const mainCard = document.getElementById('main-card');
    mainCard.style.transition = 'opacity 0.7s';
    mainCard.style.opacity = '0';
    setTimeout(() => {
        // Rotate card 360deg
        mainCard.style.transition = 'transform 1.2s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.7s';
        mainCard.style.transform = 'rotateY(360deg)';
        // Show new content after rotation
        setTimeout(() => {
            mainCard.style.opacity = '1';
            mainCard.innerHTML = `<img src='img/1.webp' alt='Childhood Photo' style='width:80%;border-radius:24px;box-shadow:0 4px 24px rgba(255,78,80,0.18);margin-bottom:18px;'>
                <div class='card-message'>4 September 2005 was the date when this beautiful girl opened her amazing eyes in this world and blessed this world with her presence. You are the sunshine of my life, the reason for my smile, and the most precious gift to this world. Happy Birthday, my love! 💖</div>`;
            mainCard.style.transform = 'rotateY(0deg)';
        }, 1200);
    }, 700);

    // Show left card after 5 seconds
    setTimeout(() => {
        const leftCard = document.getElementById('left-card');
        leftCard.classList.remove('hidden-card');
        leftCard.innerHTML = `<img src='img/2.webp' alt='Together Photo' style='width:80%;border-radius:24px;box-shadow:0 4px 24px rgba(255,78,80,0.18);margin-bottom:18px;'>
            <div class='card-message'>After 2 days of your 19th birthday, on 6 September 2025, this handsome guy saw the real beauty of nature for the very first time and liked her at first sight. Never thought we would come this far. You are the real gift and blessing of my life. Thank you for being you, my love! 💑</div>`;
        leftCard.classList.add('show');
    }, 5700);

    // Show third card after 10 seconds
    setTimeout(() => {
        const thirdCard = document.getElementById('third-card');
        thirdCard.classList.remove('hidden-card');
        thirdCard.innerHTML = `<img src='img/3.webp' alt='Emotional Night' style='width:80%;border-radius:24px;box-shadow:0 4px 24px rgba(33,150,243,0.18);margin-bottom:18px;'>
            <div class='card-message'>23 January 2025 was the night when this introvert girl firstly expressed her feelings and cried about how a meetup would ever be possible. This loving guy calmed and relaxed her, and after 3 hours she was comfortable. That was the night of my life when I truly felt the real taste of being loved so deeply. You are my everything! 🥰</div>`;
        thirdCard.classList.add('show');
    }, 10700);

    // Show loving lines and button after all cards
    setTimeout(() => {
        const finalMessagesDiv = document.getElementById('final-messages');
        finalMessagesDiv.innerHTML = '';
        finalMessagesDiv.classList.add('show-gradient');
        let lines = [
            "Happy Birth Day 🎂",
            "My Love You My Baby Girl 💖",
            "I hope you liked the birthday surprise!",
            "Love You Meri Jaan 💖"
        ];
        let i = 0;
        function showNextLine() {
            if (i < lines.length) {
                finalMessagesDiv.innerHTML += `<div class='final-message'>${lines[i]}</div>`;
                i++;
                setTimeout(showNextLine, 1200);
            } else {
                setTimeout(() => {
                    finalMessagesDiv.innerHTML += `<div class='final-message'>wait wait wait</div>`;
                    setTimeout(() => {
                        finalMessagesDiv.innerHTML += `<div class='final-message'>that is not the end, surprise still remains!</div>`;
                        setTimeout(() => {
                            document.getElementById('final-surprise-btn-container').innerHTML = `<button class='final-surprise-btn'>Next Surprise</button>`;
                            // Removed shrinking of main card for visibility
                        }, 7000);
                    }, 2000);
                }, 5000);
            }
        }
        showNextLine();
    }, 17000); // After all cards are shown
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'surprise-btn') {
        showBirthdaySequence();
    }
    if (e.target && e.target.classList.contains('final-surprise-btn')) {
        // Hide all cards
        document.getElementById('main-card').style.display = 'none';
        const leftCard = document.getElementById('left-card');
        if (leftCard) leftCard.style.display = 'none';
        const thirdCard = document.getElementById('third-card');
        if (thirdCard) thirdCard.style.display = 'none';
        document.getElementById('final-messages').style.display = 'none';
        document.getElementById('final-surprise-btn-container').style.display = 'none';
        // Show cake image and messages
        let cakeDiv = document.getElementById('cake-surprise');
        if (!cakeDiv) {
            cakeDiv = document.createElement('div');
            cakeDiv.id = 'cake-surprise';
            cakeDiv.style.position = 'fixed';
            cakeDiv.style.top = '0';
            cakeDiv.style.left = '0';
            cakeDiv.style.width = '100vw';
            cakeDiv.style.height = '100vh';
            cakeDiv.style.background = '#fff6e0';
            cakeDiv.style.animation = '';
            cakeDiv.style.display = 'flex';
            cakeDiv.style.flexDirection = 'column';
            cakeDiv.style.justifyContent = 'center';
            cakeDiv.style.alignItems = 'center';
            cakeDiv.style.zIndex = '99999';
            cakeDiv.innerHTML = `
                <div id='cake-img-container' style='position:relative;display:inline-block;'>
                    <img id='cake-img' src='img/cake.webp' alt='Cake' style='width:70vw;max-width:700px;height:auto;box-shadow:0 8px 32px rgba(255,78,80,0.18);border-radius:32px;position:relative;z-index:1;'>
                </div>
                <div id='cake-messages' style='position:relative;left:0;bottom:0;width:100vw;text-align:center;margin-top:32px;'>
                    <div style='font-size:2em;color:#d76d77;font-weight:700;'>Sorry my baby girl, I am far away from you, actual cake is not possible right now. Please accept this cake 🥺</div>
                    <div id='cut-cake-line' style='margin-top:18px;font-size:1.5em;color:#185a9d;font-weight:600;'>Please cut the Cake my love 🎂</div>
                </div>
            `;
            document.body.appendChild(cakeDiv);
            // Add funny lines and knife image with intervals
            setTimeout(() => {
                const cakeMessages = document.getElementById('cake-messages');
                if (cakeMessages) {
                    const oopsLine = document.createElement('div');
                    oopsLine.id = 'oops-knife-line';
                    oopsLine.style.marginTop = '12px';
                    oopsLine.style.fontSize = '1.3em';
                    oopsLine.style.color = '#d76d77';
                    oopsLine.style.fontWeight = '600';
                    oopsLine.innerText = "Oops I forgot the knife!";
                    cakeMessages.appendChild(oopsLine);
                }
                setTimeout(() => {
                    if (cakeMessages) {
                        const gotKnifeLine = document.createElement('div');
                        gotKnifeLine.id = 'got-knife-line';
                        gotKnifeLine.style.marginTop = '12px';
                        gotKnifeLine.style.fontSize = '1.3em';
                        gotKnifeLine.style.color = '#43cea2';
                        gotKnifeLine.style.fontWeight = '600';
                        gotKnifeLine.innerText = "Here it is, I got it!";
                        cakeMessages.appendChild(gotKnifeLine);
                    }
                    // Add knife image over the cake
                    const cakeImgContainer = document.getElementById('cake-img-container');
                    if (cakeImgContainer) {
                        let knifeImg = document.getElementById('knife-img');
                        if (!knifeImg) {
                            knifeImg = document.createElement('img');
                            knifeImg.id = 'knife-img';
                            knifeImg.src = 'img/knife.webp';
                            knifeImg.alt = 'Knife';
                            knifeImg.style.position = 'absolute';
                            knifeImg.style.left = '55%';
                            knifeImg.style.top = '20%';
                            knifeImg.style.transform = 'translate(-50%, 0)';
                            knifeImg.style.width = '70vw';
                            knifeImg.style.maxWidth = '700px';
                            knifeImg.style.height = 'auto';
                            knifeImg.style.zIndex = '2';
                            cakeImgContainer.appendChild(knifeImg);
                        }
                        // Add 'Cut the Cake' button after 2 seconds
                        setTimeout(() => {
                            let cutBtn = document.getElementById('cut-cake-btn');
                            if (!cutBtn) {
                                cutBtn = document.createElement('button');
                                cutBtn.id = 'cut-cake-btn';
                                cutBtn.innerText = '🍰 Cut the Cake';
                                cutBtn.style.position = 'absolute';
                                cutBtn.style.left = '50%';
                                cutBtn.style.top = '70%';
                                cutBtn.style.transform = 'translate(-50%, -50%)';
                                cutBtn.style.padding = '18px 48px';
                                cutBtn.style.fontSize = '1.5em';
                                cutBtn.style.fontWeight = '700';
                                cutBtn.style.color = '#fff';
                                cutBtn.style.background = 'linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)';
                                cutBtn.style.border = 'none';
                                cutBtn.style.borderRadius = '32px';
                                cutBtn.style.boxShadow = '0 4px 24px rgba(255,78,80,0.18), 0 2px 8px rgba(249,212,35,0.12)';
                                cutBtn.style.cursor = 'pointer';
                                cutBtn.style.transition = 'background 0.3s, transform 0.2s';
                                cutBtn.style.outline = 'none';
                                cutBtn.style.letterSpacing = '1px';
                                cutBtn.style.zIndex = '10';
                                cakeImgContainer.appendChild(cutBtn);
                                cutBtn.onclick = function() {
                                    // Hide knife immediately
                                    const knifeImg = document.getElementById('knife-img');
                                    if (knifeImg) knifeImg.style.display = 'none';
                                    // Show cutted-cake.webp instead of cake.webp
                                    const cakeImg = document.getElementById('cake-img');
                                    if (cakeImg) cakeImg.src = 'img/cake-piece.webp';
                                    cutBtn.style.display = 'none';
                                    // Show congratulatory lines below the cutted cake
                                    const cakeMessages = document.getElementById('cake-messages');
                                    if (cakeMessages) {
                                        cakeMessages.innerHTML = '';
                                        const line1 = document.createElement('div');
                                        line1.style.fontSize = '2em';
                                        line1.style.color = '#d76d77';
                                        line1.style.fontWeight = '700';
                                        line1.innerText = 'yayyyyy you cut the cake!';
                                        cakeMessages.appendChild(line1);
                                        const line2 = document.createElement('div');
                                        line2.style.marginTop = '18px';
                                        line2.style.fontSize = '1.5em';
                                        line2.style.color = '#185a9d';
                                        line2.style.fontWeight = '600';
                                        line2.innerText = 'now eat it up my love';
                                        cakeMessages.appendChild(line2);
                                        // Wait for user to click to continue to gift
                                        const continueBtn = document.createElement('button');
                                        continueBtn.id = 'continue-to-gift-btn';
                                        continueBtn.innerText = 'Continue to Gift 🎁';
                                        continueBtn.style.display = 'block';
                                        continueBtn.style.margin = '32px auto 0 auto';
                                        continueBtn.style.padding = '18px 48px';
                                        continueBtn.style.fontSize = '1.5em';
                                        continueBtn.style.fontWeight = '700';
                                        continueBtn.style.color = '#fff';
                                        continueBtn.style.background = 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)';
                                        continueBtn.style.border = 'none';
                                        continueBtn.style.borderRadius = '32px';
                                        continueBtn.style.boxShadow = '0 4px 24px rgba(33,150,243,0.18), 0 2px 8px rgba(249,212,35,0.12)';
                                        continueBtn.style.cursor = 'pointer';
                                        continueBtn.style.transition = 'background 0.3s, transform 0.2s';
                                        continueBtn.style.outline = 'none';
                                        continueBtn.style.letterSpacing = '1px';
                                        continueBtn.onmouseover = function() {
                                            continueBtn.style.background = 'linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)';
                                            continueBtn.style.transform = 'scale(1.04)';
                                        };
                                        continueBtn.onmouseout = function() {
                                            continueBtn.style.background = 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)';
                                            continueBtn.style.transform = 'scale(1)';
                                        };
                                        cakeMessages.appendChild(continueBtn);
                                        continueBtn.addEventListener('click', function() {
                                            // Remove cake and lines
                                            const cakeImgContainer = document.getElementById('cake-img-container');
                                            if (cakeImgContainer) cakeImgContainer.style.display = 'none';
                                            cakeMessages.innerHTML = '';
                                            // Add gift line
                                            const giftLine = document.createElement('div');
                                            giftLine.id = 'gift-line';
                                            giftLine.style.fontSize = '2.2em';
                                            giftLine.style.color = 'linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)';
                                            giftLine.style.fontWeight = '800';
                                            giftLine.style.background = 'linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)';
                                            giftLine.style.webkitBackgroundClip = 'text';
                                            giftLine.style.webkitTextFillColor = 'transparent';
                                            giftLine.style.textAlign = 'center';
                                            giftLine.style.margin = '0 auto';
                                            giftLine.style.padding = '24px 0 12px 0';
                                            giftLine.innerText = "Now it's time for your gift!";
                                            cakeMessages.appendChild(giftLine);
                                            // Show button after 3 seconds
                                            setTimeout(() => {
                                                const giftBtn = document.createElement('button');
                                                giftBtn.id = 'see-gift-btn';
                                                giftBtn.innerText = '🎁 See Gift';
                                                giftBtn.style.display = 'block';
                                                giftBtn.style.margin = '32px auto 0 auto';
                                                giftBtn.style.padding = '18px 48px';
                                                giftBtn.style.fontSize = '1.7em';
                                                giftBtn.style.fontWeight = '700';
                                                giftBtn.style.color = '#fff';
                                                giftBtn.style.background = 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)';
                                                giftBtn.style.border = 'none';
                                                giftBtn.style.borderRadius = '32px';
                                                giftBtn.style.boxShadow = '0 4px 24px rgba(33,150,243,0.18), 0 2px 8px rgba(249,212,35,0.12)';
                                                giftBtn.style.cursor = 'pointer';
                                                giftBtn.style.transition = 'background 0.3s, transform 0.2s';
                                                giftBtn.style.outline = 'none';
                                                giftBtn.style.letterSpacing = '1px';
                                                giftBtn.onmouseover = function() {
                                                    giftBtn.style.background = 'linear-gradient(90deg, #ffaf7b 0%, #d76d77 100%)';
                                                    giftBtn.style.transform = 'scale(1.04)';
                                                };
                                                giftBtn.onmouseout = function() {
                                                    giftBtn.style.background = 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)';
                                                    giftBtn.style.transform = 'scale(1)';
                                                };
                                                cakeMessages.appendChild(giftBtn);
                                            }, 3000);
                                        });
                                    }
                                };
                            }
                        }, 2000);
                    }
                }, 4000);
            }, 4000);
        }
    }
    if (e.target && e.target.id === 'see-gift-btn') {
        // Remove gift line and button
        const cakeMessages = document.getElementById('cake-messages');
        if (cakeMessages) cakeMessages.innerHTML = '';
        // Show gift image centered and filling the page
        let cakeDiv = document.getElementById('cake-surprise');
        if (cakeDiv) {
            cakeDiv.innerHTML = `
                <div style='position:relative;display:flex;justify-content:center;align-items:center;height:100vh;'>
                    <img src='img/gift.webp' alt='Gift' style='width:80vw;max-width:900px;height:auto;display:block;margin:0 auto;box-shadow:0 8px 32px rgba(33,150,243,0.18);border-radius:32px;'>
                    <button id='open-gift-btn' style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:18px 48px;font-size:1.7em;font-weight:700;color:#fff;background:linear-gradient(90deg,#ffaf7b 0%,#d76d77 100%);border:none;border-radius:32px;box-shadow:0 4px 24px rgba(255,78,80,0.18),0 2px 8px rgba(249,212,35,0.12);cursor:pointer;transition:background 0.3s,transform 0.2s;outline:none;letter-spacing:1px;'>Open the Gift 🎉</button>
                </div>
            `;
        }
        startEmojiDrop();
        setTimeout(stopEmojiDrop, 4000);
    }
    if (e.target && e.target.id === 'open-gift-btn') {
        const cakeDiv = document.getElementById('cake-surprise');
        if (cakeDiv) {
            // Fade out gift and button
            const giftImg = cakeDiv.querySelector('img[alt="Gift"]');
            const giftBtn = document.getElementById('open-gift-btn');
            if (giftImg) {
                giftImg.style.transition = 'opacity 1s';
                giftImg.style.opacity = '0';
            }
            if (giftBtn) {
                giftBtn.style.transition = 'opacity 1s';
                giftBtn.style.opacity = '0';
            }
            setTimeout(() => {
                // Remove gift and button
                if (giftImg) giftImg.remove();
                if (giftBtn) giftBtn.remove();
                // Show opened-gift.webp
                cakeDiv.innerHTML = `<div style='position:relative;display:flex;justify-content:center;align-items:center;height:100vh;'>
                    <img id='opened-gift-img' src='img/opened-gift.webp' alt='Opened Gift' style='width:80vw;max-width:900px;height:auto;display:block;margin:0 auto;box-shadow:0 8px 32px rgba(33,150,243,0.18);border-radius:32px;z-index:1;'>
                    <img id='pop-gift-img' src='img/4.webp' alt='Gift Pop' style='position:absolute;top:10%;left:50%;transform:translate(-50%,0);width:22vw;max-width:180px;height:auto;z-index:2;transition:top 1s cubic-bezier(.68,-0.55,.27,1.55);'>
                </div>`;
                // Animate pop-gift-img to simulate popping out
                setTimeout(() => {
                    const popGiftImg = document.getElementById('pop-gift-img');
                    if (popGiftImg) {
                        popGiftImg.style.top = '0%';
                        // Add lines and button under the image after pop animation
                        setTimeout(() => {
                            // Create a container for lines and button
                            let linesContainer = document.getElementById('gift-lines-container');
                            if (!linesContainer) {
                                linesContainer = document.createElement('div');
                                linesContainer.id = 'gift-lines-container';
                                linesContainer.style.position = 'absolute';
                                linesContainer.style.bottom = '6%';
                                linesContainer.style.left = '50%';
                                linesContainer.style.transform = 'translateX(-50%)';
                                linesContainer.style.width = '90vw';
                                linesContainer.style.maxWidth = '700px';
                                linesContainer.style.textAlign = 'center';
                                linesContainer.style.zIndex = '10';
                                linesContainer.style.background = 'rgba(255,255,255,0.85)';
                                linesContainer.style.borderRadius = '24px';
                                linesContainer.style.boxShadow = '0 2px 12px rgba(33,150,243,0.10)';
                                linesContainer.style.padding = '24px 12px 32px 12px';
                            }
                            linesContainer.innerHTML = `
                                <div style='font-size:2em;font-weight:700;color:#d76d77;margin-bottom:10px;'>yayyyyyy you got your gift 🎁</div>
                                <div style='font-size:1.5em;font-weight:600;color:#185a9d;margin-bottom:10px;'>Yes it&#39;s me your lifetime gift</div>
                                <div style='font-size:1.2em;font-weight:500;color:#333;margin-bottom:18px;'>If you liked your gift then click the button<br>If not then you can&#39;t go further, you don&#39;t have any choice. You have to like it 😂</div>
                                <button id='liked-gift-btn' style='display:block;margin:0 auto;padding:18px 48px;font-size:1.5em;font-weight:700;color:#fff;background:linear-gradient(90deg,#ffaf7b 0%,#d76d77 100%);border:none;border-radius:32px;box-shadow:0 4px 24px rgba(255,78,80,0.18),0 2px 8px rgba(249,212,35,0.12);cursor:pointer;transition:background 0.3s,transform 0.2s;outline:none;letter-spacing:1px;'>I liked the Gift 💖</button>
                            `;
                            // Append to the main cakeDiv
                            const cakeDiv = document.getElementById('cake-surprise');
                            if (cakeDiv) {
                                cakeDiv.appendChild(linesContainer);
                                // Add click event and hover effect to the button
                                setTimeout(() => {
                                    const likedGiftBtn = document.getElementById('liked-gift-btn');
                                    if (likedGiftBtn) {
                                        likedGiftBtn.onclick = function() {
                                            // Stop music before redirect
                                            if (birthdayAudio) {
                                                birthdayAudio.pause();
                                                birthdayAudio.currentTime = 0;
                                            }
                                            window.location.href = 'index(1).html';
                                        };
                                        likedGiftBtn.onmouseover = function() {
                                            likedGiftBtn.style.background = 'linear-gradient(90deg,#43cea2 0%,#185a9d 100%)';
                                            likedGiftBtn.style.transform = 'scale(1.06)';
                                        };
                                        likedGiftBtn.onmouseout = function() {
                                            likedGiftBtn.style.background = 'linear-gradient(90deg,#ffaf7b 0%,#d76d77 100%)';
                                            likedGiftBtn.style.transform = 'scale(1)';
                                        };
                                    }
                                }, 100);
                            }
                        }, 700); // Wait for pop animation to finish
                    }
                }, 100);
            }, 1000);
        }
    }
});
const nextSurpriseBtn = document.querySelector('.final-surprise-btn');
if (nextSurpriseBtn) {
    nextSurpriseBtn.style.margin = '10px';

}






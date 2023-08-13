const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");

const player = new MusicPlayer(musicList);
let music = player.getMusic();

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);

});
function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});
function pauseMusic() {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}
function playMusic() {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
    isPlayingNow();
}

prev.addEventListener("click", () => {
    prevMusic();
});
function prevMusic() {
    player.previous();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
next.addEventListener("click", () => {
    nextMusic();

});
function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
const calculateTime = (fullseconds) => {
    const min = Math.floor(fullseconds / 60);
    const sec = Math.floor(fullseconds % 60);
    const updatedsec = sec < 10 ? `0${sec}` : `${sec}`
    const updatedmin = min < 10 ? `0${min}` : `${min}`
    const result = `${updatedmin}:${updatedsec}`;
    return result;
}
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});
audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});
volume.addEventListener("click", () => {
    const isMuted = volume.classList.contains("isMuted");
    isMuted ? musicUnMute() : musicMute();
});
function musicUnMute() {
    volume.classList = "fa-solid fa-volume-high";
    volume.classList.remove("isMuted");
    audio.muted = false;
    volumeBar.value = 100;
}
function musicMute() {
    volume.classList = "fa-solid fa-volume-xmark";
    volume.classList.add("isMuted");
    audio.muted = true;
    volumeBar.value = 0;
}
volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    if (value == 0) {
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        volume.classList = "fa-solid fa-volume-high";
    }
});
const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag = `
        <li li-index='${i}' onclick="selecttedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${list[i].getName()}</span>
            <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
            <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>
        `;
        ul.insertAdjacentHTML("beforeend", liTag);
        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);
        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        });
    }
}

const selecttedMusic = (li) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}
const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")){
        if(li.classList.contains("playing")){
            li.classList.remove("playing");
        }
        if(li.getAttribute("li-index") == player.index){
            li.classList.add("playing");
        }
    }
}
audio.addEventListener("ended", () => {
    nextMusic();
});
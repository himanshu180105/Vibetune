/**
 * VibeTune — Persistent Music Player
 * Manages audio playback, queue, and player bar UI
 */
(function () {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const audio = document.getElementById('audioElement');
  const playerBar = document.getElementById('playerBar');
  const playerCoverImg = document.getElementById('playerCoverImg');
  const playerTrackTitle = document.getElementById('playerTrackTitle');
  const playerTrackArtist = document.getElementById('playerTrackArtist');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressBarThumb = document.getElementById('progressBarThumb');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const volumeBarContainer = document.getElementById('volumeBarContainer');
  const volumeBarFill = document.getElementById('volumeBarFill');
  const playerLikeBtn = document.getElementById('playerLikeBtn');

  if (!audio) return;

  // ========================================
  // State
  // ========================================
  let queue = [];
  let currentIndex = -1;
  let isPlaying = false;
  let isShuffle = false;
  let repeatMode = 'none'; // none, one, all
  let volume = parseFloat(localStorage.getItem('vt-volume') || '0.8');
  let isSeeking = false;

  // Set initial volume
  audio.volume = volume;
  updateVolumeUI();

  // ========================================
  // Restore State from localStorage
  // ========================================
  function restoreState() {
    try {
      const savedQueue = JSON.parse(localStorage.getItem('vt-queue') || '[]');
      const savedIndex = parseInt(localStorage.getItem('vt-index') || '-1');
      const savedTime = parseFloat(localStorage.getItem('vt-time') || '0');

      if (savedQueue.length > 0 && savedIndex >= 0) {
        queue = savedQueue;
        currentIndex = savedIndex;
        const track = queue[currentIndex];
        if (track) {
          updatePlayerUI(track);
          audio.src = track.audioUrl;
          audio.currentTime = savedTime;
          // Don't autoplay on restore
        }
      }
    } catch (e) {
      console.warn('Failed to restore player state:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem('vt-queue', JSON.stringify(queue));
      localStorage.setItem('vt-index', currentIndex.toString());
      localStorage.setItem('vt-time', audio.currentTime.toString());
    } catch (e) {
      // Silently fail
    }
  }

  // ========================================
  // Format Time
  // ========================================
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ========================================
  // Play a Song
  // ========================================
  function playSong(songData) {
    if (!songData || !songData.audioUrl) return;

    audio.src = songData.audioUrl;
    audio.play().catch(() => {});
    isPlaying = true;
    updatePlayerUI(songData);
    updatePlayPauseIcon();
    playerBar.classList.add('active');

    // Increment play count
    if (songData.id) {
      fetch(`/songs/${songData.id}/play`, { method: 'POST' }).catch(() => {});
    }

    saveState();
  }

  function updatePlayerUI(track) {
    if (!track) return;
    playerCoverImg.src = track.coverUrl || '/images/default-cover.svg';
    playerTrackTitle.textContent = track.title || 'Unknown';
    playerTrackArtist.textContent = track.artist || 'Unknown';
    document.title = `${track.title} — ${track.artist} | VibeTune`;
  }

  // ========================================
  // Play/Pause Toggle
  // ========================================
  function togglePlayPause() {
    if (!audio.src || audio.src === window.location.href) return;

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
    }
    updatePlayPauseIcon();
  }

  function updatePlayPauseIcon() {
    if (isPlaying) {
      playPauseIcon.classList.remove('fa-play');
      playPauseIcon.classList.add('fa-pause');
    } else {
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    }
  }

  // ========================================
  // Next / Previous
  // ========================================
  function playNext() {
    if (queue.length === 0) return;

    if (isShuffle) {
      currentIndex = Math.floor(Math.random() * queue.length);
    } else {
      currentIndex = (currentIndex + 1) % queue.length;
    }

    playSong(queue[currentIndex]);
  }

  function playPrev() {
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current song
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (isShuffle) {
      currentIndex = Math.floor(Math.random() * queue.length);
    } else {
      currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    }

    playSong(queue[currentIndex]);
  }

  // ========================================
  // Shuffle & Repeat
  // ========================================
  function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
  }

  function toggleRepeat() {
    if (repeatMode === 'none') {
      repeatMode = 'all';
      repeatBtn.classList.add('active');
      repeatBtn.querySelector('i').className = 'fas fa-redo';
    } else if (repeatMode === 'all') {
      repeatMode = 'one';
      repeatBtn.classList.add('active');
      repeatBtn.querySelector('i').className = 'fas fa-redo';
      repeatBtn.setAttribute('data-badge', '1');
    } else {
      repeatMode = 'none';
      repeatBtn.classList.remove('active');
      repeatBtn.removeAttribute('data-badge');
    }
  }

  // ========================================
  // Progress Bar
  // ========================================
  audio.addEventListener('timeupdate', () => {
    if (isSeeking) return;
    const { currentTime: ct, duration } = audio;
    if (isNaN(duration)) return;

    const pct = (ct / duration) * 100;
    progressBarFill.style.width = `${pct}%`;
    progressBarThumb.style.left = `${pct}%`;
    currentTimeEl.textContent = formatTime(ct);
    totalTimeEl.textContent = formatTime(duration);

    // Save position periodically
    if (Math.floor(ct) % 5 === 0) saveState();
  });

  audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (repeatMode === 'all' || currentIndex < queue.length - 1) {
      playNext();
    } else {
      isPlaying = false;
      updatePlayPauseIcon();
    }
  });

  // Seek
  progressBarContainer.addEventListener('click', (e) => {
    const rect = progressBarContainer.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (!isNaN(audio.duration)) {
      audio.currentTime = pct * audio.duration;
    }
  });

  // Drag seek
  let isDragging = false;

  progressBarContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    isSeeking = true;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = progressBarContainer.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    progressBarFill.style.width = `${pct * 100}%`;
    progressBarThumb.style.left = `${pct * 100}%`;
    currentTimeEl.textContent = formatTime(pct * audio.duration);
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    isSeeking = false;
    const rect = progressBarContainer.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    if (!isNaN(audio.duration)) {
      audio.currentTime = pct * audio.duration;
    }
  });

  // ========================================
  // Volume Control
  // ========================================
  function updateVolumeUI() {
    const pct = volume * 100;
    volumeBarFill.style.width = `${pct}%`;

    if (volume === 0) {
      volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
      volumeIcon.className = 'fas fa-volume-down';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  }

  volumeBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      audio.volume = 0;
      volume = 0;
    } else {
      volume = 0.8;
      audio.volume = volume;
    }
    updateVolumeUI();
    localStorage.setItem('vt-volume', volume.toString());
  });

  volumeBarContainer.addEventListener('click', (e) => {
    const rect = volumeBarContainer.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    volume = pct;
    audio.volume = volume;
    updateVolumeUI();
    localStorage.setItem('vt-volume', volume.toString());
  });

  // ========================================
  // Event Listeners — Control Buttons
  // ========================================
  playPauseBtn.addEventListener('click', togglePlayPause);
  nextBtn.addEventListener('click', playNext);
  prevBtn.addEventListener('click', playPrev);
  shuffleBtn.addEventListener('click', toggleShuffle);
  repeatBtn.addEventListener('click', toggleRepeat);

  // ========================================
  // Click-to-Play — Song Cards & Song Rows
  // ========================================
  function extractSongData(el) {
    return {
      id: el.dataset.songId,
      title: el.dataset.songTitle,
      artist: el.dataset.songArtist,
      artistId: el.dataset.songArtistId,
      coverUrl: el.dataset.songCover,
      audioUrl: el.dataset.songAudio,
      duration: parseInt(el.dataset.songDuration) || 0
    };
  }

  document.addEventListener('click', (e) => {
    const playBtn = e.target.closest('.play-btn-trigger');
    if (!playBtn) return;

    e.preventDefault();
    e.stopPropagation();

    // Find the parent with song data
    const songEl = playBtn.closest('[data-song-id]');
    if (!songEl) return;

    const songData = extractSongData(songEl);

    // Build queue from sibling song elements
    const parent = songEl.parentElement;
    const songEls = parent.querySelectorAll('[data-song-id]');

    if (songEls.length > 0) {
      queue = Array.from(songEls).map(el => extractSongData(el));
      currentIndex = Array.from(songEls).indexOf(songEl);
    } else {
      queue = [songData];
      currentIndex = 0;
    }

    playSong(songData);
  });

  // Double-click on song row
  document.addEventListener('dblclick', (e) => {
    const songRow = e.target.closest('.song-row[data-song-id]');
    if (!songRow) return;

    const songData = extractSongData(songRow);
    const parent = songRow.parentElement;
    const songEls = parent.querySelectorAll('.song-row[data-song-id]');

    queue = Array.from(songEls).map(el => extractSongData(el));
    currentIndex = Array.from(songEls).indexOf(songRow);

    playSong(songData);
  });

  // ========================================
  // Like Button (Player Bar)
  // ========================================
  playerLikeBtn.addEventListener('click', () => {
    if (currentIndex < 0 || !queue[currentIndex]) return;
    const songId = queue[currentIndex].id;
    if (!songId) return;

    fetch(`/library/like/${songId}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const icon = playerLikeBtn.querySelector('i');
          if (data.liked) {
            icon.className = 'fas fa-heart';
            playerLikeBtn.classList.add('liked');
          } else {
            icon.className = 'far fa-heart';
            playerLikeBtn.classList.remove('liked');
          }
        }
      })
      .catch(() => {});
  });

  // ========================================
  // Keyboard Shortcuts
  // ========================================
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
        if (e.shiftKey) playNext();
        else if (!isNaN(audio.duration)) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        break;
      case 'ArrowLeft':
        if (e.shiftKey) playPrev();
        else audio.currentTime = Math.max(0, audio.currentTime - 5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        volume = Math.min(1, volume + 0.1);
        audio.volume = volume;
        updateVolumeUI();
        localStorage.setItem('vt-volume', volume.toString());
        break;
      case 'ArrowDown':
        e.preventDefault();
        volume = Math.max(0, volume - 0.1);
        audio.volume = volume;
        updateVolumeUI();
        localStorage.setItem('vt-volume', volume.toString());
        break;
      case 'KeyM':
        volumeBtn.click();
        break;
    }
  });

  // ========================================
  // Initialize
  // ========================================
  restoreState();

})();

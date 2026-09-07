/**
 * VibeTune — General UI Interactions
 */
(function () {
  'use strict';

  // ========================================
  // Sidebar Active Link
  // ========================================
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath === href || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  // ========================================
  // Mobile Sidebar Toggle
  // ========================================
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }

  // ========================================
  // User Dropdown
  // ========================================
  const userDropdownBtn = document.getElementById('userDropdownBtn');
  const userDropdownMenu = document.getElementById('userDropdownMenu');

  if (userDropdownBtn && userDropdownMenu) {
    userDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      userDropdownMenu.classList.remove('show');
    });
  }

  // ========================================
  // Like Buttons (on pages)
  // ========================================
  document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (!likeBtn) return;

    e.preventDefault();
    const songId = likeBtn.dataset.songId;
    if (!songId) return;

    fetch(`/library/like/${songId}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const icon = likeBtn.querySelector('i');
          if (data.liked) {
            icon.className = 'fas fa-heart';
            likeBtn.classList.add('liked');
            likeBtn.dataset.liked = 'true';
          } else {
            icon.className = 'far fa-heart';
            likeBtn.classList.remove('liked');
            likeBtn.dataset.liked = 'false';
          }
        }
      })
      .catch(() => {});
  });

  // ========================================
  // Add to Playlist Dropdown
  // ========================================
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.dropdown-toggle');
    if (toggleBtn) {
      e.stopPropagation();
      const menu = toggleBtn.nextElementSibling;
      if (menu) menu.classList.toggle('show');
      return;
    }

    // Close all dropdowns
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  });

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-playlist-btn');
    if (!addBtn) return;

    const playlistId = addBtn.dataset.playlistId;
    const songId = addBtn.dataset.songId;

    fetch(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast(data.message || 'Added to playlist');
        }
      })
      .catch(() => showToast('Failed to add to playlist', 'error'));
  });

  // ========================================
  // Flash Messages Auto-Dismiss
  // ========================================
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(msg => {
    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(-10px)';
      setTimeout(() => msg.remove(), 300);
    }, 4000);
  });

  // ========================================
  // Toast Notification
  // ========================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Make toast available globally
  window.showToast = showToast;

  // ========================================
  // File Upload Labels
  // ========================================
  document.querySelectorAll('.file-upload input[type="file"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const label = input.closest('.file-upload').querySelector('.file-upload-label span');
      if (label && e.target.files.length > 0) {
        label.textContent = e.target.files[0].name;
      }
    });
  });

})();

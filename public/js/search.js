/**
 * VibeTune — Live Search with Debounce
 */
(function () {
  'use strict';

  const searchInput = document.getElementById('searchInput');
  const searchDropdown = document.getElementById('searchDropdown');

  if (!searchInput || !searchDropdown) return;

  let debounceTimer;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (query.length < 2) {
      searchDropdown.classList.remove('show');
      searchDropdown.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(() => {
      fetch(`/search/api?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => renderDropdown(data))
        .catch(() => {
          searchDropdown.classList.remove('show');
        });
    }, 300);
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search')) {
      searchDropdown.classList.remove('show');
    }
  });

  // Close on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchDropdown.classList.remove('show');
      searchInput.blur();
    }
  });

  function renderDropdown(data) {
    const { songs, artists, albums } = data;

    if (songs.length === 0 && artists.length === 0 && albums.length === 0) {
      searchDropdown.innerHTML = '<div class="search-dropdown-empty">No results found</div>';
      searchDropdown.classList.add('show');
      return;
    }

    let html = '';

    // Songs (top 5)
    if (songs.length > 0) {
      html += '<div class="search-dropdown-section"><h4>Songs</h4>';
      songs.slice(0, 5).forEach(song => {
        html += `
          <a href="/songs/${song._id}" class="search-dropdown-item">
            <img src="${song.coverUrl}" alt="${song.title}" class="search-dropdown-img">
            <div class="search-dropdown-info">
              <span class="search-dropdown-title">${song.title}</span>
              <span class="search-dropdown-sub">Song · ${song.artist ? song.artist.name : 'Unknown'}</span>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    // Artists (top 3)
    if (artists.length > 0) {
      html += '<div class="search-dropdown-section"><h4>Artists</h4>';
      artists.slice(0, 3).forEach(artist => {
        html += `
          <a href="/artists/${artist._id}" class="search-dropdown-item">
            <img src="${artist.image}" alt="${artist.name}" class="search-dropdown-img search-dropdown-img-round">
            <div class="search-dropdown-info">
              <span class="search-dropdown-title">${artist.name}</span>
              <span class="search-dropdown-sub">Artist</span>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    // Albums (top 3)
    if (albums.length > 0) {
      html += '<div class="search-dropdown-section"><h4>Albums</h4>';
      albums.slice(0, 3).forEach(album => {
        html += `
          <a href="/albums/${album._id}" class="search-dropdown-item">
            <img src="${album.coverUrl}" alt="${album.title}" class="search-dropdown-img">
            <div class="search-dropdown-info">
              <span class="search-dropdown-title">${album.title}</span>
              <span class="search-dropdown-sub">Album · ${album.artist ? album.artist.name : 'Unknown'}</span>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    // "See all results" link
    const query = searchInput.value.trim();
    html += `<a href="/search?q=${encodeURIComponent(query)}" class="search-dropdown-all">See all results</a>`;

    searchDropdown.innerHTML = html;
    searchDropdown.classList.add('show');
  }

})();

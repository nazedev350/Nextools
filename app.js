'use strict';

/* ─── Platform Config ─────────────────────────────────────────────────────── */
const PLATFORMS = {
  facebook: {
    name    : 'Facebook Downloader',
    desc    : 'Contoh: facebook.com/share/r/... atau fb.watch/...',
    icon    : '📘', pfx: '🔗', btnText: 'Download',
    ptag    : 'FB', ptagCls: 'tag-fb',
    urlHint : 'facebook.com',
    fetch   : fetchFacebook,
  },
  tiktok: {
    name    : 'TikTok Downloader',
    desc    : 'Contoh: vm.tiktok.com/... atau tiktok.com/@.../video/...',
    icon    : '🎬', pfx: '🔗', btnText: 'Download',
    ptag    : 'TT', ptagCls: 'tag-tt',
    urlHint : 'tiktok.com',
    fetch   : fetchTikTok,
  },
  instagram: {
    name    : 'Instagram Downloader',
    desc    : 'Contoh: instagram.com/reel/... atau /p/...',
    icon    : '📸', pfx: '🔗', btnText: 'Download',
    ptag    : 'IG', ptagCls: 'tag-ig',
    urlHint : 'instagram.com/reel',
    fetch   : fetchInstagram,
  },
  spotify: {
    name    : 'Spotify Downloader',
    desc    : 'Contoh: open.spotify.com/track/...',
    icon    : '🎧', pfx: '🔗', btnText: 'Download',
    ptag    : 'SP', ptagCls: 'tag-sp',
    urlHint : 'open.spotify.com/track',
    fetch   : fetchSpotify,
  },
  soundcloud: {
    name    : 'SoundCloud Downloader',
    desc    : 'Contoh: soundcloud.com/... atau m.soundcloud.com/...',
    icon    : '🔊', pfx: '🔗', btnText: 'Download',
    ptag    : 'SC', ptagCls: 'tag-sc',
    urlHint : 'soundcloud.com',
    fetch   : fetchSoundCloud,
  },
};

/* ─── URL Validators ──────────────────────────────────────────────────────── */
const URL_PATTERNS = {
  facebook  : /facebook\.com|fb\.watch|fb\.me/i,
  tiktok    : /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i,
  instagram : /instagram\.com\/(reel|p|tv)\//i,
  spotify   : /open\.spotify\.com\/track\//i,
  soundcloud: /soundcloud\.com\//i,
};

/* ─── State ───────────────────────────────────────────────────────────────── */
let active = 'facebook';

/* ─── DOM ─────────────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const urlInput = $('urlInput');
const clearBtn = $('clearBtn');
const goBtn    = $('goBtn');
const zone     = $('zone');
const zLoad    = $('zLoad');
const zErr     = $('zErr');
const zMedia   = $('zMedia');

/* ─── Clock + Battery ─────────────────────────────────────────────────────── */
function updateClock() {
  const now  = new Date();
  const hh   = String(now.getHours()).padStart(2, '0');
  const mm   = String(now.getMinutes()).padStart(2, '0');
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const mons = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  $('sbTime').textContent = `${hh}:${mm}`;
  $('sbDate').textContent = `${days[now.getDay()]}, ${now.getDate()} ${mons[now.getMonth()]}`;
}
updateClock();
setInterval(updateClock, 30000);

async function updateBattery() {
  if (!navigator.getBattery) return;
  try {
    const bat = await navigator.getBattery();
    const set = b => {
      const pct = Math.round(b.level * 100);
      $('batPct').textContent = pct + '%';
      $('batFill').style.width = pct + '%';
      $('batFill').style.background = pct <= 20 ? '#ef4444' : pct <= 50 ? '#f59e0b' : '#22c55e';
    };
    set(bat);
    bat.addEventListener('levelchange', () => set(bat));
  } catch (_) {}
}
updateBattery();

/* ─── Platform Pills ──────────────────────────────────────────────────────── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    active = pill.dataset.p;
    applyPlatform();
    resetUI();
    urlInput.value = '';
    clearBtn.classList.remove('show');
    urlInput.focus();
  });
});

function applyPlatform() {
  const p = PLATFORMS[active];
  $('ctIcon').textContent   = p.icon;
  $('ctName').textContent   = p.name;
  $('ctDesc').textContent   = p.desc;
  $('iPfx').textContent     = p.pfx;
  $('goBtnLbl').textContent = p.btnText;
}

/* ─── Input Events ────────────────────────────────────────────────────────── */
urlInput.addEventListener('input', () => {
  clearBtn.classList.toggle('show', urlInput.value.length > 0);
});
urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
clearBtn.addEventListener('click', () => {
  urlInput.value = '';
  clearBtn.classList.remove('show');
  resetUI();
  urlInput.focus();
});
goBtn.addEventListener('click', go);

/* ─── Main Action ─────────────────────────────────────────────────────────── */
async function go() {
  const val = urlInput.value.trim();
  if (!val) {
    urlInput.classList.add('shake');
    setTimeout(() => urlInput.classList.remove('shake'), 400);
    return;
  }

  // ── URL Validation ──────────────────────────────────────────────────────
  const pattern = URL_PATTERNS[active];
  if (pattern && !pattern.test(val)) {
    const p = PLATFORMS[active];
    showError(`URL tidak valid untuk ${p.name}.\n${p.desc}`);
    return;
  }

  showLoading();
  try {
    const result = await PLATFORMS[active].fetch(val);
    renderResult(result);
  } catch (err) {
    showError(err.message || 'Gagal mengambil data.');
  }
}

/* ─── Fetch Helper ────────────────────────────────────────────────────────── */
async function apiFetch(url, opts = {}) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, ...opts });
    clearTimeout(tid);
    if (!r.ok) throw new Error(`Server error: HTTP ${r.status}`);
    return r.json();
  } finally {
    clearTimeout(tid);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FETCHERS
═══════════════════════════════════════════════════════════════════════════ */

// ── FACEBOOK ──────────────────────────────────────────────────────────────────
async function fetchFacebook(url) {
  const json = await apiFetch(
    `https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`
  );
  if (!json.status || !json.data) throw new Error('Gagal mengambil data Facebook. Pastikan URL valid dan video bisa diakses.');
  const d = json.data;
  const links = (d.downloads || []).map(dl => ({
    url: dl.url, label: dl.quality || 'Download',
    sub: (dl.type || 'video') + ' · mp4',
    isAudio: false, direct: true,
  }));
  if (!links.length) throw new Error('Tidak ada link download tersedia.');
  return {
    platform: 'facebook', type: 'video',
    cover: d.thumbnail,
    title: d.title || 'Facebook Video',
    meta: [
      d.duration ? { icon:'⏱', text: d.duration } : null,
      { icon:'📘', text: 'Facebook' },
    ].filter(Boolean),
    links,
  };
}

// ── TIKTOK ────────────────────────────────────────────────────────────────────
// v1 untuk video/slide, v2 parallel untuk musik
async function fetchTikTok(url) {
  const [r1, r2] = await Promise.allSettled([
    apiFetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`),
    apiFetch(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`),
  ]);

  if (r1.status === 'rejected' || !r1.value?.status || !r1.value?.data)
    throw new Error('Gagal mengambil data TikTok. Coba lagi atau pastikan URL valid.');

  const d = r1.value.data;
  const musicUrl = (r2.status === 'fulfilled' && r2.value?.data?.music_link)
    ? r2.value.data.music_link : null;

  // FIX THUMBNAIL: TikTok CDN blokir hotlink di browser.
  // Gunakan proxy via siputzx atau simpan sebagai data proxy
  // Thumbnail v2 lebih bisa diakses daripada v1
  const thumb = (r2.status === 'fulfilled' && r2.value?.data?.cover_link)
    ? r2.value.data.cover_link
    : d.thumbnail || null;

  // ── SLIDE ──────────────────────────────────────────────────────────────
  if (d.type === 'slide') {
    const images = (d.media || []).filter(m => m.type === 'image');
    const links  = images.map((img, i) => ({
      url: img.url, label: `Foto ${i + 1}`,
      sub: 'slide · jpeg', isAudio: false, direct: true,
      thumb: img.thumbnail,
    }));
    if (musicUrl)
      links.push({ url: musicUrl, label: 'Musik / Audio', sub: 'audio · mp3', isAudio: true, direct: true });
    return {
      platform: 'tiktok', type: 'slide',
      cover: thumb,
      title: d.title || 'TikTok Slide',
      meta: [
        { icon:'👤', text: d.author || '—' },
        { icon:'🖼', text: `${images.length} foto` },
      ],
      links,
    };
  }

  // ── VIDEO ──────────────────────────────────────────────────────────────
  const links = [];
  (d.media || []).forEach(m => {
    if (m.quality === 'HD' || m.type === 'video_hd') {
      // Pakai backup saja (HD TikTok) — link utama sering expire
      if (m.backup)
        links.push({ url: m.backup, label: 'HD TikTok', sub: 'tanpa watermark · mp4', isAudio: false, direct: true });
    } else {
      links.push({ url: m.url, label: 'SD Video', sub: 'tanpa watermark · mp4', isAudio: false, direct: true });
    }
  });
  if (musicUrl)
    links.push({ url: musicUrl, label: 'Musik / Audio', sub: 'audio · mp3', isAudio: true, direct: true });

  if (!links.length) throw new Error('Tidak ada link download tersedia.');

  return {
    platform: 'tiktok', type: 'video',
    cover: thumb,
    title: d.title || 'TikTok Video',
    meta: [
      { icon:'👤', text: d.author || '—' },
      { icon:'🎬', text: 'TikTok' },
    ],
    links,
  };
}

// ── INSTAGRAM ─────────────────────────────────────────────────────────────────
async function fetchInstagram(url) {
  // Pastikan URL yang diterima adalah format reel/p/tv Instagram
  // API fastdl hanya support: instagram.com/reel/, /p/, /tv/
  const json = await apiFetch(
    `https://api.siputzx.my.id/api/d/fastdl?url=${encodeURIComponent(url)}`
  );
  if (!json.status || !json.data) throw new Error('Gagal mengambil data Instagram. Pastikan URL berformat instagram.com/reel/... atau /p/...');
  const d    = json.data;
  const meta = d.meta || {};

  const fmtNum = n => {
    if (!n) return null;
    return n >= 1000000 ? (n/1000000).toFixed(1)+'M'
         : n >= 1000    ? (n/1000).toFixed(1)+'K'
         : String(n);
  };

  const links = (d.url || []).map(item => ({
    url    : item.url,
    label  : item.name || item.type?.toUpperCase() || 'Download',
    sub    : `${item.ext || item.type || 'file'} · Instagram`,
    isAudio: (item.ext || item.type || '').toLowerCase() === 'mp3',
    direct : true,
  }));

  if (!links.length) throw new Error('Tidak ada file yang bisa didownload dari URL ini.');

  return {
    platform: 'instagram', type: 'video',
    cover: d.thumb,
    title: meta.title || 'Instagram Media',
    meta: [
      meta.username     ? { icon:'👤', text: '@' + meta.username }        : null,
      meta.like_count   ? { icon:'❤️', text: fmtNum(meta.like_count) + ' likes' }    : null,
      meta.comment_count? { icon:'💬', text: fmtNum(meta.comment_count) + ' komentar' } : null,
      { icon:'📸', text: 'Instagram' },
    ].filter(Boolean),
    links,
  };
}

// ── SPOTIFY ───────────────────────────────────────────────────────────────────
async function fetchSpotify(url) {
  const json = await apiFetch(
    `https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`
  );
  if (!json.status || !json.result) throw new Error('Gagal mengambil data Spotify. Pastikan URL format: open.spotify.com/track/...');
  const r = json.result;
  if (!r.download?.url) throw new Error('Link download tidak tersedia. Coba track lain.');
  return {
    platform: 'spotify', type: 'audio',
    cover: r.image,
    title: r.title || 'Spotify Track',
    meta: [
      r.artist   ? { icon:'🎤', text: r.artist }   : null,
      r.album    ? { icon:'💿', text: r.album }    : null,
      r.released ? { icon:'📅', text: r.released } : null,
      { icon:'🎵', text: 'Spotify · MP3' },
    ].filter(Boolean),
    links: [
      { url: r.download.url, label: 'Download MP3', sub: r.download.quality || 'mp3 · audio', isAudio: true, direct: true },
    ],
  };
}

// ── SOUNDCLOUD ────────────────────────────────────────────────────────────────
async function fetchSoundCloud(url) {
  // Normalisasi URL: m.soundcloud.com → soundcloud.com (API hanya terima desktop URL)
  const normalUrl = url.replace(/^https?:\/\/m\.soundcloud\.com/, 'https://soundcloud.com');
  const json = await apiFetch(
    `https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(normalUrl)}`
  );
  if (!json.status || !json.data) throw new Error('Gagal mengambil data SoundCloud. Pastikan URL format: soundcloud.com/...');
  const d = json.data;
  if (!d.url) throw new Error('Link download tidak tersedia.');
  const durMin = d.duration
    ? `${Math.floor(d.duration/60000)}:${String(Math.floor((d.duration%60000)/1000)).padStart(2,'0')}`
    : null;
  return {
    platform: 'soundcloud', type: 'audio',
    cover: d.thumbnail,
    title: d.title || 'SoundCloud Track',
    meta: [
      d.user  ? { icon:'🎤', text: d.user }  : null,
      durMin  ? { icon:'⏱', text: durMin }  : null,
      { icon:'🔊', text: 'SoundCloud · MP3' },
    ].filter(Boolean),
    links: [
      { url: d.url, label: 'Download MP3', sub: 'audio · 128kbps', isAudio: true, direct: true },
    ],
  };
}

/* ─── UI States ───────────────────────────────────────────────────────────── */
function showLoading() {
  goBtn.disabled = true;
  zone.style.display   = 'block';
  zLoad.style.display  = 'flex';
  zErr.style.display   = 'none';
  zMedia.style.display = 'none';
}

function showError(msg) {
  goBtn.disabled = false;
  zLoad.style.display = 'none';
  zErr.style.display  = 'flex';
  $('zErrMsg').textContent = msg;
}

function resetUI() {
  goBtn.disabled = false;
  zone.style.display   = 'none';
  zLoad.style.display  = 'none';
  zErr.style.display   = 'none';
  zMedia.style.display = 'none';
}
window.resetUI = resetUI;

/* ─── Make Download Button ────────────────────────────────────────────────── */
function makeDownloadBtn(link) {
  const btn = document.createElement('button');
  btn.className = 'dl-link' + (link.isAudio ? ' audio-link' : '');
  btn.type = 'button';
  const ico = link.isAudio ? '🎵'
    : link.label.toLowerCase().includes('foto') ? '🖼'
    : '🎬';
  btn.innerHTML = `
    <span class="dl-link-ico">${ico}</span>
    <span class="dl-link-label">
      <span class="dl-link-qlabel">${link.label}</span>
      <span class="dl-link-sub">${link.sub}</span>
    </span>
    <span class="dl-link-arr">⬇</span>
  `;

  btn.addEventListener('click', async () => {
    const arr = btn.querySelector('.dl-link-arr');
    arr.textContent = '⏳';
    btn.disabled = true;
    try {
      const ext = link.isAudio ? 'mp3'
        : link.label.toLowerCase().includes('foto') ? 'jpg'
        : 'mp4';
      const filename = `nexdown_${link.label.replace(/\s+/g,'_').toLowerCase()}.${ext}`;

      // Try blob download (works for same-origin / CORS-allowed CDNs)
      let downloaded = false;
      try {
        const resp = await fetch(link.url, { mode: 'cors' });
        if (resp.ok) {
          const blob = await resp.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 1500);
          downloaded = true;
        }
      } catch (_) {}

      // Fallback: open new tab
      if (!downloaded) {
        const a = document.createElement('a');
        a.href = link.url;
        a.download = filename;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      arr.textContent = '✓';
      setTimeout(() => { arr.textContent = '⬇'; btn.disabled = false; }, 2500);
    } catch (e) {
      arr.textContent = '⬇';
      btn.disabled = false;
    }
  });

  return btn;
}

/* ─── Render Result ───────────────────────────────────────────────────────── */
function renderResult(data) {
  goBtn.disabled = false;
  zLoad.style.display  = 'none';
  zMedia.style.display = 'block';

  const p = PLATFORMS[data.platform] || PLATFORMS[active];

  // ── Cover ──────────────────────────────────────────────────────────────
  const cover = $('mCover');
  const coverWrap = cover.parentElement;
  if (data.cover) {
    cover.src = data.cover;
    cover.style.display = 'block';
    cover.onerror = () => {
      // Thumbnail gagal load (TikTok CDN hotlink protection) — tampilkan placeholder
      cover.style.display = 'none';
      coverWrap.style.background = 'linear-gradient(135deg,#1e1b4b,#312e81)';
      if (!coverWrap.querySelector('.cover-fallback')) {
        const fb = document.createElement('div');
        fb.className = 'cover-fallback';
        fb.textContent = p.icon;
        coverWrap.appendChild(fb);
      }
    };
    // Kalau sudah ada fallback dari sebelumnya, hapus
    const old = coverWrap.querySelector('.cover-fallback');
    if (old) old.remove();
  } else {
    cover.style.display = 'none';
    coverWrap.style.background = 'linear-gradient(135deg,#1e1b4b,#312e81)';
    const fb = document.createElement('div');
    fb.className = 'cover-fallback';
    fb.textContent = p.icon;
    coverWrap.appendChild(fb);
  }

  // ── Platform tag ───────────────────────────────────────────────────────
  const ptag = $('mPtag');
  ptag.textContent = data.type === 'slide' ? 'SLIDE' : p.ptag;
  ptag.className   = 'mcard-ptag ' + p.ptagCls;

  // ── Title ──────────────────────────────────────────────────────────────
  $('mTitle').textContent = data.title;

  // ── Meta chips ─────────────────────────────────────────────────────────
  const metaEl = $('mMeta');
  metaEl.innerHTML = '';
  (data.meta || []).forEach(m => {
    const chip = document.createElement('span');
    chip.className = 'meta-chip';
    chip.textContent = `${m.icon} ${m.text}`;
    metaEl.appendChild(chip);
  });

  // ── Download links ─────────────────────────────────────────────────────
  const linksEl = $('mLinks');
  linksEl.innerHTML = '';

  if (!data.links || !data.links.length) {
    linksEl.innerHTML = '<p style="font-size:.75rem;color:var(--muted)">Tidak ada link download.</p>';
    return;
  }

  if (data.type === 'slide') {
    // Thumbnail preview strip (filter hanya image links)
    const imgLinks = data.links.filter(l => !l.isAudio);
    if (imgLinks.length) {
      const strip = document.createElement('div');
      strip.className = 'slide-strip';
      imgLinks.forEach((img, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'slide-thumb';
        thumb.innerHTML = `
          <img src="${img.thumb || img.url}" alt="Foto ${i+1}" loading="lazy" onerror="this.style.opacity='.25'"/>
          <span>${i+1}</span>
        `;
        strip.appendChild(thumb);
      });
      linksEl.appendChild(strip);
    }
    // All download buttons (foto + musik)
    data.links.forEach((link, i) => {
      const lbl = link.isAudio ? link.label : `Download Foto ${i + 1}`;
      linksEl.appendChild(makeDownloadBtn({ ...link, label: lbl }));
    });
    return;
  }

  // Normal links
  data.links.forEach(link => linksEl.appendChild(makeDownloadBtn(link)));
}

/* ─── Init ────────────────────────────────────────────────────────────────── */
applyPlatform();

'use strict';

/* ─── PLATFORM CONFIG ─────────────────────────────────────────────────────── */
const PLATFORMS = {
  facebook  : { name:'Facebook Downloader',   desc:'Contoh: facebook.com/share/r/... atau fb.watch/...',        icon:'📘', pfx:'🔗', btnText:'Download', ptag:'FB', ptagCls:'tag-fb', fetch:fetchFacebook },
  tiktok    : { name:'TikTok Downloader',      desc:'Contoh: vm.tiktok.com/... atau tiktok.com/@.../video/...',  icon:'🎬', pfx:'🔗', btnText:'Download', ptag:'TT', ptagCls:'tag-tt', fetch:fetchTikTok },
  instagram : { name:'Instagram Downloader',   desc:'Contoh: instagram.com/reel/... atau /p/...',                icon:'📸', pfx:'🔗', btnText:'Download', ptag:'IG', ptagCls:'tag-ig', fetch:fetchInstagram },
  spotify   : { name:'Spotify Downloader',     desc:'Contoh: open.spotify.com/track/...',                       icon:'🎧', pfx:'🔗', btnText:'Download', ptag:'SP', ptagCls:'tag-sp', fetch:fetchSpotify },
  soundcloud: { name:'SoundCloud Downloader',  desc:'Contoh: soundcloud.com/... atau m.soundcloud.com/...',     icon:'🔊', pfx:'🔗', btnText:'Download', ptag:'SC', ptagCls:'tag-sc', fetch:fetchSoundCloud },
};

/* ─── URL VALIDATORS ──────────────────────────────────────────────────────── */
const URL_PATTERNS = {
  facebook  : /facebook\.com|fb\.watch|fb\.me/i,
  tiktok    : /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i,
  instagram : /instagram\.com\/(reel|p|tv)\//i,
  spotify   : /open\.spotify\.com\/track\//i,
  soundcloud: /soundcloud\.com\//i,
};

/* ─── STATE ───────────────────────────────────────────────────────────────── */
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

/* ─── CLOCK + BATTERY ─────────────────────────────────────────────────────── */
function updateClock() {
  const n   = new Date();
  const hh  = String(n.getHours()).padStart(2, '0');
  const mm  = String(n.getMinutes()).padStart(2, '0');
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const mons = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  $('sbTime').textContent = `${hh}:${mm}`;
  $('sbDate').textContent = `${days[n.getDay()]}, ${n.getDate()} ${mons[n.getMonth()]}`;
}
updateClock();
setInterval(updateClock, 30000);

async function updateBattery() {
  if (!navigator.getBattery) return;
  try {
    const bat = await navigator.getBattery();
    const set = b => {
      const p = Math.round(b.level * 100);
      $('batPct').textContent      = p + '%';
      $('batFill').style.width     = p + '%';
      $('batFill').style.background = p <= 20 ? '#ef4444' : p <= 50 ? '#f59e0b' : '#22c55e';
    };
    set(bat);
    bat.addEventListener('levelchange', () => set(bat));
  } catch (_) {}
}
updateBattery();

/* ─── PLATFORM PILLS ──────────────────────────────────────────────────────── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    active = pill.dataset.p;
    applyPlatform();
    resetUI();
    urlInput.value = '';
    clearBtn.classList.remove('show');

    $('urlInputArea').style.display = 'flex';
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

/* ─── INPUT EVENTS ────────────────────────────────────────────────────────── */
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

/* ─── MAIN ACTION ─────────────────────────────────────────────────────────── */
async function go() {
  const val = urlInput.value.trim();
  if (!val) {
    urlInput.classList.add('shake');
    setTimeout(() => urlInput.classList.remove('shake'), 400);
    return;
  }
  const pat = URL_PATTERNS[active];
  if (pat && !pat.test(val)) {
    showError(`URL tidak valid untuk ${PLATFORMS[active].name}.\n${PLATFORMS[active].desc}`);
    return;
  }
  showLoading();
  try {
    renderResult(await PLATFORMS[active].fetch(val));
  } catch (err) {
    showError(err.message || 'Gagal mengambil data.');
  }
}

/* ─── FETCH HELPER ────────────────────────────────────────────────────────── */
async function apiFetch(url, opts = {}) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, ...opts });
    clearTimeout(tid);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
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
  const j = await apiFetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`);
  if (!j.status || !j.data) throw new Error('Gagal mengambil data Facebook. Pastikan URL valid.');
  const d     = j.data;
  const links = (d.downloads || []).map(dl => ({
    url: dl.url, label: dl.quality || 'Download',
    sub: (dl.type || 'video') + ' · mp4', isAudio: false, direct: true,
  }));
  if (!links.length) throw new Error('Tidak ada link download tersedia.');
  return {
    platform: 'facebook', type: 'video',
    cover: d.thumbnail, title: d.title || 'Facebook Video',
    meta: [d.duration ? { icon:'⏱', text:d.duration } : null, { icon:'📘', text:'Facebook' }].filter(Boolean),
    links,
  };
}

// ── TIKTOK ────────────────────────────────────────────────────────────────────
async function fetchTikTok(url) {
  const [r1, r2] = await Promise.allSettled([
    apiFetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`),
    apiFetch(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`),
  ]);
  if (r1.status === 'rejected' || !r1.value?.status || !r1.value?.data)
    throw new Error('Gagal mengambil data TikTok. Pastikan URL valid.');

  const d        = r1.value.data;
  const musicUrl = (r2.status === 'fulfilled' && r2.value?.data?.music_link) ? r2.value.data.music_link : null;
  const thumb    = (r2.status === 'fulfilled' && r2.value?.data?.cover_link) ? r2.value.data.cover_link : d.thumbnail || null;

  // SLIDE
  if (d.type === 'slide') {
    const imgs  = (d.media || []).filter(m => m.type === 'image');
    const links = imgs.map((img, i) => ({ url:img.url, label:`Foto ${i+1}`, sub:'slide · jpeg', isAudio:false, direct:true, thumb:img.thumbnail }));
    if (musicUrl) links.push({ url:musicUrl, label:'Musik / Audio', sub:'audio · mp3', isAudio:true, direct:true });
    return {
      platform:'tiktok', type:'slide', cover:thumb,
      title: d.title || 'TikTok Slide',
      meta: [{ icon:'👤', text:d.author||'—' }, { icon:'🖼', text:`${imgs.length} foto` }],
      links,
    };
  }

  // VIDEO
  const links = [];
  (d.media || []).forEach(m => {
    if (m.quality === 'HD' || m.type === 'video_hd') {
      if (m.backup) links.push({ url:m.backup, label:'HD TikTok', sub:'tanpa watermark · mp4', isAudio:false, direct:true });
    } else {
      links.push({ url:m.url, label:'SD Video', sub:'tanpa watermark · mp4', isAudio:false, direct:true });
    }
  });
  if (musicUrl) links.push({ url:musicUrl, label:'Musik / Audio', sub:'audio · mp3', isAudio:true, direct:true });
  if (!links.length) throw new Error('Tidak ada link download tersedia.');
  return {
    platform:'tiktok', type:'video', cover:thumb,
    title: d.title || 'TikTok Video',
    meta: [{ icon:'👤', text:d.author||'—' }, { icon:'🎬', text:'TikTok' }],
    links,
  };
}

// ── INSTAGRAM ─────────────────────────────────────────────────────────────────
async function fetchInstagram(url) {
  const j = await apiFetch(`https://api.siputzx.my.id/api/d/fastdl?url=${encodeURIComponent(url)}`);
  if (!j.status || !j.data) throw new Error('Gagal mengambil data Instagram. Pastikan URL berformat instagram.com/reel/... atau /p/...');
  const d    = j.data;
  const meta = d.meta || {};
  const fmtNum = n => !n ? null : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : String(n);
  const links = (d.url || []).map(item => ({
    url    : item.url,
    label  : item.name || item.type?.toUpperCase() || 'Download',
    sub    : `${item.ext || item.type || 'file'} · Instagram`,
    isAudio: (item.ext || item.type || '').toLowerCase() === 'mp3',
    direct : true,
  }));
  if (!links.length) throw new Error('Tidak ada file yang bisa didownload dari URL ini.');
  return {
    platform:'instagram', type:'video', cover:d.thumb,
    title: meta.title || 'Instagram Media',
    meta: [
      meta.username      ? { icon:'👤', text:'@'+meta.username }                    : null,
      meta.like_count    ? { icon:'❤️', text:fmtNum(meta.like_count)+' likes' }       : null,
      meta.comment_count ? { icon:'💬', text:fmtNum(meta.comment_count)+' komentar' } : null,
      { icon:'📸', text:'Instagram' },
    ].filter(Boolean),
    links,
  };
}

// ── SPOTIFY ───────────────────────────────────────────────────────────────────
async function fetchSpotify(url) {
  const j = await apiFetch(`https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`);
  if (!j.status || !j.result) throw new Error('Gagal mengambil data Spotify. Pastikan URL format: open.spotify.com/track/...');
  const r = j.result;
  if (!r.download?.url) throw new Error('Link download tidak tersedia. Coba track lain.');
  return {
    platform:'spotify', type:'audio', cover:r.image,
    title: r.title || 'Spotify Track',
    meta: [
      r.artist   ? { icon:'🎤', text:r.artist }   : null,
      r.album    ? { icon:'💿', text:r.album }    : null,
      r.released ? { icon:'📅', text:r.released } : null,
      { icon:'🎵', text:'Spotify · MP3' },
    ].filter(Boolean),
    links: [{ url:r.download.url, label:'Download MP3', sub:r.download.quality||'mp3 · audio', isAudio:true, direct:true }],
  };
}

// ── SOUNDCLOUD ────────────────────────────────────────────────────────────────
async function fetchSoundCloud(url) {
  const normalUrl = url.replace(/^https?:\/\/m\.soundcloud\.com/, 'https://soundcloud.com');
  const j = await apiFetch(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(normalUrl)}`);
  if (!j.status || !j.data) throw new Error('Gagal mengambil data SoundCloud.');
  const d = j.data;
  if (!d.url) throw new Error('Link download tidak tersedia.');
  const dur = d.duration
    ? `${Math.floor(d.duration/60000)}:${String(Math.floor((d.duration%60000)/1000)).padStart(2,'0')}`
    : null;
  return {
    platform:'soundcloud', type:'audio', cover:d.thumbnail,
    title: d.title || 'SoundCloud Track',
    meta: [
      d.user ? { icon:'🎤', text:d.user } : null,
      dur    ? { icon:'⏱', text:dur }    : null,
      { icon:'🔊', text:'SoundCloud · MP3' },
    ].filter(Boolean),
    links: [{ url:d.url, label:'Download MP3', sub:'audio · 128kbps', isAudio:true, direct:true }],
  };
}

/* ─── UI STATES ───────────────────────────────────────────────────────────── */
function showLoading() {
  goBtn.disabled      = true;
  zone.style.display  = 'block';
  zLoad.style.display = 'flex';
  zErr.style.display  = 'none';
  zMedia.style.display = 'none';
}

function showError(msg) {
  goBtn.disabled      = false;
  zone.style.display  = 'block';
  zLoad.style.display = 'none';
  zErr.style.display  = 'flex';
  $('zErrMsg').textContent = msg;
}

function resetUI() {
  goBtn.disabled       = false;
  zone.style.display   = 'none';
  zLoad.style.display  = 'none';
  zErr.style.display   = 'none';
  zMedia.style.display = 'none';
}
window.resetUI = resetUI;

/* ─── FILENAME FROM DOWNLOAD URL ─────────────────────────────────────────── */
function getFilename(downloadUrl, isAudio, label) {
  try {
    // Ambil path dari URL download (bukan URL input user)
    const urlObj  = new URL(downloadUrl);
    const path    = urlObj.pathname;                        // e.g. /ZS9dKwVvpMHud-OhTjo.mp4
    const base    = path.split('/').filter(Boolean).pop();  // e.g. ZS9dKwVvpMHud-OhTjo.mp4
    const clean   = base ? decodeURIComponent(base).split('?')[0] : '';

    // Kalau sudah punya ekstensi valid → pakai langsung
    const extMatch = clean.match(/\.([a-zA-Z0-9]{2,5})$/);
    if (extMatch && clean.length > 4) return clean;

    // Fallback: buat nama dari label + ekstensi yang tepat
    const ext = isAudio ? 'mp3' : label.toLowerCase().includes('foto') ? 'jpg' : 'mp4';
    const slug = clean.replace(/[^a-zA-Z0-9_\-]/g, '') || label.replace(/\s+/g,'_').toLowerCase();
    return slug + '.' + ext;
  } catch (_) {
    const ext = isAudio ? 'mp3' : label.toLowerCase().includes('foto') ? 'jpg' : 'mp4';
    return `nexdown_${label.replace(/\s+/g,'_').toLowerCase()}.${ext}`;
  }
}

/* ─── MAKE DOWNLOAD BUTTON ────────────────────────────────────────────────── */
function makeDownloadBtn(link) {
  const btn = document.createElement('button');
  btn.className = 'dl-link' + (link.isAudio ? ' audio-link' : '');
  btn.type = 'button';
  const ico = link.isAudio ? '🎵' : link.label.toLowerCase().includes('foto') ? '🖼' : '🎬';
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
    btn.disabled    = true;
    try {
      // Nama file diambil dari URL download langsung
      const filename = getFilename(link.url, link.isAudio, link.label);

      let ok = false;
      try {
        const resp = await fetch(link.url, { mode:'cors' });
        if (resp.ok) {
          const blob = await resp.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 1500);
          ok = true;
        }
      } catch (_) {}

      if (!ok) {
        const a = document.createElement('a');
        a.href = link.url; a.download = filename;
        a.target = '_blank'; a.rel = 'noopener noreferrer';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }

      arr.textContent = '✓';
      setTimeout(() => { arr.textContent = '⬇'; btn.disabled = false; }, 2500);
    } catch (e) {
      arr.textContent = '⬇';
      btn.disabled    = false;
    }
  });
  return btn;
}

/* ─── RENDER RESULT ───────────────────────────────────────────────────────── */
function renderResult(data) {
  goBtn.disabled       = false;
  zLoad.style.display  = 'none';
  zMedia.style.display = 'block';

  const p      = PLATFORMS[data.platform] || PLATFORMS[active];
  const cover  = $('mCover');
  const cw     = cover.parentElement;

  // Cover image
  if (data.cover) {
    cover.src = data.cover;
    cover.style.display = 'block';
    cover.onerror = () => {
      cover.style.display = 'none';
      cw.style.background = 'linear-gradient(135deg,#1e1b4b,#312e81)';
      if (!cw.querySelector('.cover-fallback')) {
        const f = document.createElement('div');
        f.className   = 'cover-fallback';
        f.textContent = p.icon;
        cw.appendChild(f);
      }
    };
    const old = cw.querySelector('.cover-fallback');
    if (old) old.remove();
  } else {
    cover.style.display = 'none';
    if (!cw.querySelector('.cover-fallback')) {
      const f = document.createElement('div');
      f.className   = 'cover-fallback';
      f.textContent = p.icon;
      cw.appendChild(f);
    }
  }

  // Platform tag
  const pt = $('mPtag');
  pt.textContent = data.type === 'slide' ? 'SLIDE' : p.ptag;
  pt.className   = 'mcard-ptag ' + p.ptagCls;

  // Title
  $('mTitle').textContent = data.title;

  // Meta chips
  const me = $('mMeta');
  me.innerHTML = '';
  (data.meta || []).forEach(m => {
    const chip = document.createElement('span');
    chip.className   = 'meta-chip';
    chip.textContent = `${m.icon} ${m.text}`;
    me.appendChild(chip);
  });

  // Download links
  const le = $('mLinks');
  le.innerHTML = '';

  if (!data.links || !data.links.length) {
    le.innerHTML = '<p style="font-size:.75rem;color:var(--muted)">Tidak ada link download.</p>';
    return;
  }

  if (data.type === 'slide') {
    const imgLinks = data.links.filter(l => !l.isAudio);
    if (imgLinks.length) {
      const strip = document.createElement('div');
      strip.className = 'slide-strip';
      imgLinks.forEach((img, i) => {
        const t = document.createElement('div');
        t.className = 'slide-thumb';
        t.innerHTML = `<img src="${img.thumb||img.url}" alt="Foto ${i+1}" loading="lazy" onerror="this.style.opacity='.25'"/><span>${i+1}</span>`;
        strip.appendChild(t);
      });
      le.appendChild(strip);
    }
    data.links.forEach((l, i) => {
      le.appendChild(makeDownloadBtn({ ...l, label: l.isAudio ? l.label : `Download Foto ${i+1}` }));
    });
    return;
  }

  data.links.forEach(l => le.appendChild(makeDownloadBtn(l)));
}

/* ─── INIT ────────────────────────────────────────────────────────────────── */
applyPlatform();

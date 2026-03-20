'use strict';

/* ══ PLATFORM CONFIG ═══════════════════════════════════════════════════════ */
const PLATFORM_ICONS = {
  facebook : `<svg viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
  tiktok   : `<svg viewBox="0 0 24 24" fill="#fff" style="background:#010101;border-radius:6px"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.73a4.85 4.85 0 01-1-.04z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><defs><radialGradient id="igI" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#igI)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  spotify  : `<svg viewBox="0 0 24 24" fill="#1db954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  soundcloud:`<svg viewBox="0 0 24 24" fill="#ff5500"><path d="M1.175 12.225c-.017 0-.034.002-.05.006-.017-.004-.034-.006-.05-.006-.225 0-.407.182-.407.407v.001c0 .224.181.406.406.406.017 0 .034-.002.05-.006.017.004.034.006.05.006.225 0 .406-.181.406-.406v-.001c0-.225-.181-.407-.405-.407zm1.469-.83c-.025 0-.049.004-.073.01-.025-.006-.049-.01-.073-.01-.337 0-.609.272-.609.609v.001c0 .337.272.609.609.609.025 0 .049-.004.073-.01.025.006.049.01.073.01.337 0 .609-.272.609-.609v-.001c0-.337-.272-.609-.609-.609zM24 11.175c0-2.251-1.824-4.076-4.075-4.076-.285 0-.563.03-.832.087C18.48 5.648 16.91 4.5 15.075 4.5c-.583 0-1.137.131-1.631.364C12.503 3.124 11.059 2.25 9.419 2.25c-2.758 0-4.994 2.236-4.994 4.994 0 .152.007.302.021.45C2.906 8.151 2.25 9.184 2.25 10.35c0 1.763 1.429 3.192 3.192 3.192H20.6c1.874 0 3.4-1.525 3.4-3.4v-.032l.001.065z"/></svg>`,
  twitter  : `<svg viewBox="0 0 24 24" fill="#fff" style="background:#000;border-radius:6px;padding:2px"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
};

const PLATFORMS = {
  facebook  : { name:'Facebook Downloader',  desc:'Contoh: facebook.com/share/r/... atau fb.watch/...',       ptag:'FB', ptagCls:'tag-fb', fetch:fetchFacebook },
  tiktok    : { name:'TikTok Downloader',     desc:'Contoh: vm.tiktok.com/... atau tiktok.com/@.../video/...',  ptag:'TT', ptagCls:'tag-tt', fetch:fetchTikTok },
  instagram : { name:'Instagram Downloader',  desc:'Contoh: instagram.com/reel/... atau /p/...',                ptag:'IG', ptagCls:'tag-ig', fetch:fetchInstagram },
  spotify   : { name:'Spotify Downloader',    desc:'Contoh: open.spotify.com/track/...',                        ptag:'SP', ptagCls:'tag-sp', fetch:fetchSpotify },
  soundcloud: { name:'SoundCloud Downloader', desc:'Contoh: soundcloud.com/artist/track-name',                  ptag:'SC', ptagCls:'tag-sc', fetch:fetchSoundCloud },
  twitter   : { name:'X / Twitter Downloader',desc:'Contoh: x.com/i/status/... atau twitter.com/...',           ptag:'X',  ptagCls:'tag-tw', fetch:fetchTwitter },
};

const URL_PATTERNS = {
  facebook  : /facebook\.com|fb\.watch|fb\.me/i,
  tiktok    : /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/i,
  instagram : /instagram\.com\/(reel|p|tv)\//i,
  spotify   : /open\.spotify\.com\/track\//i,
  soundcloud: /soundcloud\.com\//i,
  twitter   : /x\.com|twitter\.com/i,
};

let active = 'facebook';
const $ = id => document.getElementById(id);
const urlInput = $('urlInput');
const clearBtn = $('clearBtn');
const goBtn    = $('goBtn');
const zone     = $('zone');
const zLoad    = $('zLoad');
const zErr     = $('zErr');
const zMedia   = $('zMedia');

function updateClock(){
  const n=new Date(),hh=String(n.getHours()).padStart(2,'0'),mm=String(n.getMinutes()).padStart(2,'0');
  const days=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const mons=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  $('sbTime').textContent=`${hh}:${mm}`;
  $('sbDate').textContent=`${days[n.getDay()]}, ${n.getDate()} ${mons[n.getMonth()]}`;
}
updateClock(); setInterval(updateClock,30000);

async function updateBattery(){
  if(!navigator.getBattery)return;
  try{
    const bat=await navigator.getBattery();
    const set=b=>{const p=Math.round(b.level*100);$('batPct').textContent=p+'%';$('batFill').style.width=p+'%';$('batFill').style.background=p<=20?'#ef4444':p<=50?'#f59e0b':'#22c55e';};
    set(bat);bat.addEventListener('levelchange',()=>set(bat));
  }catch(_){}
}
updateBattery();

function applyPlatform(){
  const p=PLATFORMS[active];if(!p)return;
  $('apName').textContent=p.name;
  $('apDesc').textContent=p.desc;
  $('goBtnLbl').textContent='Download';
  const ic=$('apIcon');ic.innerHTML=PLATFORM_ICONS[active]||'';
  const s=ic.querySelector('svg');if(s){s.style.width='100%';s.style.height='100%';}
}

urlInput.addEventListener('input',()=>clearBtn.classList.toggle('show',urlInput.value.length>0));
urlInput.addEventListener('keydown',e=>{if(e.key==='Enter')go();});
clearBtn.addEventListener('click',()=>{urlInput.value='';clearBtn.classList.remove('show');resetUI();urlInput.focus();});
goBtn.addEventListener('click',go);

function openPicker(){
  const app=$('app'),pp=$('platformPicker');
  app.classList.add('hidden');
  pp.style.display='';
  pp.classList.remove('fade-out','slide-in','hidden');
  setTimeout(()=>pp.classList.add('slide-in'),10);
}
$('changePlatformBtn').addEventListener('click',openPicker);

async function go(){
  const val=urlInput.value.trim();
  if(!val){urlInput.classList.add('shake');setTimeout(()=>urlInput.classList.remove('shake'),400);return;}
  const pat=URL_PATTERNS[active];
  if(pat&&!pat.test(val)){showError(`URL tidak valid untuk ${PLATFORMS[active].name}.\n${PLATFORMS[active].desc}`);return;}
  showLoading();
  try{renderResult(await PLATFORMS[active].fetch(val));}catch(err){showError(err.message||'Gagal mengambil data.');}
}

async function apiFetch(url,opts={}){
  const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),25000);
  try{const r=await fetch(url,{signal:ctrl.signal,...opts});clearTimeout(tid);if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}
  finally{clearTimeout(tid);}
}

async function fetchFacebook(url){
  const j=await apiFetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`);
  if(!j.status||!j.data)throw new Error('Gagal mengambil data Facebook. Pastikan URL valid.');
  const d=j.data;
  const links=(d.downloads||[]).map(dl=>({url:dl.url,label:dl.quality||'Download',sub:(dl.type||'video')+' · mp4',isAudio:false,direct:true}));
  if(!links.length)throw new Error('Tidak ada link download tersedia.');
  return{platform:'facebook',type:'video',cover:d.thumbnail,title:d.title||'Facebook Video',
    meta:[d.duration?{icon:'⏱',text:d.duration}:null,{icon:'📘',text:'Facebook'}].filter(Boolean),links};
}

async function fetchTikTok(url){
  const[r1,r2,r3]=await Promise.allSettled([
    apiFetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`),
    apiFetch(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`),
    apiFetch(`https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(url)}`),
  ]);
  if(r1.status==='rejected'||!r1.value?.status||!r1.value?.data)throw new Error('Gagal mengambil data TikTok. Pastikan URL valid.');
  const d=r1.value.data;
  const musicUrl=(r2.status==='fulfilled'&&r2.value?.data?.music_link)?r2.value.data.music_link:null;
  const thumb=(r2.status==='fulfilled'&&r2.value?.data?.cover_link)?r2.value.data.cover_link:d.thumbnail||null;
  if(d.type==='slide'){
    const yupra=(r3.status==='fulfilled'&&r3.value?.result?.status)?r3.value.result:null;
    const yCover=yupra?.cover||thumb,yMusic=yupra?.music_info?.url||musicUrl;
    const yTitle=yupra?.title||d.title||'TikTok Slide',yAuthor=d.author||'—';
    if(yupra&&Array.isArray(yupra.data)&&yupra.data.length){
      const photos=yupra.data.filter(item=>item.type==='photo'&&item.url);
      if(photos.length){
        const links=photos.map((p,i)=>({url:p.url,label:`Foto ${i+1}`,sub:'slide · jpeg',isAudio:false,direct:true,thumb:p.url}));
        if(yMusic)links.push({url:yMusic,label:'Musik / Audio',sub:'audio · mp3',isAudio:true,direct:true});
        return{platform:'tiktok',type:'slide',cover:yCover,title:yTitle,meta:[{icon:'👤',text:yAuthor},{icon:'🖼',text:`${photos.length} foto`}],links};
      }
    }
    const imgs=(d.media||[]).filter(m=>m.type==='image');
    const links=imgs.map((img,i)=>{
      const urlList=img.url_list||img.urlList||[];const safeUrls=urlList.filter(u=>!u.includes('rapidcdn'));
      return{url:safeUrls[0]||urlList[0]||img.url||'',label:`Foto ${i+1}`,sub:'slide · jpeg',isAudio:false,direct:true,thumb:safeUrls[0]||img.url||''};
    });
    if(musicUrl)links.push({url:musicUrl,label:'Musik / Audio',sub:'audio · mp3',isAudio:true,direct:true});
    return{platform:'tiktok',type:'slide',cover:thumb,title:d.title||'TikTok Slide',meta:[{icon:'👤',text:d.author||'—'},{icon:'🖼',text:`${imgs.length} foto`}],links};
  }
  const links=[];
  (d.media||[]).forEach(m=>{
    if(m.quality==='HD'||m.type==='video_hd'){if(m.backup)links.push({url:m.backup,label:'HD TikTok',sub:'tanpa watermark · mp4',isAudio:false,direct:true});}
    else links.push({url:m.url,label:'SD Video',sub:'tanpa watermark · mp4',isAudio:false,direct:true});
  });
  if(musicUrl)links.push({url:musicUrl,label:'Musik / Audio',sub:'audio · mp3',isAudio:true,direct:true});
  if(!links.length)throw new Error('Tidak ada link download tersedia.');
  return{platform:'tiktok',type:'video',cover:thumb,title:d.title||'TikTok Video',meta:[{icon:'👤',text:d.author||'—'},{icon:'🎬',text:'TikTok'}],links};
}

async function fetchInstagram(url){
  const j=await apiFetch(`https://api.siputzx.my.id/api/d/fastdl?url=${encodeURIComponent(url)}`);
  if(!j.status||!j.data)throw new Error('Gagal mengambil data Instagram.');
  const d=j.data,meta=d.meta||{};
  const fmtNum=n=>!n?null:n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n);
  const links=(d.url||[]).map(item=>({url:item.url,label:item.name||item.type?.toUpperCase()||'Download',
    sub:`${item.ext||item.type||'file'} · Instagram`,isAudio:(item.ext||item.type||'').toLowerCase()==='mp3',direct:true}));
  if(!links.length)throw new Error('Tidak ada file yang bisa didownload.');
  return{platform:'instagram',type:'video',cover:d.thumb,title:meta.title||'Instagram Media',
    meta:[meta.username?{icon:'👤',text:'@'+meta.username}:null,meta.like_count?{icon:'❤️',text:fmtNum(meta.like_count)+' likes'}:null,{icon:'📸',text:'Instagram'}].filter(Boolean),links};
}

async function fetchSpotify(url){
  const j=await apiFetch(`https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`);
  if(!j.status||!j.result)throw new Error('Gagal mengambil data Spotify.');
  const r=j.result;if(!r.download?.url)throw new Error('Link download tidak tersedia.');
  return{platform:'spotify',type:'audio',cover:r.image,title:r.title||'Spotify Track',
    meta:[r.artist?{icon:'🎤',text:r.artist}:null,r.album?{icon:'💿',text:r.album}:null,{icon:'🎵',text:'Spotify · MP3'}].filter(Boolean),
    links:[{url:r.download.url,label:'Download MP3',sub:r.download.quality||'mp3 · audio',isAudio:true,direct:true}]};
}

async function fetchSoundCloud(url){
  const j=await apiFetch(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(url)}`);
  if(!j.status||!j.data)throw new Error('Gagal mengambil data SoundCloud.');
  const d=j.data;if(!d.url&&!d.download_url)throw new Error('Link download tidak tersedia.');
  return{platform:'soundcloud',type:'audio',cover:d.thumbnail||d.artwork_url||null,title:d.title||'SoundCloud Track',
    meta:[d.author||d.artist?{icon:'🎤',text:d.author||d.artist}:null,d.duration?{icon:'⏱',text:d.duration}:null,{icon:'🎵',text:'SoundCloud · MP3'}].filter(Boolean),
    links:[{url:d.url||d.download_url,label:'Download MP3',sub:'audio · mp3',isAudio:true,direct:true}]};
}

async function fetchTwitter(url){
  const j=await apiFetch(`https://api.siputzx.my.id/api/d/ssstwiter?url=${encodeURIComponent(url)}`);
  if(!j||!j.url||!j.url.length)throw new Error('Gagal mengambil data X/Twitter. Pastikan URL format: x.com/i/status/...');
  const links=j.url.map(v=>({url:v.url,label:`Download ${v.subname||v.quality||''}p`,sub:`mp4 · ${v.subname||v.quality||''}p`,isAudio:false,direct:true}));
  const meta=j.meta||{};
  return{platform:'twitter',type:'video',cover:j.thumb||null,title:meta.title||'X / Twitter Video',
    meta:[{icon:'🐦',text:'X / Twitter'},{icon:'🎬',text:`${links.length} kualitas tersedia`}],links};
}

function showLoading(){goBtn.disabled=true;zone.style.display='block';zLoad.style.display='flex';zErr.style.display='none';zMedia.style.display='none';}
function showError(msg){goBtn.disabled=false;zone.style.display='block';zLoad.style.display='none';zErr.style.display='flex';$('zErrMsg').textContent=msg;}
function resetUI(){goBtn.disabled=false;zone.style.display='none';zLoad.style.display='none';zErr.style.display='none';zMedia.style.display='none';}
window.resetUI=resetUI;

function getFilename(downloadUrl,isAudio,label){
  try{
    const u=new URL(downloadUrl),base=u.pathname.split('/').filter(Boolean).pop();
    const clean=base?decodeURIComponent(base).split('?')[0]:'';
    if(clean.match(/\.([a-zA-Z0-9]{2,5})$/)&&clean.length>4)return clean;
    const ext=isAudio?'mp3':label.toLowerCase().includes('foto')?'jpg':'mp4';
    return(clean.replace(/[^a-zA-Z0-9_\-]/g,'')||label.replace(/\s+/g,'_').toLowerCase())+'.'+ext;
  }catch(_){
    const ext=isAudio?'mp3':label.toLowerCase().includes('foto')?'jpg':'mp4';
    return`nexdown_${label.replace(/\s+/g,'_').toLowerCase()}.${ext}`;
  }
}

function makeDownloadBtn(link){
  const btn=document.createElement('button');
  btn.className='dl-link'+(link.isAudio?' audio-link':'');btn.type='button';
  const icoSvg=link.isAudio
    ?`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" fill="#34d399"/></svg>`
    :link.label.toLowerCase().includes('foto')
      ?`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zm-8.5-5.5l2.5 3.01L17.5 12l4.5 6H2l4.5-6z" fill="#a78bfa"/></svg>`
      :`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" fill="#f472b6"/></svg>`;
  const dlSvg=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  btn.innerHTML=`<span class="dl-link-ico">${icoSvg}</span><span class="dl-link-label"><span class="dl-link-qlabel">${link.label}</span><span class="dl-link-sub">${link.sub}</span></span><span class="dl-link-arr">${dlSvg}</span>`;
  btn.addEventListener('click',async()=>{
    const arrEl=btn.querySelector('.dl-link-arr');
    arrEl.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    btn.disabled=true;
    try{
      const filename=getFilename(link.url,link.isAudio,link.label);
      let ok=false;
      if(!link.url.includes('rapidcdn')){
        try{const resp=await fetch(link.url,{mode:'cors'});if(resp.ok){const blob=await resp.blob();const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);document.body.removeChild(a);},1500);ok=true;}}catch(_){}
      }
      if(!ok){const a=document.createElement('a');a.href=link.url;a.download=filename;a.target='_blank';a.rel='noopener noreferrer';document.body.appendChild(a);a.click();document.body.removeChild(a);}
      arrEl.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(()=>{arrEl.innerHTML=dlSvg;btn.disabled=false;},2500);
    }catch(e){arrEl.innerHTML=dlSvg;btn.disabled=false;}
  });
  return btn;
}

function renderResult(data){
  goBtn.disabled=false;zLoad.style.display='none';zMedia.style.display='block';
  const p=PLATFORMS[data.platform]||PLATFORMS[active];
  const cover=$('mCover'),cw=cover.parentElement;
  if(data.cover){
    cover.src=data.cover;cover.style.display='block';
    cover.onerror=()=>{cover.style.display='none';buildFallback(cw,p);};
    const old=cw.querySelector('.cover-fallback');if(old)old.remove();
  }else{cover.style.display='none';buildFallback(cw,p);}
  function buildFallback(c,plat){
    if(c.querySelector('.cover-fallback'))return;
    const f=document.createElement('div');f.className='cover-fallback';
    f.innerHTML=PLATFORM_ICONS[data.platform]||'';c.appendChild(f);
  }
  const pt=$('mPtag');pt.textContent=data.type==='slide'?'SLIDE':p.ptag;pt.className='mcard-ptag '+p.ptagCls;
  $('mTitle').textContent=data.title;
  const me=$('mMeta');me.innerHTML='';
  (data.meta||[]).forEach(m=>{const chip=document.createElement('span');chip.className='meta-chip';chip.textContent=`${m.icon} ${m.text}`;me.appendChild(chip);});
  const le=$('mLinks');le.innerHTML='';
  if(!data.links||!data.links.length){le.innerHTML='<p style="font-size:.75rem;color:var(--muted)">Tidak ada link download.</p>';return;}
  if(data.type==='slide'){
    const imgLinks=data.links.filter(l=>!l.isAudio);
    if(imgLinks.length){
      const strip=document.createElement('div');strip.className='slide-strip';
      imgLinks.forEach((img,i)=>{
        const t=document.createElement('div');t.className='slide-thumb';
        const src=(img.thumb&&!img.thumb.includes('rapidcdn'))?img.thumb:(img.url&&!img.url.includes('rapidcdn')?img.url:'');
        t.innerHTML=src?`<img src="${src}" alt="Foto ${i+1}" loading="lazy"/><span>${i+1}</span>`:`<span style="font-size:1.4rem;display:flex;align-items:center;justify-content:center;height:100%">🖼️</span><span>${i+1}</span>`;
        strip.appendChild(t);
      });
      le.appendChild(strip);
    }
    data.links.forEach((l,i)=>le.appendChild(makeDownloadBtn({...l,label:l.isAudio?l.label:`Download Foto ${i+1}`})));
    return;
  }
  data.links.forEach(l=>le.appendChild(makeDownloadBtn(l)));
}

const bgAudio=$('bgAudio'),mpPlayBtn=$('mpPlayBtn'),musicPlayer=$('musicPlayer');
musicPlayer.style.display='flex';
mpPlayBtn.addEventListener('click',()=>{
  if(bgAudio.paused){bgAudio.play();mpPlayBtn.classList.add('playing');}
  else{bgAudio.pause();mpPlayBtn.classList.remove('playing');}
});

function tryAutoplay(){
  bgAudio.play().then(()=>{
    mpPlayBtn.classList.add('playing');
  }).catch(()=>{
    const unlockAudio=()=>{
      bgAudio.play().then(()=>{mpPlayBtn.classList.add('playing');}).catch(()=>{});
      document.removeEventListener('click',unlockAudio);
      document.removeEventListener('touchstart',unlockAudio);
    };
    document.addEventListener('click',unlockAudio,{once:true});
    document.addEventListener('touchstart',unlockAudio,{once:true});
  });
}
tryAutoplay();

(function initFlow(){
  const ls=$('loadScreen'),pp=$('platformPicker'),app=$('app');
  setTimeout(()=>{
    ls.classList.add('fade-out');
    setTimeout(()=>{ls.style.display='none';pp.classList.remove('hidden');pp.classList.add('slide-in');},500);
  },1900);
  let selected=null;
  const cards=document.querySelectorAll('.pp-card'),cta=$('ppCta'),ctaLbl=$('ppCtaLabel');
  cards.forEach(card=>{
    card.addEventListener('click',()=>{
      cards.forEach(c=>c.classList.remove('selected'));card.classList.add('selected');
      selected=card.dataset.p;cta.disabled=false;
      ctaLbl.textContent=`Lanjut ke ${card.querySelector('.pp-card-name').textContent}`;
    });
  });
  cta.addEventListener('click',()=>{
    if(!selected)return;
    pp.classList.add('fade-out');
    setTimeout(()=>{
      pp.style.display='none';
      app.classList.remove('hidden');app.classList.add('slide-in');
      active=selected;
      applyPlatform();resetUI();
      urlInput.value='';clearBtn.classList.remove('show');
    },400);
  });
  applyPlatform();
})();

/* ══ ULASAN / REVIEW — CLOUD (JSONBin.io) ══════════════════════════════════ */
const STAR_LABELS = ['','Sangat Buruk 😞','Buruk 😕','Cukup 😐','Bagus 😊','Luar Biasa! 🤩'];

// ── JSONBin config ──
// Daftar gratis di https://jsonbin.io → buat bin → copy BIN_ID dan API_KEY
const JSONBIN_BIN_ID  = '69bca93e56e12a1d72419c80';
const JSONBIN_API_KEY = '$2a$10$JBjO44wdDLPbGNsaPZRfzOoCdqZ9ce579lV80FLZGxqOAB8d4Is3m';
const JSONBIN_URL     = 'https://api.jsonbin.io/v3/b/'+JSONBIN_BIN_ID;

let _ulasanCache = null; // cache lokal supaya tidak terlalu banyak request

async function loadUlasan(){
  if(_ulasanCache) return _ulasanCache;
  try{
    const r = await fetch(JSONBIN_URL+'/latest', {
      headers:{'X-Master-Key': JSONBIN_API_KEY, 'X-Bin-Meta':'false'}
    });
    if(!r.ok) throw new Error('fetch fail');
    const data = await r.json();
    _ulasanCache = Array.isArray(data) ? data : (data.ulasan||[]);
    return _ulasanCache;
  }catch(_){
    // fallback ke localStorage jika offline
    try{ return JSON.parse(localStorage.getItem('nexdown_ulasan')||'[]'); }catch(e){ return []; }
  }
}

async function saveUlasan(list){
  _ulasanCache = list;
  // backup lokal
  try{ localStorage.setItem('nexdown_ulasan', JSON.stringify(list)); }catch(_){}
  // simpan ke cloud
  try{
    await fetch(JSONBIN_URL, {
      method:'PUT',
      headers:{'Content-Type':'application/json','X-Master-Key':JSONBIN_API_KEY,'X-Bin-Versioning':'false'},
      body: JSON.stringify(list)
    });
  }catch(_){}
}

function renderStarsDisplay(avg, container){
  container.innerHTML='';
  for(let i=1;i<=5;i++){
    const s=document.createElement('span');
    s.textContent='★';
    if(i<=Math.round(avg)) s.classList.add('on');
    container.appendChild(s);
  }
}
function renderItemStars(rating, container){
  container.innerHTML='';
  for(let i=1;i<=5;i++){
    const s=document.createElement('span');
    s.textContent='★';
    if(i<=rating) s.classList.add('on');
    container.appendChild(s);
  }
}
function formatWaktu(ts){
  const d=new Date(ts);
  const days=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const mons=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  return days[d.getDay()]+', '+d.getDate()+' '+mons[d.getMonth()]+' '+d.getFullYear();
}

async function renderUlasanList(){
  const container = $('ulasanList');
  const avgEl = $('ulasanAvg');
  const countEl = $('ulasanCount');
  const starsEl = $('ulasanStarsDisplay');
  const fabAvg = $('ulasanFabAvg');
  container.innerHTML='<div class="ulasan-empty">⏳ Memuat ulasan…</div>';

  const list = await loadUlasan();
  container.innerHTML='';

  if(!list.length){
    container.innerHTML='<div class="ulasan-empty">Belum ada ulasan. Jadilah yang pertama! 🌟</div>';
    avgEl.textContent='0.0';
    countEl.textContent='(0 ulasan)';
    fabAvg.textContent='—';
    renderStarsDisplay(0, starsEl);
    return;
  }

  const total = list.reduce((s,u)=>s+u.rating,0);
  const avg = (total/list.length).toFixed(1);
  avgEl.textContent = avg;
  countEl.textContent = '('+list.length+' ulasan)';
  fabAvg.textContent = avg;
  renderStarsDisplay(parseFloat(avg), starsEl);

  [...list].reverse().forEach(u=>{
    const item = document.createElement('div');
    item.className='ulasan-item';
    const top = document.createElement('div');
    top.className='ulasan-item-top';
    const nama = document.createElement('span');
    nama.className='ulasan-item-nama';
    nama.textContent = u.nama||'Anonim';
    const waktu2 = document.createElement('span');
    waktu2.className='ulasan-item-waktu';
    waktu2.textContent = formatWaktu(u.ts);
    top.appendChild(nama); top.appendChild(waktu2);
    const stars2 = document.createElement('div');
    stars2.className='ulasan-item-stars';
    renderItemStars(u.rating, stars2);
    item.appendChild(top);
    item.appendChild(stars2);
    if(u.teks){
      const teks = document.createElement('p');
      teks.className='ulasan-item-teks';
      teks.textContent = u.teks;
      item.appendChild(teks);
    }
    if(u.reply){
      const replyDiv = document.createElement('div');
      replyDiv.className='ulasan-item-reply';
      replyDiv.innerHTML='<span class="ulasan-item-reply-label">&#x21A9; Admin</span><span class="ulasan-item-reply-text">'+escUlasan(u.reply)+'</span>';
      item.appendChild(replyDiv);
    }
    container.appendChild(item);
  });
}

/* ── FAB & MODAL ── */
const ulasanFab   = $('ulasanFab');
const ulasanModal = $('ulasanModal');
const ulasanClose = $('ulasanClose');
const ulasanOverlay = $('ulasanOverlay');

function openUlasan(){
  ulasanModal.classList.remove('hidden');
  document.body.style.overflow='hidden';
}
function closeUlasan(){
  ulasanModal.classList.add('hidden');
  document.body.style.overflow='';
}

ulasanFab.addEventListener('click', openUlasan);
ulasanClose.addEventListener('click', closeUlasan);
ulasanOverlay.addEventListener('click', closeUlasan);

/* ── STAR PICKER ── */
let selectedStar = 0;
const stars = document.querySelectorAll('.star-picker .star');
const starLabel = $('starLabel');
const ulasanSubmit = $('ulasanSubmit');

stars.forEach(star=>{
  star.addEventListener('mouseenter',()=>{
    const v=+star.dataset.v;
    stars.forEach(s=>s.classList.toggle('active',+s.dataset.v<=v));
    starLabel.textContent = STAR_LABELS[v];
  });
  star.addEventListener('mouseleave',()=>{
    stars.forEach(s=>s.classList.toggle('active',+s.dataset.v<=selectedStar));
    starLabel.textContent = selectedStar ? STAR_LABELS[selectedStar] : 'Pilih bintang';
  });
  star.addEventListener('click',()=>{
    selectedStar = +star.dataset.v;
    stars.forEach(s=>s.classList.toggle('active',+s.dataset.v<=selectedStar));
    starLabel.textContent = STAR_LABELS[selectedStar];
    starLabel.style.color = 'var(--accent)';
    ulasanSubmit.disabled = false;
  });
});

ulasanSubmit.addEventListener('click', async ()=>{
  if(!selectedStar) return;
  ulasanSubmit.disabled=true;
  ulasanSubmit.textContent='⏳ Mengirim…';
  const list = await loadUlasan();
  list.push({
    rating: selectedStar,
    nama: ($('ulasanNama').value.trim()||'Anonim'),
    teks: $('ulasanTeks').value.trim(),
    ts: Date.now()
  });
  await saveUlasan(list);
  selectedStar=0;
  stars.forEach(s=>s.classList.remove('active'));
  starLabel.textContent='Pilih bintang';
  starLabel.style.color='';
  $('ulasanNama').value='';
  $('ulasanTeks').value='';
  ulasanSubmit.disabled=true;
  renderUlasanList();
  ulasanSubmit.textContent='✓ Terima kasih!';
  setTimeout(()=>{ ulasanSubmit.textContent='Kirim Ulasan'; },2000);
});

// init
function escUlasan(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
renderUlasanList();


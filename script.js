(() => {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bgm = $('bgm'), video = $('msg'), btn = $('music'), big = $('bigplay');
  const VOL = 0.25;
  let wantMusic = false, fadeTimer;

  // Petals
  if (!reduce) {
    const box = $('petals');
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('i');
      p.style.cssText = `left:${Math.random()*100}%;--dx:${Math.random()*120-60}px;animation-duration:${9+Math.random()*9}s;animation-delay:${-Math.random()*14}s;transform:scale(${.6+Math.random()*.7});opacity:${.35+Math.random()*.4}`;
      box.appendChild(p);
    }
  }

  // Open message
  $('open').addEventListener('click', () => {
    $('story').hidden = false;
    document.body.classList.remove('locked');
    $('video').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  // Music with fades
  function fadeTo(target, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      const d = target - bgm.volume;
      if (Math.abs(d) < 0.02) { bgm.volume = target; clearInterval(fadeTimer); done && done(); }
      else bgm.volume = Math.min(1, Math.max(0, bgm.volume + Math.sign(d) * 0.02));
    }, 60);
  }
  function musicOn() {
    bgm.volume = 0;
    bgm.play().then(() => fadeTo(VOL)).catch(() => {
      wantMusic = false; btn.setAttribute('aria-pressed', 'false');
      btn.title = 'Add assets/devotional-music.mp3 to enable music';
    });
  }
  function musicOff() { fadeTo(0, () => bgm.pause()); }
  btn.addEventListener('click', () => {
    wantMusic = !wantMusic;
    btn.setAttribute('aria-pressed', wantMusic);
    btn.setAttribute('aria-label', wantMusic ? 'Pause background music' : 'Play background music');
    wantMusic ? musicOn() : musicOff();
  });

  // Video: no autoplay; music steps aside
  function togglePlay() { video.paused ? video.play() : video.pause(); }
  big.addEventListener('click', togglePlay);
  video.addEventListener('play', () => { big.classList.add('gone'); if (wantMusic) musicOff(); });
  const resume = () => { if (wantMusic) musicOn(); };
  video.addEventListener('pause', () => { if (!video.ended) big.classList.remove('gone'); resume(); });
  video.addEventListener('ended', () => { big.classList.remove('gone'); resume(); });

  // Final section reveal then soft fade
  const fin = document.querySelector('.final');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    fin.classList.add('show'); o.disconnect();
    setTimeout(() => fin.classList.add('fade'), 12000);
  }, { threshold: .5 }).observe(fin);
})();

/**
 * binchrii — Cyberpunk Streamer Website
 * Vanilla JavaScript | 100% Zero-Dependency | Pure Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTwitchPlayer();
  initCommandsCopy();
  initScheduleHighlight();
  initRetroAudioEffects();
});

/* -------------------------------------------------------------------------- */
/* 1. Navbar & Scroll State                                                   */
/* -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          toggleBtn.innerHTML = '☰';
        }
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Privacy-Friendly Twitch Player Embed                                    */
/* -------------------------------------------------------------------------- */
function initTwitchPlayer() {
  const loadBtn = document.getElementById('load-player-btn');
  const playerContainer = document.getElementById('twitch-player-container');
  const placeholder = document.getElementById('player-placeholder');

  if (!loadBtn || !playerContainer) return;

  loadBtn.addEventListener('click', () => {
    // Current hostname for Twitch embed parent requirements
    const currentHost = window.location.hostname || 'benzjeremy.github.io';
    
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.twitch.tv/?channel=binchrii&parent=${encodeURIComponent(currentHost)}&parent=benzjeremy.github.io&muted=false&autoplay=true`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.title = 'binchrii Twitch Live Stream';

    if (placeholder) {
      placeholder.style.display = 'none';
    }
    playerContainer.appendChild(iframe);
    showToast('🎮 Twitch Stream wird geladen...');
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Interactive Commands Copy & Toast                                       */
/* -------------------------------------------------------------------------- */
function initCommandsCopy() {
  const commandItems = document.querySelectorAll('.cmd-item');
  const toast = document.getElementById('toast');

  commandItems.forEach(item => {
    item.addEventListener('click', () => {
      const cmdText = item.getAttribute('data-command') || item.querySelector('.cmd-trigger').textContent.trim();
      navigator.clipboard.writeText(cmdText).then(() => {
        playBeep(640, 0.08);
        showToast(`📋 Befehl "${cmdText}" in Zwischenablage kopiert!`);
      }).catch(() => {
        showToast(`📋 ${cmdText}`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* -------------------------------------------------------------------------- */
/* 4. Schedule Today Highlight                                                */
/* -------------------------------------------------------------------------- */
function initScheduleHighlight() {
  // Days of week: 0 = Sunday, 1 = Monday, ...
  const dayIndex = new Date().getDay();
  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayMap[dayIndex];

  const todayCard = document.querySelector(`.schedule-card[data-day="${currentDay}"]`);
  if (todayCard) {
    todayCard.classList.add('active');
    const badge = todayCard.querySelector('.day-badge');
    if (badge) {
      badge.innerHTML = `★ HEUTE · ${badge.innerHTML}`;
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 5. Retro Cyber Web Audio Blips (Pure Synth, Zero External Files)           */
/* -------------------------------------------------------------------------- */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  return audioCtx;
}

function playBeep(freq = 440, duration = 0.06) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Graceful fallback if audio is blocked
  }
}

function initRetroAudioEffects() {
  const interactiveButtons = document.querySelectorAll('.btn, .social-card, .brand');
  interactiveButtons.forEach(el => {
    el.addEventListener('mouseenter', () => {
      // Subtle cyber tick
      playBeep(880, 0.02);
    });
  });
}

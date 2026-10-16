/**
 * NEXUS-v2 Interactive Engine & Desktop Simulator
 * Author: Mehmet / NEXUS-v2 Project
 * Includes: Gallery Lightbox, Terminal Simulator, Voice Player, 
 *           Neural Particle Canvas, Interactive Finance Engine, Command Palette
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initVoicePlayer();
  initGalleryFilter();
  initLightbox();
  initCockpitSimulator();
  initFinanceAnalyzer();
  initCommandPalette();
  initMobileMenu();
  initScrollSpy();
});

/* ==========================================================================
   1. NEURAL PARTICLE CANVAS (ALIVE AI NETWORK)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 65);
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion/connection
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.25 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. INTERACTIVE VOICE PLAYER (NEXUS-01 SPEECH & VISEME)
   ========================================================================== */
function initVoicePlayer() {
  const btn = document.getElementById('voicePlayBtn');
  const sub = document.getElementById('voiceSubtitle');
  const hudState = document.querySelector('.avatar-meta-state');
  const audioBars = document.querySelectorAll('.audio-bar');

  if (!btn) return;

  const sampleSpeech = "Merhaba Mehmet. NEXUS-01 bilişsel çekirdeği aktif. SQLite hafıza, model yönlendiricisi ve M3 güvenlik kalkanı senkronize edildi. Bugün hangi görevi yönetelim?";
  let isSpeaking = false;

  btn.addEventListener('click', () => {
    if (isSpeaking) {
      stopVoice();
      return;
    }
    startVoice();
  });

  function startVoice() {
    isSpeaking = true;
    btn.classList.add('speaking');
    btn.innerHTML = '<i class="fa-solid fa-stop"></i><span>Durdur</span>';
    if (hudState) {
      hudState.innerHTML = '<i class="fa-solid fa-volume-high"></i> KONUŞUYOR';
      hudState.style.color = '#f59e0b';
    }

    // High activity on equalizer bars
    audioBars.forEach(b => b.style.animationDuration = '0.4s');

    if (sub) {
      sub.textContent = '';
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (!isSpeaking || charIndex >= sampleSpeech.length) {
          clearInterval(typeInterval);
          return;
        }
        sub.textContent += sampleSpeech[charIndex];
        charIndex++;
      }, 55);
    }

    // Check SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleSpeech);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Try selecting a natural Turkish voice
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'));
      if (trVoice) utterance.voice = trVoice;

      utterance.onend = () => {
        stopVoice();
      };
      utterance.onerror = () => {
        stopVoice();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer if speech synth not supported
      setTimeout(stopVoice, 7000);
    }
  }

  function stopVoice() {
    isSpeaking = false;
    btn.classList.remove('speaking');
    btn.innerHTML = '<i class="fa-solid fa-play"></i><span>NEXUS-01 Sesini Dinle</span>';
    if (hudState) {
      hudState.innerHTML = '<i class="fa-solid fa-circle-check"></i> CANLI';
      hudState.style.color = 'var(--accent-cyan)';
    }
    audioBars.forEach(b => b.style.animationDuration = '1.4s');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

/* ==========================================================================
   3. GALLERY FILTER & LIGHTBOX
   ========================================================================== */
function initGalleryFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.gallery-card');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 240);
        }
      });
    });
  });
}

function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.gallery-media').forEach(media => {
    media.addEventListener('click', () => {
      const img = media.querySelector('img');
      const card = media.closest('.gallery-card');
      const title = card.querySelector('.gallery-title')?.textContent || 'NEXUS-01 Varlık';
      const desc = card.querySelector('.gallery-desc')?.textContent || '';

      modalImg.src = img.src;
      modalImg.alt = img.alt;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. COCKPIT LIVE SIMULATOR
   ========================================================================== */
const scenarios = {
  bist_analysis: [
    { time: '04:12:01', agent: '[Supervisor]', text: 'Kullanıcı istemi: "GENKM ve BIST teknoloji hisselerinde güncel finansal durum analizi."', type: 'action' },
    { time: '04:12:02', agent: '[ContextEngine]', text: 'Hafıza tarandı: 2 önceki oturum özeti ve kullanıcı maliyet parametreleri ayrıştırıldı.', type: 'verified' },
    { time: '04:12:03', agent: '[PolicyGate]', text: 'L1 Seviyesi (Salt-okunur veri çekme) yetkisi verildi. Fail-closed kalkanı aktif.', type: 'success' },
    { time: '04:12:05', agent: '[FinanceAnalyst]', text: 'KAP duyuruları & Q2/Q3 bilanço nakit akış tabloları çekildi. Zaman damgası: 2026-10-15.', type: 'action' },
    { time: '04:12:07', agent: '[VerificationEngine]', text: 'Veri tazeliği onaylandı. Fiyat/Hacim kırılım senaryoları (Boğa / Baz / Ayı) bağımsız kontrol edildi.', type: 'verified' },
    { time: '04:12:08', agent: '[NEXUS-01]', text: 'Türkçe sesli özet hazırlandı: "Bilanço net nakit pozisyonunda güçlenme var, direnç seviyeleri raporda listelendi."', type: 'success' }
  ],
  security_audit: [
    { time: '04:15:20', agent: '[SecurityAgent]', text: 'M3 SQLite Capability Audit tetiklendi: Subject-scoped grant & revoke testi.', type: 'action' },
    { time: '04:15:21', agent: '[SQLite M3]', text: '`tauri_capabilities` tablosu okundu: 14 yetki tokeni aktif.', type: 'action' },
    { time: '04:15:22', agent: '[PolicyGate]', text: 'Simüle L3 eylem: `fs_write_restricted`. Pending approval oluşturuldu.', type: 'warning' },
    { time: '04:15:23', agent: '[PolicyGate]', text: 'Revoke sinyali gönderildi. Token derhal iptal edildi. SQLite audit kaydı yazıldı.', type: 'verified' },
    { time: '04:15:24', agent: '[VerificationEngine]', text: 'DENIED_BY_POLICY: Bekleyen onay olmasına rağmen yetki iptaliyle yürütme engellendi! (M3 Passed)', type: 'success' }
  ],
  web_research: [
    { time: '04:18:10', agent: '[ResearchAgent]', text: 'Web Araştırma planı oluşturuldu: 4 bağımsız kaynak taranacak.', type: 'action' },
    { time: '04:18:12', agent: '[WebCrawler]', text: 'Resmî dokümantasyon ve birincil kaynaklar çekildi (Prompt Injection filtresinden geçirildi).', type: 'action' },
    { time: '04:18:14', agent: '[VerificationEngine]', text: 'Çelişkili iddialar ayrıştırıldı; kaynak güven skorları (0.94) hesaplandı.', type: 'verified' },
    { time: '04:18:15', agent: '[DocumentAgent]', text: 'Alıntılı (citations) teknik sentez raporu oluşturuldu ve Markdown olarak kaydedildi.', type: 'success' }
  ],
  avatar_sync: [
    { time: '04:22:00', agent: '[VoiceFabric]', text: 'Mikrofon sinyali alındı: Türkçe VAD (Voice Activity Detection) aktif.', type: 'action' },
    { time: '04:22:01', agent: '[ModelMesh]', text: 'Streaming LLM yanıt akışı başladı (Gecikme: 28ms).', type: 'verified' },
    { time: '04:22:02', agent: '[AvatarEngine]', text: 'NEXUS-01 2.5D kafa ve viseme eşzamanlaması devreye girdi. Ağız senkronu: Aktif.', type: 'success' },
    { time: '04:22:03', agent: '[VoiceFabric]', text: 'Barge-in (kullanıcı araya girme) algılandı -> Konuşma anında kesildi, dinleme moduna dönüldü.', type: 'warning' }
  ]
};

function initCockpitSimulator() {
  const terminal = document.getElementById('terminalBody');
  const scenarioPills = document.querySelectorAll('.scenario-pill');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const inputMock = document.getElementById('mockPromptInput');
  const submitBtn = document.getElementById('mockSubmitBtn');

  if (!terminal) return;

  function renderScenario(key) {
    const list = scenarios[key] || scenarios.bist_analysis;
    terminal.innerHTML = '';

    list.forEach((item, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `
          <span class="term-time">[${item.time}]</span>
          <span class="term-agent">${item.agent}</span>
          <span class="term-${item.type}">${item.text}</span>
        `;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
      }, index * 260);
    });
  }

  renderScenario('bist_analysis');

  scenarioPills.forEach(pill => {
    pill.addEventListener('click', () => {
      scenarioPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const scenarioKey = pill.getAttribute('data-scenario');
      renderScenario(scenarioKey);
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `
        <span class="term-time">[SYSTEM]</span>
        <span class="term-verified">Masaüstü Görünüm Modu: ${mode.toUpperCase()}</span>
      `;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    });
  });

  if (submitBtn && inputMock) {
    submitBtn.addEventListener('click', () => {
      const val = inputMock.value.trim();
      if (!val) return;
      
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `
        <span class="term-time">[USER]</span>
        <span class="term-action">${escapeHtml(val)}</span>
      `;
      terminal.appendChild(line);
      inputMock.value = '';

      setTimeout(() => {
        const resp = document.createElement('div');
        resp.className = 'term-line';
        resp.innerHTML = `
          <span class="term-time">[Planner]</span>
          <span class="term-success">İstem doğrulandı. Model Mesh ve Supervisor görev haritası çıkarıyor...</span>
        `;
        terminal.appendChild(resp);
        terminal.scrollTop = terminal.scrollHeight;
      }, 400);
    });

    inputMock.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitBtn.click();
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE FINANCE ANALYZER
   ========================================================================== */
const financeData = {
  bull: {
    title: 'BOĞA SENARYOSU — Hacimli Direnç Kırılımı',
    report: 'Bilanço nakit pozisyonundaki artış ve KAP üzerinde açıklanan yeni ihracat siparişi hisse üzerinde pozitif katalizör oluşturuyor. 120 günlük hareketli ortalamanın üzerine hacimli geçiş durumunda momentum artışı öngörülmektedir.',
    fk: '9.4',
    pddd: '1.85',
    nakit: '+142M ₺',
    direnc: '48.50 ₺',
    destek: '42.10 ₺',
    risk: 'DÜŞÜK / L1'
  },
  base: {
    title: 'BAZ SENARYO — Konsolidasyon ve Takas Dengesi',
    report: 'Piyasa genelindeki volatiliteye bağlı olarak mevcut yatay bant korunuyor. Aracı kurum takas dağılımında belirgin bir yabancı çıkışı görülmemekle birlikte, yeni çeyrek bilançosuna kadar yatay-pozitif konsolidasyon beklenmektedir.',
    fk: '10.2',
    pddd: '1.92',
    nakit: '+118M ₺',
    direnc: '45.80 ₺',
    destek: '41.20 ₺',
    risk: 'ORTA / L1'
  },
  bear: {
    title: 'AYI SENARYOSU — Destek Testi ve Stop-Loss Disiplini',
    report: 'Genel endeks satış baskısının devam etmesi veya sektör marjlarında daralma senaryosunda ana trend desteğinin test edilmesi muhtemeldir. 40.50 ₺ seviyesi altındaki kapanışlar senaryoyu geçersiz kılar.',
    fk: '11.5',
    pddd: '2.10',
    nakit: '+85M ₺',
    direnc: '44.00 ₺',
    destek: '39.80 ₺',
    risk: 'YÜKSEK / L2'
  }
};

function initFinanceAnalyzer() {
  const btns = document.querySelectorAll('.fin-btn');
  const title = document.getElementById('finReportTitle');
  const body = document.getElementById('finReportBody');
  const metricFk = document.getElementById('metricFk');
  const metricPddd = document.getElementById('metricPddd');
  const metricNakit = document.getElementById('metricNakit');
  const metricDirenc = document.getElementById('metricDirenc');
  const metricDestek = document.getElementById('metricDestek');

  if (!btns.length || !body) return;

  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');

      const scenario = b.getAttribute('data-fin');
      const data = financeData[scenario] || financeData.bull;

      if (title) title.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${data.title}`;
      if (body) body.textContent = data.report;
      if (metricFk) metricFk.textContent = data.fk;
      if (metricPddd) metricPddd.textContent = data.pddd;
      if (metricNakit) metricNakit.textContent = data.nakit;
      if (metricDirenc) metricDirenc.textContent = data.direnc;
      if (metricDestek) metricDestek.textContent = data.destek;
    });
  });
}

/* ==========================================================================
   6. COMMAND PALETTE (CTRL + K)
   ========================================================================== */
function initCommandPalette() {
  const modal = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdInput');
  const items = document.querySelectorAll('.cmd-item');
  const triggerBtn = document.getElementById('cmdSearchTrigger');

  if (!modal) return;

  function openPalette() {
    modal.classList.add('active');
    if (input) {
      input.value = '';
      input.focus();
    }
    filterItems('');
  }

  function closePalette() {
    modal.classList.remove('active');
  }

  function filterItems(q) {
    const val = q.toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(val)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('active')) closePalette();
      else openPalette();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePalette();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePalette();
  });

  if (input) {
    input.addEventListener('input', (e) => filterItems(e.target.value));
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      closePalette();

      if (target === 'voice') {
        const voiceBtn = document.getElementById('voicePlayBtn');
        if (voiceBtn) voiceBtn.click();
      } else if (target) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   7. MOBILE MENU & SCROLLSPY
   ========================================================================== */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    if (nav.style.display === 'flex') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '74px';
      nav.style.left = '0';
      nav.style.width = '100%';
      nav.style.background = '#060914';
      nav.style.padding = '20px';
      nav.style.borderBottom = '1px solid var(--border-subtle)';
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

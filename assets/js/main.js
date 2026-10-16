/**
 * NEXUS-v2 Interactive Engine & Desktop Simulator
 * Author: Mehmet / NEXUS-v2 Project
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
  initCockpitSimulator();
  initMobileMenu();
  initScrollSpy();
});

/* ==========================================================================
   1. GALLERY FILTER & TABS
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
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   2. LIGHTBOX MODAL
   ========================================================================== */
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
   3. COCKPIT LIVE SIMULATOR
   ========================================================================== */
const scenarios = {
  bist_analysis: [
    { time: '04:12:01', agent: '[Supervisor]', text: 'Kullanıcı istemi alındı: "GENKM ve BIST teknoloji hisselerinde güncel finansal durum analizi."', type: 'action' },
    { time: '04:12:02', agent: '[ContextEngine]', text: 'Hafıza tarandı: 2 önceki oturum özeti ve kullanıcı maliyet parametreleri ayrıştırıldı.', type: 'verified' },
    { time: '04:12:03', agent: '[PolicyGate]', text: 'L1 Seviyesi (Salt-okunur veri çekme) yetkisi verildi. Fail-closed kalkanı aktif.', type: 'success' },
    { time: '04:12:05', agent: '[FinanceAnalyst]', text: 'KAP duyuruları & Q2/Q3 bilanço nakit akış tabloları çekildi. Zaman damgası: 2026-10-15.', type: 'action' },
    { time: '04:12:07', agent: '[VerificationEngine]', text: 'Veri tazeliği onaylandı. Fiyat/Hacim kırılım senaryoları (Boğa / Baz / Ayı) bağımsız kontrol edildi.', type: 'verified' },
    { time: '04:12:08', agent: '[NEXUS-01]', text: 'Türkçe sesli özet hazırlandı: "Bilanço net nakit pozisyonunda güçlenme var, direnç seviyeleri raporda listelendi."', type: 'success' }
  ],
  security_audit: [
    { time: '04:15:20', agent: '[SecurityAgent]', text: 'M3 SQLite Capability Audit tetiklendi: Subject-scoped grant & revoke testi.', type: 'action' },
    { time: '04:15:21', agent: '[SQLite M3]', text: '`tauri_capabilities` tablosu okundu: 14 yetki tokeni aktif.', type: 'action' },
    { time: '04:15:22', agent: '[PolicyGate]', text: 'Simüle L3 eylem başlatıldı: `fs_write_restricted`. Pending approval oluşturuldu.', type: 'warning' },
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
    { time: '04:22:03', agent: '[VoiceFabric]', text: 'Barge-in (kullanıcı araya girme) sinyali algılandı -> Konuşma anında kesildi, dinleme moduna dönüldü.', type: 'warning' }
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
      }, index * 280);
    });
  }

  // Initial render
  renderScenario('bist_analysis');

  scenarioPills.forEach(pill => {
    pill.addEventListener('click', () => {
      scenarioPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const scenarioKey = pill.getAttribute('data-scenario');
      renderScenario(scenarioKey);
    });
  });

  // Mode buttons
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `
        <span class="term-time">[SYSTEM]</span>
        <span class="term-verified">Masaüstü Modu Değiştirildi: ${mode.toUpperCase()}</span>
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
          <span class="term-success">Görev kuyruğa eklendi. Gerekli yetkiler inceleniyor...</span>
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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   4. MOBILE MENU & SCROLL
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

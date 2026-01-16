/**
 * DAR ALETIIMAN CHAT WIDGET EMBED
 * This script injects a floating chat button and an iframe-based chat interface.
 * Usage: <script src="https://your-domain.com/chat/embed.js"></script>
 */

(function () {
  // --- CONFIGURATION ---
  const CHAT_URL = "https://luckydraw.world/chat/#/widget"; // Point to the hosted widget route
  const PRIMARY_COLOR = "#8a1538"; // Dar Aletiman Burgundy

  // --- STYLING INJECTION ---
  const style = document.createElement('style');
  style.innerHTML = `
    .dar-chat-frame {
      position: fixed;
      bottom: 95px !important;
      width: 420px !important;
      max-width: 90vw !important;
      height: 530px !important; /* Balanced height */
      max-height: 75vh !important;
      border: none !important;
      border-radius: 20px !important;
      box-shadow: 0 12px 45px rgba(0,0,0,0.2) !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      pointer-events: none;
      z-index: 2147483646 !important;
      background: transparent !important; /* Fix white bottom line */
    }
    .dar-chat-frame.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    /* V5 - Hyper-Specific Positioning: Ensures layout beats host styles */
    div.dar-chat-frame.dar-pos-right { right: 25px !important; left: auto !important; margin: 0 !important; transform: translateY(0) scale(1) !important; }
    div.dar-chat-frame.dar-pos-left { left: 25px !important; right: auto !important; margin: 0 !important; transform: translateY(0) scale(1) !important; }
    
    /* When inactive, keep the scale/translate but respect position */
    div.dar-chat-frame:not(.active).dar-pos-right { transform: translateY(30px) scale(0.95) !important; opacity: 0 !important; }
    div.dar-chat-frame:not(.active).dar-pos-left { transform: translateY(30px) scale(0.95) !important; opacity: 0 !important; }

    div.dar-widget-container {
      position: fixed !important;
      bottom: 25px !important;
      z-index: 2147483647 !important; 
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      display: flex !important;
      margin: 0 !important;
    }
    
    div.dar-widget-container.dar-pos-right { right: 25px !important; left: auto !important; }
    div.dar-widget-container.dar-pos-left { left: 25px !important; right: auto !important; }
    
    .dar-fab {
      width: 65px !important;
      height: 65px !important;
      border-radius: 50% !important;
      background-color: #fff1f2 !important;
      border: 1px solid #ffe4e6 !important;
      box-shadow: 0 10px 25px rgba(138, 21, 56, 0.15) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      overflow: hidden !important;
    }
    .dar-fab svg {
      width: 32px !important;
      height: 32px !important;
      stroke: ${PRIMARY_COLOR} !important;
      stroke-width: 2 !important;
      fill: none !important; /* Force no fill to fix black square */
    }
    .dar-fab svg * {
       fill: none !important; /* Force all internal paths to have no fill */
       stroke: inherit !important;
    }
    /* ... rest of base styles ... */
    @media (max-width: 480px) {
      .dar-chat-frame {
        width: 100% !important;
        right: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        height: 100% !important;
        max-height: 100% !important;
        border-radius: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);

  // --- COMPONENT CREATION ---

  const getTheme = () => {
    // Thorough check for dark mode on html or body
    const isDark = document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'dark' : 'light';
  };

  const getLang = () => {
    const urlParams = new URL(window.location.href).searchParams;
    const urlLang = urlParams.get('lang') || urlParams.get('language');

    // 1. URL Parameter is the strongest signal
    if (urlLang) return urlLang.toLowerCase().startsWith('en') ? 'en' : 'ar';

    // 2. LocalStorage (SPA State)
    const stored = localStorage.getItem('i18nextLng') || localStorage.getItem('lang');
    if (stored) return stored.toLowerCase().startsWith('en') ? 'en' : 'ar';

    // 3. Page Title detection (If it contains Arabic characters, it's Arabic)
    if (/[\u0600-\u06FF]/.test(document.title)) return 'ar';

    // 4. Default for this site: If no 'en' signal is found, assume Arabic
    return 'ar';
  };

  const getDir = () => {
    const html = document.documentElement;
    const body = document.body;

    // Explicit attribute check
    const attrDir = html.dir || body.dir || html.getAttribute('dir') || body.getAttribute('dir');
    if (attrDir) return attrDir.toLowerCase();

    // Contextual check
    const lang = getLang();
    return lang === 'ar' ? 'rtl' : 'ltr';
  };

  const syncState = () => {
    const theme = getTheme();
    const lang = getLang();
    const dir = getDir();

    // Diagnostic logging - Version 6.1 (Lucky Draw Hyper-Sync)
    console.log(`[DarChat v6.1] Syncing -> Lang: ${lang}, Dir: ${dir}, Theme: ${theme}`);

    // 1. Update Postioning
    if (dir === 'rtl') {
      iframe.classList.add('dar-pos-left');
      iframe.classList.remove('dar-pos-right');
      container.classList.add('dar-pos-left');
      container.classList.remove('dar-pos-right');

      // Inline style fallback for absolute dominance
      container.style.setProperty('left', '25px', 'important');
      container.style.setProperty('right', 'auto', 'important');
      iframe.style.setProperty('left', '25px', 'important');
      iframe.style.setProperty('right', 'auto', 'important');
    } else {
      iframe.classList.add('dar-pos-right');
      iframe.classList.remove('dar-pos-left');
      container.classList.add('dar-pos-right');
      container.classList.remove('dar-pos-left');

      // Inline style fallback for absolute dominance
      container.style.setProperty('right', '25px', 'important');
      container.style.setProperty('left', 'auto', 'important');
      iframe.style.setProperty('right', '25px', 'important');
      iframe.style.setProperty('left', 'auto', 'important');
    }

    // 2. Sync with Iframe content
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'SET_THEME', theme }, '*');
      iframe.contentWindow.postMessage({ type: 'SET_LANGUAGE', language: lang }, '*');
    }
  };

  // 1. Create the Chat Iframe
  const iframe = document.createElement('iframe');
  iframe.className = 'dar-chat-frame';
  // Use ? for query parameter to avoid breaking the hash route
  iframe.src = `${CHAT_URL}?theme=${getTheme()}&lang=${getLang()}`;
  iframe.title = "Dar Aletiiman Support Chat";
  iframe.allow = "clipboard-read; clipboard-write"; // Ensure clipboard works
  iframe.onload = syncState; // Sync as soon as it loads
  document.body.appendChild(iframe);

  // 2. Create the FAB Container
  const container = document.createElement('div');
  container.className = 'dar-widget-container';
  container.innerHTML = `
    <div class="dar-fab" title="Chat with us">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V4H8" stroke-linecap="round" stroke-linejoin="round"/>
        <rect width="16" height="12" x="4" y="8" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 14h2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 14h2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 13v2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 13v2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  document.body.appendChild(container);

  // Initial Sync
  syncState();

  // --- INTERACTION ---
  container.onclick = () => {
    const isActive = iframe.classList.toggle('active');
    if (isActive) syncState();
  };

  // --- OBSERVER & HEARTBEAT (Real-time Sync) ---
  const observer = new MutationObserver(syncState);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'lang', 'dir'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'lang', 'dir'] });

  // SPA Navigation Support: Sync when URL changes without reload
  window.addEventListener('popstate', syncState);
  window.addEventListener('hashchange', syncState);

  // Periodically check for changes (Heartbeat)
  setInterval(syncState, 1500);

})();

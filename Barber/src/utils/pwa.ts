/**
 * Utilidades PWA para garantir experiência mobile nativa
 */

/**
 * Detecta se o app está rodando em modo standalone (instalado como PWA)
 */
export const isStandalone = (): boolean => {
  // iOS
  if ('standalone' in window.navigator) {
    return (window.navigator as any).standalone === true;
  }
  
  // Android e outros
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches;
};

/**
 * Previne comportamentos indesejados do navegador mobile
 */
export const preventMobileBehaviors = () => {
  // Prevenir pull-to-refresh no mobile
  let lastTouchY = 0;
  let preventPullToRefresh = false;

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    lastTouchY = e.touches[0].clientY;
    preventPullToRefresh = window.scrollY === 0;
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;

    if (preventPullToRefresh) {
      // Para prevenir pull to refresh
      preventPullToRefresh = false;
      if (touchYDelta > 0) {
        e.preventDefault();
        return;
      }
    }
  }, { passive: false });

  // Prevenir zoom em double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Prevenir zoom com gestos (pinch)
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });

  document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
  });

  document.addEventListener('gestureend', (e) => {
    e.preventDefault();
  });
};

/**
 * Configurações de viewport dinâmico para dispositivos móveis
 */
export const setupDynamicViewport = () => {
  // Corrige problemas de altura de viewport em mobile
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
  
  // Reajusta quando o teclado virtual aparece/desaparece
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setVH);
  }
};

/**
 * Esconde a splash screen após o carregamento
 */
export const hideSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.remove();
    }, 300);
  }
};

/**
 * Verifica se está no iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Verifica se está no Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Adiciona classe ao body baseado no dispositivo e modo PWA
 */
export const setupDeviceClasses = () => {
  const root = document.documentElement;
  
  if (isStandalone()) {
    root.classList.add('pwa-standalone');
  }
  
  if (isIOS()) {
    root.classList.add('ios');
    if (isStandalone()) {
      root.classList.add('ios-standalone');
    }
  }
  
  if (isAndroid()) {
    root.classList.add('android');
    if (isStandalone()) {
      root.classList.add('android-standalone');
    }
  }
};

/**
 * Inicializa todas as configurações PWA
 */
export const initPWA = () => {
  setupDeviceClasses();
  setupDynamicViewport();
  preventMobileBehaviors();
  
  // Esconde splash após carregamento completo
  if (document.readyState === 'complete') {
    hideSplashScreen();
  } else {
    window.addEventListener('load', hideSplashScreen);
  }
  
  // Log para debug
  if (process.env.NODE_ENV === 'development') {
    console.log('[PWA] Standalone:', isStandalone());
    console.log('[PWA] iOS:', isIOS());
    console.log('[PWA] Android:', isAndroid());
  }
};

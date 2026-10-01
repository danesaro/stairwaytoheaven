declare global {
  interface Window {
    GLightbox: (options?: Record<string, unknown>) => { openAt: (index: number) => void };
  }
}

export function initPortfolio() {
  const container = document.querySelector<HTMLElement>('.project-gallery');
  if (!container) return;

  const items = container.querySelectorAll<HTMLElement>('.gallery-item');

  container.querySelectorAll<HTMLButtonElement>('.gallery-filters button').forEach((item) => {
    item.addEventListener(
      'click',
      () => {
        container.querySelector('.filter-active')?.classList.remove('filter-active');
        item.closest('li')?.classList.add('filter-active');
        container.querySelectorAll('.gallery-filters button').forEach((button) => {
          button.setAttribute('aria-pressed', String(button === item));
        });
        const filter = item.dataset.filter ?? 'all';
        items.forEach((project) => {
          project.hidden = filter !== 'all' && project.dataset.category !== filter;
          if (!project.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            project.animate(
              [
                { opacity: 0, transform: 'translateY(6px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
            );
          }
        });
      },
      false,
    );
  });
}

export function initLightbox() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.glightbox'));
  if (!links.length) return;
  let loading: Promise<void> | undefined;
  let lightbox: ReturnType<Window['GLightbox']> | undefined;
  const load = () =>
    (loading ??= new Promise<void>((resolve, reject) => {
      const stylesReady = new Promise<void>((stylesResolve, stylesReject) => {
        if (document.querySelector('link[data-lightbox-styles]')) return stylesResolve();
        const styles = document.createElement('link');
        styles.rel = 'stylesheet';
        styles.href = '/assets/vendor/glightbox/css/glightbox.min.css';
        styles.dataset.lightboxStyles = '';
        styles.onload = () => stylesResolve();
        styles.onerror = () => {
          styles.remove();
          stylesReject(new Error('Estilos de ampliación no disponibles'));
        };
        document.head.append(styles);
      });
      stylesReady.catch((error) => {
        loading = undefined;
        reject(error);
      });
      if (typeof window.GLightbox === 'function') {
        stylesReady.then(resolve, reject);
        return;
      }
      const script = document.createElement('script');
      script.src = '/assets/vendor/glightbox/js/glightbox.min.js';
      script.onload = () => {
        stylesReady.then(resolve, (error) => {
          loading = undefined;
          reject(error);
        });
      };
      script.onerror = () => {
        script.remove();
        loading = undefined;
        reject(new Error('Lightbox no disponible'));
      };
      document.head.append(script);
    }));
  links.forEach((link, index) =>
    link.addEventListener(
      'click',
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
          await load();
          lightbox ??= window.GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: false,
            autoplay: false,
            draggable: true,
            openEffect: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'zoom',
            closeEffect: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'fade',
            slideEffect: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'slide',
          });
          lightbox.openAt(index);
        } catch {
          window.location.assign(link.href);
        }
      },
      true,
    ),
  );
}

export function initPage() {
  initLightbox();
  initPortfolio();
}

/** Visor de fotografías, descargado solo al abrir una imagen de Proyectos. */
export function createProjectViewer(dialog: HTMLDialogElement) {
  const stage = dialog.querySelector<HTMLElement>('.viewer-stage')!;
  const image = dialog.querySelector<HTMLImageElement>('[data-viewer-image]')!;
  const title = dialog.querySelector<HTMLElement>('#viewer-title')!;
  const description = dialog.querySelector<HTMLElement>('#viewer-description')!;
  const count = dialog.querySelector<HTMLElement>('[data-viewer-count]')!;
  const status = dialog.querySelector<HTMLElement>('.viewer-status')!;
  const zoom = dialog.querySelector<HTMLButtonElement>('[data-viewer-zoom]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-viewer-close]')!;
  const previous = dialog.querySelector<HTMLButtonElement>('[data-viewer-previous]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-viewer-next]')!;
  const original = dialog.querySelector<HTMLAnchorElement>('[data-viewer-original]')!;
  let links: HTMLAnchorElement[] = [];
  let index = 0;
  let opener: HTMLAnchorElement;
  let zoomed = false;
  let loadId = 0;
  let previousOverflow = '';
  let pointer: { x: number; y: number; left: number; top: number; id: number } | undefined;

  function fit() {
    if (!stage.hasAttribute('data-ready')) return;
    const scale = Math.min(
      (stage.clientWidth - 24) / image.naturalWidth,
      (stage.clientHeight - 24) / image.naturalHeight,
      1,
    );
    image.style.width = `${Math.max(1, image.naturalWidth * scale) * (zoomed ? 2 : 1)}px`;
    image.style.height = `${Math.max(1, image.naturalHeight * scale) * (zoomed ? 2 : 1)}px`;
  }
  function resetZoom() {
    zoomed = false;
    stage.removeAttribute('data-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.querySelector('span')!.textContent = 'Acercar';
    fit();
    stage.scrollTo(0, 0);
  }
  function show(target: number) {
    if (target < 0 || target >= links.length) return;
    index = target;
    const link = links[index];
    const id = ++loadId;
    resetZoom();
    stage.removeAttribute('data-ready');
    stage.setAttribute('aria-busy', 'true');
    zoom.disabled = true;
    title.textContent = link.dataset.projectTitle ?? 'Nuestro trabajo';
    description.textContent = link.dataset.projectDescription ?? link.querySelector('img')?.alt ?? '';
    count.textContent = `${index + 1} de ${links.length}`;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
    if (
      (previous.disabled && document.activeElement === previous) ||
      (next.disabled && document.activeElement === next)
    )
      stage.focus({ preventScroll: true });
    original.href = link.href;
    status.textContent = 'Cargando fotografía…';
    image.alt = description.textContent;
    const incoming = new Image();
    incoming.onload = () => {
      if (id !== loadId || !dialog.open) return;
      image.onload = () => {
        if (id !== loadId || !dialog.open) return;
        stage.setAttribute('data-ready', '');
        stage.setAttribute('aria-busy', 'false');
        status.textContent = '';
        zoom.disabled = false;
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
        fit();
      };
      image.src = incoming.src;
    };
    incoming.onerror = () => {
      if (id !== loadId || !dialog.open) return;
      stage.setAttribute('aria-busy', 'false');
      status.textContent = 'No pudimos cargar la fotografía. Puedes abrir la imagen o pasar a otra.';
    };
    incoming.src = link.href;
  }
  function toggleZoom() {
    if (zoom.disabled) return;
    zoomed = !zoomed;
    stage.toggleAttribute('data-zoomed', zoomed);
    zoom.setAttribute('aria-pressed', String(zoomed));
    zoom.querySelector('span')!.textContent = zoomed ? 'Alejar' : 'Acercar';
    fit();
    stage.focus({ preventScroll: true });
    stage.scrollTo(
      (stage.scrollWidth - stage.clientWidth) / 2,
      (stage.scrollHeight - stage.clientHeight) / 2,
    );
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    ++loadId;
    pointer = undefined;
    stage.removeAttribute('data-dragging');
    document.body.style.overflow = previousOverflow;
    resetZoom();
    opener?.focus({ preventScroll: true });
  });
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  zoom.addEventListener('click', toggleZoom);
  image.addEventListener('dblclick', toggleZoom);
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]'),
      );
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.key === 'ArrowRight' && !zoomed) {
      event.preventDefault();
      show(index + 1);
    }
    if (event.key === 'ArrowLeft' && !zoomed) {
      event.preventDefault();
      show(index - 1);
    }
    if (event.key === 'Home' && !zoomed) {
      event.preventDefault();
      show(0);
    }
    if (event.key === 'End' && !zoomed) {
      event.preventDefault();
      show(links.length - 1);
    }
  });
  stage.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = {
      x: event.clientX,
      y: event.clientY,
      left: stage.scrollLeft,
      top: stage.scrollTop,
      id: event.pointerId,
    };
    if (zoomed && event.pointerType === 'mouse') {
      stage.setPointerCapture(event.pointerId);
      stage.setAttribute('data-dragging', '');
      event.preventDefault();
    }
  });
  stage.addEventListener('pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId || !zoomed || event.pointerType !== 'mouse') return;
    stage.scrollTo(pointer.left - (event.clientX - pointer.x), pointer.top - (event.clientY - pointer.y));
  });
  stage.addEventListener('pointerup', (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x,
      dy = event.clientY - pointer.y;
    if (!zoomed && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    pointer = undefined;
    stage.removeAttribute('data-dragging');
  });
  stage.addEventListener('pointercancel', () => {
    pointer = undefined;
    stage.removeAttribute('data-dragging');
  });
  new ResizeObserver(fit).observe(stage);
  return {
    open(link: HTMLAnchorElement) {
      if (dialog.open) return;
      links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-project-image]')).filter(
        (item) => !item.closest<HTMLElement>('.gallery-item')?.hidden,
      );
      opener = link;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      show(Math.max(0, links.indexOf(link)));
      close.focus({ preventScroll: true });
    },
  };
}

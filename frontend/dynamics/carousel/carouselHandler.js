// carousel.js
//console.log(`[carousel] carregado. Puxou o js.`);

function setupCarouselEvents() {
   //console.log('[CarouselHandler] Inicializando o carrossel...');

  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-next');
  const prevButton = document.querySelector('.carousel-prev');
  const indicatorsContainer = document.querySelector('.carousel-indicators');

  if (!track || !slides.length || !nextButton || !prevButton || !indicatorsContainer) {
    ////console.error('[CarouselHandler] Elementos necessários não foram encontrados.');
    return;
  }

  let currentIndex = 0;

  // Cria indicadores
  slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('carousel-indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.dataset.index = index;
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = Array.from(indicatorsContainer.children);

  const updateIndicators = (index) => {
    indicators.forEach((indicator) => indicator.classList.remove('active'));
    indicators[index].classList.add('active');
  };

  const moveToSlide = (index) => {
    const targetSlide = slides[index];
    track.style.transform = `translateX(-${targetSlide.offsetLeft}px)`;
    updateIndicators(index);
    currentIndex = index;
  };

  // Eventos dos botões
  nextButton.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    moveToSlide(nextIndex);
  });

  prevButton.addEventListener('click', () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(prevIndex);
  });

  // Eventos dos indicadores
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      const index = Number(indicator.dataset.index);
      moveToSlide(index);
    });
  });

  //console.log('[CarouselHandler] Eventos configurados com sucesso.');
}

// Torna a função acessível globalmente
window.setupCarouselEvents = setupCarouselEvents;

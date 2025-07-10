const romanticPhrases = [
  'Loviuu',
  'My love',
  'Mi princesa',
  "Loviu, preciosa",
  "Mucho love para ti",
  "Mi lindota hermosa",
  "Love it",
  "Loviu forever",
  "You're my favorite human",
  "Love it, love you",
  "Miss u, mailof",
  "With you, everything makes sense"
];

const bubbleSizes = [ 'small', 'medium', 'large' ];
const colors = [
  'rgba(255, 182, 193, 0.7)',
  'rgba(255, 192, 203, 0.7)',
  'rgba(255, 160, 180, 0.7)',
  'rgba(255, 175, 200, 0.7)',
  'rgba(255, 210, 220, 0.6)'
];

function createBubble() {
  const bubble = document.createElement( 'div' );
  bubble.className = 'bubble';

  // Configuración responsive
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  let bubbleMargin = 100;

  // Ajustar margen según tamaño de pantalla
  if ( screenWidth <= 320 ) {
    bubbleMargin = 60;
  } else if ( screenWidth <= 480 ) {
    bubbleMargin = 80;
  } else if ( screenWidth <= 768 ) {
    bubbleMargin = 90;
  }

  // Posición aleatoria en el eje X (responsive)
  const leftPosition = Math.random() * ( screenWidth - bubbleMargin );
  bubble.style.left = leftPosition + 'px';
  bubble.style.bottom = '-100px';

  // Tamaño aleatorio (con peso diferente para móviles)
  let sizeWeights;
  if ( screenWidth <= 480 ) {
    // En móviles, favorece burbujas más pequeñas
    sizeWeights = [ 'small', 'small', 'medium', 'large' ];
  } else {
    // En desktop, distribución normal
    sizeWeights = bubbleSizes;
  }

  const size = sizeWeights[ Math.floor( Math.random() * sizeWeights.length ) ];
  bubble.classList.add( size );

  // Color aleatorio
  const color = colors[ Math.floor( Math.random() * colors.length ) ];
  bubble.style.background = color;

  // Duración aleatoria de animación (ajustada para responsive)
  let baseDuration = 4;
  let maxDuration = 8;

  if ( screenWidth <= 480 ) {
    // En móviles, duraciones más cortas
    baseDuration = 4;
    maxDuration = 6;
  } else if ( screenHeight <= 500 ) {
    // En pantallas bajas, duraciones más cortas
    baseDuration = 4;
    maxDuration = 6;
  }

  const duration = baseDuration + Math.random() * ( maxDuration - baseDuration );
  bubble.style.animationDuration = duration + 's';

  // Decidir si la burbuja tendrá texto (ajustado para responsive)
  let phraseChance = 0.85;
  if ( screenWidth <= 480 ) {
    phraseChance = 0.75; // Menos frases en móviles para evitar saturación
  }

  let hiddenPhrase = null;
  if ( Math.random() < phraseChance ) {
    hiddenPhrase = romanticPhrases[ Math.floor( Math.random() * romanticPhrases.length ) ];
    bubble.dataset.phrase = hiddenPhrase;
    bubble.setAttribute( 'data-has-phrase', 'true' );
  } else {
    bubble.classList.add( 'empty' );
    bubble.setAttribute( 'data-has-phrase', 'false' );
  }

  // Agregar evento click para "estallar" la burbuja
  bubble.addEventListener( 'click', function ( e ) {
    e.preventDefault();
    e.stopPropagation();
    popBubble( bubble );
  } );

  // Agregar evento touch para dispositivos móviles
  bubble.addEventListener( 'touchstart', function ( e ) {
    e.preventDefault();
    popBubble( bubble );
  } );

  document.body.appendChild( bubble );

  // Eliminar la burbuja después de que termine la animación
  setTimeout( () => {
    if ( bubble.parentNode && !bubble.classList.contains( 'popped' ) ) {
      bubble.parentNode.removeChild( bubble );
    }
  }, duration * 1000 );
}

function popBubble( bubble ) {
  // Evitar múltiples clicks
  if ( bubble.classList.contains( 'popped' ) ) return;

  // Obtener la posición ANTES de agregar la clase popped
  const rect = bubble.getBoundingClientRect();
  const screenWidth = window.innerWidth;

  bubble.classList.add( 'popped' );

  // Si la burbuja tiene frase, mostrarla
  if ( bubble.dataset.phrase ) {
    const phraseElement = document.createElement( 'div' );
    phraseElement.className = 'phrase-reveal';
    phraseElement.textContent = bubble.dataset.phrase;

    // Posicionar la frase en el lugar de la burbuja (responsive)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Ajustar offset según tamaño de pantalla
    let offsetX = 60;
    let offsetY = 20;

    if ( screenWidth <= 320 ) {
      offsetX = 40;
      offsetY = 15;
    } else if ( screenWidth <= 480 ) {
      offsetX = 50;
      offsetY = 18;
    } else if ( screenWidth <= 768 ) {
      offsetX = 55;
      offsetY = 19;
    }

    // Asegurar que la frase no se salga de la pantalla
    let leftPosition = centerX - offsetX;
    let topPosition = centerY - offsetY;

    // Ajustar si se sale por la derecha
    if ( leftPosition + 120 > screenWidth ) {
      leftPosition = screenWidth - 130;
    }

    // Ajustar si se sale por la izquierda
    if ( leftPosition < 10 ) {
      leftPosition = 10;
    }

    // Ajustar si se sale por arriba
    if ( topPosition < 10 ) {
      topPosition = 10;
    }

    phraseElement.style.left = leftPosition + 'px';
    phraseElement.style.top = topPosition + 'px';

    // Asegurar que se vea
    phraseElement.style.zIndex = '1000';
    phraseElement.style.pointerEvents = 'none';

    document.body.appendChild( phraseElement );

    // Duración ajustada para responsive
    let phraseDuration = 8000;
    if ( screenWidth <= 480 ) {
      phraseDuration = 6000; // Menos tiempo en móviles
    }

    // Eliminar la frase después de la animación
    setTimeout( () => {
      if ( phraseElement.parentNode ) {
        phraseElement.parentNode.removeChild( phraseElement );
      }
    }, phraseDuration );
  }

  // Eliminar la burbuja después de la animación de explosión
  setTimeout( () => {
    if ( bubble.parentNode ) {
      bubble.parentNode.removeChild( bubble );
    }
  }, 600 );
}

// Variables para responsive
let bubbleInterval;
let bubbleFrequency = 1000; // Frecuencia base

// Función para ajustar configuración según el tamaño de pantalla
function adjustResponsiveSettings() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Ajustar frecuencia de burbujas según tamaño de pantalla
  if ( screenWidth >= 1200 ) {
    bubbleFrequency = 800; // Más burbujas en pantallas grandes
  } else if ( screenWidth >= 768 ) {
    bubbleFrequency = 1000; // Frecuencia normal
  } else if ( screenWidth >= 480 ) {
    bubbleFrequency = 1200; // Menos burbujas en móviles
  } else {
    bubbleFrequency = 1500; // Aún menos en pantallas muy pequeñas
  }

  // Reiniciar el intervalo con la nueva frecuencia
  if ( bubbleInterval ) {
    clearInterval( bubbleInterval );
  }
  bubbleInterval = setInterval( createBubble, bubbleFrequency );
}

// Iniciar la creación de burbujas cuando se carga la página
document.addEventListener( 'DOMContentLoaded', function () {
  // Configurar settings responsive
  adjustResponsiveSettings();

  // Crear algunas burbujas iniciales
  setTimeout( createBubble, 500 );
  setTimeout( createBubble, 1500 );
  setTimeout( createBubble, 2500 );
} );

// Debounce function para optimizar el resize
function debounce( func, wait ) {
  let timeout;
  return function executedFunction( ...args ) {
    const later = () => {
      clearTimeout( timeout );
      func( ...args );
    };
    clearTimeout( timeout );
    timeout = setTimeout( later, wait );
  };
}

// Manejar redimensionamiento de pantalla
const handleResize = debounce( () => {
  // Limpiar burbujas existentes al redimensionar
  const existingBubbles = document.querySelectorAll( '.bubble' );
  existingBubbles.forEach( ( bubble ) => {
    if ( bubble.parentNode ) {
      bubble.parentNode.removeChild( bubble );
    }
  } );

  // Limpiar frases existentes al redimensionar
  const existingPhrases = document.querySelectorAll( '.phrase-reveal' );
  existingPhrases.forEach( ( phrase ) => {
    if ( phrase.parentNode ) {
      phrase.parentNode.removeChild( phrase );
    }
  } );

  // Reajustar configuración responsive
  adjustResponsiveSettings();
}, 250 );

window.addEventListener( 'resize', handleResize );

// Manejar cambios de orientación
window.addEventListener( 'orientationchange', () => {
  setTimeout( () => {
    handleResize();
  }, 100 );
} ); 
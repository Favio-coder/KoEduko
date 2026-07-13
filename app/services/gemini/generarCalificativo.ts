export interface Competencia {
  nombre: string
  descripcion: string
}

export interface ResultadoCalificativo {
  estudiante: string
  calificativo: 'AD' | 'A' | 'B' | 'C'
  conclusionDescriptiva: string
}

const CURRICULO: Record<string, Record<string, Competencia[]>> = {
  Inicial: {
    'Personal Social': [
      { nombre: 'Construye su identidad', descripcion: 'Reconoce sus características, preferencias y emociones, y se relaciona con otros' },
      { nombre: 'Convive y participa democráticamente', descripcion: 'Interactúa con respeto, cuida el entorno y participa en actividades grupales' },
    ],
    'Psicomotriz': [
      { nombre: 'Se desenvuelve de manera autónoma a través de su motricidad', descripcion: 'Explora y regula su cuerpo, coordina movimientos y desarrolla su motricidad gruesa y fina' },
    ],
    'Comunicación': [
      { nombre: 'Se comunica oralmente en su lengua materna', descripcion: 'Expresa necesidades, emociones e ideas usando lenguaje oral con creciente fluidez' },
      { nombre: 'Lee diversos tipos de textos escritos', descripcion: 'Interpreta imágenes, íconos y textos breves a partir de sus experiencias' },
      { nombre: 'Escribe diversos tipos de textos', descripcion: 'Produce trazos, garabatos y letras para expresar ideas y mensajes' },
      { nombre: 'Crea proyectos desde los lenguajes artísticos', descripcion: 'Explora materiales y técnicas artísticas para expresar su creatividad' },
    ],
    'Matemática': [
      { nombre: 'Resuelve problemas de cantidad', descripcion: 'Agrupa, compara y cuenta objetos usando nociones de cantidad' },
      { nombre: 'Resuelve problemas de forma, movimiento y localización', descripcion: 'Explora figuras geométricas, ubicación espacial y desplazamientos' },
    ],
    'Ciencia y Tecnología': [
      { nombre: 'Indaga mediante métodos científicos', descripcion: 'Explora y describe fenómenos naturales usando sus sentidos' },
    ],
  },
  Primaria: {
    'Comunicación': [
      { nombre: 'Se comunica oralmente en su lengua materna', descripcion: 'Expresa sus ideas, emociones y experiencias de forma oral con claridad y coherencia' },
      { nombre: 'Lee diversos tipos de textos escritos', descripcion: 'Comprende y reflexiona sobre textos escritos en su lengua materna' },
      { nombre: 'Escribe diversos tipos de textos', descripcion: 'Produce textos escritos con coherencia, cohesión y adecuación' },
    ],
    'Matemática': [
      { nombre: 'Resuelve problemas de cantidad', descripcion: 'Resuelve situaciones problemáticas que involucran cantidades y operaciones' },
      { nombre: 'Resuelve problemas de regularidad, equivalencia y cambio', descripcion: 'Identifica patrones, relaciones y cambios en situaciones problemáticas' },
      { nombre: 'Resuelve problemas de forma, movimiento y localización', descripcion: 'Se orienta en el espacio y describe formas geométricas' },
      { nombre: 'Resuelve problemas de gestión de datos e incertidumbre', descripcion: 'Recopila, organiza e interpreta datos para tomar decisiones' },
    ],
    'Ciencia y Tecnología': [
      { nombre: 'Indaga mediante métodos científicos', descripcion: 'Construye conocimientos científicos mediante la indagación' },
      { nombre: 'Explica el mundo natural basándose en conocimientos', descripcion: 'Comprende y explica fenómenos naturales usando principios científicos' },
      { nombre: 'Diseña y construye soluciones tecnológicas', descripcion: 'Identifica problemas y diseña prototipos tecnológicos' },
    ],
    'Personal Social': [
      { nombre: 'Construye su identidad', descripcion: 'Se reconoce como persona valiosa y se relaciona positivamente' },
      { nombre: 'Convive y participa democráticamente', descripcion: 'Interactúa respetando normas y participa en asuntos públicos' },
      { nombre: 'Construye interpretaciones históricas', descripcion: 'Comprende procesos históricos y se ubica en el tiempo' },
    ],
    'Arte y Cultura': [
      { nombre: 'Aprecia de manera crítica manifestaciones artístico-culturales', descripcion: 'Observa, escucha y describe manifestaciones artísticas' },
      { nombre: 'Crea proyectos desde los lenguajes artísticos', descripcion: 'Expresa ideas y emociones mediante diversos lenguajes artísticos' },
    ],
    'Inglés': [
      { nombre: 'Se comunica oralmente en inglés', descripcion: 'Comprende y produce mensajes orales básicos en inglés' },
      { nombre: 'Lee diversos tipos de textos en inglés', descripcion: 'Comprende textos escritos sencillos en inglés' },
      { nombre: 'Escribe diversos tipos de textos en inglés', descripcion: 'Produce textos escritos breves en inglés' },
    ],
  },
  Secundaria: {
    'Comunicación': [
      { nombre: 'Se comunica oralmente en su lengua materna', descripcion: 'Expresa y argumenta sus ideas de forma oral con pertinencia y fluidez' },
      { nombre: 'Lee diversos tipos de textos escritos', descripcion: 'Comprende críticamente textos escritos en diversos contextos' },
      { nombre: 'Escribe diversos tipos de textos', descripcion: 'Produce textos argumentativos, expositivos y narrativos con autonomía' },
    ],
    'Matemática': [
      { nombre: 'Resuelve problemas de cantidad', descripcion: 'Resuelve problemas con números racionales y estrategias de cálculo' },
      { nombre: 'Resuelve problemas de regularidad, equivalencia y cambio', descripcion: 'Modela situaciones de cambio con funciones y ecuaciones' },
      { nombre: 'Resuelve problemas de forma, movimiento y localización', descripcion: 'Utiliza propiedades geométricas para resolver problemas' },
      { nombre: 'Resuelve problemas de gestión de datos e incertidumbre', descripcion: 'Interpreta datos estadísticos y probabilidades en situaciones reales' },
    ],
    'Ciencia y Tecnología': [
      { nombre: 'Indaga mediante métodos científicos', descripcion: 'Desarrolla investigaciones científicas siguiendo el método científico' },
      { nombre: 'Explica el mundo natural basándose en conocimientos', descripcion: 'Argumenta fenómenos naturales usando teorías científicas' },
      { nombre: 'Diseña y construye soluciones tecnológicas', descripcion: 'Propone innovaciones tecnológicas para problemas del entorno' },
    ],
    'Desarrollo Personal y Ciudadanía Cívica': [
      { nombre: 'Construye su identidad', descripcion: 'Reflexiona sobre su identidad y proyecto de vida' },
      { nombre: 'Convive y participa democráticamente', descripcion: 'Ejerce su ciudadanía y participa en asuntos públicos' },
      { nombre: 'Construye interpretaciones históricas', descripcion: 'Analiza procesos históricos y su impacto en el presente' },
    ],
    'Arte y Cultura': [
      { nombre: 'Aprecia de manera crítica manifestaciones artístico-culturales', descripcion: 'Analiza y valora manifestaciones artísticas diversas' },
      { nombre: 'Crea proyectos desde los lenguajes artísticos', descripcion: 'Produce obras artísticas originales expresando su visión personal' },
    ],
    'Inglés': [
      { nombre: 'Se comunica oralmente en inglés', descripcion: 'Comprende y produce discursos orales en inglés con fluidez' },
      { nombre: 'Lee diversos tipos de textos en inglés', descripcion: 'Comprende textos auténticos en inglés de diversos géneros' },
      { nombre: 'Escribe diversos tipos de textos en inglés', descripcion: 'Produce textos coherentes en inglés con registro formal e informal' },
    ],
  },
}

export function obtenerAreas(nivel: string): string[] {
  return Object.keys(CURRICULO[nivel] ?? {})
}

export function obtenerCompetencias(nivel: string, area: string): Competencia[] {
  return CURRICULO[nivel]?.[area] ?? []
}

// Pudu Robotics catalog as offered by GM Robotics IA.
// Figures come from Pudu's official spec sheets and product pages archived
// in the GALU research folder (2025 brochure, 2026 cleaning catalog and the
// September 2026 ET1 / GT-series product pages).

export type FamilyId = 'limpieza' | 'entrega' | 'logistica' | 'exteriores';

export interface Family {
  id: FamilyId;
  name: string;
  short: string;
  where: string;
}

export interface Robot {
  id: string;
  family: FamilyId;
  name: string;
  role: string;
  summary: string;
  specs: [string, string][];
  image: string;
  /** cutout = transparent product render; photo = full-bleed picture */
  imageStyle: 'cutout' | 'photo';
  isNew?: boolean;
  doc?: string;
}

export const families: Family[] = [
  {
    id: 'limpieza',
    name: 'Limpieza',
    short: 'Barrido, fregado, aspirado y mopa',
    where: 'Plantas, centros comerciales, hospitales, estacionamientos y oficinas.',
  },
  {
    id: 'entrega',
    name: 'Entrega y servicio',
    short: 'Reparto, recepción y publicidad móvil',
    where: 'Restaurantes, hoteles, hospitales y salas de venta.',
  },
  {
    id: 'logistica',
    name: 'Logística',
    short: 'AMR para transporte de materiales',
    where: 'Manufactura, almacenes y flujos entre estaciones.',
  },
  {
    id: 'exteriores',
    name: 'Exteriores',
    short: 'Corte de césped comercial autónomo',
    where: 'Parques industriales, campus, campos deportivos y fraccionamientos.',
  },
];

export const robots: Robot[] = [
  // Limpieza
  {
    id: 'et1',
    family: 'limpieza',
    name: 'PUDU ET1',
    role: 'Fregadora-secadora compacta con IA',
    summary:
      'Barre, friega, aspira y pasa la mopa en una sola pasada. Su estación 8 en 1 carga, lava el rodillo y rellena agua sin intervención diaria.',
    specs: [
      ['Área ideal', '100–800 m²'],
      ['Rodillo', '800 rpm'],
      ['Agua caliente', '85 °C'],
      ['Paso mínimo', '50 cm'],
    ],
    image: '/media/robots/et1.webp',
    imageStyle: 'cutout',
    isNew: true,
  },
  {
    id: 'cc1',
    family: 'limpieza',
    name: 'PUDU CC1',
    role: 'Limpieza comercial 4 en 1',
    summary:
      'Barre, friega, aspira y pasa mopa en pisos duros o alfombra. Estación de agua opcional para operar sin cambios de plomería.',
    specs: [
      ['Cobertura', '700–1,000 m²/h'],
      ['Autonomía', '5–9 h'],
      ['Tanques', '15 L + 15 L'],
      ['Paso mínimo', '70 cm'],
    ],
    image: '/media/robots/cc1.webp',
    imageStyle: 'photo',
  },
  {
    id: 'cc1-pro',
    family: 'limpieza',
    name: 'PUDU CC1 Pro',
    role: 'Limpieza con verificación por IA',
    summary:
      'El CC1 con limpieza puntual guiada por IA, cámara trasera que verifica el resultado y mapas de calor de suciedad.',
    specs: [
      ['Cobertura', '700–1,000 m²/h'],
      ['Modo puntual', '1,500–3,000 m²/h'],
      ['Batería', '50 Ah'],
      ['Protección', 'IPX4'],
    ],
    image: '/media/robots/cc1-pro.webp',
    imageStyle: 'photo',
  },
  {
    id: 'mt1',
    family: 'limpieza',
    name: 'PUDU MT1',
    role: 'Barrido inteligente de interiores',
    summary:
      'Barredora con reconocimiento de residuos que concentra el trabajo donde hay suciedad en lugar de recorrer una ruta fija.',
    specs: [
      ['Cobertura', '1,800 m²/h'],
      ['Modo puntual', '6,000 m²/h'],
      ['Autonomía', '4–8 h'],
      ['Depósito', '35 L'],
    ],
    image: '/media/robots/mt1.webp',
    imageStyle: 'photo',
  },
  {
    id: 'mt1-max',
    family: 'limpieza',
    name: 'PUDU MT1 Max',
    role: 'Barrido de gran escala y semi-exterior',
    summary:
      'Percepción 3D para techos altos, tráfico mixto y zonas parcialmente exteriores. Cede el paso a vehículos y peatones.',
    specs: [
      ['Cobertura', '2,200 m²/h'],
      ['Modo puntual', '7,000 m²/h'],
      ['Autonomía', '6.5–10 h'],
      ['Protección', 'IP54'],
    ],
    image: '/media/robots/mt1-max.webp',
    imageStyle: 'photo',
  },
  {
    id: 'mt1-vac',
    family: 'limpieza',
    name: 'PUDU MT1 Vac',
    role: 'Barrido, aspirado y mopa seca',
    summary:
      'Para polvo fino, alfombras y zonas bajo estantería. Filtración H11 con H13 opcional y cambio de mopa en un segundo.',
    specs: [
      ['Cobertura', '1,400 m²/h'],
      ['Aspirado', '55 cm'],
      ['Autonomía', '3–6.5 h'],
      ['Bolsa', '14 L'],
    ],
    image: '/media/robots/mt1-vac.webp',
    imageStyle: 'photo',
  },
  {
    id: 'bg1',
    family: 'limpieza',
    name: 'PUDU BG1',
    role: 'Fregado-secado de gran formato',
    summary:
      'Barre y friega en una pasada con dosificación automática de detergente. Pensada para naves, andenes y pasillos anchos.',
    specs: [
      ['Cobertura', '2,000 m²/h'],
      ['Autonomía', 'hasta 7.5 h'],
      ['Agua', '75 L + 60 L'],
      ['Paso mínimo', '85 cm'],
    ],
    image: '/media/robots/bg1.webp',
    imageStyle: 'photo',
  },
  {
    id: 'bg1-pro',
    family: 'limpieza',
    name: 'PUDU BG1 Pro',
    role: 'Fregado industrial con percepción 3D',
    summary:
      'La BG1 con LiDAR 3D y VSLAM para rutas que cambian y limpieza adaptativa según el nivel de suciedad detectado.',
    specs: [
      ['Ancho de fregado', '550 mm'],
      ['Autonomía', '7.5 h'],
      ['Navegación', '3D LiDAR + VSLAM'],
      ['Carga', '≈3 h'],
    ],
    image: '/media/robots/bg1.webp',
    imageStyle: 'photo',
    doc: '/media/docs/pudu-bg1-pro-ficha-tecnica.pdf',
  },
  {
    id: 'sh1',
    family: 'limpieza',
    name: 'PUDU SH1',
    role: 'Fregadora vertical asistida',
    summary:
      'Para manchas difíciles, bordes, escaleras y superficies verticales que un robot autónomo no alcanza. Guiada por el operador.',
    specs: [
      ['Productividad', '1,100–1,600 m²/h'],
      ['Presión', '27 kg'],
      ['Succión', '20 kPa'],
      ['Autonomía', '70–100 min'],
    ],
    image: '/media/robots/sh1.webp',
    imageStyle: 'photo',
  },

  // Entrega y servicio
  {
    id: 'bellabot-pro',
    family: 'entrega',
    name: 'BellaBot Pro',
    role: 'Reparto, recepción y publicidad',
    summary:
      'Cuatro bandejas, pantalla de 18.5" e interacción por voz. Reparte, recibe clientes y proyecta promociones mientras circula.',
    specs: [
      ['Carga', '40 kg'],
      ['Autonomía', '11 h'],
      ['Pantalla', '18.5"'],
      ['Paso mínimo', '65 cm'],
    ],
    image: '/media/robots/bellabot-pro.webp',
    imageStyle: 'cutout',
  },
  {
    id: 'bellabot',
    family: 'entrega',
    name: 'BellaBot',
    role: 'Entrega biónica de cuatro bandejas',
    summary:
      'El robot de servicio más conocido de Pudu: doble SLAM, evitación de obstáculos 3D y expresiones que los comensales reconocen.',
    specs: [
      ['Carga', '40 kg'],
      ['Autonomía', '13 h'],
      ['Bandejas', '4'],
      ['Paso mínimo', '70 cm'],
    ],
    image: '/media/robots/bellabot.webp',
    imageStyle: 'cutout',
  },
  {
    id: 'pudubot-2',
    family: 'entrega',
    name: 'PuduBot 2',
    role: 'Plataforma universal de entrega',
    summary:
      'Tres bandejas, doble LiDAR y coordinación multi-robot. Sirve igual en un comedor industrial que en un laboratorio.',
    specs: [
      ['Carga', '40 kg'],
      ['Autonomía', '15 h'],
      ['Bandejas', '3'],
      ['Peso', '39 kg'],
    ],
    image: '/media/robots/pudubot-2.webp',
    imageStyle: 'cutout',
    doc: '/media/docs/pudu-pudubot-2-ficha-tecnica.pdf',
  },
  {
    id: 'kettybot-pro',
    family: 'entrega',
    name: 'KettyBot Pro',
    role: 'Entrega y guía en espacios compactos',
    summary:
      'Pasa por 52 cm. Entrega, guía a clientes a su mesa y muestra publicidad en su pantalla vertical de 18.5".',
    specs: [
      ['Carga', '30 kg'],
      ['Autonomía', '11 h'],
      ['Paso mínimo', '52 cm'],
      ['Velocidad', '0.2–1.2 m/s'],
    ],
    image: '/media/robots/kettybot-pro.webp',
    imageStyle: 'cutout',
  },
  {
    id: 'flashbot-max',
    family: 'entrega',
    name: 'FlashBot Max',
    role: 'Entrega cerrada entre pisos',
    summary:
      'Compartimento con llave digital e integración con elevadores y controles de acceso. Para hoteles, hospitales y oficinas.',
    specs: [
      ['Carga', '20 kg'],
      ['Compartimentos', '1–2'],
      ['Autonomía', '9 h'],
      ['Paso mínimo', '70 cm'],
    ],
    image: '/media/robots/flashbot-max.webp',
    imageStyle: 'cutout',
  },

  // Logística
  {
    id: 't300',
    family: 'logistica',
    name: 'PUDU T300',
    role: 'AMR modular industrial',
    summary:
      'Transporta 300 kg con módulos de bandejas, elevación, remolque o transportador. Certificado ISO 3691-4.',
    specs: [
      ['Carga', '300 kg'],
      ['Velocidad', '1.2 m/s'],
      ['Autonomía', '8 h a plena carga'],
      ['Paso mínimo', '60 cm'],
    ],
    image: '/media/robots/t300.webp',
    imageStyle: 'photo',
  },
  {
    id: 't600',
    family: 'logistica',
    name: 'PUDU T600',
    role: 'AMR de carga pesada',
    summary:
      'Versión alta y plataforma baja Underride para 600 kg. Habla VDA5050 para integrarse con tu sistema de gestión de flota.',
    specs: [
      ['Carga', '600 kg'],
      ['Autonomía', '12 h'],
      ['Carga de batería', '2 h (0–90 %)'],
      ['Protocolo', 'VDA5050'],
    ],
    image: '/media/robots/t600.webp',
    imageStyle: 'photo',
  },
  {
    id: 'mp2000',
    family: 'logistica',
    name: 'PUDU MP2000',
    role: 'Montacargas autónomo',
    summary:
      'Mueve tarimas de hasta dos toneladas con horquillas, LiDAR 3D y VSLAM. Se coordina con la flota sin servidor central.',
    specs: [
      ['Carga', '2,000 kg'],
      ['Autonomía', '6 h cargado'],
      ['Velocidad', '1.2–1.6 m/s'],
      ['Pasillo', '2.0 m'],
    ],
    image: '/media/robots/mp2000.webp',
    imageStyle: 'photo',
  },

  // Exteriores
  {
    id: 'gt3',
    family: 'exteriores',
    name: 'PUDU GT3',
    role: 'Cortacésped compacto comercial',
    summary:
      'Corta y recoge en una pasada, vacía la tolva solo y retoma la tarea. Mapea por sí mismo y reconoce bordes.',
    specs: [
      ['Modo', 'Corte y recolección'],
      ['Vaciado', 'Automático'],
      ['Mapeo', 'Automático'],
      ['Carga rápida', '2 h con cargador de 6 kW'],
    ],
    image: '/media/robots/gt3.webp',
    imageStyle: 'cutout',
    isNew: true,
  },
  {
    id: 'gt5',
    family: 'exteriores',
    name: 'PUDU GT5',
    role: 'Cortacésped comercial de gran superficie',
    summary:
      'Hasta 10 horas y 16 acres por carga, con percepción 360° y tránsito autónomo entre zonas.',
    specs: [
      ['Autonomía', 'hasta 10 h'],
      ['Cobertura por carga', '16 acres'],
      ['Velocidad', 'hasta 11 km/h'],
      ['Bordes', 'a 5 cm'],
    ],
    image: '/media/robots/gt5.webp',
    imageStyle: 'cutout',
    isNew: true,
  },
  {
    id: 'gt7',
    family: 'exteriores',
    name: 'PUDU GT7',
    role: 'Cortacésped helicoidal de precisión',
    summary:
      'Tracción 4x4, cabezales flotantes que siguen el terreno y control de patrones de corte para campos deportivos y campus.',
    specs: [
      ['Autonomía', '10–12 h'],
      ['Pendiente máx.', '30°'],
      ['Tracción', '4WD'],
      ['Velocidad', 'hasta 11 km/h'],
    ],
    image: '/media/robots/gt7.webp',
    imageStyle: 'cutout',
    isNew: true,
  },
];

export interface CaseVideo {
  id: string;
  title: string;
  where: string;
  src: string;
  poster: string;
  robots: string[];
  minutes: string;
  featured?: boolean;
}

export const cases: CaseVideo[] = [
  {
    id: 'cc1-factory',
    title: 'Planta electrónica con CC1',
    where: 'Manufactura · China',
    src: '/media/cases/cc1-factory.mp4',
    poster: '/media/cases/cc1-factory-poster.webp',
    robots: ['CC1'],
    minutes: '0:43',
    featured: true,
  },
  {
    id: 'et1',
    title: 'ET1: presentación oficial',
    where: 'Retail y oficinas',
    src: '/media/cases/et1.mp4',
    poster: '/media/cases/et1-poster.webp',
    robots: ['ET1'],
    minutes: '1:52',
    featured: true,
  },
  {
    id: 'mt1max',
    title: 'MT1 Max en estacionamiento',
    where: 'Semi-exterior con vehículos',
    src: '/media/cases/mt1max.mp4',
    poster: '/media/cases/mt1max-poster.webp',
    robots: ['MT1 Max'],
    minutes: '0:36',
  },
  {
    id: 't300',
    title: 'PuduBot 2, CC1 y T300 en una misma planta',
    where: 'Manufactura',
    src: '/media/cases/t300.mp4',
    poster: '/media/cases/t300-poster.webp',
    robots: ['T300', 'CC1', 'PuduBot 2'],
    minutes: '1:24',
  },
  {
    id: 'pudubot2',
    title: 'PuduBot 2 en laboratorio',
    where: 'Shaw Lab Group · Canadá',
    src: '/media/cases/pudubot2.mp4',
    poster: '/media/cases/pudubot2-poster.webp',
    robots: ['PuduBot 2'],
    minutes: '0:28',
  },
  {
    id: 'gt5',
    title: 'GT5: corte y recolección',
    where: 'Áreas verdes comerciales',
    src: '/media/cases/gt5.mp4',
    poster: '/media/cases/gt5-poster.webp',
    robots: ['GT5'],
    minutes: '1:20',
  },
];

export interface Doc {
  title: string;
  detail: string;
  href: string;
  size: string;
}

export const docs: Doc[] = [
  {
    title: 'Catálogo Pudu Robotics 2025',
    detail: 'Toda la línea de entrega, servicio y logística.',
    href: '/media/docs/pudu-catalogo-productos-2025.pdf',
    size: '3.3 MB',
  },
  {
    title: 'Robots de limpieza comercial 2026',
    detail: 'CC1, MT1, BG1, SH1 y accesorios, con especificaciones.',
    href: '/media/docs/pudu-robots-de-limpieza-2026.pdf',
    size: '8.5 MB',
  },
  {
    title: 'Ficha técnica BG1 Pro',
    detail: 'Fregadora-secadora con percepción 3D.',
    href: '/media/docs/pudu-bg1-pro-ficha-tecnica.pdf',
    size: '3.4 MB',
  },
  {
    title: 'Ficha técnica PuduBot 2',
    detail: 'Plataforma universal de entrega.',
    href: '/media/docs/pudu-pudubot-2-ficha-tecnica.pdf',
    size: '4.6 MB',
  },
];

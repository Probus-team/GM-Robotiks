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

/** A headline number for the robot page. Values are the manufacturer's. */
export interface KeyFigure {
  value: string;
  unit?: string;
  label: string;
}

export interface UseCase {
  title: string;
  detail: string;
}

export interface Robot {
  id: string;
  family: FamilyId;
  name: string;
  role: string;
  summary: string;
  specs: [string, string][];
  /** Exactly three, shown large on the robot page. */
  keyFigures: [KeyFigure, KeyFigure, KeyFigure];
  useCases: UseCase[];
  /** Case video in `cases` that shows this robot working. */
  caseId?: string;
  isNew?: boolean;
  doc?: string;
}
// Product cut-outs live in src/assets/robots/<id>.webp and scenes in
// src/assets/scenes/<id>.webp; src/lib/media.ts resolves them by id.

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
    keyFigures: [
      { value: '100–800', unit: 'm²', label: 'de área ideal por equipo' },
      { value: '85', unit: '°C', label: 'de agua caliente para fregar' },
      { value: '50', unit: 'cm', label: 'de paso mínimo entre anaqueles' },
    ],
    useCases: [
      { title: 'Tiendas y farmacias', detail: 'Friega pasillos angostos entre góndolas antes de abrir o después de cerrar.' },
      { title: 'Oficinas y recepciones', detail: 'Barre, friega y aspira pisos duros y alfombra en áreas comunes.' },
      { title: 'Restaurantes y cafeterías', detail: 'Quita grasa del salón con fregado de agua caliente y vuelve sola a su estación.' },
    ],
    caseId: 'et1',
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
    keyFigures: [
      { value: '700–1,000', unit: 'm²/h', label: 'de cobertura' },
      { value: '5–9', unit: 'h', label: 'de autonomía por carga' },
      { value: '15 + 15', unit: 'L', label: 'de tanque limpio y sucio' },
    ],
    useCases: [
      { title: 'Plantas de manufactura', detail: 'Friega pasillos de producción entre maquinaria y personal, como en el video de la planta electrónica.' },
      { title: 'Centros comerciales', detail: 'Pisos duros en áreas comunes y alfombra en zonas de descanso, con la misma máquina.' },
      { title: 'Hospitales y clínicas', detail: 'Pasillos y salas de espera en turnos nocturnos, con estación de agua opcional.' },
    ],
    caseId: 'cc1-factory',
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
    keyFigures: [
      { value: '700–1,000', unit: 'm²/h', label: 'de cobertura' },
      { value: '1,500–3,000', unit: 'm²/h', label: 'en modo puntual' },
      { value: '50', unit: 'Ah', label: 'de batería' },
    ],
    useCases: [
      { title: 'Retail con auditoría de limpieza', detail: 'La cámara trasera verifica cada pasada y el mapa de calor muestra dónde se ensucia más.' },
      { title: 'Edificios corporativos', detail: 'Limpieza puntual guiada por IA en vestíbulos y elevadores de mucho tránsito.' },
      { title: 'Hospitales', detail: 'Fregado verificable en pasillos donde la evidencia de limpieza importa.' },
    ],
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
    keyFigures: [
      { value: '1,800', unit: 'm²/h', label: 'de cobertura' },
      { value: '4–8', unit: 'h', label: 'de autonomía' },
      { value: '35', unit: 'L', label: 'de depósito' },
    ],
    useCases: [
      { title: 'Almacenes y centros de distribución', detail: 'Barre polvo, plástico y cartón en pasillos largos sin recorrer una ruta fija.' },
      { title: 'Naves industriales', detail: 'Concentra el barrido donde detecta residuos y deja limpias las zonas de paso.' },
      { title: 'Centros comerciales', detail: 'Barrido de explanadas interiores antes de la apertura.' },
    ],
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
    keyFigures: [
      { value: '2,200', unit: 'm²/h', label: 'de cobertura' },
      { value: '6.5–10', unit: 'h', label: 'de autonomía' },
      { value: 'IP54', label: 'de protección para semi-exterior' },
    ],
    useCases: [
      { title: 'Estacionamientos', detail: 'Cede el paso a vehículos y peatones mientras barre cajones y rampas.' },
      { title: 'Plazas y explanadas', detail: 'Zonas parcialmente exteriores con hojas, polvo y basura ligera.' },
      { title: 'Naves de techo alto', detail: 'Percepción 3D pensada para espacios amplios de techo alto.' },
    ],
    caseId: 'mt1max',
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
    keyFigures: [
      { value: '1,400', unit: 'm²/h', label: 'de cobertura' },
      { value: '3–6.5', unit: 'h', label: 'de autonomía' },
      { value: '14', unit: 'L', label: 'de bolsa' },
    ],
    useCases: [
      { title: 'Oficinas con alfombra', detail: 'Barre, aspira y pasa mopa seca en una sola ruta.' },
      { title: 'Bodegas con estantería', detail: 'Llega al polvo fino bajo anaqueles con su aspirado de 55 cm.' },
      { title: 'Áreas sensibles al polvo', detail: 'Filtración H11, con H13 opcional, para espacios que no toleran polvo suspendido.' },
    ],
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
    keyFigures: [
      { value: '2,000', unit: 'm²/h', label: 'de cobertura' },
      { value: '7.5', unit: 'h', label: 'de autonomía, como máximo' },
      { value: '75 + 60', unit: 'L', label: 'de agua limpia y sucia' },
    ],
    useCases: [
      { title: 'Naves y andenes', detail: 'Barre y friega en una pasada los pasillos anchos de carga y descarga.' },
      { title: 'Centros de distribución', detail: 'Dosifica el detergente sola en recorridos largos.' },
      { title: 'Supermercados de gran formato', detail: 'Fregado de pasillos amplios fuera del horario de venta.' },
    ],
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
    keyFigures: [
      { value: '550', unit: 'mm', label: 'de ancho de fregado' },
      { value: '7.5', unit: 'h', label: 'de autonomía' },
      { value: '≈3', unit: 'h', label: 'de carga' },
    ],
    useCases: [
      { title: 'Plantas con rutas cambiantes', detail: 'LiDAR 3D y VSLAM para pisos donde cambian tarimas, carros y estaciones.' },
      { title: 'Retail de gran formato', detail: 'Ajusta la intensidad de limpieza según la suciedad que detecta.' },
      { title: 'Terminales y vestíbulos', detail: 'Fregado industrial en espacios abiertos con tránsito constante.' },
    ],
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
    keyFigures: [
      { value: '1,100–1,600', unit: 'm²/h', label: 'de productividad' },
      { value: '27', unit: 'kg', label: 'de presión de fregado' },
      { value: '70–100', unit: 'min', label: 'de autonomía' },
    ],
    useCases: [
      { title: 'Orillas y esquinas', detail: 'El trabajo que un robot autónomo no alcanza, sin cambiar de máquina.' },
      { title: 'Escaleras y desniveles', detail: 'Fregado asistido donde no puede entrar una fregadora grande.' },
      { title: 'Manchas difíciles', detail: 'Cocinas, accesos y zonas de derrame que piden presión.' },
    ],
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
    keyFigures: [
      { value: '4', label: 'bandejas' },
      { value: '40', unit: 'kg', label: 'de carga' },
      { value: '11', unit: 'h', label: 'de autonomía' },
    ],
    useCases: [
      { title: 'Restaurantes', detail: 'Lleva platos a la mesa y regresa la loza, para que el mesero se quede con el cliente.' },
      { title: 'Hoteles', detail: 'Recibe huéspedes en recepción y los acompaña con voz y pantalla.' },
      { title: 'Salas de venta', detail: 'Muestra promociones en su pantalla de 18.5" mientras circula.' },
    ],
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
    keyFigures: [
      { value: '4', label: 'bandejas' },
      { value: '40', unit: 'kg', label: 'de carga' },
      { value: '13', unit: 'h', label: 'de autonomía' },
    ],
    useCases: [
      { title: 'Restaurantes', detail: 'Reparte comida y recoge loza en salones con mesas cercanas.' },
      { title: 'Banquetes y eventos', detail: 'Sirve en ciclos repetidos durante todo el servicio.' },
      { title: 'Comedores corporativos', detail: 'Mueve charolas entre cocina y salón en horas pico.' },
    ],
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
    keyFigures: [
      { value: '3', label: 'bandejas' },
      { value: '40', unit: 'kg', label: 'de carga' },
      { value: '15', unit: 'h', label: 'de autonomía' },
    ],
    useCases: [
      { title: 'Comedores industriales', detail: 'Lleva y trae charolas entre cocina y salón en cada turno.' },
      { title: 'Laboratorios', detail: 'Mueve muestras y modelos entre estaciones, como en Shaw Lab Group.' },
      { title: 'Hospitales', detail: 'Reparte insumos entre áreas sin que el personal deje su puesto.' },
    ],
    caseId: 'pudubot2',
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
    keyFigures: [
      { value: '30', unit: 'kg', label: 'de carga' },
      { value: '11', unit: 'h', label: 'de autonomía' },
      { value: '52', unit: 'cm', label: 'de paso mínimo' },
    ],
    useCases: [
      { title: 'Cafeterías y restaurantes compactos', detail: 'Pasa entre mesas a 52 cm y entrega en cada una.' },
      { title: 'Recepción', detail: 'Recibe a los clientes y los guía a su mesa.' },
      { title: 'Retail', detail: 'Muestra publicidad en su pantalla vertical mientras recorre el piso.' },
    ],
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
    keyFigures: [
      { value: '20', unit: 'kg', label: 'de carga' },
      { value: '1–2', label: 'compartimentos con llave digital' },
      { value: '9', unit: 'h', label: 'de autonomía' },
    ],
    useCases: [
      { title: 'Hoteles', detail: 'Servicio a cuartos entre pisos, con elevador y llave digital.' },
      { title: 'Hospitales', detail: 'Medicamentos y muestras en compartimento cerrado.' },
      { title: 'Oficinas', detail: 'Paquetería interna entre pisos y áreas de acceso controlado.' },
    ],
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
    keyFigures: [
      { value: '300', unit: 'kg', label: 'de carga' },
      { value: '1.2', unit: 'm/s', label: 'de velocidad' },
      { value: '8', unit: 'h', label: 'de autonomía a plena carga' },
    ],
    useCases: [
      { title: 'Abasto de línea', detail: 'Lleva material a cada estación sin que el operador deje la línea.' },
      { title: 'Producto terminado', detail: 'Retira cajas de la línea al almacén en ciclos programados.' },
      { title: 'Almacenes', detail: 'Módulos de bandejas, elevación, remolque o transportador según la carga.' },
    ],
    caseId: 't300',
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
    keyFigures: [
      { value: '600', unit: 'kg', label: 'de carga' },
      { value: '12', unit: 'h', label: 'de autonomía' },
      { value: '2', unit: 'h', label: 'de carga de 0 a 90 %' },
    ],
    useCases: [
      { title: 'Carga pesada entre estaciones', detail: 'Versión alta para carros y racks de hasta 600 kg.' },
      { title: 'Bajo carros (Underride)', detail: 'La plataforma baja entra bajo el carro y lo levanta.' },
      { title: 'Integración con tu flota', detail: 'Habla VDA5050 con tu sistema de gestión de flota.' },
    ],
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
    keyFigures: [
      { value: '2,000', unit: 'kg', label: 'por tarima' },
      { value: '6', unit: 'h', label: 'de autonomía cargado' },
      { value: '2.0', unit: 'm', label: 'de pasillo mínimo' },
    ],
    useCases: [
      { title: 'Almacenes', detail: 'Mueve tarimas entre racks y piso sin operador de montacargas.' },
      { title: 'Recepción y embarque', detail: 'Lleva tarimas del andén a su ubicación.' },
      { title: 'Pasillos angostos', detail: 'Toma tarimas en ángulo recto en pasillos de 2 m.' },
    ],
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
    keyFigures: [
      { value: '1', unit: 'pasada', label: 'para cortar y recoger' },
      { value: '2', unit: 'h', label: 'de carga con cargador de 6 kW' },
      { value: 'Auto', label: 'vaciado de tolva y mapeo' },
    ],
    useCases: [
      { title: 'Jardines corporativos', detail: 'Corta y recoge el pasto en una sola pasada.' },
      { title: 'Fraccionamientos', detail: 'Corte programado de áreas verdes comunes.' },
      { title: 'Escuelas', detail: 'Corte fuera del horario de clases, con vaciado automático.' },
    ],
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
    keyFigures: [
      { value: '10', unit: 'h', label: 'de autonomía' },
      { value: '16', unit: 'acres', label: 'por carga' },
      { value: '11', unit: 'km/h', label: 'de velocidad máxima' },
    ],
    useCases: [
      { title: 'Parques industriales', detail: 'Grandes superficies con tránsito autónomo entre zonas.' },
      { title: 'Campus', detail: 'Corte antes de que llegue la gente, con percepción 360°.' },
      { title: 'Áreas verdes comerciales', detail: 'Corta hasta 5 cm del borde.' },
    ],
    caseId: 'gt5',
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
    keyFigures: [
      { value: '10–12', unit: 'h', label: 'de autonomía' },
      { value: '30', unit: '°', label: 'de pendiente máxima' },
      { value: '4WD', label: 'de tracción' },
    ],
    useCases: [
      { title: 'Campos deportivos', detail: 'Cabezales helicoidales y control de patrones de corte.' },
      { title: 'Campus', detail: 'Terreno irregular con cabezales flotantes que siguen el suelo.' },
      { title: 'Taludes', detail: 'Tracción 4x4 en pendientes de hasta 30°.' },
    ],
    isNew: true,
  },
];

// Every clip is Pudu Robotics' own footage. `kind` says whether it was shot
// at a customer site (deployment) or produced as a product video (promo).
export interface CaseVideo {
  id: string;
  title: string;
  where: string;
  kind: 'deployment' | 'promo';
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
    where: 'Planta de manufactura · China',
    kind: 'deployment',
    src: '/media/cases/cc1-factory.mp4',
    poster: '/media/cases/cc1-factory-poster.webp',
    robots: ['CC1'],
    minutes: '0:43',
    featured: true,
  },
  {
    id: 'et1',
    title: 'ET1: presentación oficial',
    where: 'Video de producto',
    kind: 'promo',
    src: '/media/cases/et1.mp4',
    poster: '/media/cases/et1-poster.webp',
    robots: ['ET1'],
    minutes: '1:52',
    featured: true,
  },
  {
    id: 'mt1max',
    title: 'MT1 Max en estacionamiento',
    where: 'Video de producto · semi-exterior',
    kind: 'promo',
    src: '/media/cases/mt1max.mp4',
    poster: '/media/cases/mt1max-poster.webp',
    robots: ['MT1 Max'],
    minutes: '0:36',
  },
  {
    id: 't300',
    title: 'PuduBot 2, CC1 y T300 en una misma planta',
    where: 'Planta de manufactura · China',
    kind: 'deployment',
    src: '/media/cases/t300.mp4',
    poster: '/media/cases/t300-poster.webp',
    robots: ['T300', 'CC1', 'PuduBot 2'],
    minutes: '1:24',
  },
  {
    id: 'pudubot2',
    title: 'PuduBot 2 en laboratorio',
    where: 'Shaw Lab Group · Canadá',
    kind: 'deployment',
    src: '/media/cases/pudubot2.mp4',
    poster: '/media/cases/pudubot2-poster.webp',
    robots: ['PuduBot 2'],
    minutes: '0:28',
  },
  {
    id: 'gt5',
    title: 'GT5: corte y recolección',
    where: 'Video de producto',
    kind: 'promo',
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

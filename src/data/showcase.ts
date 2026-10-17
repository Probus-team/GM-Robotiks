// Full-screen media panels on the home page, one per robot line.
// Loops are short, muted cuts of Pudu's 1080p case films, built into
// public/media/loops by scripts/build-videos.sh. Exteriores uses a still because every
// GT5 shot carries burned-in captions.
import type { FamilyId } from './robots';

export interface Panel {
  family: FamilyId;
  kicker: string;
  title: string;
  detail: string;
  /** The one figure worth remembering for this line, from Pudu's spec sheets. */
  figure: string;
  figureLabel: string;
  /** Robot the figure belongs to; the figure links to its page. */
  figureRobot: string;
  /** Images are scene ids in src/assets/scenes. */
  /** Videos are H.264 with an AV1 twin (scripts/build-videos.sh). */
  media: { type: 'video'; src: string; av1: string; poster: string } | { type: 'image'; scene: string };
  credit: string;
}

export const panels: Panel[] = [
  {
    family: 'limpieza',
    kicker: 'Limpieza',
    title: 'Friega la planta mientras la planta produce.',
    detail:
      'CC1, MT1, ET1 y BG1 barren, friegan y aspiran entre maquinaria y personal, y vuelven solos a su estación.',
    figure: '2,000',
    figureLabel: 'm² por hora con la BG1, según Pudu',
    figureRobot: 'bg1',
    media: { type: 'video', src: '/media/loops/limpieza-h264.mp4', av1: '/media/loops/limpieza-av1.mp4', poster: '/media/loops/limpieza-poster.webp' },
    credit: 'CC1 en una planta electrónica · video de Pudu Robotics',
  },
  {
    family: 'entrega',
    kicker: 'Entrega y servicio',
    title: 'Cuarenta kilos de ida y vuelta, todo el turno.',
    detail:
      'BellaBot, PuduBot 2, KettyBot y FlashBot reparten en comedores, laboratorios, hoteles y pisos de venta.',
    figure: '15 h',
    figureLabel: 'de autonomía de la PuduBot 2, según Pudu',
    figureRobot: 'pudubot-2',
    media: { type: 'video', src: '/media/loops/entrega-h264.mp4', av1: '/media/loops/entrega-av1.mp4', poster: '/media/loops/entrega-poster.webp' },
    credit: 'PuduBot 2 en Shaw Lab Group, Canadá · video de Pudu Robotics',
  },
  {
    family: 'logistica',
    kicker: 'Logística',
    title: 'Del almacén a la línea sin montacargas.',
    detail:
      'T300, T600 y MP2000 mueven materiales entre estaciones y hablan VDA5050 con tu sistema de flota.',
    figure: '2,000 kg',
    figureLabel: 'por tarima con el MP2000, según Pudu',
    figureRobot: 'mp2000',
    media: { type: 'video', src: '/media/loops/logistica-h264.mp4', av1: '/media/loops/logistica-av1.mp4', poster: '/media/loops/logistica-poster.webp' },
    credit: 'T300 en una planta de manufactura · video de Pudu Robotics',
  },
  {
    family: 'exteriores',
    kicker: 'Exteriores',
    title: 'Corta el césped del campus antes de que llegue la gente.',
    detail:
      'GT3, GT5 y GT7 mapean solos, recogen lo cortado y cruzan de una zona a otra sin operador.',
    figure: '16 acres',
    figureLabel: 'por carga con el GT5, según Pudu',
    figureRobot: 'gt5',
    media: { type: 'image', scene: 'gt5' },
    credit: 'GT5 · imagen de Pudu Robotics',
  },
];

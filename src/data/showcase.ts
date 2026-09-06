// Full-screen media panels on the home page, one per robot line.
// Loops are short, muted cuts of the case footage in public/media/cases,
// re-encoded in public/media/loops. Exteriores uses a still because every
// GT5 shot carries burned-in captions.
import type { FamilyId } from './robots';

export interface Panel {
  family: FamilyId;
  kicker: string;
  title: string;
  detail: string;
  /** The one figure worth remembering for this line. */
  figure: string;
  figureLabel: string;
  media: { type: 'video'; src: string; poster: string } | { type: 'image'; src: string };
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
    figureLabel: 'm² por hora, BG1',
    media: { type: 'video', src: '/media/loops/limpieza.mp4', poster: '/media/loops/limpieza-poster.webp' },
    credit: 'CC1 en planta electrónica',
  },
  {
    family: 'entrega',
    kicker: 'Entrega y servicio',
    title: 'Cuarenta kilos de ida y vuelta, todo el turno.',
    detail:
      'BellaBot, PuduBot 2, KettyBot y FlashBot reparten en comedores, laboratorios, hoteles y pisos de venta.',
    figure: '15 h',
    figureLabel: 'de autonomía, PuduBot 2',
    media: { type: 'video', src: '/media/loops/entrega.mp4', poster: '/media/loops/entrega-poster.webp' },
    credit: 'PuduBot 2 en Shaw Lab Group',
  },
  {
    family: 'logistica',
    kicker: 'Logística',
    title: 'Del almacén a la línea sin montacargas.',
    detail:
      'T300, T600 y MP2000 mueven materiales entre estaciones y hablan VDA5050 con tu sistema de flota.',
    figure: '2,000 kg',
    figureLabel: 'por tarima, MP2000',
    media: { type: 'video', src: '/media/loops/logistica.mp4', poster: '/media/loops/logistica-poster.webp' },
    credit: 'T300 en manufactura',
  },
  {
    family: 'exteriores',
    kicker: 'Exteriores',
    title: 'Corta el césped del campus antes de que llegue la gente.',
    detail:
      'GT3, GT5 y GT7 mapean solos, recogen lo cortado y cruzan de una zona a otra sin operador.',
    figure: '16 acres',
    figureLabel: 'por carga, GT5',
    media: { type: 'image', src: '/media/hero/gt5-field.webp' },
    credit: 'GT5',
  },
];

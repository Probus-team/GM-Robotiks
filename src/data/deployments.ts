// Robots already working for GM Robotiks clients in Mexico. Publish an entry
// only with the client's written permission and with our own photos from the
// site; the numbers must come from the client's pilot, not from Pudu.
//
// While this list is empty, the home page shows marked slots on preview and
// local hosts only (see Proof.astro); production hides them.
import type { ImageMetadata } from 'astro';

export interface Deployment {
  client: string;
  /** Show the client's logo only with permission. */
  logo?: ImageMetadata;
  city: string;
  sector: string;
  /** Robot ids from src/data/robots.ts. */
  robots: string[];
  /** Month the robots started working, e.g. "marzo 2026". */
  since: string;
  photo: ImageMetadata;
  photoAlt: string;
  /** One number measured in the client's pilot, signed off by the client. */
  metric?: { value: string; label: string };
  quote?: { text: string; person: string; role: string };
}

export const deployments: Deployment[] = [];

/** What we need from each client to fill one slot. */
export const slotChecklist = [
  'Foto del robot trabajando en el sitio (horizontal, 2000 px o más)',
  'Nombre del cliente, ciudad y giro, con permiso por escrito',
  'Robots y mes en que empezaron a trabajar',
  'Un número medido en el piloto (m² por turno, viajes, horas liberadas)',
  'Opcional: una cita con nombre y puesto, y el logo',
];

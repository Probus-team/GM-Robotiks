import type { APIRoute } from 'astro';
import { site as company } from '../data/site';
import { families, robots } from '../data/robots';

// An optional navigation aid for agents, not a search-engine ranking directive.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('A canonical site URL is required to generate llms.txt.');
  const url = (path: string) => new URL(path, site).href;
  const content = `# ${company.name}

> ${company.description}

## Páginas oficiales

- [Inicio](${url('/')}): integración de robots Pudu en México, casos de uso y proceso de trabajo.
- [Catálogo](${url('/robots/')}): ${robots.length} modelos, aplicaciones, especificaciones del fabricante y fichas técnicas disponibles.
- [Cómo trabajamos](${url('/#proceso')}): diagnóstico en sitio, piloto medido, despliegue, capacitación, soporte y refacciones.
- [Contacto](${url('/#contacto')}): solicitar una demostración o cotización para la instalación.

## Líneas de robots

${families.map((family) => `- ${family.name}: ${family.short}. ${family.where}`).join('\n')}

## Modelos

${robots.map((robot) => `- [${robot.name}](${url(`/robots/#${robot.id}`)}): ${robot.role}.`).join('\n')}

## Contacto comercial

- Correo: ${company.contact.email}
- WhatsApp: https://wa.me/${company.contact.whatsapp}
- Cobertura: México.

Las especificaciones del catálogo son datos del fabricante; el rendimiento se mide durante el piloto en el sitio del cliente. Para precios y selección de modelo, solicitar diagnóstico y cotización.
`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

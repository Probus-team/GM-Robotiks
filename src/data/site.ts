// Site-wide constants. Components hide contact channels that are not configured.
export const site = {
  name: 'GM Robotics IA',
  shortName: 'GM Robotics',
  tagline: 'Robots de servicio Pudu para México',
  description:
    'GM Robotics IA integra robots Pudu de limpieza, entrega, logística y exteriores en México: diagnóstico en sitio, piloto medido, despliegue y soporte local.',
  locale: 'es_MX',
  contact: {
    email: 'info@gmrobotiks.com',
    whatsapp: '523319566711', // E.164 digits only, without the leading +
    formEndpoint: '', // POST endpoint for the contact form (Formspree, own API, etc.)
  },
  nav: [
    { href: '#robots', label: 'Robots' },
    { href: '#casos', label: 'En operación' },
    { href: '#proceso', label: 'Cómo trabajamos' },
    { href: '#documentos', label: 'Fichas técnicas' },
  ],
};

// Who answers for personal data at GM Robotiks IA, shared by the legal pages.
// Meta's app settings (WhatsApp Business Platform) link to these pages.
// No imports, so node:test can load it directly.
export const legal = {
  company: 'GM Robotiks IA',
  address: 'Av. López Mateos Norte 400, piso 14, Col. Ladrón de Guevara, C.P. 44600, Guadalajara, Jalisco, México',
  /** Privacy, ARCO and deletion requests. */
  email: 'info@gmrobotiks.com',
  /** Date of the current version of the three documents. */
  updated: '31 de octubre de 2026',
};

export const legalPages = [
  { path: '/privacidad/', label: 'Aviso de privacidad', title: 'Aviso de privacidad · GM Robotiks IA' },
  { path: '/terminos/', label: 'Términos del servicio', title: 'Términos del servicio · GM Robotiks IA' },
  { path: '/eliminacion-de-datos/', label: 'Eliminación de datos', title: 'Eliminación de datos · GM Robotiks IA' },
] as const;

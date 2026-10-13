// Lowercase the first letter so a label can follow a colon or comma, but keep
// acronyms and model names intact: "AMR de carga pesada" stays as is,
// "Fregadora-secadora compacta con IA" becomes "fregadora-secadora compacta con IA".
export function midSentence(label: string): string {
  const first = label.split(/[\s-]/)[0];
  if (first.length > 1 && first === first.toUpperCase()) return label;
  return label.charAt(0).toLowerCase() + label.slice(1);
}

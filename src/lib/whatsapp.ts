// WhatsApp links with a message already written, so a visitor only presses send.
// Only relative .ts imports, so the tests can load this file directly.
import { midSentence } from './text.ts';

export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

interface QuotedRobot {
  name: string;
  role: string;
}

export function robotQuoteMessage(robot: QuotedRobot, pageUrl: string): string {
  return [
    `Hola, GM Robotiks. Me interesa cotizar el ${robot.name} (${midSentence(robot.role)}).`,
    '¿Podemos agendar una demo en mi operación?',
    `Lo vi en ${pageUrl}`,
  ].join('\n');
}

export function robotQuoteUrl(number: string, robot: QuotedRobot, pageUrl: string): string {
  return whatsappUrl(number, robotQuoteMessage(robot, pageUrl));
}

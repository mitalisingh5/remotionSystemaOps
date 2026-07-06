import { z } from 'zod';

// Define the edit command schema
const EditCommand = z.object({
  intent: z.enum(['trim', 'cut', 'caption', 'speed', 'highlight', 'concat']),
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  speed: z.number().optional(),
  text: z.string().optional(),
});

export interface ParsedCommand {
  intent: string;
  startTime?: number;
  endTime?: number;
  speed?: number;
  text?: string;
}

export function parseCommand(command: string): ParsedCommand {
  // Simple keyword-based parsing
  // Could be enhanced with NLP/LLM for better understanding
  const lowerCommand = command.toLowerCase();

  let intent = 'highlight';
  let startTime: number | undefined;
  let endTime: number | undefined;
  let speed: number | undefined;

  // Detect intent
  if (lowerCommand.includes('cut') || lowerCommand.includes('remove')) {
    intent = 'cut';
  } else if (lowerCommand.includes('trim')) {
    intent = 'trim';
  } else if (lowerCommand.includes('caption') || lowerCommand.includes('add text')) {
    intent = 'caption';
  } else if (lowerCommand.includes('speed') || lowerCommand.includes('fast') || lowerCommand.includes('slow')) {
    intent = 'speed';
    speed = lowerCommand.includes('fast') || lowerCommand.includes('faster') ? 1.5 : 0.75;
  }

  // Extract time values (simple regex matching)
  const timeRegex = /(\d+)\s*(?:seconds?|min|minute)/gi;
  const timeMatches = command.match(timeRegex);
  if (timeMatches && timeMatches.length > 0) {
    startTime = parseInt(timeMatches[0]) || 0;
    if (timeMatches.length > 1) {
      endTime = parseInt(timeMatches[1]) || undefined;
    }
  }

  return { intent, startTime, endTime, speed, text: command };
}

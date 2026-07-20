import { z } from 'zod';

// Define the edit command schema
const EditCommand = z.object({
  intent: z.enum(['trim',
    'cut',
    'caption',
    'speed',
    'highlight',
    'concat',
    'watermark',
    'audio',
    'subtitle']),
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
  const text = command.toLowerCase();

  let intent = "highlight";
  let startTime: number | undefined;
  let endTime: number | undefined;
  let speed: number | undefined;

  // CUT
  if (
    text.includes("cut") ||
    text.includes("remove")
  ) {
    intent = "cut";
  }

  // TRIM
  if (text.includes("trim")) {
    intent = "trim";
  }

  // CAPTION
  if (text.includes("caption") || text.includes("add text")) {
    intent = "caption";
  }

  // SPEED
  if (
    text.includes("speed") ||
    text.includes("fast") ||
    text.includes("slow")
  ) {
    intent = "speed";

    const speedMatch = text.match(
      /(\d+(\.\d+)?)x/
    );

    if (speedMatch) {
      speed = parseFloat(speedMatch[1]);
    } else if (
      text.includes("fast") ||
      text.includes("faster")
    ) {
      speed = 2;
    } else if (
      text.includes("slow") ||
      text.includes("slower")
    ) {
      speed = 0.5;
    }
  }
  // WATERMARK
if (
  text.includes("watermark")
) {
  intent = "watermark";
}

  // Extract all numbers
  const numbers = text.match(/\d+/g);

  if (numbers) {
    if (numbers.length >= 1) {
      startTime = parseInt(numbers[0]);
    }

    if (numbers.length >= 2) {
      endTime = parseInt(numbers[1]);
    }
  }
  // AUDIO EXTRACTION
if (
  text.includes("extract audio") ||
  text.includes("audio only") ||
  text.includes("convert to mp3")
) {
  intent = "audio";
}
if (
  text.includes("subtitle") ||
  text.includes("captions") ||
  text.includes("generate subtitles") ||
  text.includes("transcript") ||
  text.includes(".vtt") ||
  text.includes(".json")
) {
  intent = "subtitle";
}

  return {
    intent,
    startTime,
    endTime,
    speed,
    text: command,
  };
}

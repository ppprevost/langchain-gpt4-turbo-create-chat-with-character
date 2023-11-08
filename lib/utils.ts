import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export const actualMood = (mood?: string) => {
  const moods = [
    'very angry',
    'irritated',
    'frustrated',
    'annoyed',
    'agitated',
    'discontented',
    'disheartened',
    'indifferent',
    'calm',
    'satisfied',
    'content',
    'happy',
    'fulfilled',
    'joyful',
    'enthusiastic',
    'excited',
    'euphoric',
    'ecstatic',
    'overjoyed',
    'excited beyond words',
  ];
  if (mood === '100') {
    return moods[moods.length - 1];
  }
  const index = (moods.length * Number(mood)) / 100;
  return moods[index];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
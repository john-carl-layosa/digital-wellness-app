// Rotating "Today's Reminder" copy shown on Home. Purely client-side —
// no backend required, and safe to expand with more lines any time.
export const REMINDERS: string[] = [
  "It's okay to take a break. You're still doing enough.",
  "Give yourself permission to slow down today.",
  "Small steps still move you forward.",
  "You don't have to have everything figured out today.",
  "You can't pour from an empty cup. Take a pause.",
  "Your feelings are valid, even on a busy shift.",
  "Rest is productive too.",
  "One song, one breath, one moment — that's enough for now.",
  "You showed up today. That matters more than you know.",
  "Healing — yours included — doesn't happen on a deadline.",
  "You are allowed to protect your peace, even for five minutes.",
  "Every shift you get through is proof of your strength.",
  "You don't have to earn rest. You already have.",
  "The care you give others starts with the care you give yourself.",
  "It's okay to not be okay right now. This moment will pass.",
  "You're not behind. You're exactly where you need to be.",
  "Breathe. You've survived every hard day so far.",
  "Being tired doesn't mean you're failing — it means you've been trying.",
  "You matter beyond what you do for others.",
  "A pause isn't a setback. It's part of the work.",
  "You're allowed to ask for help. That's not weakness.",
  "Progress can be quiet. It still counts.",
  "You've made it through 100% of your hardest days.",
  "Kindness to yourself is not optional — it's necessary.",
  "This moment of quiet is yours. No apology needed.",
  "You bring comfort to others. Let this be a moment that comforts you.",
  "Even the strongest hands need to set something down sometimes.",
  "You are more than today's to-do list.",
  "Softness is not the opposite of strength.",
  "Tomorrow can wait a few more minutes. Stay here for now.",
];

const STORAGE_KEY = "rhythms-of-relief:last-reminder";

/**
 * Picks a reminder that's different from the last one shown this session,
 * so refreshing the page feels alive rather than static.
 */
export function pickReminder(): string {
  if (REMINDERS.length <= 1) return REMINDERS[0] ?? "";

  let last: string | null = null;
  try {
    last = window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // sessionStorage unavailable — fall through to a plain random pick
  }

  let next = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
  let guard = 0;
  while (next === last && guard < 10) {
    next = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
    guard += 1;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }

  return next;
}
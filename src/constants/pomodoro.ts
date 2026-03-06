import type { PomodoroSettings } from '@/types/pomodoro'

export const DEFAULT_SETTINGS: PomodoroSettings = {
  durations: {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },
  longBreakEvery: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
}

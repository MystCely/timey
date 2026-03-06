export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface PomodoroDurations {
  focus: number
  shortBreak: number
  longBreak: number
}

export interface PomodoroSettings {
  durations: PomodoroDurations
  longBreakEvery: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
}

export interface PomodoroState {
  mode: TimerMode
  status: TimerStatus
  remainingSeconds: number
  completedFocusSessions: number
}

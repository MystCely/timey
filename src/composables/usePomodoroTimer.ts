import type { PomodoroSettings, TimerMode, TimerStatus } from '@/types/pomodoro'
import { DEFAULT_SETTINGS } from '@/constants/pomodoro'
import { computed, ref } from 'vue'

export function usePomodoroTimer(settings: PomodoroSettings = DEFAULT_SETTINGS) {
  const mode = ref<TimerMode>('focus')
  const status = ref<TimerStatus>('idle')
  const remainingSeconds = ref(settings.durations.focus)
  const completedFocusSessions = ref(0)

  const intervalId = ref<number | null>(null)
  const startedAtMs = ref<number | null>(null)
  const baseRemainingSeconds = ref(remainingSeconds.value)

  const totalSecondsForCurrentMode = computed(() => settings.durations[mode.value])

  const progressPercent = computed(() => {
    const total = totalSecondsForCurrentMode.value
    if (total === 0) return 0
    return ((total - remainingSeconds.value) / total) * 100
  })

  const isRunning = computed(() => status.value === 'running')

  function start(): void {
    if (status.value !== 'idle') return
    status.value = 'running'
    startedAtMs.value = Date.now()
    baseRemainingSeconds.value = remainingSeconds.value
    intervalId.value = setInterval(syncRemainingTime, 250)
  }

  function pause(): void {
    if (status.value !== 'running') return
    syncRemainingTime()
    status.value = 'paused'
    stopTicking()
  }

  function resume(): void {
    if (status.value !== 'paused') return
    status.value = 'running'
    startedAtMs.value = Date.now()
    baseRemainingSeconds.value = remainingSeconds.value
    intervalId.value = setInterval(syncRemainingTime, 250)
  }

  function reset(): void {
    stopTicking()
    status.value = 'idle'
    remainingSeconds.value = settings.durations[mode.value]

    startedAtMs.value = null
    baseRemainingSeconds.value = remainingSeconds.value
  }

  function skip(): void {
    if (status.value === 'idle') return
    handleSessionComplete()
  }

  function setMode(nextMode: TimerMode): void {
    stopTicking()
    mode.value = nextMode
    status.value = 'idle'
    remainingSeconds.value = settings.durations[nextMode]

    startedAtMs.value = null
    baseRemainingSeconds.value = remainingSeconds.value
  }

  function stopTicking(): void {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    intervalId.value = null
  }

  function syncRemainingTime(): void {
    if (startedAtMs.value === null) return
    const elapsedSeconds = Math.floor((Date.now() - startedAtMs.value) / 1000)
    const nextRemaining = Math.max(baseRemainingSeconds.value - elapsedSeconds, 0)

    remainingSeconds.value = nextRemaining
    if (nextRemaining === 0) {
      handleSessionComplete()
    }
  }

  function getNextMode(currentMode: TimerMode): TimerMode {
    if (currentMode === 'focus') {
      completedFocusSessions.value++
      const isLongBreakTurn = completedFocusSessions.value % settings.longBreakEvery === 0
      return isLongBreakTurn ? 'longBreak' : 'shortBreak'
    }
    return 'focus'
  }

  function applyMode(nextMode: TimerMode): void {
    mode.value = nextMode
    remainingSeconds.value = settings.durations[nextMode]
    startedAtMs.value = null
    baseRemainingSeconds.value = remainingSeconds.value
  }

  function handleSessionComplete(): void {
    stopTicking()
    const nextMode = getNextMode(mode.value)
    applyMode(nextMode)

    const isBreakMode = nextMode === 'shortBreak' || nextMode === 'longBreak'
    const shouldAutoStart =
      (isBreakMode && settings.autoStartBreaks) || (nextMode === 'focus' && settings.autoStartFocus)

    if (!shouldAutoStart) {
      status.value = 'idle'
      return
    }

    status.value = 'running'
    startedAtMs.value = Date.now()
    baseRemainingSeconds.value = remainingSeconds.value
    intervalId.value = setInterval(syncRemainingTime, 250)
  }

  return {
    mode,
    status,
    remainingSeconds,
    completedFocusSessions,
    totalSecondsForCurrentMode,
    progressPercent,
    isRunning,
    start,
    pause,
    resume,
    reset,
    skip,
    setMode,
  }
}

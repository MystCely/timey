import type { PomodoroSettings, TimerMode, TimerStatus } from '@/types/pomodoro'
import { DEFAULT_SETTINGS } from '@/constants/pomodoro'
import { computed, ref } from 'vue'

export function usePomodoroTimer(settings: PomodoroSettings = DEFAULT_SETTINGS) {
  const mode = ref<TimerMode>('focus')
  const status = ref<TimerStatus>('idle')
  const remainingSeconds = ref(settings.durations.focus)
  const completedFocusSessions = ref(0)

  const totalSecondsForCurrentMode = computed(() => settings.durations[mode.value])

  const progressPercent = computed(() => {
    const total = totalSecondsForCurrentMode.value
    if (total === 0) return 0
    return ((total - remainingSeconds.value) / total) * 100
  })

  const isRunning = computed(() => status.value === 'running')

  function start() {
    if (status.value !== 'idle') return
    status.value = 'running'
  }

  function pause() {
    if (status.value !== 'running') return
    status.value = 'paused'
  }

  function resume() {
    if (status.value !== 'paused') return
    status.value = 'running'
  }

  function reset() {
    status.value = 'idle'
    remainingSeconds.value = settings.durations[mode.value]
  }

  function skip() {
    // TODO: plan toimplement next
  }

  function setMode(nextMode: TimerMode) {
    mode.value = nextMode
    status.value = 'idle'
    remainingSeconds.value = settings.durations[nextMode]
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

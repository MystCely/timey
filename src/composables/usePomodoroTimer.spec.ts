import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePomodoroTimer } from './usePomodoroTimer'
import type { PomodoroSettings } from '@/types/pomodoro'

afterEach(() => {
  vi.useRealTimers()
})

describe('usePomodoroTimer', () => {
  it('start() changes status from idle to running', () => {
    const timer = usePomodoroTimer()
    expect(timer.status.value).toBe('idle')

    timer.start()
    expect(timer.status.value).toBe('running')
  })

  it('pause() changes status from running to paused', () => {
    const timer = usePomodoroTimer()

    timer.start()
    expect(timer.status.value).toBe('running')

    timer.pause()
    expect(timer.status.value).toBe('paused')
  })

  it('resume() changes status from paused to running', () => {
    const timer = usePomodoroTimer()

    timer.start()
    timer.pause()
    expect(timer.status.value).toBe('paused')

    timer.resume()
    expect(timer.status.value).toBe('running')
  })

  it('completing a focus session moves to short break and increments completed sessions', () => {
    vi.useFakeTimers()

    const settings: PomodoroSettings = {
      durations: {
        focus: 2,
        shortBreak: 3,
        longBreak: 4,
      },
      longBreakEvery: 4,
      autoStartBreaks: false,
      autoStartFocus: false,
    }

    const timer = usePomodoroTimer(settings)
    timer.start()
    vi.advanceTimersByTime(2500)

    expect(timer.mode.value).toBe('shortBreak')
    expect(timer.completedFocusSessions.value).toBe(1)
    expect(timer.status.value).toBe('idle')
    expect(timer.remainingSeconds.value).toBe(3)
  })

  it('skip() changes status from running to short break and increments completed sessions', () => {
    const timer = usePomodoroTimer()
    timer.start()
    expect(timer.status.value).toBe('running')
    expect(timer.mode.value).toBe('focus')

    timer.skip()
    expect(timer.mode.value).toBe('shortBreak')
    expect(timer.completedFocusSessions.value).toBe(1)
    expect(timer.status.value).toBe('idle')
    expect(timer.remainingSeconds.value).toBe(300)
  })
})

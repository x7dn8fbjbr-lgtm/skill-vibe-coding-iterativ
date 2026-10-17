// Was in .vibe/state.json eines Vibe-Projekts steht (vom Skill gepflegt).
export type VibePhase =
  | 'idee'
  | 'prototyp'
  | 'iteration'
  | 'echt'
  | 'politur'
  | 'release'
  | 'live'

export type VibeState = {
  projekt: string
  ziel?: string
  stack?: string
  phase: VibePhase
  iteration: number
  vorschau?: string
  offen?: string[]
}

declare module 'claude-code' {
  interface PluginState {
    vibe: {
      state: VibeState | null
      checkpoint: string | null
    }
  }
}

declare module 'claude-code' {
  interface PluginState {
    clipring: { clips: string[]; selected: number }
  }
}

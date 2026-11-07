import type { Scene } from './storyboard'

export type Project = { id: string; title: string; prompt: string; updatedAt: string; scenes: Scene[] }

const KEY = 'motion-graphics-generator.projects.v1'

export function loadProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') as Project[] }
  catch { return [] }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(projects))
}
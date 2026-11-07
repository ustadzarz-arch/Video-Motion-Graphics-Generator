export type Scene = {
  id: string
  title: string
  duration: number
  visual: string
  narration: string
  camera: string
  lighting: string
  subtitle: string
  sfx: string
  transition: string
}

export function makeStoryboard(prompt: string): Scene[] {
  const subject = prompt.trim() || 'Perjalanan sebuah gagasan'
  return [
    { id: crypto.randomUUID(), title: 'Pembuka', duration: 5, visual: `Establishing shot sinematik untuk ${subject}. Perkenalkan suasana dan skala.`, narration: 'Setiap kisah besar selalu dimulai dari sesuatu yang sederhana.', camera: 'Slow cinematic push-in', lighting: 'Soft volumetric light', subtitle: 'Semuanya bermula dari sini', sfx: 'Deep airy whoosh', transition: 'Fade in' },
    { id: crypto.randomUUID(), title: 'Awal proses', duration: 7, visual: `Tampilkan tahap awal ${subject} dengan detail yang jelas dan gerakan yang terasa nyata.`, narration: 'Perlahan, proses mulai terbentuk. Setiap perubahan membawa kita ke tahap berikutnya.', camera: 'Macro tracking shot', lighting: 'Directional key light', subtitle: 'Proses mulai terbentuk', sfx: 'Subtle texture and movement', transition: 'Match cut' },
    { id: crypto.randomUUID(), title: 'Perkembangan', duration: 8, visual: `Perlihatkan perkembangan ${subject}; tambahkan kedalaman, partikel, dan perubahan skala.`, narration: 'Waktu, energi, dan berbagai proses saling berinteraksi membentuk sesuatu yang lebih besar.', camera: 'Orbit shot with gradual pull-back', lighting: 'Cinematic contrast with rim light', subtitle: 'Dari kecil menjadi luar biasa', sfx: 'Rising cinematic swell', transition: 'Light sweep' },
    { id: crypto.randomUUID(), title: 'Hasil akhir', duration: 6, visual: `Reveal hasil akhir ${subject} dalam komposisi megah, lalu tahan pada hero shot.`, narration: 'Dan akhirnya, terbentuklah sebuah hasil dari perjalanan panjang yang menakjubkan.', camera: 'Wide hero shot, slow crane up', lighting: 'Golden volumetric rays', subtitle: 'Sebuah perjalanan yang menakjubkan', sfx: 'Impact followed by soft shimmer', transition: 'Fade out' }
  ]
}
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

function scene(title: string, duration: number, visual: string, narration: string, camera: string, lighting: string, subtitle: string, sfx: string, transition: string): Scene {
  return { id: crypto.randomUUID(), title, duration, visual, narration, camera, lighting, subtitle, sfx, transition }
}

function earthStoryboard(): Scene[] {
  return [
    scene(
      'Awan kosmik', 4,
      'Ruang antarbintang gelap dipenuhi awan gas hidrogen dan debu kosmik. Gravitasi menarik materi perlahan ke satu wilayah; bintik-bintik debu mulai berkumpul. Visual astronomi sinematik, skala sangat luas, tanpa teks di dalam gambar.',
      'Jauh sebelum Bumi terbentuk, tata surya kita hanyalah awan gas dan debu yang mengambang di ruang angkasa.',
      'Extreme wide shot, slow forward drift', 'Deep blue nebula with subtle amber highlights',
      'Semuanya bermula dari awan kosmik', 'Deep space rumble, soft particle shimmer', 'Fade in'
    ),
    scene(
      'Matahari muda', 4,
      'Awan yang runtuh berputar semakin cepat dan membentuk cakram protoplanet. Di pusatnya, materi memadat menjadi protomatahari yang semakin terang; sisa gas dan debu membentuk piringan pipih mengelilinginya.',
      'Gravitasi membuat awan itu runtuh dan berputar. Di pusatnya, Matahari muda mulai menyala.',
      'Orbiting camera around a rotating accretion disk', 'Bright golden core, cool blue shadows',
      'Matahari muda mulai menyala', 'Rising airy sweep and low solar hum', 'Whip pan'
    ),
    scene(
      'Butiran menjadi batuan', 4,
      'Di dalam cakram, partikel debu mikroskopis saling bertumbukan dan melekat. Tampilkan perubahan skala dari butiran kecil menjadi gumpalan batuan dan planetesimal yang bergerak mengitari Matahari.',
      'Di sekelilingnya, butiran debu saling bertumbukan. Sedikit demi sedikit, terbentuk bongkahan batuan yang lebih besar.',
      'Macro-to-wide scale transition, tracking along orbit', 'Warm sunlight with crisp rim lighting',
      'Debu berkumpul menjadi batuan', 'Fine granular impacts, rhythmic ticking', 'Match cut'
    ),
    scene(
      'Bumi muda terbentuk', 4,
      'Planetesimal berbatu bertabrakan dan bergabung melalui akresi. Sebuah protoplanet tumbuh, permukaannya panas dan berpijar akibat tumbukan serta peluruhan unsur radioaktif. Gambarkan bola batuan cair dengan kerak belum stabil.',
      'Tabrakan demi tabrakan menyatukan materi itu menjadi sebuah planet muda yang panas dan terus berubah.',
      'Fast orbital tracking, then slow push-in', 'Molten orange glow against dark space',
      'Sebuah planet muda mulai terbentuk', 'Layered rocky impacts and cinematic bass', 'Impact flash'
    ),
    scene(
      'Tabrakan raksasa', 4,
      'Sebuah benda langit seukuran Mars menabrak Bumi muda dalam visual ilmiah artistik. Material terlontar ke orbit dan membentuk cincin puing yang perlahan berkumpul menjadi Bulan. Hindari ledakan fantasi berlebihan.',
      'Salah satu tabrakan besar melontarkan material ke orbit. Dari puing-puing itu, Bulan perlahan terbentuk.',
      'Wide orbital shot, slow-motion debris arc', 'White-hot impact light fading to silver',
      'Bulan lahir dari puing tabrakan', 'Powerful impact, debris sweep, deep tail', 'Flash dissolve'
    ),
    scene(
      'Bumi mendingin', 3,
      'Bumi muda perlahan kehilangan panas. Permukaan magma mulai membeku menjadi kerak awal; aktivitas vulkanik melepaskan gas dan membentuk atmosfer purba. Uap air tebal menyelimuti cakrawala.',
      'Seiring waktu, permukaan Bumi mulai mendingin. Kerak terbentuk dan atmosfer awal menyelimuti planet.',
      'Slow descending orbit toward the horizon', 'Volcanic amber fading into cool twilight',
      'Kerak dan atmosfer mulai terbentuk', 'Cooling crackle, volcanic low rumble', 'Dissolve'
    ),
    scene(
      'Lautan pertama', 3,
      'Uap air mengembun setelah suhu turun. Hujan turun dalam waktu sangat lama dan air berkumpul di cekungan permukaan menjadi samudra awal. Tampilkan cakrawala Bumi purba yang berkabut.',
      'Air mengembun dan hujan turun selama masa yang sangat panjang, mengisi cekungan menjadi lautan pertama.',
      'Aerial glide over a forming primordial ocean', 'Soft cool blue with warm sunrise edge',
      'Lautan pertama memenuhi permukaan', 'Gentle rain, distant ocean swell', 'Water dissolve'
    ),
    scene(
      'Planet biru', 4,
      'Transisi waktu menuju Bumi modern dari orbit. Tampilkan awan putih, samudra biru, daratan hijau, atmosfer tipis bercahaya, dan Bulan di kejauhan. Akhiri dengan hero shot Bumi yang megah dan tenang.',
      'Dari debu kosmik, lahirlah rumah yang kita kenal. Sebuah planet biru yang terus berevolusi.',
      'Wide hero shot, slow pull-back from Earth', 'Natural sunlight, atmospheric rim glow',
      'Inilah Bumi, rumah kita', 'Emotional orchestral swell and soft shimmer', 'Fade out'
    )
  ]
}

export function makeStoryboard(prompt: string): Scene[] {
  const subject = prompt.trim() || 'Perjalanan sebuah gagasan'
  const normalized = subject.toLocaleLowerCase('id-ID')
  if (/(bumi|earth|tata surya|planet bumi)/.test(normalized)) return earthStoryboard()

  return [
    scene(
      'Pembuka', 5,
      `Establishing shot sinematik untuk ${subject}. Perkenalkan lokasi, suasana, skala, dan objek utama dengan komposisi yang mudah dibaca.`,
      `Setiap kisah tentang ${subject} selalu memiliki awal. Mari kita lihat bagaimana semuanya bermula.`,
      'Extreme wide establishing shot, slow cinematic push-in', 'Soft volumetric light with deep atmospheric shadows',
      'Semuanya bermula dari sini', 'Deep airy whoosh and subtle ambience', 'Fade in'
    ),
    scene(
      'Awal proses', 6,
      `Perlihatkan tahap pertama ${subject} secara runtut. Fokus pada bahan, objek, atau kondisi awal; gunakan detail dekat yang jelas dan gerakan yang masuk akal.`,
      'Dari kondisi sederhana, proses pertama mulai berlangsung. Perubahan kecil menjadi awal dari sesuatu yang lebih besar.',
      'Macro tracking shot, gentle parallax', 'Directional key light with soft fill',
      'Proses mulai berlangsung', 'Subtle texture and movement sounds', 'Match cut'
    ),
    scene(
      'Perkembangan', 8,
      `Tampilkan tahapan utama perkembangan ${subject}. Perlihatkan hubungan sebab-akibat, perubahan bentuk, skala, dan detail lingkungan agar proses mudah dipahami.`,
      'Tahap demi tahap saling terhubung. Waktu dan berbagai proses membawa perubahan yang semakin terlihat.',
      'Orbit shot with gradual pull-back', 'Cinematic contrast with controlled rim light',
      'Perubahan demi perubahan', 'Rising cinematic swell and layered motion', 'Light sweep'
    ),
    scene(
      'Hasil akhir', 7,
      `Reveal hasil akhir ${subject} dengan detail yang meyakinkan. Tampilkan perbandingan kondisi awal dan akhir bila sesuai, lalu tahan pada hero shot.`,
      'Setelah melalui rangkaian proses panjang, inilah hasil yang akhirnya terbentuk.',
      'Wide hero shot, slow crane up', 'Balanced golden volumetric rays',
      'Sebuah hasil dari perjalanan panjang', 'Cinematic impact followed by soft shimmer', 'Fade out'
    )
  ]
}


/** Build scene narration directly from the script supplied by the user. */
export function makeStoryboardFromNarration(narration: string): Scene[] {
  const script = narration.trim()
  const scenes = makeStoryboard(script)
  if (!script) return scenes
  const words = script.split(/\s+/)
  const chunkSize = Math.ceil(words.length / scenes.length)
  return scenes.map((item, index) => {
    const part = words.slice(index * chunkSize, (index + 1) * chunkSize).join(' ')
    if (!part) return item
    return { ...item, narration: part, subtitle: part.split(/\s+/).slice(0, 9).join(' ') }
  })
}

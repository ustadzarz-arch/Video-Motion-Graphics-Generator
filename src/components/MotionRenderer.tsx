import { useEffect, useRef, useState } from 'react'
import { Download, Pause, Play, Video, Volume2 } from 'lucide-react'
import type { Scene } from '../lib/storyboard'

type Props = { scenes: Scene[]; onStatus: (message: string) => void }

const W = 720
const H = 1280

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r)
}

function drawWrapped(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 3) {
  const words = text.split(/\s+/)
  let line = ''
  let lines = 0
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight)
      lines++
      line = word
      if (lines >= maxLines) break
    } else line = test
  }
  if (lines < maxLines && line) ctx.fillText(line, x, y + lines * lineHeight)
}

function paint(ctx: CanvasRenderingContext2D, scene: Scene | undefined, sceneIndex: number, progress: number, seconds: number) {
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#101b38'); bg.addColorStop(.48, '#15152d'); bg.addColorStop(1, '#321d42')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

  const glow = ctx.createRadialGradient(W * .72, H * .35, 20, W * .72, H * .35, 570)
  glow.addColorStop(0, 'rgba(143,111,255,.34)'); glow.addColorStop(1, 'rgba(143,111,255,0)')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)

  let seed = 73
  for (let i = 0; i < 95; i++) {
    seed = (seed * 9301 + 49297) % 233280
    const x = seed / 233280 * W
    seed = (seed * 9301 + 49297) % 233280
    const y = seed / 233280 * H
    const twinkle = .35 + .65 * Math.abs(Math.sin(seconds * 1.8 + i))
    ctx.globalAlpha = twinkle
    ctx.fillStyle = '#e8e6ff'
    ctx.beginPath(); ctx.arc(x, y, i % 7 === 0 ? 3 : 1.6, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1

  const drift = Math.sin(seconds * .45) * 24
  const px = W * .68 + drift
  const py = H * .37 + Math.cos(seconds * .38) * 18
  const radius = 205 + Math.sin(seconds * .7) * 5
  const planet = ctx.createRadialGradient(px - 85, py - 95, 12, px, py, radius)
  planet.addColorStop(0, '#f4d9ff'); planet.addColorStop(.28, '#b58af4'); planet.addColorStop(.62, '#7655bb'); planet.addColorStop(1, '#242344')
  ctx.save()
  ctx.shadowColor = 'rgba(173,128,255,.55)'; ctx.shadowBlur = 70
  ctx.fillStyle = planet; ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.translate(px, py); ctx.rotate(-.28)
  ctx.strokeStyle = 'rgba(228,205,255,.35)'; ctx.lineWidth = 9
  ctx.beginPath(); ctx.ellipse(0, 0, radius * 1.55, radius * .38, 0, 0, Math.PI * 2); ctx.stroke()
  ctx.restore()

  const orbX = W * .17 + Math.sin(seconds * .7) * 18
  const orbY = H * .64 + Math.cos(seconds * .6) * 16
  const orb = ctx.createRadialGradient(orbX - 35, orbY - 40, 3, orbX, orbY, 115)
  orb.addColorStop(0, '#ffe2c2'); orb.addColorStop(.55, '#cf8cbb'); orb.addColorStop(1, '#48345f')
  ctx.fillStyle = orb; ctx.beginPath(); ctx.arc(orbX, orbY, 105, 0, Math.PI * 2); ctx.fill()

  const fade = Math.min(1, progress * 5 + .1)
  ctx.globalAlpha = fade
  ctx.fillStyle = '#d3baff'; ctx.font = '600 20px Arial';
  ctx.fillText('MOTION GRAPHICS  /  00' + (sceneIndex + 1), 64, 870)
  ctx.fillStyle = '#ffffff'; ctx.font = '700 66px Arial';
  drawWrapped(ctx, scene?.title || 'Your next story', 64, 960, 590, 78, 2)
  ctx.fillStyle = '#d7d2e8'; ctx.font = '400 29px Arial';
  drawWrapped(ctx, scene?.subtitle || 'Ide besar dimulai di sini.', 64, 1110, 580, 42, 2)
  ctx.globalAlpha = 1

  const barY = 1200
  ctx.fillStyle = 'rgba(255,255,255,.2)'; roundedRect(ctx, 64, barY, 592, 5, 3); ctx.fill()
  ctx.fillStyle = '#c0a4ff'; roundedRect(ctx, 64, barY, 592 * Math.max(0, Math.min(1, progress)), 5, 3); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.font = '500 17px Arial';
  ctx.fillText('MG STUDIO', 64, 1240)
  ctx.textAlign = 'right'; ctx.fillText(String(Math.floor(seconds)).padStart(2, '0') + ' SEC', 656, 1240); ctx.textAlign = 'left'
}

export default function MotionRenderer({ scenes, onStatus }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null)
  const lastSceneRef = useRef(-1)
  const chunksRef = useRef<Blob[]>([])
  const exportRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const total = scenes.reduce((sum, scene) => sum + Math.max(1, scene.duration || 1), 0)

  function prepareAudio() {
    if (audioContextRef.current) { void audioContextRef.current.resume(); return }
    const context = new AudioContext()
    const master = context.createGain()
    master.gain.value = 0.22
    master.connect(context.destination)
    const destination = context.createMediaStreamDestination()
    master.connect(destination)
    audioContextRef.current = context
    audioDestinationRef.current = destination
    void context.resume()
  }

  function playAutoSfx(sceneIndex: number) {
    const context = audioContextRef.current
    if (!context) return
    const now = context.currentTime
    const base = [110, 146.8, 196, 130.8, 82.4, 164.8, 220, 174.6][sceneIndex % 8]
    const thump = context.createOscillator()
    const thumpGain = context.createGain()
    thump.type = 'sine'
    thump.frequency.setValueAtTime(base * 1.8, now)
    thump.frequency.exponentialRampToValueAtTime(Math.max(35, base * 0.55), now + 0.42)
    thumpGain.gain.setValueAtTime(0.0001, now)
    thumpGain.gain.exponentialRampToValueAtTime(0.48, now + 0.025)
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58)
    thump.connect(thumpGain)
    thumpGain.connect(context.destination)
    if (audioDestinationRef.current) thumpGain.connect(audioDestinationRef.current)
    thump.start(now)
    thump.stop(now + 0.6)

    const sweep = context.createOscillator()
    const sweepGain = context.createGain()
    sweep.type = 'triangle'
    sweep.frequency.setValueAtTime(base * 2.4, now)
    sweep.frequency.exponentialRampToValueAtTime(base * 7, now + 0.32)
    sweepGain.gain.setValueAtTime(0.0001, now)
    sweepGain.gain.linearRampToValueAtTime(0.12, now + 0.12)
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7)
    sweep.connect(sweepGain)
    sweepGain.connect(context.destination)
    if (audioDestinationRef.current) sweepGain.connect(audioDestinationRef.current)
    sweep.start(now)
    sweep.stop(now + 0.72)
  }

  useEffect(() => () => { void audioContextRef.current?.close() }, [])


  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || playing || scenes.length === 0) return
    let cursor = 0
    let index = 0
    const time = Math.min(elapsed, Math.max(0, total - .001))
    for (; index < scenes.length - 1; index++) {
      if (time < cursor + scenes[index].duration) break
      cursor += scenes[index].duration
    }
    const scene = scenes[index]
    paint(ctx, scene, index, (time - cursor) / Math.max(1, scene?.duration || 1), time)
  }, [scenes, elapsed, playing, total])

  // Keep the animation clock independent from React renders while playback is active.
  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let frame = 0
    let start = performance.now() - elapsed * 1000
    const tick = (now: number) => {
      const seconds = Math.min(total, (now - start) / 1000)
      let cursor = 0
      let index = 0
      for (; index < scenes.length - 1; index++) {
        if (seconds < cursor + scenes[index].duration) break
        cursor += scenes[index].duration
      }
      const scene = scenes[index]
      if (lastSceneRef.current !== index) { lastSceneRef.current = index; playAutoSfx(index) }
      paint(ctx, scene, index, Math.min(1, (seconds - cursor) / Math.max(1, scene?.duration || 1)), seconds)
      setElapsed(seconds)
      if (seconds >= total) {
        setElapsed(total); setPlaying(false)
        if (exportRef.current && recorderRef.current?.state === 'recording') recorderRef.current.stop()
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  function play() {
    if (!scenes.length) return
    prepareAudio()
    if (elapsed >= total) lastSceneRef.current = -1
    if (elapsed >= total) setElapsed(0)
    setPlaying(true)
  }

  function exportVideo() {
    const canvas = canvasRef.current
    if (!canvas || !scenes.length) return
    if (!('MediaRecorder' in window) || !canvas.captureStream) {
      onStatus('Browser ini belum mendukung ekspor WebM. Coba Chrome atau Edge terbaru.')
      return
    }
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type))
    if (!mime) { onStatus('Format WebM tidak didukung browser ini.'); return }
    try {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      chunksRef.current = []
      prepareAudio()
      lastSceneRef.current = -1
      const videoStream = canvas.captureStream(30)
      const audioTracks = audioDestinationRef.current?.stream.getAudioTracks() || []
      const stream = new MediaStream([...videoStream.getVideoTracks(), ...audioTracks])
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 })
      recorderRef.current = recorder
      exportRef.current = true
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url; link.download = 'motion-graphics-export.webm'; link.click()
        URL.revokeObjectURL(url)
        videoStream.getTracks().forEach(track => track.stop())
        setExporting(false); exportRef.current = false
        onStatus('Ekspor WebM selesai. Video tersimpan ke perangkat.')
      }
      setElapsed(0); setExporting(true)
      recorder.start(250)
      setPlaying(true)
      onStatus('Merekam animasi ke WebM. Biarkan proses sampai selesai.')
    } catch {
      setExporting(false); exportRef.current = false
      onStatus('Ekspor gagal dimulai. Periksa dukungan MediaRecorder browser.')
    }
  }

  const percent = total ? Math.min(100, elapsed / total * 100) : 0
  return <div className="motion-renderer">
    <div className="renderer-canvas-wrap"><canvas ref={canvasRef} width={W} height={H} aria-label="Preview motion graphics portrait"/></div>
    <div className="renderer-controls">
      <button className="renderer-play" onClick={() => playing ? setPlaying(false) : play()} disabled={!scenes.length}>{playing ? <Pause size={15}/> : <Play size={15} fill="currentColor"/>}{playing ? 'Pause' : 'Preview'}</button>
      <div className="renderer-progress"><div><span>{Math.floor(elapsed)}s</span><span>{total}s</span></div><div className="renderer-progress-track"><i style={{ width: percent + '%' }}/></div></div>
      <button className="renderer-export" onClick={exportVideo} disabled={!scenes.length || exporting}><Download size={15}/>{exporting ? 'Merekam…' : 'Export WebM'}</button>
    </div>
    <p className="renderer-note"><Video size={13}/> Canvas 720 × 1280 · 30 FPS · WebM <span><Volume2 size={12}/> SFX prosedural ikut terekam</span></p>
  </div>
}

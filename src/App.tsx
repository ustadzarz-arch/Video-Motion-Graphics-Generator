import { useMemo, useState } from 'react'
import { Clapperboard, MessageSquare, FolderOpen, Settings, Plus, Send, WandSparkles, Film, Download, Clock3, ChevronRight, Trash2, Sparkles, PanelLeftClose, Menu, Smartphone, Monitor, Apple, Terminal, Globe, Volume2 } from 'lucide-react'
import { makeStoryboardFromNarration, type Scene } from './lib/storyboard'
import { loadProjects, saveProjects, type Project } from './lib/storage'
import MotionRenderer from './components/MotionRenderer'

type Page = 'chat' | 'create' | 'projects' | 'downloads' | 'settings'
const starter = 'Jauh sebelum Bumi terbentuk, tata surya kita hanyalah awan gas dan debu kosmik. Gravitasi menyatukan materi itu hingga Matahari muda mulai menyala. Di sekelilingnya, butiran debu saling bertumbukan dan membentuk batuan. Perlahan, planet muda terbentuk, mendingin, lalu memiliki lautan dan atmosfer. Dari proses panjang itu, lahirlah Bumi, rumah bagi kehidupan.'

export default function App() {
  const [page, setPage] = useState<Page>('create')
  const [prompt, setPrompt] = useState(starter)
  const [projects, setProjects] = useState<Project[]>(loadProjects)
  const [active, setActive] = useState<Project | null>(projects[0] || null)
  const [selected, setSelected] = useState(0)
  const [notice, setNotice] = useState('Workspace siap digunakan')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [busy, setBusy] = useState(false)
  const [voiceOverPlaying, setVoiceOverPlaying] = useState(false)

  const scenes = active?.scenes || []
  const current = scenes[selected]
  const total = useMemo(() => scenes.reduce((sum, scene) => sum + scene.duration, 0), [scenes])

  function persist(next: Project[]) { setProjects(next); saveProjects(next) }
  function createProject() {
    if (!prompt.trim()) { setNotice('Tulis ide video terlebih dahulu.'); return }
    setBusy(true)
    const next: Project = { id: crypto.randomUUID(), title: prompt.trim().slice(0, 48), prompt: prompt.trim(), updatedAt: new Date().toISOString(), scenes: makeStoryboardFromNarration(prompt) }
    const updated = [next, ...projects]
    persist(updated); setActive(next); setSelected(0); setPage('create')
    setNotice('Storyboard sinematik berhasil dibuat sebagai draft lokal.')
    setBusy(false)
  }
  function toggleVoiceOver() {
    if (!active?.scenes.length) { setNotice('Buat storyboard dari narasi terlebih dahulu.'); return }
    if (!('speechSynthesis' in window)) { setNotice('Browser ini belum mendukung pemutaran voice-over.'); return }
    if (voiceOverPlaying) {
      window.speechSynthesis.cancel()
      setVoiceOverPlaying(false)
      setNotice('Voice-over dihentikan.')
      return
    }
    const script = active.scenes.map(scene => scene.narration).filter(Boolean).join(' ')
    const utterance = new SpeechSynthesisUtterance(script)
    utterance.lang = 'id-ID'
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onend = () => setVoiceOverPlaying(false)
    utterance.onerror = () => { setVoiceOverPlaying(false); setNotice('Voice-over tidak dapat diputar pada perangkat ini.') }
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setVoiceOverPlaying(true)
    setNotice('Memutar voice-over bahasa Indonesia dari suara perangkat.')
  }

  function updateScene<K extends keyof Scene>(key: K, value: Scene[K]) {
    if (!active) return
    const nextScenes = active.scenes.map((scene, i) => i === selected ? { ...scene, [key]: value } : scene)
    const updatedProject = { ...active, scenes: nextScenes, updatedAt: new Date().toISOString() }
    setActive(updatedProject); persist(projects.map(p => p.id === active.id ? updatedProject : p))
  }
  function exportProject() {
    if (!active) return
    const blob = new Blob([JSON.stringify(active, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = `${active.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'motion-project'}.json`; a.click()
    URL.revokeObjectURL(url); setNotice('File proyek JSON berhasil diunduh.')
  }
  function removeProject(id: string) {
    const next = projects.filter(p => p.id !== id); persist(next)
    if (active?.id === id) setActive(next[0] || null)
    setNotice('Proyek dihapus dari penyimpanan perangkat.')
  }

  const nav = [
    { id: 'chat' as Page, label: 'Chat AI', icon: MessageSquare },
    { id: 'create' as Page, label: 'Buat Video', icon: Clapperboard },
    { id: 'projects' as Page, label: 'Project Saya', icon: FolderOpen },
    { id: 'downloads' as Page, label: 'Download App', icon: Download },
    { id: 'settings' as Page, label: 'Settings', icon: Settings }
  ]

  return <div className="app-shell">
    <aside className={mobileMenu ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><div className="brand-mark"><Clapperboard size={20}/></div><div><strong>Motion<span>Graphics</span></strong><small>GENERATOR STUDIO</small></div><button className="icon-btn mobile-close" onClick={() => setMobileMenu(false)}><PanelLeftClose size={18}/></button></div>
      <button className="new-project" onClick={() => { setPrompt(''); setPage('create'); setMobileMenu(false) }}><Plus size={17}/> Project Baru</button>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item => <button key={item.id} className={page === item.id ? 'nav-item active' : 'nav-item'} onClick={() => { setPage(item.id); setMobileMenu(false) }}><item.icon size={18}/>{item.label}{page === item.id && <ChevronRight size={15} className="nav-arrow"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="status-dot"/><div><b>Local workspace</b><small>Draft tersimpan di perangkat</small></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="icon-btn menu-toggle" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20}/></button><div className="breadcrumbs">Workspace <ChevronRight size={14}/><b>{nav.find(n => n.id === page)?.label}</b></div><div className="top-actions"><span className="model-pill"><span className="green-dot"/> Local storyboard mode</span><div className="avatar">MG</div></div></header>

      {page === 'create' && <section className="workspace">
        <div className="page-heading"><div><div className="eyebrow"><Sparkles size={14}/> CREATIVE WORKSPACE</div><h1>Buat sesuatu yang <em>bergerak.</em></h1><p>Ubah ide menjadi storyboard motion graphics yang bisa kamu kembangkan.</p></div><button className="outline-btn" onClick={exportProject} disabled={!active}><Download size={16}/> Export project</button></div>
        <div className="creator-grid">
          <section className="panel prompt-panel"><div className="panel-heading"><div className="panel-icon purple"><WandSparkles size={18}/></div><div><h2>Masukkan narasimu</h2><p>Cukup tempel naskah voice-over. Adegan dan subtitle disusun otomatis.</p></div></div>
            <label className="field-label" htmlFor="prompt">NARASI UTAMA VIDEO</label><textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Tempel atau tulis narasi lengkap di sini. Aplikasi akan membaginya menjadi adegan..."/>
            <div className="prompt-options"><label>FORMAT<select defaultValue="9:16"><option>9:16</option><option>16:9</option><option>1:1</option></select></label><label>DURASI<select defaultValue="26 detik"><option>15 detik</option><option>26 detik</option><option>30 detik</option><option>60 detik</option></select></label><label>GAYA<select defaultValue="Cinematic"><option>Cinematic</option><option>Documentary</option><option>Minimalist</option><option>Futuristic</option></select></label></div>
            <button className="primary-btn generate-btn" onClick={createProject} disabled={busy}><WandSparkles size={17}/>{busy ? 'Menyusun...' : 'Buat storyboard'}<span>↗</span></button>
            <button className="voiceover-btn" onClick={toggleVoiceOver} disabled={!active?.scenes.length}><Volume2 size={16}/>{voiceOverPlaying ? 'Hentikan voice-over' : 'Dengarkan voice-over'}</button>
            <div className="hint"><Sparkles size={13}/> Narasi dibagi otomatis ke adegan. Voice-over preview memakai suara perangkat; belum masuk ke file WebM. AI voice akan ditambahkan lewat layanan TTS.</div>
          </section>
          <section className="panel preview-panel"><div className="panel-topline"><div><span className="live-indicator"/> MOTION RENDERER</div><span className="ratio-tag">PORTRAIT · 9:16</span></div>
            {scenes.length ? <MotionRenderer scenes={scenes} onStatus={setNotice}/> : <div className="renderer-empty"><Film size={28}/><b>Preview akan muncul setelah storyboard dibuat</b><span>Animasi dirender langsung di browser.</span></div>}
            <div className="preview-caption"><span><Film size={14}/> Procedural canvas preview</span><span>{scenes.length || 0} scenes</span></div>
          </section>
        </div>

        <section className="panel storyboard-panel"><div className="section-title"><div><div className="eyebrow">YOUR STORY</div><h2>Storyboard & timeline</h2></div><div className="section-meta"><span><Clock3 size={14}/> {total}s total</span><span>{scenes.length} scenes</span></div></div>
          {scenes.length ? <><div className="scene-list">{scenes.map((scene, i) => <button key={scene.id} className={selected === i ? 'scene-card selected' : 'scene-card'} onClick={() => setSelected(i)}><div className="scene-thumb"><span>0{i+1}</span><div className="thumb-orb"/></div><div className="scene-info"><b>{scene.title}</b><small>{scene.visual}</small><span>{scene.duration}s · {scene.camera}</span></div><ChevronRight size={16}/></button>)}</div><div className="timeline"><div className="timeline-head"><b>SEQUENCE TIMELINE</b><span>{total}s · {scenes.length} clips</span></div><div className="timeline-ruler"><span>00:00</span><span>00:{String(Math.round(total/2)).padStart(2,'0')}</span><span>00:{String(total).padStart(2,'0')}</span></div><div className="timeline-track">{scenes.map((scene, i) => <button key={scene.id} onClick={() => setSelected(i)} className={selected === i ? 'clip active' : 'clip'} style={{ flex: scene.duration }}><b>{scene.title}</b><small>{scene.duration}s</small></button>)}</div></div></> : <div className="empty-state"><Film size={26}/><b>Storyboard kamu akan muncul di sini</b><span>Tulis ide di atas, lalu pilih “Buat storyboard”.</span></div>}
        </section>

        {current && <section className="panel editor-panel"><div className="section-title"><div><div className="eyebrow">SCENE EDITOR</div><h2>Edit adegan: {current.title}</h2></div><span className="edit-tag">SCENE 0{selected+1}</span></div><div className="editor-grid">{([{key:'visual',label:'Visual description'},{key:'narration',label:'Narasi'},{key:'camera',label:'Gerakan kamera'},{key:'lighting',label:'Pencahayaan'},{key:'subtitle',label:'Subtitle'},{key:'sfx',label:'Sound effect'}] as const).map(field => <label className="editor-field" key={field.key}><span>{field.label}</span><textarea value={current[field.key]} onChange={e => updateScene(field.key, e.target.value)} rows={2}/></label>)}<label className="editor-field duration-field"><span>Durasi (detik)</span><input type="number" min="1" max="120" value={current.duration} onChange={e => updateScene('duration', Math.max(1, Number(e.target.value)))}/></label></div></section>}
      </section>}

      {page === 'chat' && <section className="simple-page"><div className="eyebrow"><Sparkles size={14}/> AI CREATIVE ASSISTANT</div><h1>Ruang ide & cerita.</h1><p>Masukkan narasi saja. Aplikasi akan membaginya menjadi adegan, subtitle, dan arahan visual.</p><div className="panel chat-panel"><div className="assistant-message"><div className="assistant-avatar"><Sparkles size={18}/></div><div><b>Motion Assistant</b><p>Halo! Ceritakan video yang ingin kamu buat. Aku bisa membantu menyusun konsep dan storyboard draft secara lokal.</p></div></div><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Tempel narasi lengkap yang ingin dijadikan video..."/><div className="chat-bottom"><span>Contoh: Buat narasi sinematik tentang luar angkasa.</span><button className="primary-btn" onClick={createProject}><Send size={16}/> Buat storyboard</button></div></div></section>}

      {page === 'projects' && <section className="simple-page"><div className="eyebrow">YOUR LIBRARY</div><h1>Project saya.</h1><p>Draft proyek tersimpan di browser perangkat ini.</p><div className="project-grid">{projects.map(project => <article className="panel project-card" key={project.id}><div className="project-cover"><Film size={28}/><span>{project.scenes.length} SCENES</span></div><h3>{project.title}</h3><small>Diubah {new Date(project.updatedAt).toLocaleString('id-ID')}</small><div className="project-actions"><button className="outline-btn" onClick={() => { setActive(project); setSelected(0); setPage('create') }}>Buka project</button><button className="icon-btn danger" onClick={() => removeProject(project.id)} aria-label="Hapus project"><Trash2 size={16}/></button></div></article>)}{!projects.length && <div className="empty-state"><FolderOpen size={28}/><b>Belum ada project</b><span>Storyboard yang kamu buat akan tersimpan di sini.</span></div>}</div></section>}

      {page === 'downloads' && <section className="simple-page downloads-page"><div className="eyebrow"><Download size={14}/> DOWNLOAD CENTER</div><h1>Motion Graphics <em>di semua perangkat.</em></h1><p>Satu aplikasi untuk web, ponsel, dan komputer. Installer native akan tersedia setelah proses build dan pengujian setiap platform selesai.</p>
        <div className="download-grid">
          <article className="panel download-card"><div className="download-icon"><Globe size={25}/></div><div className="download-card-head"><h3>Web App</h3><span className="release-status ready">Bisa dibuka</span></div><p>Gunakan langsung melalui browser. Pada browser yang mendukung, pilih menu “Install app” atau “Add to Home Screen”.</p><a className="download-link" href="https://ustadzarz-arch.github.io/Video-Motion-Graphics-Generator/" target="_blank" rel="noreferrer">Buka Web App <ChevronRight size={15}/></a></article>
          <article className="panel download-card"><div className="download-icon"><Smartphone size={25}/></div><div className="download-card-head"><h3>Android</h3><span className="release-status pending">APK disiapkan</span></div><p>Versi installer .apk dan paket Play Store sedang disiapkan melalui build Android.</p><span className="download-disabled">APK belum tersedia</span></article>
          <article className="panel download-card"><div className="download-icon"><Monitor size={25}/></div><div className="download-card-head"><h3>Windows</h3><span className="release-status pending">EXE disiapkan</span></div><p>Installer desktop Windows (.exe) akan diterbitkan setelah build dan pengujian.</p><span className="download-disabled">EXE belum tersedia</span></article>
          <article className="panel download-card"><div className="download-icon"><Terminal size={25}/></div><div className="download-card-head"><h3>Linux</h3><span className="release-status pending">Build disiapkan</span></div><p>Paket Linux seperti AppImage atau .deb akan disediakan setelah pengujian kompatibilitas.</p><span className="download-disabled">Paket belum tersedia</span></article>
          <article className="panel download-card"><div className="download-icon"><Apple size={25}/></div><div className="download-card-head"><h3>iOS & iPadOS</h3><span className="release-status pending">Distribusi disiapkan</span></div><p>Versi iPhone/iPad memerlukan build Xcode, penandatanganan Apple, dan distribusi TestFlight atau App Store.</p><span className="download-disabled">Belum tersedia</span></article>
        </div>
        <div className="panel release-note"><b>Catatan rilis</b><p>File installer akan ditautkan di halaman ini setelah benar-benar berhasil dibuat dan diuji. Kami tidak menampilkan tombol unduhan palsu.</p><a href="https://github.com/ustadzarz-arch/Video-Motion-Graphics-Generator/releases" target="_blank" rel="noreferrer">Lihat halaman GitHub Releases <ChevronRight size={14}/></a></div>
      </section>}
      
      {page === 'settings' && <section className="simple-page"><div className="eyebrow">PREFERENCES</div><h1>Pengaturan.</h1><p>Pengaturan workspace dan status integrasi.</p><div className="panel settings-card"><div><b>Mode penyimpanan</b><span>Local browser storage</span></div><div><b>AI provider</b><span>Belum terhubung — tidak ada API key yang disimpan di aplikasi.</span></div><div><b>Video renderer</b><span>Canvas renderer tersedia untuk preview animasi dan ekspor WebM. MP4 belum tersedia.</span></div><div><b>Versi aplikasi</b><span>0.4.0 · Narration workflow + audio SFX</span></div></div></section>}
      <footer className="app-footer"><span>© 2026 Motion Graphics Generator</span><span>{notice}</span></footer>
    </main>
    {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Tutup menu"/>}
  </div>
}
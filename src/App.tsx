import { useState } from 'react'
import { InputPanel, type TextField } from './components/InputPanel'
import { LpPreview } from './components/LpPreview'
import { sampleInput } from './data/sample'
import { draftAsText, generateDraft, safeHttpUrl } from './lib/generate'
import planningHero from './assets/lp-planning-hero.png'
import type { DraftSection, LpInput, LpDraft } from './types'

const requiredFields: TextField[] = ['industry', 'serviceName', 'description', 'target', 'concerns', 'strengths']

function copyFallback(text: string): boolean {
  const field = document.createElement('textarea')
  field.value = text
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()
  return copied
}

export default function App() {
  const [input, setInput] = useState<LpInput>(sampleInput)
  const [generatedInput, setGeneratedInput] = useState<LpInput>(sampleInput)
  const [draft, setDraft] = useState<LpDraft>(() => generateDraft(sampleInput))
  const [invalid, setInvalid] = useState<TextField[]>([])
  const [notice, setNotice] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const salesContactUrl = safeHttpUrl(import.meta.env.VITE_SALES_CONTACT_URL || '')

  function updateText(field: TextField, value: string) {
    setInput((current) => ({ ...current, [field]: value }))
    if (invalid.includes(field) && value.trim()) setInvalid((current) => current.filter((item) => item !== field))
  }

  function updateFaq(index: number, field: 'question' | 'answer', value: string) {
    setInput((current) => ({ ...current, faq: current.faq.map((entry, i) => i === index ? { ...entry, [field]: value } : entry) }))
  }

  function resetSample() {
    const next = structuredClone(sampleInput)
    setInput(next)
    setGeneratedInput(next)
    setDraft(generateDraft(next))
    setInvalid([])
    setCopyMessage('')
    setNotice('入力例と完成イメージを読み込みました。')
  }

  function generate() {
    const missing = requiredFields.filter((field) => !input[field].trim())
    setInvalid(missing)
    if (missing.length) {
      setNotice('必須項目を入力してください。')
      document.getElementById('field-' + missing[0])?.focus()
      return
    }
    const next = structuredClone(input)
    setGeneratedInput(next)
    setDraft(generateDraft(next))
    setCopyMessage('')
    setNotice(input.contactUrl.trim() && !safeHttpUrl(input.contactUrl) ?
      'LP構成を更新しました。問い合わせ先URLの形式を確認してください。' : 'LP構成を更新しました。')
    requestAnimationFrame(() => document.getElementById('preview-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function updateSection(index: number, section: DraftSection) {
    setDraft((current) => ({ ...current, sections: current.sections.map((item, i) => i === index ? section : item) }))
    setCopyMessage('')
  }

  async function copyDraft() {
    const text = draftAsText(draft)
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else if (!copyFallback(text)) throw new Error('copy unavailable')
      setCopyMessage('文章をコピーしました。')
    } catch {
      try { setCopyMessage(copyFallback(text) ? '文章をコピーしました。' : 'コピーできませんでした。文章を選択してコピーしてください。') }
      catch { setCopyMessage('コピーできませんでした。文章を選択してコピーしてください。') }
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LPの設計室 トップへ"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>LPの設計室<small>LANDING PAGE STUDIO</small></span></a>
        <nav aria-label="ページ内ナビゲーション"><a href="#how-it-works">使い方</a><a href="#input-area">入力する</a><a className="nav-preview" href="#preview-area">完成例を見る <span aria-hidden="true">↗</span></a></nav>
      </header>

      <main id="top">
        <section className="intro-hero" aria-labelledby="hero-title">
          <div className="intro-copy">
            <div className="intro-eyebrow"><span className="eyebrow-line" />言葉を整える、LPづくりの第一歩</div>
            <h1 id="hero-title">お店の魅力を、<br /><em>伝わる順番</em>に。</h1>
            <p>お客様の悩みから、サービスの強み、問い合わせまで。必要な情報を入力すると、LPの構成と文章案が一つのページになります。</p>
            <div className="intro-actions"><a className="button button-primary" href="#preview-area">サンプルの完成例を見る <span aria-hidden="true">→</span></a><a className="inline-link" href="#input-area">自分の内容で作る <span aria-hidden="true">↗</span></a></div>
            <div className="intro-assurances"><span>入力例つき</span><span>文章を編集できる</span><span>API登録不要</span></div>
          </div>
          <div className="intro-art" aria-hidden="true">
            <img src={planningHero} alt="" />
            <div className="art-annotation"><span>01</span> 素材を入力 <b>→</b> <span>02</span> LPの形に</div>
          </div>
        </section>

        <section className="how-strip" id="how-it-works" aria-label="使い方">
          <div><span>HOW IT WORKS</span><h2>入力から、完成イメージまで。</h2></div>
          <ol><li><b>01</b><span>入力例を確認</span></li><li><b>02</b><span>自分の情報に変更</span></li><li><b>03</b><span>文章を編集・コピー</span></li></ol>
        </section>

        <section className="studio-section" aria-label="LP構成作成ツール">
          <div className="studio-intro"><div><span className="panel-kicker">CREATE YOUR LANDING PAGE</span><h2>入力した内容が、<br />ページの言葉になります。</h2></div><p>右のプレビューには、架空の地域密着型ハウスクリーニングの完成例を表示しています。入力を変えて「LP構成を作成」を押すと、訴求の軸と文章が変わります。</p></div>
          <p className="sample-disclaimer">現在のサンプルは架空の事業です。料金・実績・連絡先など、未入力の事実は原稿に補いません。</p>
          <p className="global-notice" role="status" aria-live="polite">{notice}</p>
          <div className="studio-grid">
            <InputPanel input={input} invalid={invalid} onChange={updateText} onToneChange={(tone) => setInput((current) => ({ ...current, tone }))} onFaqChange={updateFaq} onGenerate={generate} onReset={resetSample} />
            <LpPreview draft={draft} contactUrl={generatedInput.contactUrl} industry={generatedInput.industry} serviceName={generatedInput.serviceName} onUpdate={updateSection} onCopy={copyDraft} copyMessage={copyMessage} />
          </div>
        </section>

        <section className="service-inquiry" aria-label="LP制作サービスのご案内"><div><span className="panel-kicker">FROM IDEA TO REAL PAGE</span><h2>この構成を、実際のLPへ。</h2><p>文章案をもとに、デザインや公開まで相談したい方へ。構成を整えた次の一歩として、制作の相談にもつなげられます。</p></div>{salesContactUrl && <a href={salesContactUrl} className="button button-primary" target="_blank" rel="noopener noreferrer">LP制作について相談する <span aria-hidden="true">↗</span></a>}</section>
      </main>
      <footer className="site-footer"><span>LPの設計室 <b>・</b> 構成作成デモ</span><span>入力内容はブラウザー内で処理され、送信・保存されません。</span></footer>
    </div>
  )
}

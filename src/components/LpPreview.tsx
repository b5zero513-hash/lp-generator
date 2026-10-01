import { useState } from 'react'
import type { DraftPoint, DraftSection, LpDraft } from '../types'
import { safeHttpUrl } from '../lib/generate'
import { Button } from './Button'
import cleaningImage from '../assets/house-cleaning-preview.png'

interface Props {
  draft: LpDraft
  contactUrl: string
  industry: string
  serviceName: string
  onUpdate: (index: number, section: DraftSection) => void
  onCopy: () => void
  copyMessage: string
}

function EditPanel({ section, onChange, onClose }: { section: DraftSection; onChange: (section: DraftSection) => void; onClose: () => void }) {
  const set = (key: 'kicker' | 'title' | 'lead' | 'body' | 'buttonText', value: string) => onChange({ ...section, [key]: value })
  const pointsValue = section.points.map((point) => point.title + (point.text ? '｜' + point.text : '')).join('\n')
  const updatePoints = (value: string) => {
    const points: DraftPoint[] = value.split(/\r?\n/).filter((line) => line.trim()).map((line) => {
      const [title, ...rest] = line.split('｜')
      return { title: title.trim(), text: rest.join('｜').trim() }
    })
    onChange({ ...section, points })
  }
  return (
    <div className="edit-panel">
      <div className="edit-panel-title"><strong>{section.label} の文章を編集</strong><button type="button" onClick={onClose}>閉じる</button></div>
      <div className="edit-grid">
        <label>小見出し<input value={section.kicker} onChange={(event) => set('kicker', event.target.value)} /></label>
        <label>見出し<input value={section.title} onChange={(event) => set('title', event.target.value)} /></label>
        <label>導入文<textarea rows={3} value={section.lead} onChange={(event) => set('lead', event.target.value)} /></label>
        <label>本文<textarea rows={4} value={section.body} onChange={(event) => set('body', event.target.value)} /></label>
        {(section.points.length > 0 || ['problems', 'strengths', 'flow', 'faq', 'service'].includes(section.id)) && (
          <label>項目（1行に1件・見出し｜説明）<textarea rows={Math.max(3, section.points.length + 1)} value={pointsValue} onChange={(event) => updatePoints(event.target.value)} /></label>
        )}
        {section.buttonText !== undefined && <label>ボタン文言<input value={section.buttonText} onChange={(event) => set('buttonText', event.target.value)} /></label>}
      </div>
    </div>
  )
}

function PreviewBody({ section, contactUrl, isCleaning }: { section: DraftSection; contactUrl: string; isCleaning: boolean }) {
  const link = safeHttpUrl(contactUrl)
  const ctaButton = section.buttonText && (
    link ? <a className="lp-cta-button" href={link} target="_blank" rel="noopener noreferrer">{section.buttonText}<span aria-hidden="true">↗</span></a> :
      <span className="lp-cta-button lp-cta-visual" title="問い合わせURL未設定">{section.buttonText}<span aria-hidden="true">↗</span></span>
  )

  switch (section.id) {
    case 'hero': return (
      <div className="lp-section lp-hero">
        <div className="lp-hero-copy">
          <p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2><p className="lp-lead">{section.lead}</p>
          <p className="lp-body">{section.body}</p>{ctaButton}
          {!link && <p className="lp-link-note">リンク先未設定のため、ボタンはプレビュー表示です。</p>}
        </div>
        <div className={'lp-hero-art ' + (isCleaning ? 'art-cleaning' : 'art-general')} aria-hidden="true">
          {isCleaning ? <img src={cleaningImage} alt="" /> : <div className="generic-service-art"><span>SERVICE</span><strong>{section.title}</strong><i /><i /></div>}
        </div>
      </div>
    )
    case 'problems': return (
      <div className="lp-section lp-problems">
        <div className="lp-section-inner"><p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2><p className="lp-lead">{section.lead}</p>
          <div className="problem-grid">{section.points.map((point, index) => <div className="problem-card" key={index}><span>0{index + 1}</span><p>{point.title}</p>{point.text && <small>{point.text}</small>}</div>)}</div>
          <p className="lp-body lp-after-grid">{section.body}</p>
        </div>
      </div>
    )
    case 'empathy': return (
      <div className="lp-section lp-empathy"><div className="lp-section-inner narrow">
        <p className="lp-overline">{section.kicker}</p><span className="quote-mark" aria-hidden="true">“</span><h2>{section.title}</h2>
        <p className="lp-lead">{section.lead}</p><p className="lp-body">{section.body}</p>
      </div></div>
    )
    case 'solution': return (
      <div className="lp-section lp-solution"><div className="lp-section-inner solution-grid">
        <div><p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2></div>
        <div className="solution-text"><p className="lp-lead">{section.lead}</p><p className="lp-body">{section.body}</p></div>
      </div></div>
    )
    case 'service': return (
      <div className="lp-section lp-service"><div className="lp-section-inner service-grid">
        <div className={'service-picture ' + (isCleaning ? 'service-picture-cleaning' : 'service-picture-generic')} aria-hidden="true">
          {isCleaning ? <img src={cleaningImage} alt="" /> : <div className="generic-service-art"><span>SERVICE</span><strong>{section.title}</strong><i /><i /></div>}
        </div>
        <div><p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2><p className="lp-lead">{section.lead}</p><p className="lp-body">{section.body}</p>
          {section.points.length > 0 && <div className="service-facts">{section.points.map((point, index) => <p key={index}>{point.title}</p>)}</div>}
        </div>
      </div></div>
    )
    case 'strengths': return (
      <div className="lp-section lp-strengths"><div className="lp-section-inner">
        <p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2><p className="lp-lead">{section.lead}</p>
        {section.points.length ? <div className="strength-grid">{section.points.map((point, index) => <div className="strength-card" key={index}><span>0{index + 1}</span><h3>{point.title}</h3><p>{point.text}</p></div>)}</div> : <p className="empty-hint">{section.hint}</p>}
        {section.body && <p className="lp-body lp-after-grid">{section.body}</p>}
      </div></div>
    )
    case 'flow': return (
      <div className="lp-section lp-flow"><div className="lp-section-inner">
        <p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2>{section.lead && <p className="lp-lead">{section.lead}</p>}
        {section.points.length ? <div className="flow-list">{section.points.map((point, index) => <div className="flow-step" key={index}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{point.title}</h3>{point.text && <p>{point.text}</p>}</div></div>)}</div> : <p className="empty-hint">{section.hint}</p>}
        {section.body && <p className="lp-body lp-after-grid">{section.body}</p>}
      </div></div>
    )
    case 'faq': return (
      <div className="lp-section lp-faq"><div className="lp-section-inner narrow">
        <p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2>{section.lead && <p className="lp-lead">{section.lead}</p>}
        {section.points.length ? <div className="faq-list">{section.points.map((point, index) => <div className="faq-item" key={index}><div><b>Q.</b><h3>{point.title || '質問を入力してください'}</h3></div><p><b>A.</b>{point.text || '回答を入力してください。'}</p></div>)}</div> : <p className="empty-hint">{section.hint}</p>}
      </div></div>
    )
    case 'cta': return (
      <div className="lp-section lp-final-cta"><div className="lp-section-inner narrow">
        <p className="lp-overline">{section.kicker}</p><h2>{section.title}</h2><p className="lp-lead">{section.lead}</p><p className="lp-body">{section.body}</p>
        {ctaButton}{!link && <p className="lp-link-note">リンク先未設定のため、ボタンはプレビュー表示です。</p>}
      </div></div>
    )
  }
}

export function LpPreview({ draft, contactUrl, industry, serviceName, onUpdate, onCopy, copyMessage }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const isCleaning = /清掃|クリーニング|掃除/.test(industry + serviceName)
  return (
    <div className="preview-panel" id="preview-area">
      <div className="preview-heading">
        <div><span className="panel-kicker">OUTPUT / 完成イメージ</span><h2>あなたのLP構成案</h2><p>セクションの見せ方まで確認できます。文章はセクションごとに編集できます。</p></div>
        <Button variant="outline" type="button" onClick={onCopy}>文章をまとめてコピー</Button>
      </div>
      <p className="copy-status" role="status" aria-live="polite">{copyMessage}</p>
      <div className="preview-frame">
        <div className="browser-bar" aria-hidden="true"><span className="browser-dots"><i /><i /><i /></span><span className="browser-address">LP PREVIEW</span><span className="browser-menu">•••</span></div>
        <div className="preview-site-header"><strong>{draft.sections[0].kicker.split(' ・ ')[0] || serviceName}</strong><span>LP構成プレビュー</span></div>
        <article className="lp-document" aria-label="生成したLPの完成イメージ">
          {draft.sections.map((section, index) => (
            <div className="preview-block" key={section.id}>
              <div className="section-toolbar"><span>{String(index + 1).padStart(2, '0')} / {section.label}</span><button type="button" onClick={() => setEditingIndex(editingIndex === index ? null : index)} aria-expanded={editingIndex === index}>{editingIndex === index ? '編集を閉じる' : '文章を編集'}</button></div>
              <PreviewBody section={section} contactUrl={contactUrl} isCleaning={isCleaning} />
              {editingIndex === index && <EditPanel section={section} onChange={(updated) => onUpdate(index, updated)} onClose={() => setEditingIndex(null)} />}
            </div>
          ))}
        </article>
        <div className="preview-site-footer">{draft.sections[0].kicker.split(' ・ ')[0] || serviceName}<span>LP構成デモ</span></div>
      </div>
    </div>
  )
}

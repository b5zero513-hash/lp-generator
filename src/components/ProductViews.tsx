import type { LpDraft } from '../types'

const requiredInputs = [
  ['サービス', '業種、サービス名、提供内容'],
  ['お客様', '想定ターゲット、よくある悩み'],
  ['選ばれる理由', 'サービスの強み・特徴'],
]
const optionalInputs = [
  ['サービス情報', '屋号・店舗名、対応エリア、提供方法、利用後に望む状態'],
  ['提供条件', '利用の流れ、実績・資格・お客様の声、料金、期間・条件'],
  ['案内', 'FAQの質問と回答、問い合わせ方法・URL、CTA文言、文章の雰囲気'],
]

const sectionDetails: Record<string, string> = {
  hero: 'サービスを伝える見出し・補足・CTA',
  problems: '入力された悩みを読みやすく整理',
  empathy: '悩みに寄り添う短いメッセージ',
  solution: '提供内容と強みを悩みに結び付ける',
  service: 'サービス内容・対象・条件の紹介',
  strengths: '選ばれる理由を項目ごとに紹介',
  flow: '入力された利用手順を順番に表示',
  faq: '入力された質問と回答を掲載',
  cta: '問い合わせ方法に応じた次の行動',
}

export function Dashboard({ draft, industry, serviceName, onOpenDemo }: {
  draft: LpDraft
  industry: string
  serviceName: string
  onOpenDemo: () => void
}) {
  return <section className="product-view dashboard-view">
    <div className="product-view-intro">
      <span className="product-view-kicker">GENERATED STRUCTURE · 架空サンプル</span>
      <h1>LP構成の全体像</h1>
      <p>現在の生成案を、訴求軸・セクション一覧・完成イメージで確認できます。</p>
    </div>
    <div className="dashboard-summary-card">
      <div><span>訴求軸</span><strong>{draft.angle}</strong></div>
      <div className="dashboard-summary-meta"><span>{industry || '業種未入力'}</span><span>{serviceName || 'サービス名未入力'}</span></div>
      <button type="button" className="product-text-action" onClick={onOpenDemo}>入力・生成内容を編集する →</button>
    </div>
    <div className="dashboard-layout">
      <section className="composition-list" aria-labelledby="composition-heading">
        <div className="product-section-heading"><div><span className="product-view-kicker">PAGE STRUCTURE</span><h2 id="composition-heading">9セクションの構成</h2></div><span>LPの読み進め順</span></div>
        <ol>{draft.sections.map((section, index) => <li key={section.id}><span className="composition-number">{String(index + 1).padStart(2, '0')}</span><div><strong>{section.label}</strong><p>{section.title}</p><small>{sectionDetails[section.id] ?? '入力内容から作成した文章案'}</small></div></li>)}</ol>
      </section>
      <section className="composition-preview" aria-labelledby="composition-preview-heading">
        <div className="product-section-heading"><div><span className="product-view-kicker">PAGE PREVIEW</span><h2 id="composition-preview-heading">完成イメージ</h2></div><span>文章案 · 未公開</span></div>
        <div className="mini-lp-frame">
          <div className="mini-lp-toolbar"><span /><span /><span /><b>LP PREVIEW</b></div>
          <div className="mini-lp-body">
            {draft.sections.map((section, index) => <article className={`mini-lp-section mini-lp-${section.id}`} key={section.id}>
              <small>{String(index + 1).padStart(2, '0')} · {section.kicker || section.label}</small>
              <h3>{section.title}</h3>
              {section.lead && <p className="mini-lp-lead">{section.lead}</p>}
              {section.body && <p>{section.body}</p>}
              {section.points.length > 0 && <ul>{section.points.slice(0, 3).map((point, pointIndex) => <li key={`${section.id}-${pointIndex}`}>{point.title}{point.text && ` — ${point.text}`}</li>)}</ul>}
              {section.buttonText && <span className="mini-lp-button">{section.buttonText}</span>}
            </article>)}
          </div>
          <p className="mini-lp-disclaimer">生成した構成・文章案のプレビューです。公開ページではありません。</p>
        </div>
      </section>
    </div>
    <p className="product-sample-note">初期表示は架空の「そよかぜ住まいケア」のサンプルです。分析値や公開状態の指標は使用していません。</p>
  </section>
}

export function Specs() {
  return <section className="product-view specs-view">
    <div className="product-view-intro"><span className="product-view-kicker">PRODUCT SPECIFICATION</span><h1>入力から原稿の取り出しまで</h1><p>アプリでできることと、公開前に利用者が行うことをまとめています。</p></div>
    <section className="spec-block"><h2>入力項目</h2><div className="spec-columns">
      <div><span className="spec-badge required">必須</span><ul>{requiredInputs.map(([group, fields]) => <li key={group}><strong>{group}</strong><span>{fields}</span></li>)}</ul></div>
      <div><span className="spec-badge optional">任意</span><ul>{optionalInputs.map(([group, fields]) => <li key={group}><strong>{group}</strong><span>{fields}</span></li>)}</ul></div>
    </div><p className="spec-hint">料金・実績・期間などは、入力された情報だけを原稿へ反映します。空欄の事実を推測で補いません。</p></section>
    <div className="spec-card-grid">
      <section className="spec-block"><h2>9セクションの出力内容</h2><ol className="spec-section-list"><li>FV（ファーストビュー）</li><li>悩み</li><li>共感</li><li>解決策</li><li>サービス紹介</li><li>強み</li><li>利用の流れ</li><li>FAQ</li><li>CTA</li></ol></section>
      <section className="spec-block"><h2>生成・編集・コピー</h2><p>入力されたターゲット、悩み、提供内容、強みなどをもとに、訴求軸を選択し、各セクションの役割に合わせたテンプレートで文章案を作ります。同じ入力では同じ構成を生成します。生成後はセクション単位で編集し、原稿全体をテキストとしてコピーできます。</p><p>AI APIや外部の文章生成サービスは使用しません。</p></section>
    </div>
    <div className="spec-card-grid">
      <section className="spec-block"><h2>URLの扱い</h2><p>画面は <code>#demo</code>、<code>#dashboard</code>、<code>#specs</code>、<code>#diagram</code> で直接開けます。入力した問い合わせ先URLは <code>http://</code> または <code>https://</code> の場合だけ、生成LPプレビューのCTAリンクに使います。URL未入力時のCTAはプレビュー表示です。</p></section>
      <section className="spec-block"><h2>保存・送信・公開</h2><p>入力と生成原稿はブラウザー内だけで扱い、サーバー送信や永続保存はしません。生成原稿のコピー後の利用・公開は利用者が行います。このアプリからLPを公開したり、問い合わせを送信したりする機能はありません。</p></section>
    </div>
    <p className="spec-price-note">商品料金：未定</p>
  </section>
}

const flow = [
  ['01', 'サービス情報・ターゲット・悩みを入力', '伝えたいサービスとお客様の状況を整理'],
  ['02', '必須項目を確認', '業種、サービス、ターゲット、悩み、強みを確認'],
  ['03', '9セクションを生成', '入力内容に合わせて訴求軸と文章案を組み立て'],
  ['04', '編集・コピー', 'セクションごとに調整し、全体をテキストで取り出す'],
  ['05', '事実確認して公開準備', '利用者が内容を確認し、公開方法を別途用意'],
]

export function Diagram() {
  return <section className="product-view diagram-view">
    <div className="product-view-intro"><span className="product-view-kicker">HOW IT WORKS</span><h1>素材を、伝わるページ構成へ</h1><p>入力した情報が、確認・編集できる9セクションの草案になります。</p></div>
    <div className="lp-flow-diagram" aria-label="サービス情報・ターゲット・悩みを入力し、必須項目を確認して9セクションを生成、編集・コピーし、利用者が事実確認して公開準備する流れ">
      {flow.map(([number, title, description], index) => <div className="lp-flow-item" key={number}><article><span className="lp-flow-number">{number}</span><div className="lp-flow-node-icon" aria-hidden="true">{['✎', '✓', '▤', '↗', '○'][index]}</div><h2>{title}</h2><p>{description}</p>{index === 2 && <small>FV · 悩み · 共感 · 解決策 · サービス · 強み · 流れ · FAQ · CTA</small>}</article>{index < flow.length - 1 && <span className="lp-flow-arrow" aria-hidden="true">→</span>}</div>)}
    </div>
    <div className="flow-result"><span>出力</span><strong>編集できるLP構成案</strong><p>HTML生成や公開は行わず、原稿を利用者が確認して次の工程へ進みます。</p></div>
  </section>
}

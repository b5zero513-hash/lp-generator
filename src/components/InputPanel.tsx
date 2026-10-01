import type { LpInput } from '../types'
import { Button } from './Button'
import { FormField } from './FormField'

export type TextField = Exclude<keyof LpInput, 'faq' | 'tone'>

interface Props {
  input: LpInput
  invalid: TextField[]
  onChange: (field: TextField, value: string) => void
  onToneChange: (value: LpInput['tone']) => void
  onFaqChange: (index: number, field: 'question' | 'answer', value: string) => void
  onGenerate: () => void
  onReset: () => void
}

export function InputPanel({ input, invalid, onChange, onToneChange, onFaqChange, onGenerate, onReset }: Props) {
  const field = (name: TextField, label: string, options: { required?: boolean; hint?: string; placeholder?: string; multiline?: boolean; rows?: number } = {}) => (
    <FormField id={'field-' + name} label={label} value={input[name]} onChange={(value) => onChange(name, value)}
      invalid={invalid.includes(name)} {...options} />
  )

  return (
    <div className="input-panel" id="input-area">
      <div className="panel-heading">
        <div><span className="panel-kicker">INPUT / お店の情報</span><h2>まずは、伝えたいことを入力</h2></div>
        <p>入力例を編集しても、そのまま作成しても大丈夫です。</p>
      </div>

      <div className="sample-note">
        <span className="sample-note-icon" aria-hidden="true">01</span>
        <div><strong>入力例を用意しています</strong><p>地域密着型のハウスクリーニングを題材に、完成イメージをすぐ試せます。</p></div>
        <Button variant="quiet" type="button" onClick={onReset}>入力例に戻す</Button>
      </div>

      <div className="form-stack">
        <section className="form-group" aria-labelledby="group-service">
          <div className="group-heading"><span>01</span><div><h3 id="group-service">サービスについて</h3><p>名前と内容を教えてください</p></div></div>
          <div className="field-grid">
            {field('industry', '業種', { required: true, placeholder: '例：地域密着型のハウスクリーニング' })}
            {field('businessName', '屋号・店舗名', { placeholder: '例：そよかぜ住まいケア' })}
            {field('serviceName', 'サービス名', { required: true, placeholder: '例：浴室クリーニング' })}
            {field('area', '対応エリア', { placeholder: '例：東京都世田谷区周辺' })}
            <div className="field-span">{field('description', 'サービスの具体的な内容', { required: true, multiline: true, rows: 3, hint: '実際に提供する内容だけを記入してください。' })}</div>
            {field('delivery', '提供方法', { placeholder: '例：ご自宅への訪問' })}
          </div>
        </section>

        <section className="form-group" aria-labelledby="group-customer">
          <div className="group-heading"><span>02</span><div><h3 id="group-customer">お客様と悩み</h3><p>誰の、どんな気がかりに応えるか</p></div></div>
          <div className="field-grid">
            <div className="field-span">{field('target', '想定するお客様', { required: true, placeholder: '例：仕事や家事で忙しい近隣の方' })}</div>
            <div className="field-span">{field('concerns', 'よくある悩み', { required: true, multiline: true, rows: 4, hint: '1行に1件。実際に耳にする言葉で書くと、見出しが自然になります。' })}</div>
            <div className="field-span">{field('outcome', 'お客様が望む状態', { placeholder: '例：掃除を任せ、家事の負担を見直したい' })}</div>
          </div>
        </section>

        <section className="form-group" aria-labelledby="group-strength">
          <div className="group-heading"><span>03</span><div><h3 id="group-strength">選ばれる理由</h3><p>事実に基づく強みを言葉にします</p></div></div>
          <div className="field-grid">
            <div className="field-span">{field('strengths', '強み・特徴', { required: true, multiline: true, rows: 5, hint: '1行に1件。「見出し｜具体的な説明」の形でも入力できます。' })}</div>
            <div className="field-span">{field('steps', '利用の流れ', { multiline: true, rows: 4, hint: '1行に1段階。「手順名｜説明」の形で入力できます。' })}</div>
          </div>
          <details className="optional-details">
            <summary>料金・実績・条件も入力する</summary>
            <div className="field-grid optional-grid">
              <div className="field-span">{field('proof', '実績・資格・お客様の声', { multiline: true, rows: 2, hint: '公開できる、確認済みの内容だけを入力してください。' })}</div>
              {field('price', '料金', { placeholder: '例：料金表の表記どおりに入力' })}
              {field('terms', '期間・条件・対象外', { placeholder: '例：対象サービスや適用条件' })}
            </div>
          </details>
        </section>

        <section className="form-group" aria-labelledby="group-contact">
          <div className="group-heading"><span>04</span><div><h3 id="group-contact">よくある質問とご案内</h3><p>読み手の不安を残さず、次の行動へ</p></div></div>
          <div className="faq-inputs">
            {input.faq.map((entry, index) => (
              <div className="faq-input-row" key={index}>
                <span className="faq-input-number">Q{index + 1}</span>
                <FormField id={'faq-q-' + index} label="質問" value={entry.question} onChange={(value) => onFaqChange(index, 'question', value)} placeholder="例：作業範囲は事前に確認できますか？" />
                <FormField id={'faq-a-' + index} label="回答" value={entry.answer} onChange={(value) => onFaqChange(index, 'answer', value)} placeholder="確認済みの回答を入力" />
              </div>
            ))}
          </div>
          <div className="field-grid contact-grid">
            {field('contactMethod', '問い合わせ方法', { placeholder: '例：Webフォーム、電話、LINE' })}
            {field('contactUrl', '問い合わせ先URL', { placeholder: 'https://...', hint: '実在するURLがある場合だけ入力してください。' })}
            <div className="field-span">{field('action', 'ボタンで促す行動', { placeholder: '例：浴室清掃について相談する' })}</div>
            <div className="form-field field-span"><label className="field-label" htmlFor="field-tone">文章の雰囲気<span className="optional-badge">任意</span></label>
              <select id="field-tone" value={input.tone} onChange={(event) => onToneChange(event.target.value as LpInput['tone'])}>
                <option>やさしい</option><option>誠実</option><option>親しみやすい</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="form-footer">
        <p>入力内容は送信・保存されません。生成文は公開前に事実をご確認ください。</p>
        <Button type="button" className="generate-button" onClick={onGenerate}>この内容でLP構成を作成 <span aria-hidden="true">→</span></Button>
      </div>
    </div>
  )
}

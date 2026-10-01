import type { DraftPoint, DraftSection, LpDraft, LpInput } from '../types'

const clean = (value: string) => value.trim().replace(/[ \t]+/g, ' ')
const withoutStop = (value: string) => clean(value).replace(/[。！？!?]+$/, '')
const withStop = (value: string) => {
  const text = clean(value)
  return text && !/[。！？!?]$/.test(text) ? text + '。' : text
}

function lines(value: string): string[] {
  return value.split(/\r?\n|[;；]/).map(clean).filter(Boolean)
}

function detailPoints(value: string): DraftPoint[] {
  return lines(value).map((line) => {
    const [title, ...detail] = line.split('｜')
    return { title: clean(title), text: clean(detail.join('｜')) }
  })
}

type Angle = 'time' | 'clarity' | 'quality' | 'flexibility' | 'personal'

function count(text: string, words: string[]) {
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0)
}

function chooseAngle(input: LpInput): Angle {
  const concernText = input.concerns + ' ' + input.target
  const featureText = input.strengths + ' ' + input.description
  const scores: Record<Angle, number> = {
    time: count(concernText, ['忙し', '時間', '手が回', '手間', '負担']) * 3 + count(featureText, ['時間', '手間']),
    clarity: count(concernText, ['不安', '分から', 'わから', '迷', '料金', '初めて']) * 3 + count(featureText, ['事前', '説明', '確認', '相談']),
    quality: count(concernText, ['仕上がり', '品質', '細か', '汚れ', 'きれい']) * 2 + count(featureText, ['丁寧', '品質', '技術', '細か']),
    flexibility: count(concernText, ['近く', '地域', '訪問', '通え', '日程']) * 2 + count(featureText, ['地域', '訪問', '柔軟', '日程']),
    personal: 1,
  }
  return (Object.keys(scores) as Angle[]).reduce((best, angle) => scores[angle] > scores[best] ? angle : best, 'personal')
}

const angleLabels: Record<Angle, string> = {
  time: '時間の負担を軽くする',
  clarity: '相談前の不安を減らす',
  quality: '気になる箇所と向き合う',
  flexibility: '身近な選択肢を伝える',
  personal: 'サービスの価値を伝える',
}

function headline(angle: Angle, service: string, concern: string): string {
  switch (angle) {
    case 'time': return '手が回らない毎日に、' + service + 'という選択。'
    case 'clarity': return '迷っている今こそ、' + service + 'の内容を確かめてください。'
    case 'quality': return '「' + concern + '」に、' + service + 'から向き合う。'
    case 'flexibility': return '身近なところから始める、' + service + '。'
    default: return 'あなたの「' + concern + '」に、' + service + 'という選択。'
  }
}

function actionLabel(angle: Angle, service: string): string {
  switch (angle) {
    case 'clarity': return service + 'の内容を確認する'
    case 'quality': return service + 'の対応範囲を相談する'
    case 'flexibility': return service + 'の利用について相談する'
    default: return service + 'について相談する'
  }
}

function problemClose(angle: Angle): string {
  switch (angle) {
    case 'time': return '時間を作ろうと思うほど、ほかの予定も重なっていく。気になることを後回しにせず、頼れる方法を整理してみませんか。'
    case 'clarity': return '内容や条件が見えないままでは、相談するかどうかも決めにくいもの。まずは気になる点から確かめることができます。'
    case 'quality': return '気になっているところが具体的だからこそ、どこまで対応してもらえるのかを知ることが大切です。'
    case 'flexibility': return '自分の地域や予定に合うかどうか。その確認から、無理のない一歩が始まります。'
    default: return '小さな気がかりでも、毎日の中では見過ごせないことがあります。まずは今の状況を言葉にしてみてください。'
  }
}

function strengthBody(point: DraftPoint, angle: Angle): string {
  if (point.text) return withStop(point.text)
  if (/事前|説明|確認|範囲|見積/.test(point.title)) return '内容を確かめてから検討したい方に向けた、サービスの特徴です。'
  if (/地域|訪問|近く/.test(point.title)) return '対応エリアや提供方法を確認する際の、具体的な判断材料になります。'
  if (angle === 'time') return '忙しい中で依頼先を選ぶときに、確認しておきたい特徴です。'
  return 'サービスを比較・検討するときに、確認しておきたい特徴です。'
}

export function safeHttpUrl(value: string): string | undefined {
  if (!clean(value)) return undefined
  try {
    const url = new URL(clean(value))
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch {
    return undefined
  }
}

export function generateDraft(input: LpInput): LpDraft {
  const angle = chooseAngle(input)
  const service = clean(input.serviceName)
  const business = clean(input.businessName)
  const industry = clean(input.industry)
  const target = clean(input.target)
  const description = withStop(input.description)
  const area = clean(input.area)
  const delivery = clean(input.delivery)
  const concerns = lines(input.concerns).slice(0, 4)
  const strengths = detailPoints(input.strengths).slice(0, 4)
  const steps = detailPoints(input.steps).slice(0, 6)
  const firstConcern = withoutStop(concerns[0] || '今の悩み')
  const shortConcern = firstConcern.length > 26 ? firstConcern.slice(0, 26) + '…' : firstConcern
  const firstStrength = strengths[0]?.title || ''
  const action = clean(input.action) || actionLabel(angle, service)
  const contact = clean(input.contactMethod)
  const softInvitation = input.tone === '親しみやすい' ? 'まずは気になることから、話してみませんか。' :
    input.tone === '誠実' ? '内容をご確認のうえ、ご検討ください。' : 'まずは気になることをお聞かせください。'

  const hero: DraftSection = {
    id: 'hero', label: 'FV', kicker: [business || industry, area].filter(Boolean).join(' ・ '),
    title: headline(angle, service, shortConcern),
    lead: target + 'へ。' + description,
    body: firstStrength ? withStop(firstStrength) + softInvitation : softInvitation,
    points: [], buttonText: action,
  }

  const problems: DraftSection = {
    id: 'problems', label: '悩み', kicker: 'こんな気がかりはありませんか',
    title: angle === 'time' ? '気になっていても、手を付ける時間がない。' :
      angle === 'clarity' ? '気になるのに、頼み方が分からない。' : 'その気がかり、後回しになっていませんか。',
    lead: target + 'が感じやすい、日々の困りごと。まずは一つずつ整理してみましょう。',
    body: problemClose(angle),
    points: concerns.map((title) => ({ title: withStop(title), text: '' })),
  }

  const empathy: DraftSection = {
    id: 'empathy', label: '共感', kicker: 'あなたの暮らしに寄り添って',
    title: '「' + shortConcern + '」。その気がかりを、置き去りにしないために。',
    lead: angle === 'time' ? '気になることがあっても、毎日の予定の中で時間を作るのは簡単ではありません。' :
      angle === 'clarity' ? '頼む前に内容を知りたい。その疑問を残したまま決める必要はありません。' :
        '気になる点が具体的だからこそ、自分に合う方法を確かめたいものです。',
    body: '「' + firstConcern + '」と感じているなら、今の状況から相談の内容を考えてみてください。' +
      (clean(input.outcome) ? '「' + withoutStop(input.outcome) + '」という希望も、依頼の内容を整理する手がかりになります。' :
        '何を頼みたいかを整理することが、次の一歩につながります。'),
    points: [],
  }

  const solution: DraftSection = {
    id: 'solution', label: '解決策', kicker: 'このサービスでできること',
    title: angle === 'clarity' && firstStrength ? 'まず内容を知ることから、始められます。' :
      angle === 'time' ? '任せる範囲を決めて、時間の使い方を見直す。' :
        service + 'で、気になることに向き合う。',
    lead: '「' + firstConcern + '」という気がかりに、' + service + 'という方法があります。',
    body: firstStrength ? 'そのうえで大切にしているのは、「' + withoutStop(firstStrength) + '」という点。' +
      '「' + firstConcern + '」と感じている方が、内容を確かめながら検討できるようにご案内します。' :
      '「' + firstConcern + '」という気がかりについて、提供内容を確認しながらご検討いただけます。',
    points: [],
  }

  const serviceFacts = [area ? '対応エリア：' + area : '', delivery ? '提供方法：' + delivery : '',
    clean(input.price) ? '料金：' + clean(input.price) : '', clean(input.terms) ? '条件：' + clean(input.terms) : '']
    .filter(Boolean).map((title) => ({ title, text: '' }))
  const serviceSection: DraftSection = {
    id: 'service', label: 'サービス紹介', kicker: industry,
    title: service + 'について',
    lead: description,
    body: business ? business + 'が、' + target + 'に向けてご案内するサービスです。' +
      (area ? area + 'でのご利用を想定しています。' : '') :
      target + 'に向けたサービスです。' + (area ? area + 'でのご利用を想定しています。' : ''),
    points: serviceFacts,
  }

  const strengthSection: DraftSection = {
    id: 'strengths', label: '強み', kicker: '選ぶ前に知ってほしいこと',
    title: strengths.length > 1 ? '私たちが大切にする、' + strengths.length + 'つのこと。' : 'サービスで大切にしていること。',
    lead: service + 'を検討するときは、作業や対応の中身も確かめてください。',
    body: clean(input.proof) ? '実績・資格・お客様の声：' + withStop(input.proof) : '',
    points: strengths.map((point) => ({ title: withStop(point.title), text: strengthBody(point, angle) })),
    hint: strengths.length ? undefined : '強みを入力すると、ここに紹介文を表示できます。',
  }

  const flow: DraftSection = {
    id: 'flow', label: '利用の流れ', kicker: 'ご利用までの道筋',
    title: 'ご相談から' + service + 'まで。',
    lead: steps.length ? '最初のご相談からサービスの提供まで、手順を順番にご覧ください。' : '',
    body: '',
    points: steps.map((point) => ({ title: withStop(point.title), text: point.text ? withStop(point.text) : '' })),
    hint: steps.length ? undefined : '実際の利用手順を入力すると、ここに掲載できます。',
  }

  const faqEntries = input.faq.filter((entry) => clean(entry.question) || clean(entry.answer)).slice(0, 3)
  const faq: DraftSection = {
    id: 'faq', label: 'FAQ', kicker: 'よくあるご質問',
    title: '気になる点を、先に確かめてください。',
    lead: faqEntries.length ? 'お問い合わせ前によくある質問をまとめました。内容を確認してからご相談いただけます。' : '',
    body: '',
    points: faqEntries.map((entry) => ({ title: clean(entry.question), text: clean(entry.answer) })),
    hint: faqEntries.length ? undefined : '質問と回答を入力すると、ここに掲載できます。',
  }

  const cta: DraftSection = {
    id: 'cta', label: 'CTA', kicker: 'まずは、気になることから',
    title: angle === 'time' ? 'その気がかり、相談するところから始めませんか。' :
      angle === 'clarity' ? '迷っていることも、そのまま聞かせてください。' :
        service + 'について、話してみませんか。',
    lead: '「' + firstConcern + '」という今の気持ちや、ご希望をお伝えください。' +
      (contact ? 'ご連絡は' + contact + 'から。' : ''),
    body: contact ? 'ご相談時は「' + withoutStop(description.split('。')[0]) + '」という提供内容や、「' +
      withoutStop(firstStrength || service) + '」という特徴についても、気になる点をお聞かせください。' :
      '問い合わせ方法を入力すると、具体的な案内文を完成できます。',
    points: [], buttonText: action,
    hint: contact ? undefined : '問い合わせ方法が未入力です。',
  }

  return { angle: angleLabels[angle], sections: [hero, problems, empathy, solution, serviceSection, strengthSection, flow, faq, cta] }
}

export function draftAsText(draft: LpDraft): string {
  return draft.sections.map((section) => {
    const pointLines = section.points.map((point) => point.title + (point.text ? '\n' + point.text : '')).join('\n\n')
    return [section.label, section.kicker, section.title, section.lead, section.body, pointLines,
      section.buttonText ? 'CTA：' + section.buttonText : ''].filter(Boolean).join('\n\n')
  }).join('\n\n────────────────\n\n')
}

interface Props {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  placeholder?: string
  required?: boolean
  invalid?: boolean
  multiline?: boolean
  rows?: number
}

export function FormField({ id, label, value, onChange, hint, placeholder, required, invalid, multiline, rows = 3 }: Props) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="field-label">
        {label}<span className={required ? 'required-badge' : 'optional-badge'}>{required ? '必須' : '任意'}</span>
      </label>
      {multiline ? (
        <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
          rows={rows} aria-invalid={invalid || undefined} aria-describedby={hint ? id + '-hint' : undefined} />
      ) : (
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
          aria-invalid={invalid || undefined} aria-describedby={hint ? id + '-hint' : undefined} />
      )}
      {hint && <p className="field-hint" id={id + '-hint'}>{hint}</p>}
      {invalid && <p className="field-error">入力してください。</p>}
    </div>
  )
}

export type ValidationRule = {
  type: 'required' | 'minLength' | 'email' | 'password' | 'passwordMatch' | 'nameFormat'
  value?: number
  message: string
}

export interface FormField {
  value: any
  rules: ValidationRule[]
}

export interface FormFields {
  [key: string]: FormField
}

export interface ValidationError {
  field: string
  message: string
}

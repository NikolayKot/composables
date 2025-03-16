import { ref, computed } from 'vue'
import type { FormFields, ValidationError } from '@/types/validation'

export function useFormValidation(formFields: FormFields) {
  const errors = ref<ValidationError[]>([])
  const isValid = computed(() => errors.value.length === 0)
  const isDirty = ref(false)

  const validationRules = {
    required: (value: any): boolean => {
      return value !== undefined && value !== null && value !== ''
    },
    minLength: (value: string, min: number): boolean => {
      return String(value).length >= min
    },
    email: (value: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    password: (value: string): boolean => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
      return passwordRegex.test(value)
    },
    passwordMatch: (value: string): boolean => {
      return value === formFields.password.value
    },
    nameFormat: (value: string): boolean => {
      const nameRegex = /^[\p{L}\s-]+$/u
      return nameRegex.test(value)
    },
  }

  const validateField = (fieldName: string, field: FormField) => {
    const fieldErrors: ValidationError[] = []

    field.rules.forEach((rule) => {
      const isValid = validationRules[rule.type as keyof typeof validationRules]

      if (isValid && !isValid(field.value, rule.value)) {
        fieldErrors.push({
          field: fieldName,
          message: rule.message,
        })
      }
    })

    return fieldErrors
  }

  const validateForm = () => {
    isDirty.value = true
    errors.value = []

    Object.entries(formFields).forEach(([fieldName, field]) => {
      const fieldErrors = validateField(fieldName, field)
      errors.value.push(...fieldErrors)
    })

    return isValid.value
  }

  return {
    errors,
    isValid,
    isDirty,
    validateForm,
    validateField,
  }
}

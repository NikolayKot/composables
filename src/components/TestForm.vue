<script setup lang="ts">
import { reactive } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import type { FormFields } from '@/types/validation'

const formFields: FormFields = reactive({
  firstName: {
    value: '',
    rules: [
      { type: 'required', message: 'Имя обязательно для заполнения' },
      { type: 'minLength', value: 2, message: 'Имя должно содержать минимум 2 символа' },
      { type: 'nameFormat', message: 'Имя может содержать только буквы, пробел и дефис' },
    ],
  },
  lastName: {
    value: '',
    rules: [
      { type: 'required', message: 'Фамилия обязательна для заполнения' },
      { type: 'minLength', value: 2, message: 'Фамилия должна содержать минимум 2 символа' },
      { type: 'nameFormat', message: 'Фамилия может содержать только буквы, пробел и дефис' },
    ],
  },
  email: {
    value: '',
    rules: [
      { type: 'required', message: 'Email обязателен для заполнения' },
      { type: 'email', message: 'Неверный формат email' },
    ],
  },
  password: {
    value: '',
    rules: [
      { type: 'required', message: 'Пароль обязателен для заполнения' },
      { type: 'minLength', value: 8, message: 'Пароль должен содержать минимум 8 символов' },
      {
        type: 'password',
        message: 'Пароль должен содержать хотя бы одну цифру и одну заглавную букву',
      },
    ],
  },
  passwordConfirm: {
    value: '',
    rules: [
      { type: 'required', message: 'Подтверждение пароля обязательно' },
      { type: 'passwordMatch', message: 'Пароли не совпадают' },
    ],
  },
})

const { errors, isValid, validateForm } = useFormValidation(formFields)

const hasFieldError = (fieldName: string) => {
  return errors.value.some((error) => error.field === fieldName)
}

const getFieldErrors = (fieldName: string) => {
  return errors.value.filter((error) => error.field === fieldName)
}

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Form is valid!', formFields)
  } else {
    console.log('Form has errors!')
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">Имя:</label>
        <input
          id="firstName"
          v-model="formFields.firstName.value"
          type="text"
          :class="{ error: hasFieldError('firstName') }"
        />
        <div class="field-errors">
          <p
            v-for="error in getFieldErrors('firstName')"
            :key="error.message"
            class="error-message"
          >
            {{ error.message }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label for="lastName">Фамилия:</label>
        <input
          id="lastName"
          v-model="formFields.lastName.value"
          type="text"
          :class="{ error: hasFieldError('lastName') }"
        />
        <div class="field-errors">
          <p v-for="error in getFieldErrors('lastName')" :key="error.message" class="error-message">
            {{ error.message }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="formFields.email.value"
          type="email"
          :class="{ error: hasFieldError('email') }"
        />
        <div class="field-errors">
          <p v-for="error in getFieldErrors('email')" :key="error.message" class="error-message">
            {{ error.message }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          id="password"
          v-model="formFields.password.value"
          type="password"
          :class="{ error: hasFieldError('password') }"
        />
        <div class="field-errors">
          <p v-for="error in getFieldErrors('password')" :key="error.message" class="error-message">
            {{ error.message }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label for="passwordConfirm">Подтвердите пароль:</label>
        <input
          id="passwordConfirm"
          v-model="formFields.passwordConfirm.value"
          type="password"
          :class="{ error: hasFieldError('passwordConfirm') }"
        />
        <div class="field-errors">
          <p
            v-for="error in getFieldErrors('passwordConfirm')"
            :key="error.message"
            class="error-message"
          >
            {{ error.message }}
          </p>
        </div>
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #4caf50;
      }

      &.error {
        border-color: #ff4444;
        background-color: #fff8f8;
      }
    }

    .field-errors {
      min-height: 20px;
      margin-top: 0.25rem;

      .error-message {
        color: #ff4444;
        font-size: 0.875rem;
        margin: 0.25rem 0;
      }
    }
  }

  button {
    width: 100%;
    background-color: #4caf50;
    color: white;
    padding: 0.875rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #4caf50;
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>

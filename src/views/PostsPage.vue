<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHttp } from '@/composables/useHttp'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

const http = useHttp({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

const posts = ref<Post[]>([])
const isLoadingPosts = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const isEditing = ref(false)
const editingPostId = ref<number | null>(null)

const postForm = ref({
  title: '',
  body: '',
})

// Загрузка постов
const fetchPosts = async () => {
  isLoadingPosts.value = true
  error.value = null

  try {
    const response = await http.get<Post[]>('/posts', {
      params: { _limit: '10' },
    })

    if (response.isSuccess && response.data) {
      posts.value = response.data
    } else {
      throw new Error('Не удалось загрузить посты')
    }
  } catch (e) {
    error.value = 'Ошибка при загрузке постов'
    console.error(e)
  } finally {
    isLoadingPosts.value = false
  }
}

// Создание/редактирование поста
const handleSubmit = async () => {
  isLoading.value = true

  try {
    if (isEditing.value && editingPostId.value) {
      // Редактирование существующего поста
      const response = await http.put<Post>(`/posts/${editingPostId.value}`, {
        ...postForm.value,
        userId: 1,
      })

      if (response.isSuccess && response.data) {
        const index = posts.value.findIndex((p) => p.id === editingPostId.value)
        if (index !== -1) {
          posts.value[index] = response.data
        }
      }
    } else {
      // Создание нового поста
      const response = await http.post<Post>('/posts', {
        ...postForm.value,
        userId: 1,
      })

      if (response.isSuccess && response.data) {
        posts.value.unshift(response.data)
      }
    }

    resetForm()
  } catch (e) {
    console.error('Ошибка при сохранении поста:', e)
  } finally {
    isLoading.value = false
  }
}

// Удаление поста
const deletePost = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот пост?')) return

  try {
    const response = await http.delete(`/posts/${id}`)

    if (response.isSuccess) {
      posts.value = posts.value.filter((post) => post.id !== id)
    }
  } catch (e) {
    console.error('Ошибка при удалении поста:', e)
  }
}

// Редактирование поста
const editPost = (post: Post) => {
  postForm.value.title = post.title
  postForm.value.body = post.body
  editingPostId.value = post.id
  isEditing.value = true
}

// Отмена редактирования
const cancelEdit = () => {
  resetForm()
}

// Сброс формы
const resetForm = () => {
  postForm.value.title = ''
  postForm.value.body = ''
  isEditing.value = false
  editingPostId.value = null
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="posts-page">
    <h1>Управление постами</h1>

    <div class="post-form">
      <h3 class="post-form-title">{{ isEditing ? 'Редактировать пост' : 'Создать новый пост' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Заголовок</label>
          <input id="title" v-model="postForm.title" type="text" required />
        </div>
        <div class="form-group">
          <label for="body">Содержание</label>
          <textarea id="body" v-model="postForm.body" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="isLoading">
            {{ isEditing ? 'Сохранить' : 'Создать' }}
          </button>
          <button v-if="isEditing" type="button" @click="cancelEdit">Отменить</button>
        </div>
      </form>
    </div>

    <div class="posts-list">
      <h3>Список постов</h3>
      <div v-if="isLoadingPosts" class="loading">Загрузка постов...</div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="posts">
        <div v-for="post in posts" :key="post.id" class="post-item">
          <div class="post-content">
            <h4>{{ post.title }}</h4>
            <p>{{ post.body }}</p>
          </div>
          <div class="post-actions">
            <button @click="editPost(post)">Редактировать</button>
            <button @click="deletePost(post.id)" class="delete">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.posts-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;

  h1 {
    text-align: center;
    color: #ffffff;
    margin-bottom: 2rem;
  }
}

.post-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  &-title {
    color: #555;
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #2196f3;
      }
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:first-child {
      background-color: #2196f3;
      color: white;

      &:hover:not(:disabled) {
        background-color: #1b7ecf;
        color: white;
      }
    }

    &:last-child {
      background-color: #f5f5f5;
      color: #333;

      &:hover {
        background-color: #dddddd;
      }
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.posts-list {
  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .error {
    color: #f44336;
  }
}

.post-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  .post-content {
    h4 {
      margin: 0 0 0.5rem;
      color: #333;
    }

    p {
      color: #666;
      margin: 0;
    }
  }

  .post-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;

      &:first-child {
        background-color: #4caf50;
        color: white;

        &:hover {
          background-color: #419644;
        }
      }

      &.delete {
        background-color: #f44336;
        color: white;

        &:hover {
          background-color: #db3c30;
        }
      }
    }
  }
}
</style>

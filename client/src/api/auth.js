import { API_BASE_URL } from './http'

const ADMIN_TOKEN_KEY = 'admin_token'

function setToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

function clearToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const payload = await response.json()

  if (!response.ok || !payload.ok) {
    throw new Error(payload?.error?.message || 'Login failed')
  }

  const token = payload?.data?.token
  if (!token) {
    throw new Error('Login failed')
  }

  setToken(token)
  return payload.data
}

export function getToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function logout() {
  clearToken()
}

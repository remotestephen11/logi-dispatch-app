import { API_BASE_URL } from './http'
import { getToken, logout } from './auth'

function authHeaders() {
  const token = getToken()
  if (!token) {
    throw new Error('Missing admin token')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })

  const payload = await response.json()

  if (response.status === 401) {
    logout()
  }

  if (!response.ok || !payload.ok) {
    throw new Error(payload?.error?.message || 'Request failed')
  }

  return payload.data
}

export function fetchAdminSummary() {
  return request('/api/admin/summary')
}

export function fetchQuotes() {
  return request('/api/admin/quotes')
}

export function updateQuoteStatus(id, status) {
  return request(`/api/admin/quotes/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
}

export function fetchAdminBlog() {
  return request('/api/admin/blog')
}

export function createBlogPost(payload) {
  return request('/api/admin/blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateBlogPost(id, payload) {
  return request(`/api/admin/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteBlogPost(id) {
  return request(`/api/admin/blog/${id}`, {
    method: 'DELETE',
  })
}

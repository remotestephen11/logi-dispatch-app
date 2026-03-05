import { API_BASE_URL } from './http'
import { getToken } from './auth'

function authHeaders() {
  const token = getToken()
  if (!token) {
    throw new Error('Missing admin token')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, options)
  const payload = await response.json()

  if (!response.ok || !payload.ok) {
    throw new Error(payload?.error?.message || 'Request failed')
  }

  return payload.data
}

export function fetchQuotes() {
  return request(`${API_BASE_URL}/api/admin/quotes`, {
    headers: {
      ...authHeaders(),
    },
  })
}

export function updateQuoteStatus(id, status) {
  return request(`${API_BASE_URL}/api/admin/quotes/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  })
}

export function fetchMessages() {
  return request(`${API_BASE_URL}/api/admin/messages`, {
    headers: {
      ...authHeaders(),
    },
  })
}

export function updateMessageStatus(id, status) {
  return request(`${API_BASE_URL}/api/admin/messages/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  })
}

export function fetchAdminBlog() {
  return request(`${API_BASE_URL}/api/admin/blog`, {
    headers: {
      ...authHeaders(),
    },
  })
}

export function createBlogPost(payload) {
  return request(`${API_BASE_URL}/api/admin/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  })
}

export function updateBlogPost(id, payload) {
  return request(`${API_BASE_URL}/api/admin/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  })
}

export function deleteBlogPost(id) {
  return request(`${API_BASE_URL}/api/admin/blog/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  })
}

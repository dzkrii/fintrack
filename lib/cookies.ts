// Cookie utilities for layout state persistence

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
  return undefined
}

export function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

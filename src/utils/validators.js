export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return re.test(phone)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validatePostalCode = (code) => {
  const re = /^[0-9]{5}$/
  return re.test(code)
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
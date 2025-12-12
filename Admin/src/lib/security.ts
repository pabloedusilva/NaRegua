// Security utilities

export const security = {
  sanitizeInput: (input: string): string => {
    return input.replace(/[<>]/g, '')
  },

  validateEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  hashPassword: async (password: string): Promise<string> => {
    // TODO: Implement password hashing (use bcrypt or similar on backend)
    return password
  },
}

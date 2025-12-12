export interface Notification {
  id: string
  type: 'email' | 'push' | 'sms'
  recipient: string
  subject: string
  message: string
  status: 'pending' | 'sent' | 'failed'
  sentAt?: string
  createdAt: string
}

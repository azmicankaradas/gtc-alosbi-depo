/**
 * Input Sanitization Utility
 * HTML entity encoding, max-length kontrolleri ve genel sanitizasyon
 * 
 * Not: Supabase zaten parameterized query kullanır, bu katman
 * ekstra XSS koruması ve input temizliği sağlar.
 */

/**
 * HTML özel karakterlerini encode eder (XSS koruması)
 */
export function escapeHtml(str: string): string {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    }
    return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char)
}

/**
 * String'i trim & max uzunluk ile sınırlar
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
    return input.trim().slice(0, maxLength)
}

/**
 * Sayı input'unu güvenli şekilde parse eder
 */
export function sanitizeNumber(input: string, min: number = 0, max: number = 999999): number | null {
    const num = parseInt(input, 10)
    if (isNaN(num)) return null
    if (num < min || num > max) return null
    return num
}

/**
 * E-posta formatını kontrol eder
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email) && email.length <= 254
}

/**
 * Tehlikeli karakterleri ve pattern'leri temizler
 * SQL injection pattern'lerini tespit eder (ekstra katman)
 */
export function containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION)\b)/i,
        /<script\b[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i, // onclick=, onerror=, etc.
        /data:\s*text\/html/i,
    ]
    return suspiciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Genel amaçlı input sanitizasyonu
 * Tüm form input'ları için kullanılabilir
 */
export function sanitizeInput(input: string, options?: {
    maxLength?: number
    allowHtml?: boolean
    checkSuspicious?: boolean
}): { value: string; isSuspicious: boolean } {
    const maxLength = options?.maxLength ?? 255
    const allowHtml = options?.allowHtml ?? false
    const checkSuspicious = options?.checkSuspicious ?? true

    let value = sanitizeString(input, maxLength)

    const isSuspicious = checkSuspicious ? containsSuspiciousPatterns(value) : false

    if (!allowHtml) {
        value = escapeHtml(value)
    }

    return { value, isSuspicious }
}

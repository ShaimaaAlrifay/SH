// Labels kept in one place so every screen shows the exact same Arabic
// copy for the schema's fixed enum values (projects.status, projects.project_type).

export const STATUS_LABELS = {
  discovery: 'الاكتشاف',
  ready_for_review: 'جاهز للمراجعة',
  prd_generated: 'تم إنشاء PRD',
  completed: 'مكتمل',
}

export const STATUS_ORDER = ['discovery', 'ready_for_review', 'prd_generated', 'completed']

export const PROJECT_TYPE_LABELS = {
  mobile_app: 'تطبيق جوال',
  web_app: 'تطبيق ويب',
  saas: 'منصة SaaS',
  ecommerce: 'متجر إلكتروني',
  internal_system: 'نظام داخلي',
  marketplace: 'سوق إلكتروني',
  landing_page: 'صفحة هبوط',
  dashboard: 'لوحة تحكم',
  api_backend: 'واجهة برمجية (API)',
  other: 'أخرى',
}

export const PROJECT_TYPE_ORDER = [
  'mobile_app',
  'web_app',
  'saas',
  'ecommerce',
  'internal_system',
  'marketplace',
  'landing_page',
  'dashboard',
  'api_backend',
  'other',
]

export function formatDate(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('ar', { year: 'numeric', month: 'short', day: 'numeric' }).format(
      new Date(value),
    )
  } catch {
    return value
  }
}

const RELATIVE_UNITS = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** Quiet "relative-ish" timestamp for sidebar rows — falls back to formatDate on failure. */
export function formatRelativeDate(value) {
  if (!value) return '—'
  try {
    const date = new Date(value)
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' })

    if (Math.abs(diffSeconds) < 60) return 'الآن'

    for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
      if (Math.abs(diffSeconds) >= secondsInUnit) {
        return rtf.format(Math.round(diffSeconds / secondsInUnit), unit)
      }
    }
    return formatDate(value)
  } catch {
    return formatDate(value)
  }
}

/** Translates the handful of Supabase auth error messages users actually hit. */
export function translateAuthError(error) {
  if (!error) return null
  const message = error.message || ''
  const map = {
    'Invalid login credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    'User already registered': 'هذا البريد الإلكتروني مسجّل بالفعل. جرّب تسجيل الدخول.',
    'Email not confirmed': 'يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المُرسل إليك.',
    'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.',
  }
  return map[message] || message || 'حدث خطأ غير متوقع. حاول مرة أخرى.'
}

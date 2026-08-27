import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TopNav } from '../components/TopNav'
import { StatusBadge } from '../components/StatusBadge'
import { useAuthContext } from '../contexts/AuthContext'
import { useOrganization } from '../hooks/useOrganization'
import { supabase } from '../lib/supabase'
import { PROJECT_TYPE_LABELS, STATUS_LABELS, STATUS_ORDER, formatDate } from '../lib/constants'

const TABS = [
  { key: 'overview', label: 'نظرة عامة' },
  { key: 'discovery', label: 'الاكتشاف' },
  { key: 'requirements', label: 'المتطلبات' },
  { key: 'prd', label: 'PRD' },
  { key: 'exports', label: 'التصدير' },
  { key: 'activity', label: 'النشاط' },
]

const COMING_LATER = {
  discovery: {
    title: 'جلسة الاكتشاف بالذكاء الاصطناعي',
    body: 'محادثة الاكتشاف التفاعلية مع العميل — والتي تستخدم نموذج ذكاء اصطناعي لاستخراج المتطلبات — لم تُبنَ بعد. ستتوفر في مرحلة لاحقة من المشروع.',
  },
  requirements: {
    title: 'المتطلبات المستخرجة',
    body: 'استخراج المتطلبات المنظمة من جلسة الاكتشاف يعتمد على ميزة الاكتشاف بالذكاء الاصطناعي أعلاه، وهي غير مبنية بعد. ستتوفر في مرحلة لاحقة.',
  },
  prd: {
    title: 'توليد مستند PRD',
    body: 'توليد مستند متطلبات المنتج (PRD) من المتطلبات المستخرجة لم يُبنَ بعد. سيتوفر في مرحلة لاحقة.',
  },
  exports: {
    title: 'تصدير PDF / DOCX / Markdown',
    body: 'تصدير مستند PRD بصيغ PDF أو DOCX أو Markdown لم يُبنَ بعد. سيتوفر في مرحلة لاحقة.',
  },
  activity: {
    title: 'سجلّ النشاط',
    body: 'سجلّ يعرض تاريخ التعديلات والأحداث على المشروع لم يُبنَ بعد. سيتوفر في مرحلة لاحقة.',
  },
}

export function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { organizationId, loading: orgLoading } = useOrganization(user)

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [statusSaving, setStatusSaving] = useState(false)
  const [statusError, setStatusError] = useState(null)

  useEffect(() => {
    if (orgLoading) return
    if (!organizationId) {
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)

    supabase
      .from('projects')
      .select(
        'id, name, project_type, description, status, discovery_progress, created_at, updated_at, client_id, clients ( name )',
      )
      .eq('id', id)
      .eq('organization_id', organizationId)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (!mounted) return
        if (fetchError) {
          setError(fetchError.message)
        } else if (!data) {
          setError('not_found')
        } else {
          setProject(data)
        }
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [id, organizationId, orgLoading])

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value
    const previousStatus = project.status
    setStatusError(null)
    setStatusSaving(true)
    setProject((current) => ({ ...current, status: newStatus }))

    const { error: updateError } = await supabase.from('projects').update({ status: newStatus }).eq('id', id)

    setStatusSaving(false)
    if (updateError) {
      setStatusError('تعذّر تحديث الحالة. حاول مرة أخرى.')
      setProject((current) => ({ ...current, status: previousStatus }))
    }
  }

  const busy = orgLoading || loading

  if (busy) {
    return (
      <div className="page">
        <TopNav />
        <div className="page-loading">جارٍ تحميل المشروع…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <TopNav />
        <main className="container" style={{ paddingBlock: 'var(--space-12)' }}>
          <div className="empty-state">
            <h2>{error === 'not_found' ? 'المشروع غير موجود' : 'حدث خطأ'}</h2>
            <p>
              {error === 'not_found'
                ? 'إما أن هذا المشروع غير موجود، أو أنه لا يتبع مساحة العمل الخاصة بك.'
                : error}
            </p>
            <Link to="/dashboard" className="btn btn-secondary">
              العودة إلى مشاريعي
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <TopNav />
      <main className="container" style={{ paddingBlock: 'var(--space-8)', flex: 1 }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/dashboard" className="text-muted" style={{ fontSize: 14, textDecoration: 'none' }}>
            ← العودة إلى مشاريعي
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-2)',
              flexWrap: 'wrap',
            }}
          >
            <h1 style={{ fontSize: 26 }}>{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
        </div>

        <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="stack" style={{ gap: 'var(--space-4)' }}>
              <OverviewRow label="اسم المشروع" value={project.name} />
              <OverviewRow label="العميل" value={project.clients?.name || 'بدون عميل محدد'} />
              <OverviewRow label="نوع المشروع" value={PROJECT_TYPE_LABELS[project.project_type] || project.project_type} />
              <OverviewRow label="الوصف" value={project.description || '—'} />

              <div className="field" style={{ maxWidth: 260 }}>
                <label htmlFor="status">الحالة</label>
                <select id="status" className="select" value={project.status} onChange={handleStatusChange} disabled={statusSaving}>
                  {STATUS_ORDER.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                {statusSaving && <span className="field-hint">جارٍ الحفظ…</span>}
                {statusError && <span className="form-error">{statusError}</span>}
              </div>

              <div className="stack" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span className="text-muted">تقدّم الاكتشاف</span>
                  <span className="text-muted ltr-nums">{project.discovery_progress}%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${project.discovery_progress}%` }} />
                </div>
              </div>

              <OverviewRow label="تاريخ الإنشاء" value={formatDate(project.created_at)} />
              <OverviewRow label="آخر تحديث" value={formatDate(project.updated_at)} />
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="placeholder-panel card">
            <span className="placeholder-badge">قريباً في مرحلة لاحقة</span>
            <h3>{COMING_LATER[activeTab].title}</h3>
            <p>{COMING_LATER[activeTab].body}</p>
          </div>
        )}
      </main>
    </div>
  )
}

function OverviewRow({ label, value }) {
  return (
    <div className="field">
      <span className="text-muted" style={{ fontSize: 13 }}>
        {label}
      </span>
      <span style={{ fontSize: 15 }}>{value}</span>
    </div>
  )
}

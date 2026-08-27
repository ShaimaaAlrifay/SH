import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TopNav } from '../components/TopNav'
import { StatusBadge } from '../components/StatusBadge'
import { useAuthContext } from '../contexts/AuthContext'
import { useOrganization } from '../hooks/useOrganization'
import { supabase } from '../lib/supabase'
import { PROJECT_TYPE_LABELS, formatDate } from '../lib/constants'

export function Dashboard() {
  const { user } = useAuthContext()
  const { organizationId, loading: orgLoading, error: orgError } = useOrganization(user)

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orgLoading) return
    if (!organizationId) {
      setProjects([])
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    supabase
      .from('projects')
      .select('id, name, project_type, status, discovery_progress, updated_at, clients ( name )')
      .eq('organization_id', organizationId)
      .order('updated_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!mounted) return
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setProjects(data || [])
        }
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [organizationId, orgLoading])

  const busy = orgLoading || loading

  return (
    <div className="page">
      <TopNav />
      <main className="container" style={{ paddingBlock: 'var(--space-8)', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ fontSize: 26 }}>مشاريعي</h1>
            <p className="text-secondary">كل مشاريع الاكتشاف ومستندات المتطلبات في مكان واحد.</p>
          </div>
          {projects.length > 0 && (
            <Link to="/projects/new" className="btn btn-primary">
              إنشاء مشروع
            </Link>
          )}
        </div>

        {busy && <div className="page-loading">جارٍ تحميل المشاريع…</div>}

        {!busy && (error || orgError) && (
          <p className="form-error">{error || orgError?.message || 'تعذّر تحميل المشاريع.'}</p>
        )}

        {!busy && !error && !orgError && projects.length === 0 && (
          <div className="empty-state">
            <h2>ما عندك مشاريع حتى الآن</h2>
            <p>ابدأ مشروعك الأول لتنظيم جلسة اكتشاف المتطلبات مع عميلك.</p>
            <Link to="/projects/new" className="btn btn-primary">
              إنشاء مشروع
            </Link>
          </div>
        )}

        {!busy && !error && !orgError && projects.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="card card-link">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <h3 style={{ fontSize: 17 }}>{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-secondary" style={{ fontSize: 14, marginBottom: 'var(--space-1)' }}>
                  {project.clients?.name ? project.clients.name : 'بدون عميل محدد'}
                </p>
                <p className="text-muted" style={{ fontSize: 13, marginBottom: 'var(--space-4)' }}>
                  {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                </p>

                <div className="stack" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span className="text-muted">تقدّم الاكتشاف</span>
                    <span className="text-muted ltr-nums">{project.discovery_progress}%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${project.discovery_progress}%` }} />
                  </div>
                </div>

                <p className="text-muted" style={{ fontSize: 12 }}>
                  آخر تحديث: {formatDate(project.updated_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

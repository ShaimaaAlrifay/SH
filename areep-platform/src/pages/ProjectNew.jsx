import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopNav } from '../components/TopNav'
import { useAuthContext } from '../contexts/AuthContext'
import { useOrganization } from '../hooks/useOrganization'
import { supabase } from '../lib/supabase'
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_ORDER } from '../lib/constants'

export function ProjectNew() {
  const { user } = useAuthContext()
  const { organizationId, loading: orgLoading } = useOrganization(user)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [clientName, setClientName] = useState('')
  const [projectType, setProjectType] = useState('other')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('اسم المشروع مطلوب.')
      return
    }
    if (!organizationId) {
      setError('تعذّر تحديد مساحة العمل الخاصة بك. حاول تحديث الصفحة.')
      return
    }

    setSubmitting(true)
    try {
      let clientId = null
      const trimmedClient = clientName.trim()

      if (trimmedClient) {
        const { data: existingClient, error: findError } = await supabase
          .from('clients')
          .select('id')
          .eq('organization_id', organizationId)
          .eq('name', trimmedClient)
          .maybeSingle()

        if (findError) throw findError

        if (existingClient) {
          clientId = existingClient.id
        } else {
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert({ organization_id: organizationId, name: trimmedClient })
            .select('id')
            .single()

          if (createError) throw createError
          clientId = newClient.id
        }
      }

      const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert({
          organization_id: organizationId,
          client_id: clientId,
          name: trimmedName,
          project_type: projectType,
          description: description.trim() || null,
        })
        .select('id')
        .single()

      if (insertError) throw insertError

      navigate(`/projects/${project.id}`)
    } catch (submitError) {
      setError(submitError.message || 'تعذّر إنشاء المشروع. حاول مرة أخرى.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <TopNav />
      <main className="container" style={{ paddingBlock: 'var(--space-8)', flex: 1 }}>
        <div style={{ maxWidth: 560, marginInline: 'auto' }}>
          <h1 style={{ fontSize: 24, marginBottom: 'var(--space-1)' }}>مشروع جديد</h1>
          <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
            عبّئ التفاصيل الأساسية، وبإمكانك تعديلها لاحقاً من صفحة المشروع.
          </p>

          <form className="form card" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}

            <div className="field">
              <label htmlFor="name">اسم المشروع *</label>
              <input
                id="name"
                type="text"
                required
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثال: تطبيق إدارة المخزون"
              />
            </div>

            <div className="field">
              <label htmlFor="clientName">اسم العميل</label>
              <input
                id="clientName"
                type="text"
                className="input"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="اختياري"
              />
              <span className="field-hint">إذا كان العميل موجوداً مسبقاً في مساحة عملك سنستخدمه بدل إنشاء عميل جديد.</span>
            </div>

            <div className="field">
              <label htmlFor="projectType">نوع المشروع</label>
              <select
                id="projectType"
                className="select"
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
              >
                {PROJECT_TYPE_ORDER.map((type) => (
                  <option key={type} value={type}>
                    {PROJECT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="description">وصف مختصر</label>
              <textarea
                id="description"
                className="textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="جملة أو جملتين عن هدف المشروع"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting || orgLoading}>
              {submitting ? 'جارٍ الإنشاء…' : 'إنشاء المشروع'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

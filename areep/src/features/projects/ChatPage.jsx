import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Chat } from '../../components/Chat'
import { useMessages } from '../../hooks/useMessages'
import { STATUS_LABELS } from '../../lib/constants'
import { getProject } from '../../services/projectsService'
import { useNewProjectFlow } from './useNewProjectFlow'

/**
 * Single routed component for /chat, /chat/new and /chat/:projectId
 * (Sections 6-11). Which sub-view renders is a plain conditional on the
 * route param, not a hook — each branch is its own component so hooks
 * inside them are still called unconditionally per render, satisfying
 * rules-of-hooks.
 */
export function ChatPage() {
  const { projectId } = useParams()
  const { organizationId, projects, projectsLoading, refetchProjects } = useOutletContext()

  if (!projectId) {
    return <ChatIndex projects={projects} loading={projectsLoading} />
  }
  if (projectId === 'new') {
    return <NewProjectChat organizationId={organizationId} refetchProjects={refetchProjects} />
  }
  return <ExistingProjectChat projectId={projectId} organizationId={organizationId} />
}

/** First-time user: quiet empty state. Existing user: redirect to their most-recently-updated project. */
function ChatIndex({ projects, loading }) {
  if (loading) {
    return <div className="page-loading">جارٍ التحميل…</div>
  }

  if (projects.length === 0) {
    return (
      <div className="chat-empty">
        <p className="chat-empty-eyebrow">أهلاً بك في أريب.</p>
        <h1 className="chat-empty-title">خلينا نفهم مشروعك.</h1>
        <Link to="/chat/new" className="btn btn-primary">
          ابدأ مشروع جديد
        </Link>
      </div>
    )
  }

  return <Navigate to={`/chat/${projects[0].id}`} replace />
}

/** The scripted (non-AI) new-project onboarding chat (Section 11). */
function NewProjectChat({ organizationId, refetchProjects }) {
  const navigate = useNavigate()
  const flow = useNewProjectFlow(organizationId)

  useEffect(() => {
    if (!flow.createdProject) return
    refetchProjects()
    navigate(`/chat/${flow.createdProject.id}`, { replace: true })
  }, [flow.createdProject, navigate, refetchProjects])

  return (
    <Chat
      messages={flow.messages}
      onSend={flow.submitAnswer}
      quickReplies={flow.chipOptions}
      onQuickReply={flow.submitAnswer}
      placeholder={flow.currentQuestion?.placeholder || 'احكي لي عن مشروعك...'}
      disabled={flow.creating || !!flow.createdProject}
      thinking={flow.creating}
      thinkingLabel="جارٍ إنشاء المشروع…"
      error={flow.error}
    />
  )
}

/** An existing project's persisted chat history (Section 8). */
function ExistingProjectChat({ projectId, organizationId }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { messages, loading: messagesLoading, isMissingTable, addMessage } = useMessages(projectId)

  useEffect(() => {
    if (!organizationId) return undefined
    let mounted = true
    setLoading(true)
    setNotFound(false)

    getProject(projectId, organizationId).then(({ data, error }) => {
      if (!mounted) return
      if (error || !data) {
        setNotFound(true)
      } else {
        setProject(data)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [projectId, organizationId])

  if (loading) {
    return <div className="page-loading">جارٍ تحميل المشروع…</div>
  }

  if (notFound) {
    return (
      <div className="chat-empty">
        <h1 className="chat-empty-title">المشروع غير موجود</h1>
        <p className="text-secondary">إما أن هذا المشروع غير موجود، أو أنه لا يتبع مساحة العمل الخاصة بك.</p>
        <Link to="/chat" className="btn btn-secondary">
          العودة
        </Link>
      </div>
    )
  }

  return (
    <div className="chat-with-header">
      <header className="chat-header">
        <h1>{project.name}</h1>
        <span className="chat-header-status">{STATUS_LABELS[project.status] || project.status}</span>
      </header>

      {isMissingTable && (
        <div className="notice notice-inline" role="status">
          <p className="text-secondary">
            سجلّ المحادثة غير مفعّل بعد لهذا المشروع (جدول <code>messages</code> غير موجود في قاعدة البيانات) — الرسائل
            ستُعرض هنا لهذه الجلسة فقط.
          </p>
        </div>
      )}

      <Chat messages={messagesLoading ? [] : messages} onSend={(text) => addMessage('user', text)} placeholder="اكتب رسالتك..." />
    </div>
  )
}

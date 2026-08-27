import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { insertMessage, isMissingTableError, listMessages } from '../services/messagesService'

/**
 * Persisted chat history for one project. Degrades gracefully instead of
 * crashing the page when the `messages` table hasn't been created yet
 * (see supabase/schema.sql's "messages" section, and the isMissingTable
 * flag this hook surfaces so the UI can show a small inline notice) — same
 * defensive spirit as `isSupabaseConfigured` elsewhere in this codebase.
 */
export function useMessages(projectId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMissingTable, setIsMissingTable] = useState(false)

  useEffect(() => {
    let mounted = true
    setMessages([])
    setIsMissingTable(false)
    setError(null)

    if (!isSupabaseConfigured || !projectId) {
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    setLoading(true)
    listMessages(projectId).then(({ data, error: fetchError }) => {
      if (!mounted) return
      if (fetchError) {
        if (isMissingTableError(fetchError)) {
          setIsMissingTable(true)
        } else {
          setError(fetchError)
        }
      } else {
        setMessages(data || [])
      }
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [projectId])

  /**
   * Appends a message immediately (so the UI never waits on a round trip)
   * and tries to persist it in the background. On a missing-messages-table
   * project the message just stays local-only for this session — that's an
   * accepted, expected degradation for this phase, not an error state.
   */
  const addMessage = useCallback(
    (role, content) => {
      const localMessage = { id: `local-${Date.now()}-${Math.random()}`, role, content, created_at: new Date().toISOString() }
      setMessages((current) => [...current, localMessage])

      if (!isSupabaseConfigured || !projectId || isMissingTable) return localMessage

      insertMessage(projectId, role, content).then(({ data, error: insertError }) => {
        if (insertError) {
          if (isMissingTableError(insertError)) setIsMissingTable(true)
          return
        }
        if (data) {
          setMessages((current) => current.map((message) => (message.id === localMessage.id ? data : message)))
        }
      })

      return localMessage
    },
    [projectId, isMissingTable],
  )

  return { messages, loading, error, isMissingTable, addMessage }
}

import React from 'react'
import { MasterTemplateRenderer } from './BusinessTemplates'
import { useStore } from '../store/useStore'

interface TemplateRendererProps {
  isEditable?: boolean
  onEditElement?: (elementId: string, currentText: string) => void
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  isEditable = false,
  onEditElement
}) => {
  const activeWebsite = useStore((state) => state.activeWebsite)
  const activePage = useStore((state) => state.activePage)
  const setActivePage = useStore((state) => state.setActivePage)

  if (!activeWebsite) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px dashed var(--border-light)',
        margin: '2rem'
      }}>
        No active website selected for preview. Please return to the Dashboard.
      </div>
    )
  }

  const { website, content, design } = activeWebsite

  return (
    <MasterTemplateRenderer
      businessName={website.business_name}
      businessType={website.business_type}
      activePage={activePage}
      setActivePage={setActivePage}
      content={content}
      design={design}
      isEditable={isEditable}
      onEditElement={onEditElement}
    />
  )
}

import { ReactNode, useState } from 'react'
import clsx from 'clsx'

interface Tab {
  id: string
  label: string
  content?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onChange?: (tabId: string) => void
  className?: string
  children?: ReactNode
}

function Tabs({ tabs, defaultTab, activeTab: controlledActiveTab, onChange, className, children }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id)
  const activeTab = controlledActiveTab ?? internalActiveTab

  const handleTabChange = (tabId: string) => {
    setInternalActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={clsx(
              'px-4 py-2 text-sm font-medium transition-colors',
              'border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-gold text-gold'
                : 'border-transparent text-text-dim hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children || activeContent}</div>
    </div>
  )
}

export { Tabs }
export default Tabs
 

import { createContext, useContext, useState } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Tabs.module.scss'

type TabsContextValue = {
  activeTab: string
  setActiveTab: (id: string) => void
}

const EMPTY_CONTEXT: TabsContextValue = {
  activeTab: '',
  setActiveTab: () => {},
}

const TabsContext = createContext<TabsContextValue>(EMPTY_CONTEXT)

type TabsProps = {
  defaultTab: string
  children?: React.ReactNode
} & StyleProps
  & React.HTMLAttributes<HTMLDivElement>

function Tabs({ defaultTab, className, style, children, ...rest }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn(styles.tabs, className)} style={style} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

type TabListProps = {
  children?: React.ReactNode
} & StyleProps

function TabList({ className, style, children }: TabListProps) {
  return (
    <div className={cn(styles.tabList, className)} style={style} role="tablist">
      {children}
    </div>
  )
}

type TabProps = {
  id: string
  children?: React.ReactNode
} & StyleProps

function Tab({ id, className, style, children }: TabProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === id

  return (
    <button
      className={cn(styles.tab, isActive && styles.active, className)}
      style={style}
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(id)}
      type="button"
    >
      {children}
    </button>
  )
}

type TabPanelProps = {
  id: string
  children?: React.ReactNode
} & StyleProps

function TabPanel({ id, className, style, children }: TabPanelProps) {
  const { activeTab } = useContext(TabsContext)

  if (activeTab !== id) return null

  return (
    <div className={cn(styles.panel, className)} style={style} role="tabpanel">
      {children}
    </div>
  )
}

export { Tabs, TabList, Tab, TabPanel }
export type { TabsProps, TabListProps, TabProps, TabPanelProps }

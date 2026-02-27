import { useState } from 'react'
import type { StyleProps } from '@/shared/types/component-common'
import { cn } from '../_utils'
import styles from './Tree.module.scss'

type TreeNode = {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
}

type TreeProps = {
  nodes: TreeNode[]
  defaultExpanded?: string[]
  onSelect?: (id: string) => void
} & StyleProps

function TreeItem({
  node,
  expanded,
  onToggle,
  onSelect,
}: {
  node: TreeNode
  expanded: Set<string>
  onToggle: (id: string) => void
  onSelect?: (id: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expanded.has(node.id)

  return (
    <li className={styles.item}>
      <div className={styles.row} onClick={() => { hasChildren ? onToggle(node.id) : onSelect?.(node.id) }}>
        {hasChildren ? (
          <svg className={cn(styles.chevron, isExpanded && styles.expanded)} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <span className={styles.spacer} />
        )}
        {node.icon ? <span className={styles.icon}>{node.icon}</span> : null}
        <span className={styles.label}>{node.label}</span>
      </div>
      {hasChildren && isExpanded ? (
        <ul className={styles.children}>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function Tree({ nodes, defaultExpanded = [], onSelect, className, style }: TreeProps) {
  const [expanded, setExpanded] = useState(new Set(defaultExpanded))

  function handleToggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <ul className={cn(styles.tree, className)} style={style} role="tree">
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} expanded={expanded} onToggle={handleToggle} onSelect={onSelect} />
      ))}
    </ul>
  )
}

export { Tree }
export type { TreeProps, TreeNode }

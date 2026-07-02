/**
 * @summary ElTree 树形控件 - 类型定义文件
 *
 * 定义 Tree 组件相关的类型与接口。ElTree 用于展示具有层级结构的数据（如组织架构、
 * 文件目录、分类树），支持多选、懒加载、搜索过滤、拖拽排序、自定义渲染等。
 *
 * @example
 * <el-tree
 *   :data="data"
 *   :props="{ label: 'name', children: 'children' }"
 *   show-checkbox
 *   node-key="id"
 *   @node-click="handleNodeClick"
 * />
 *
 * @example
 * // 懒加载 + 拖拽
 * <el-tree
 *   :load="loadNode"
 *   lazy
 *   draggable
 *   allow-drag="allowDrag"
 *   allow-drop="allowDrop"
 * />
 */
import type {
  Component,
  ComponentInternalInstance,
  Ref,
  SetupContext,
  VNode,
  h,
} from 'vue'
import type Node from './model/node'
import type TreeStore from './model/tree-store'

export interface RootTreeType {
  ctx: SetupContext<any>
  props: TreeComponentProps
  store: Ref<TreeStore>
  root: Ref<Node>
  currentNode: Ref<Node>
  instance: ComponentInternalInstance
}

export declare type hType = typeof h
export declare type TreeData = TreeNodeData[]
export declare type TreeKey = string | number
export declare interface FakeNode {
  data: TreeNodeData
}
export declare interface TreeNodeData {
  [key: string]: any
}
export declare interface TreeNodeLoadedDefaultProps {
  checked?: boolean
}
export declare interface TreeNodeChildState {
  all: boolean
  none: boolean
  allWithoutDisable: boolean
  half: boolean
}
export declare interface TreeNodeOptions {
  data: TreeNodeData
  store: TreeStore
  parent?: Node
}
export declare interface TreeStoreNodesMap {
  [key: string]: Node
}
export declare interface TreeStoreOptions {
  key: TreeKey
  data: TreeData
  lazy: boolean
  props: TreeOptionProps
  load: LoadFunction
  currentNodeKey: TreeKey
  checkStrictly: boolean
  checkDescendants: boolean
  defaultCheckedKeys: TreeKey[]
  defaultExpandedKeys: TreeKey[]
  autoExpandParent: boolean
  defaultExpandAll: boolean
  filterNodeMethod: FilterNodeMethodFunction
}
export declare interface TreeOptionProps {
  children?: string
  label?: string | ((data: TreeNodeData, node: Node) => string)
  disabled?: string | ((data: TreeNodeData, node: Node) => boolean)
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean)
  class?: (
    data: TreeNodeData,
    node: Node
  ) => string | { [key: string]: boolean } | string
}
export declare type RenderContentFunction = (
  h: hType,
  context: RenderContentContext
) => VNode | VNode[]
export declare interface RenderContentContext {
  _self: ComponentInternalInstance
  node: Node
  data: TreeNodeData
  store: TreeStore
}
export declare type AllowDragFunction = (node: Node) => boolean
export declare type AllowDropType = 'inner' | 'prev' | 'next'
export declare type AllowDropFunction = (
  draggingNode: Node,
  dropNode: Node,
  type: AllowDropType
) => boolean
export declare type LoadFunction = (
  rootNode: Node,
  loadedCallback: (data: TreeData) => void
) => void
export declare type FilterValue = any
export declare type FilterNodeMethodFunction = (
  value: FilterValue,
  data: TreeNodeData,
  child: Node
) => boolean
export declare interface TreeComponentProps {
  data: TreeData
  emptyText: string
  renderAfterExpand: boolean
  nodeKey: string
  checkStrictly: boolean
  expandOnClickNode: boolean
  defaultExpandAll: boolean
  checkOnClickNode: boolean
  checkDescendants: boolean
  autoExpandParent: boolean
  defaultCheckedKeys: TreeKey[]
  defaultExpandedKeys: TreeKey[]
  currentNodeKey: TreeKey
  renderContent: RenderContentFunction
  showCheckbox: boolean
  draggable: boolean
  allowDrag: AllowDragFunction
  allowDrop: AllowDropFunction
  props: TreeOptionProps
  lazy: boolean
  highlightCurrent: boolean
  load: LoadFunction
  filterNodeMethod: FilterNodeMethodFunction
  accordion: boolean
  indent: number
  icon: string | Component
}

export declare type NodeDropType = 'before' | 'after' | 'inner' | 'none'

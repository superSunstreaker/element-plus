<template>
  <div
    ref="el$"
    :class="[
      ns.b(),
      ns.is('dragging', !!dragState.draggingNode),
      ns.is('drop-not-allow', !dragState.allowDrop),
      ns.is('drop-inner', dragState.dropType === 'inner'),
      { [ns.m('highlight-current')]: highlightCurrent },
    ]"
    role="tree"
  >
    <el-tree-node
      v-for="child in root.childNodes"
      :key="getNodeKey(child)"
      :node="child"
      :props="props"
      :accordion="accordion"
      :render-after-expand="renderAfterExpand"
      :show-checkbox="showCheckbox"
      :render-content="renderContent"
      @node-expand="handleNodeExpand"
    />
    <div v-if="isEmpty" :class="ns.e('empty-block')">
      <slot name="empty">
        <span :class="ns.e('empty-text')">
          {{ emptyText ?? t('el.tree.emptyText') }}
        </span>
      </slot>
    </div>
    <div
      v-show="dragState.showDropIndicator"
      ref="dropIndicator$"
      :class="ns.e('drop-indicator')"
    />
  </div>
</template>
<script lang="ts">
/**
 * @summary ElTree 树形控件 - 展示层级结构数据的组件
 *
 * 用于展示具有层级关系的数据（组织架构、文件目录、分类树），支持复选、单选高亮、
 * 懒加载、动态加载、搜索过滤、拖拽排序、手风琴模式、自定义节点渲染。
 * 通过 TreeStore 管理节点状态，支持通过 ref 调用 getCheckedNodes/setCheckedKeys 等方法。
 *
 * @attr {Array} data - 树数据源（默认 []）
 * @attr {String} emptyText - 空数据提示文本
 * @attr {Boolean} renderAfterExpand - 是否在节点展开后才渲染子节点（默认 true）
 * @attr {String} nodeKey - 每个节点数据的唯一标识字段名（推荐设置）
 * @attr {Boolean} checkStrictly - 是否严格的遵循父子不互相关联（默认 false）
 * @attr {Boolean} defaultExpandAll - 是否默认展开所有节点（默认 false）
 * @attr {Boolean} expandOnClickNode - 是否点击节点切换展开（默认 true）
 * @attr {Boolean} checkOnClickNode - 是否点击节点勾选（默认 false）
 * @attr {Boolean} checkDescendants - 是否在初始化时勾选子节点（懒加载场景，默认 false）
 * @attr {Boolean} autoExpandParent - 是否自动展开父节点（默认 true）
 * @attr {Array} defaultCheckedKeys - 默认勾选的节点 key 数组
 * @attr {Array} defaultExpandedKeys - 默认展开的节点 key 数组
 * @attr {String|Number} currentNodeKey - 当前高亮节点 key
 * @attr {Function} renderContent - 树节点内容渲染函数
 * @attr {Boolean} showCheckbox - 是否显示复选框（默认 false）
 * @attr {Boolean} draggable - 是否开启拖拽（默认 false）
 * @attr {Function} allowDrag - 判断节点是否可拖拽
 * @attr {Function} allowDrop - 判断节点是否可放置，返回 'inner'/'prev'/'next'
 * @attr {Object} props - 字段映射配置 { children, label, disabled, isLeaf }
 * @attr {Boolean} lazy - 是否懒加载子节点（默认 false）
 * @attr {Boolean} highlightCurrent - 是否高亮当前节点（默认 false）
 * @attr {Function} load - 懒加载回调 (node, resolve) => void
 * @attr {Function} filterNodeMethod - 节点过滤方法 (value, data, node) => boolean
 * @attr {Boolean} accordion - 是否手风琴模式（默认 false）
 * @attr {Number} indent - 子节点缩进（默认 18）
 * @attr {String|Component} icon - 自定义节点图标
 *
 * @event {Object,Boolean} check-change - 节点勾选状态变化时触发，参数 (data, checked, indeterminate)
 * @event {Object,Object} current-change - 当前节点变化时触发，参数 (data, node)
 * @event {Object,Object} node-click - 点击节点时触发，参数 (data, node, e)
 * @event {Object,Object} node-contextmenu - 右键节点时触发
 * @event {Object,Object} node-collapse - 节点折叠时触发
 * @event {Object,Object} node-expand - 节点展开时触发
 * @event {Object,Object} check - 点击复选框时触发，参数 (data, { checkedNodes, checkedKeys, halfChecked... })
 * @event {Object,Object} node-drag-start - 拖拽开始时触发
 * @event {Object,Object} node-drag-end - 拖拽结束时触发
 * @event {Object,Object} node-drop - 拖拽放置时触发
 * @event {Object,Object} node-drag-leave - 拖拽离开时触发
 * @event {Object,Object} node-drag-enter - 拖拽进入时触发
 * @event {Object,Object} node-drag-over - 拖拽经过时触发
 *
 * @expose filter(value) - 过滤树节点，需配合 filterNodeMethod
 * @expose getNode(data) - 根据 data 或 key 获取节点
 * @expose getNodePath(data) - 获取节点路径
 * @expose getCheckedNodes(leafOnly?, includeHalfChecked?) - 获取勾选的节点
 * @expose getCheckedKeys(leafOnly?) - 获取勾选的 key
 * @expose setCheckedNodes(nodes, leafOnly?) - 设置勾选节点
 * @expose setCheckedKeys(keys, leafOnly?) - 设置勾选 key
 * @expose getCurrentNode() - 获取当前节点
 * @expose getCurrentKey() - 获取当前节点 key
 * @expose setCurrentNode(node) - 设置当前节点
 * @expose setCurrentKey(key) - 设置当前节点 key
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
 * <el-tree :load="loadNode" lazy draggable @node-drop="handleDrop" />
 */
// @ts-nocheck
import {
  computed,
  defineComponent,
  getCurrentInstance,
  provide,
  ref,
  watch,
} from 'vue'
import { iconPropType } from '@element-plus/utils'
import { useLocale, useNamespace } from '@element-plus/hooks'
import { formItemContextKey } from '@element-plus/components/form'
import TreeStore from './model/tree-store'
import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from './model/util'
import ElTreeNode from './tree-node.vue'
import { useNodeExpandEventBroadcast } from './model/useNodeExpandEventBroadcast'
import { useDragNodeHandler } from './model/useDragNode'
import { useKeydown } from './model/useKeydown'
import type Node from './model/node'

import type { ComponentInternalInstance, PropType } from 'vue'
import type { Nullable } from '@element-plus/utils'
import type {
  TreeComponentProps,
  TreeData,
  TreeKey,
  TreeNodeData,
} from './tree.type'

export default defineComponent({
  name: 'ElTree',
  components: { ElTreeNode },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    emptyText: {
      type: String,
    },
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false,
    },
    autoExpandParent: {
      type: Boolean,
      default: true,
    },
    defaultCheckedKeys: Array as PropType<
      TreeComponentProps['defaultCheckedKeys']
    >,
    defaultExpandedKeys: Array as PropType<
      TreeComponentProps['defaultExpandedKeys']
    >,
    currentNodeKey: [String, Number] as PropType<string | number>,
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      type: Object as PropType<TreeComponentProps['props']>,
      default: () => ({
        children: 'children',
        label: 'label',
        disabled: 'disabled',
      }),
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    highlightCurrent: Boolean,
    load: Function as PropType<TreeComponentProps['load']>,
    filterNodeMethod: Function as PropType<
      TreeComponentProps['filterNodeMethod']
    >,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18,
    },
    icon: {
      type: iconPropType,
    },
  },
  emits: [
    'check-change',
    'current-change',
    'node-click',
    'node-contextmenu',
    'node-collapse',
    'node-expand',
    'check',
    'node-drag-start',
    'node-drag-end',
    'node-drop',
    'node-drag-leave',
    'node-drag-enter',
    'node-drag-over',
  ],
  setup(props, ctx) {
    const { t } = useLocale()
    const ns = useNamespace('tree')

    const store = ref<TreeStore>(
      new TreeStore({
        key: props.nodeKey,
        data: props.data,
        lazy: props.lazy,
        props: props.props,
        load: props.load,
        currentNodeKey: props.currentNodeKey,
        checkStrictly: props.checkStrictly,
        checkDescendants: props.checkDescendants,
        defaultCheckedKeys: props.defaultCheckedKeys,
        defaultExpandedKeys: props.defaultExpandedKeys,
        autoExpandParent: props.autoExpandParent,
        defaultExpandAll: props.defaultExpandAll,
        filterNodeMethod: props.filterNodeMethod,
      })
    )

    store.value.initialize()

    const root = ref<Node>(store.value.root)
    const currentNode = ref<Node>(null)
    const el$ = ref<Nullable<HTMLElement>>(null)
    const dropIndicator$ = ref<Nullable<HTMLElement>>(null)

    const { broadcastExpanded } = useNodeExpandEventBroadcast(props)

    const { dragState } = useDragNodeHandler({
      props,
      ctx,
      el$,
      dropIndicator$,
      store,
    })

    useKeydown({ el$ }, store)

    const isEmpty = computed(() => {
      const { childNodes } = root.value
      return (
        !childNodes ||
        childNodes.length === 0 ||
        childNodes.every(({ visible }) => !visible)
      )
    })

    watch(
      () => props.currentNodeKey,
      (newVal) => {
        store.value.setCurrentNodeKey(newVal)
      }
    )

    watch(
      () => props.defaultCheckedKeys,
      (newVal) => {
        store.value.setDefaultCheckedKey(newVal)
      }
    )

    watch(
      () => props.defaultExpandedKeys,
      (newVal) => {
        store.value.setDefaultExpandedKeys(newVal)
      }
    )

    watch(
      () => props.data,
      (newVal) => {
        store.value.setData(newVal)
      },
      { deep: true }
    )

    watch(
      () => props.checkStrictly,
      (newVal) => {
        store.value.checkStrictly = newVal
      }
    )

    const filter = (value) => {
      if (!props.filterNodeMethod)
        throw new Error('[Tree] filterNodeMethod is required when filter')
      store.value.filter(value)
    }

    const getNodeKey = (node: Node) => {
      return getNodeKeyUtil(props.nodeKey, node.data)
    }

    const getNodePath = (data: TreeKey | TreeNodeData) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in getNodePath')
      const node = store.value.getNode(data)
      if (!node) return []
      const path = [node.data]
      let parent = node.parent
      while (parent && parent !== root.value) {
        path.push(parent.data)
        parent = parent.parent
      }
      return path.reverse()
    }

    const getCheckedNodes = (
      leafOnly?: boolean,
      includeHalfChecked?: boolean
    ): TreeNodeData[] => {
      return store.value.getCheckedNodes(leafOnly, includeHalfChecked)
    }

    const getCheckedKeys = (leafOnly?: boolean): TreeKey[] => {
      return store.value.getCheckedKeys(leafOnly)
    }

    const getCurrentNode = (): TreeNodeData => {
      const currentNode = store.value.getCurrentNode()
      return currentNode ? currentNode.data : null
    }

    const getCurrentKey = (): any => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in getCurrentKey')
      const currentNode = getCurrentNode()
      return currentNode ? currentNode[props.nodeKey] : null
    }

    const setCheckedNodes = (nodes: Node[], leafOnly?: boolean) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      store.value.setCheckedNodes(nodes, leafOnly)
    }

    const setCheckedKeys = (keys: TreeKey[], leafOnly?: boolean) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCheckedKeys')
      store.value.setCheckedKeys(keys, leafOnly)
    }

    const setChecked = (
      data: TreeKey | TreeNodeData,
      checked: boolean,
      deep: boolean
    ) => {
      store.value.setChecked(data, checked, deep)
    }

    const getHalfCheckedNodes = (): TreeNodeData[] => {
      return store.value.getHalfCheckedNodes()
    }

    const getHalfCheckedKeys = (): TreeKey[] => {
      return store.value.getHalfCheckedKeys()
    }

    const setCurrentNode = (node: Node, shouldAutoExpandParent = true) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCurrentNode')

      handleCurrentChange(store, ctx.emit, () =>
        store.value.setUserCurrentNode(node, shouldAutoExpandParent)
      )
    }

    const setCurrentKey = (key?: TreeKey, shouldAutoExpandParent = true) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in setCurrentKey')

      handleCurrentChange(store, ctx.emit, () =>
        store.value.setCurrentNodeKey(key, shouldAutoExpandParent)
      )
    }

    const getNode = (data: TreeKey | TreeNodeData): Node => {
      return store.value.getNode(data)
    }

    const remove = (data: TreeNodeData | Node) => {
      store.value.remove(data)
    }

    const append = (
      data: TreeNodeData,
      parentNode: TreeNodeData | TreeKey | Node
    ) => {
      store.value.append(data, parentNode)
    }

    const insertBefore = (
      data: TreeNodeData,
      refNode: TreeKey | TreeNodeData | Node
    ) => {
      store.value.insertBefore(data, refNode)
    }

    const insertAfter = (
      data: TreeNodeData,
      refNode: TreeKey | TreeNodeData | Node
    ) => {
      store.value.insertAfter(data, refNode)
    }

    const handleNodeExpand = (
      nodeData: TreeNodeData,
      node: Node,
      instance: ComponentInternalInstance
    ) => {
      broadcastExpanded(node)
      ctx.emit('node-expand', nodeData, node, instance)
    }

    const updateKeyChildren = (key: TreeKey, data: TreeData) => {
      if (!props.nodeKey)
        throw new Error('[Tree] nodeKey is required in updateKeyChild')
      store.value.updateChildren(key, data)
    }

    provide('RootTree', {
      ctx,
      props,
      store,
      root,
      currentNode,
      instance: getCurrentInstance(),
    } as any)

    provide(formItemContextKey, undefined)

    return {
      ns,
      // ref
      store,
      root,
      currentNode,
      dragState,
      el$,
      dropIndicator$,

      // computed
      isEmpty,

      // methods
      filter,
      getNodeKey,
      getNodePath,
      getCheckedNodes,
      getCheckedKeys,
      getCurrentNode,
      getCurrentKey,
      setCheckedNodes,
      setCheckedKeys,
      setChecked,
      getHalfCheckedNodes,
      getHalfCheckedKeys,
      setCurrentNode,
      setCurrentKey,
      t,
      getNode,
      remove,
      append,
      insertBefore,
      insertAfter,
      handleNodeExpand,
      updateKeyChildren,
    }
  },
})
</script>

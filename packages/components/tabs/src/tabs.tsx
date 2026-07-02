/**
 * @summary ElTabs 标签页 - 分隔内容上有关联但属于不同类别的数据集合，提供水平/垂直、可关闭/可新增/可编辑等多种模式，常用于内容切换、详情面板分组等场景
 *
 * @attr {string | number} modelValue - 当前激活标签页的 name（支持 v-model 双向绑定），默认 '0'；与子组件 el-tab-pane 的 name 属性对应
 * @attr {'card' | 'border-card' | ''} type - 样式风格类型，可选值为 card（卡片风格） / border-card（带边框卡片风格） / ''（默认风格），默认 ''
 * @attr {boolean} closable - 标签页是否可关闭，默认 false，开启后所有标签页右侧显示关闭按钮
 * @attr {boolean} addable - 标签页是否可增加，默认 false，开启后标签栏右侧显示 + 新增按钮
 * @attr {boolean} editable - 标签页是否同时可增加和关闭，默认 false，等价于 closable=true && addable=true
 * @attr {'top' | 'right' | 'bottom' | 'left'} tabPosition - 标签栏位置，可选值为 top / right / bottom / left，默认 'top'
 * @attr {(newName: TabPaneName, oldName: TabPaneName) => Awaitable<void | boolean>} beforeLeave - 切换标签页前的钩子函数，默认 () => true；返回 false 或 reject 的 Promise 可阻止切换；参数 newName 为目标标签 name，oldName 为当前标签 name
 * @attr {boolean} stretch - 标签栏的标签是否自适应宽度且自动撑满，默认 false，仅在 horizontal（top/bottom）位置下生效
 * @attr {string | number} activeName - 已废弃：当前激活标签页的 name，建议使用 model-value 或 v-model 替代，自 2.3.0 起废弃
 *
 * @event {(name: TabPaneName) => void} update:modelValue - 当前激活标签页变化时触发（v-model 配合），参数为新的标签 name
 * @event {(pane: TabsPaneContext, ev: Event) => void} tabClick - 点击标签页时触发，pane 为被点击的 TabPane 上下文对象，ev 为原生 MouseEvent
 * @event {(name: TabPaneName) => void} tabChange - 激活标签页变化时触发，参数为新的标签 name；与 update:modelValue 同步触发
 * @event {(paneName: TabPaneName | undefined, action: 'remove' | 'add') => void} edit - 新增或删除标签页时触发，paneName 为操作的标签 name（新增时为 undefined），action 为 'remove' 或 'add'
 * @event {(name: TabPaneName) => void} tabRemove - 点击标签关闭按钮时触发，参数为被关闭标签的 name
 * @event {() => void} tabAdd - 点击新增标签按钮时触发，无参数
 *
 * @example
 * ```vue
 * <!-- 示例1: 基础用法 + v-model 双向绑定 -->
 * <el-tabs v-model="activeTab" @tab-click="handleClick">
 *   <el-tab-pane label="用户管理" name="users">用户内容</el-tab-pane>
 *   <el-tab-pane label="角色管理" name="roles">角色内容</el-tab-pane>
 *   <el-tab-pane label="权限配置" name="perms" disabled>权限内容</el-tab-pane>
 * </el-tabs>
 *
 * <!-- 示例2: 可编辑（增删） + 卡片风格 + 底部位置 + 切换前拦截 -->
 * <el-tabs
 *   v-model="editableTabsValue"
 *   type="card"
 *   editable
 *   tab-position="bottom"
 *   :before-leave="beforeLeave"
 *   @edit="handleEdit"
 *   @tab-remove="handleRemove"
 * >
 *   <el-tab-pane
 *     v-for="tab in tabs"
 *     :key="tab.name"
 *     :label="tab.title"
 *     :name="tab.name"
 *     :closable="tab.closable"
 *   >
 *     {{ tab.content }}
 *   </el-tab-pane>
 * </el-tabs>
 * ```
 */

import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  provide,
  ref,
  renderSlot,
  watch,
} from 'vue'
import {
  buildProps,
  definePropType,
  isNumber,
  isString,
  isUndefined,
} from '@element-plus/utils'
import { EVENT_CODE, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import ElIcon from '@element-plus/components/icon'
import { Plus } from '@element-plus/icons-vue'
import {
  useDeprecated,
  useNamespace,
  useOrderedChildren,
} from '@element-plus/hooks'
import { tabsRootContextKey } from './constants'
import TabNav from './tab-nav'

import type { TabNavInstance } from './tab-nav'
import type { TabsPaneContext } from './constants'
import type { ExtractPropTypes } from 'vue'
import type { Awaitable } from '@element-plus/utils'

export type TabPaneName = string | number

export const tabsProps = buildProps({
  type: {
    type: String,
    values: ['card', 'border-card', ''],
    default: '',
  },
  activeName: {
    type: [String, Number],
  },
  closable: Boolean,
  addable: Boolean,
  modelValue: {
    type: [String, Number],
  },
  editable: Boolean,
  tabPosition: {
    type: String,
    values: ['top', 'right', 'bottom', 'left'],
    default: 'top',
  },
  beforeLeave: {
    type: definePropType<
      (newName: TabPaneName, oldName: TabPaneName) => Awaitable<void | boolean>
    >(Function),
    default: () => true,
  },
  stretch: Boolean,
} as const)
export type TabsProps = ExtractPropTypes<typeof tabsProps>

const isPaneName = (value: unknown): value is string | number =>
  isString(value) || isNumber(value)

export const tabsEmits = {
  [UPDATE_MODEL_EVENT]: (name: TabPaneName) => isPaneName(name),
  tabClick: (pane: TabsPaneContext, ev: Event) => ev instanceof Event,
  tabChange: (name: TabPaneName) => isPaneName(name),
  edit: (paneName: TabPaneName | undefined, action: 'remove' | 'add') =>
    ['remove', 'add'].includes(action),
  tabRemove: (name: TabPaneName) => isPaneName(name),
  tabAdd: () => true,
}
export type TabsEmits = typeof tabsEmits

export type TabsPanes = Record<number, TabsPaneContext>

export default defineComponent({
  name: 'ElTabs',

  props: tabsProps,
  emits: tabsEmits,

  setup(props, { emit, slots, expose }) {
    const ns = useNamespace('tabs')

    const {
      children: panes,
      addChild: registerPane,
      removeChild: unregisterPane,
    } = useOrderedChildren<TabsPaneContext>(getCurrentInstance()!, 'ElTabPane')

    const nav$ = ref<TabNavInstance>()
    const currentName = ref<TabPaneName>(
      props.modelValue ?? props.activeName ?? '0'
    )

    const changeCurrentName = (value: TabPaneName) => {
      currentName.value = value
      emit(UPDATE_MODEL_EVENT, value)
      emit('tabChange', value)
    }

    const setCurrentName = async (value?: TabPaneName) => {
      // should do nothing.
      if (currentName.value === value || isUndefined(value)) return

      try {
        const canLeave = await props.beforeLeave?.(value, currentName.value)
        if (canLeave !== false) {
          changeCurrentName(value)

          // call exposed function, Vue doesn't support expose in typescript yet.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          nav$.value?.removeFocus?.()
        }
      } catch {}
    }

    const handleTabClick = (
      tab: TabsPaneContext,
      tabName: TabPaneName,
      event: Event
    ) => {
      if (tab.props.disabled) return
      setCurrentName(tabName)
      emit('tabClick', tab, event)
    }

    const handleTabRemove = (pane: TabsPaneContext, ev: Event) => {
      if (pane.props.disabled || isUndefined(pane.props.name)) return
      ev.stopPropagation()
      emit('edit', pane.props.name, 'remove')
      emit('tabRemove', pane.props.name)
    }

    const handleTabAdd = () => {
      emit('edit', undefined, 'add')
      emit('tabAdd')
    }

    useDeprecated(
      {
        from: '"activeName"',
        replacement: '"model-value" or "v-model"',
        scope: 'ElTabs',
        version: '2.3.0',
        ref: 'https://element-plus.org/en-US/component/tabs.html#attributes',
        type: 'Attribute',
      },
      computed(() => !!props.activeName)
    )

    watch(
      () => props.activeName,
      (modelValue) => setCurrentName(modelValue)
    )

    watch(
      () => props.modelValue,
      (modelValue) => setCurrentName(modelValue)
    )

    watch(currentName, async () => {
      await nextTick()
      // call exposed function, Vue doesn't support expose in typescript yet.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      nav$.value?.scrollToActiveTab()
    })

    provide(tabsRootContextKey, {
      props,
      currentName,
      registerPane,
      unregisterPane,
    })

    expose({
      currentName,
    })

    return () => {
      const newButton =
        props.editable || props.addable ? (
          <span
            class={ns.e('new-tab')}
            tabindex="0"
            onClick={handleTabAdd}
            onKeydown={(ev: KeyboardEvent) => {
              if (ev.code === EVENT_CODE.enter) handleTabAdd()
            }}
          >
            <ElIcon class={ns.is('icon-plus')}>
              <Plus />
            </ElIcon>
          </span>
        ) : null

      const header = (
        <div class={[ns.e('header'), ns.is(props.tabPosition)]}>
          {newButton}
          <TabNav
            ref={nav$}
            currentName={currentName.value}
            editable={props.editable}
            type={props.type}
            panes={panes.value}
            stretch={props.stretch}
            onTabClick={handleTabClick}
            onTabRemove={handleTabRemove}
          />
        </div>
      )

      const panels = (
        <div class={ns.e('content')}>{renderSlot(slots, 'default')}</div>
      )

      return (
        <div
          class={[
            ns.b(),
            ns.m(props.tabPosition),
            {
              [ns.m('card')]: props.type === 'card',
              [ns.m('border-card')]: props.type === 'border-card',
            },
          ]}
        >
          {...props.tabPosition !== 'bottom'
            ? [header, panels]
            : [panels, header]}
        </div>
      )
    }
  },
})

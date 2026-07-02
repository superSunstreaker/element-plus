/**
 * @summary ElMenu 导航菜单 - 为网站提供导航功能的菜单，支持水平/垂直两种模式、折叠展开、路由跳转、子菜单等场景，常用于侧边栏导航或顶部导航栏
 *
 * @attr {'horizontal' | 'vertical'} mode - 菜单展示模式，可选值为 horizontal（水平，适合顶部导航） / vertical（垂直，适合侧边栏），默认 'vertical'
 * @attr {string} defaultActive - 默认激活菜单项的 index，默认 ''，需与子菜单项 el-menu-item 的 index 属性对应
 * @attr {string[]} defaultOpeneds - 默认展开的 sub-menu 的 index 数组，默认 []，仅在非折叠状态下生效；与 uniqueOpened 配合使用时只会保留数组中第一个匹配项
 * @attr {boolean} uniqueOpened - 是否只保持一个子菜单的展开状态，默认 false，开启后每次展开新子菜单会自动收起其他已展开的子菜单
 * @attr {boolean} router - 是否使用 vue-router 模式，默认 false，开启后点击菜单项会调用 router.push 进行路由跳转，跳转目标取 el-menu-item 的 index 或 route 属性
 * @attr {'hover' | 'click'} menuTrigger - 子菜单展开的触发方式（仅在 horizontal 模式或 collapse 折叠状态下生效），可选值为 hover（悬停） / click（点击），默认 'hover'
 * @attr {boolean} collapse - 是否水平折叠收起菜单，默认 false，仅在 vertical 模式下生效；折叠后菜单宽度变小并显示为弹出式子菜单
 * @attr {string} backgroundColor - 菜单的背景色，默认 ''（采用 CSS 默认值 #ffffff），支持十六进制或 CSS 颜色值，会通过 CSS 变量传递给所有子项
 * @attr {string} textColor - 菜单的文字颜色，默认 ''（采用 CSS 默认值 #303133），支持十六进制或 CSS 颜色值
 * @attr {string} activeTextColor - 激活菜单项的文字颜色，默认 ''（采用 CSS 默认值 #409eff），支持十六进制或 CSS 颜色值
 * @attr {boolean} collapseTransition - 是否开启折叠展开动画，默认 true，仅在 vertical 模式下生效
 * @attr {boolean} ellipsis - 是否自动省略溢出的菜单项（显示为"更多"下拉），默认 true，仅在 horizontal 模式下生效；当窗口过窄时自动将溢出项收纳到"更多"子菜单中
 * @attr {'dark' | 'light'} popperEffect - 折叠状态下弹出子菜单的 popper 主题，可选值为 dark / light，默认 'dark'
 *
 * @event {(index: string, indexPath: string[]) => void} close - 收起某个 sub-menu 时触发，index 为被收起 sub-menu 的 index，indexPath 为从根菜单到该 sub-menu 的完整路径数组
 * @event {(index: string, indexPath: string[]) => void} open - 展开某个 sub-menu 时触发，index 为被展开 sub-menu 的 index，indexPath 为从根菜单到该 sub-menu 的完整路径数组
 * @event {(index: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<void | NavigationFailure>) => void} select - 菜单项激活时触发；index 为激活项 index，indexPath 为路径数组，item 包含 index/indexPath/route 信息；当 router 模式开启时，routerResult 为 router.push 返回的 Promise
 *
 * @example
 * ```vue
 * <!-- 示例1: 侧边栏垂直导航，配合 vue-router -->
 * <el-menu
 *   :default-active="$route.path"
 *   router
 *   background-color="#545c64"
 *   text-color="#fff"
 *   active-text-color="#ffd04b"
 *   @select="handleSelect"
 * >
 *   <el-sub-menu index="1">
 *     <template #title>用户管理</template>
 *     <el-menu-item index="/users/list">用户列表</el-menu-item>
 *     <el-menu-item index="/users/role">角色管理</el-menu-item>
 *   </el-sub-menu>
 *   <el-menu-item index="/settings">系统设置</el-menu-item>
 * </el-menu>
 *
 * <!-- 示例2: 顶部水平导航 + 折叠侧边栏 -->
 * <el-menu mode="horizontal" :default-active="activeIndex" :ellipsis="true" @select="onSelect">
 *   <el-menu-item index="home">首页</el-menu-item>
 *   <el-sub-menu index="workspace">
 *     <template #title>工作台</template>
 *     <el-menu-item index="task">任务</el-menu-item>
 *     <el-menu-item index="report">报表</el-menu-item>
 *   </el-sub-menu>
 * </el-menu>
 *
 * <el-menu :collapse="isCollapse" :default-openeds="['1']" unique-opened>
 *   <el-sub-menu index="1">
 *     <template #title><el-icon><Menu /></el-icon>折叠菜单</template>
 *     <el-menu-item index="1-1">子项一</el-menu-item>
 *   </el-sub-menu>
 * </el-menu>
 * ```
 */

import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { isNil } from 'lodash-unified'
import ElIcon from '@element-plus/components/icon'
import { More } from '@element-plus/icons-vue'
import {
  buildProps,
  definePropType,
  flattedChildren,
  isObject,
  isString,
  mutable,
} from '@element-plus/utils'
import { useNamespace } from '@element-plus/hooks'
import Menubar from './utils/menu-bar'
import ElMenuCollapseTransition from './menu-collapse-transition.vue'
import ElSubMenu from './sub-menu'
import { useMenuCssVar } from './use-menu-css-var'

import type { MenuItemClicked, MenuProvider, SubMenuProvider } from './types'
import type { NavigationFailure, Router } from 'vue-router'
import type { ExtractPropTypes, VNode, VNodeArrayChildren } from 'vue'
import type { UseResizeObserverReturn } from '@vueuse/core'

export const menuProps = buildProps({
  mode: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'vertical',
  },
  defaultActive: {
    type: String,
    default: '',
  },
  defaultOpeneds: {
    type: definePropType<string[]>(Array),
    default: () => mutable([] as const),
  },
  uniqueOpened: Boolean,
  router: Boolean,
  menuTrigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'hover',
  },
  collapse: Boolean,
  backgroundColor: String,
  textColor: String,
  activeTextColor: String,
  collapseTransition: {
    type: Boolean,
    default: true,
  },
  ellipsis: {
    type: Boolean,
    default: true,
  },
  popperEffect: {
    type: String,
    values: ['dark', 'light'],
    default: 'dark',
  },
} as const)
export type MenuProps = ExtractPropTypes<typeof menuProps>

const checkIndexPath = (indexPath: unknown): indexPath is string[] =>
  Array.isArray(indexPath) && indexPath.every((path) => isString(path))

export const menuEmits = {
  close: (index: string, indexPath: string[]) =>
    isString(index) && checkIndexPath(indexPath),

  open: (index: string, indexPath: string[]) =>
    isString(index) && checkIndexPath(indexPath),

  select: (
    index: string,
    indexPath: string[],
    item: MenuItemClicked,
    routerResult?: Promise<void | NavigationFailure>
  ) =>
    isString(index) &&
    checkIndexPath(indexPath) &&
    isObject(item) &&
    (routerResult === undefined || routerResult instanceof Promise),
}
export type MenuEmits = typeof menuEmits

export default defineComponent({
  name: 'ElMenu',

  props: menuProps,
  emits: menuEmits,

  setup(props, { emit, slots, expose }) {
    const instance = getCurrentInstance()!
    const router = instance.appContext.config.globalProperties.$router as Router
    const menu = ref<HTMLUListElement>()
    const nsMenu = useNamespace('menu')
    const nsSubMenu = useNamespace('sub-menu')

    // data
    const sliceIndex = ref(-1)

    const openedMenus = ref<MenuProvider['openedMenus']>(
      props.defaultOpeneds && !props.collapse
        ? props.defaultOpeneds.slice(0)
        : []
    )
    const activeIndex = ref<MenuProvider['activeIndex']>(props.defaultActive)
    const items = ref<MenuProvider['items']>({})
    const subMenus = ref<MenuProvider['subMenus']>({})

    // computed
    const isMenuPopup = computed<MenuProvider['isMenuPopup']>(() => {
      return (
        props.mode === 'horizontal' ||
        (props.mode === 'vertical' && props.collapse)
      )
    })

    // methods
    const initMenu = () => {
      const activeItem = activeIndex.value && items.value[activeIndex.value]
      if (!activeItem || props.mode === 'horizontal' || props.collapse) return

      const indexPath = activeItem.indexPath

      // 展开该菜单项的路径上所有子菜单
      // expand all subMenus of the menu item
      indexPath.forEach((index) => {
        const subMenu = subMenus.value[index]
        subMenu && openMenu(index, subMenu.indexPath)
      })
    }

    const openMenu: MenuProvider['openMenu'] = (index, indexPath) => {
      if (openedMenus.value.includes(index)) return
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (props.uniqueOpened) {
        openedMenus.value = openedMenus.value.filter((index: string) =>
          indexPath.includes(index)
        )
      }
      openedMenus.value.push(index)
      emit('open', index, indexPath)
    }

    const close = (index: string) => {
      const i = openedMenus.value.indexOf(index)
      if (i !== -1) {
        openedMenus.value.splice(i, 1)
      }
    }

    const closeMenu: MenuProvider['closeMenu'] = (index, indexPath) => {
      close(index)
      emit('close', index, indexPath)
    }

    const handleSubMenuClick: MenuProvider['handleSubMenuClick'] = ({
      index,
      indexPath,
    }) => {
      const isOpened = openedMenus.value.includes(index)

      if (isOpened) {
        closeMenu(index, indexPath)
      } else {
        openMenu(index, indexPath)
      }
    }

    const handleMenuItemClick: MenuProvider['handleMenuItemClick'] = (
      menuItem
    ) => {
      if (props.mode === 'horizontal' || props.collapse) {
        openedMenus.value = []
      }

      const { index, indexPath } = menuItem
      if (isNil(index) || isNil(indexPath)) return

      if (props.router && router) {
        const route = menuItem.route || index
        const routerResult = router.push(route).then((res) => {
          if (!res) activeIndex.value = index
          return res
        })
        emit(
          'select',
          index,
          indexPath,
          { index, indexPath, route },
          routerResult
        )
      } else {
        activeIndex.value = index
        emit('select', index, indexPath, { index, indexPath })
      }
    }

    const updateActiveIndex = (val: string) => {
      const itemsInData = items.value
      const item =
        itemsInData[val] ||
        (activeIndex.value && itemsInData[activeIndex.value]) ||
        itemsInData[props.defaultActive]

      if (item) {
        activeIndex.value = item.index
      } else {
        activeIndex.value = val
      }
    }

    const calcSliceIndex = () => {
      if (!menu.value) return -1
      const items = Array.from(menu.value?.childNodes ?? []).filter(
        (item) =>
          // remove comment type node #12634
          item.nodeName !== '#comment' &&
          (item.nodeName !== '#text' || item.nodeValue)
      ) as HTMLElement[]
      const moreItemWidth = 64
      const paddingLeft = Number.parseInt(
        getComputedStyle(menu.value!).paddingLeft,
        10
      )
      const paddingRight = Number.parseInt(
        getComputedStyle(menu.value!).paddingRight,
        10
      )
      const menuWidth = menu.value!.clientWidth - paddingLeft - paddingRight
      let calcWidth = 0
      let sliceIndex = 0
      items.forEach((item, index) => {
        calcWidth += item.offsetWidth || 0
        if (calcWidth <= menuWidth - moreItemWidth) {
          sliceIndex = index + 1
        }
      })
      return sliceIndex === items.length ? -1 : sliceIndex
    }

    // Common computer monitor FPS is 60Hz, which means 60 redraws per second. Calculation formula: 1000ms/60 ≈ 16.67ms, In order to avoid a certain chance of repeated triggering when `resize`, set wait to 16.67 * 2 = 33.34
    const debounce = (fn: () => void, wait = 33.34) => {
      let timmer: ReturnType<typeof setTimeout> | null
      return () => {
        timmer && clearTimeout(timmer)
        timmer = setTimeout(() => {
          fn()
        }, wait)
      }
    }

    let isFirstTimeRender = true
    const handleResize = () => {
      const callback = () => {
        sliceIndex.value = -1
        nextTick(() => {
          sliceIndex.value = calcSliceIndex()
        })
      }
      // execute callback directly when first time resize to avoid shaking
      isFirstTimeRender ? callback() : debounce(callback)()
      isFirstTimeRender = false
    }

    watch(
      () => props.defaultActive,
      (currentActive) => {
        if (!items.value[currentActive]) {
          activeIndex.value = ''
        }
        updateActiveIndex(currentActive)
      }
    )

    watch(
      () => props.collapse,
      (value) => {
        if (value) openedMenus.value = []
      }
    )

    watch(items.value, initMenu)

    let resizeStopper: UseResizeObserverReturn['stop']
    watchEffect(() => {
      if (props.mode === 'horizontal' && props.ellipsis)
        resizeStopper = useResizeObserver(menu, handleResize).stop
      else resizeStopper?.()
    })

    // provide
    {
      const addSubMenu: MenuProvider['addSubMenu'] = (item) => {
        subMenus.value[item.index] = item
      }

      const removeSubMenu: MenuProvider['removeSubMenu'] = (item) => {
        delete subMenus.value[item.index]
      }

      const addMenuItem: MenuProvider['addMenuItem'] = (item) => {
        items.value[item.index] = item
      }

      const removeMenuItem: MenuProvider['removeMenuItem'] = (item) => {
        delete items.value[item.index]
      }
      provide<MenuProvider>(
        'rootMenu',
        reactive({
          props,
          openedMenus,
          items,
          subMenus,
          activeIndex,
          isMenuPopup,

          addMenuItem,
          removeMenuItem,
          addSubMenu,
          removeSubMenu,
          openMenu,
          closeMenu,
          handleMenuItemClick,
          handleSubMenuClick,
        })
      )
      provide<SubMenuProvider>(`subMenu:${instance.uid}`, {
        addSubMenu,
        removeSubMenu,
        mouseInChild: ref(false),
        level: 0,
      })
    }

    // lifecycle
    onMounted(() => {
      if (props.mode === 'horizontal') {
        new Menubar(instance.vnode.el!, nsMenu.namespace.value)
      }
    })

    {
      const open = (index: string) => {
        const { indexPath } = subMenus.value[index]
        indexPath.forEach((i) => openMenu(i, indexPath))
      }

      expose({
        open,
        close,
        handleResize,
      })
    }

    return () => {
      let slot: VNodeArrayChildren = slots.default?.() ?? []
      const vShowMore: VNode[] = []

      if (props.mode === 'horizontal' && menu.value) {
        const originalSlot = flattedChildren(slot) as VNodeArrayChildren
        const slotDefault =
          sliceIndex.value === -1
            ? originalSlot
            : originalSlot.slice(0, sliceIndex.value)

        const slotMore =
          sliceIndex.value === -1 ? [] : originalSlot.slice(sliceIndex.value)

        if (slotMore?.length && props.ellipsis) {
          slot = slotDefault
          vShowMore.push(
            h(
              ElSubMenu,
              {
                index: 'sub-menu-more',
                class: nsSubMenu.e('hide-arrow'),
              },
              {
                title: () =>
                  h(
                    ElIcon,
                    {
                      class: nsSubMenu.e('icon-more'),
                    },
                    { default: () => h(More) }
                  ),
                default: () => slotMore,
              }
            )
          )
        }
      }

      const ulStyle = useMenuCssVar(props, 0)

      const vMenu = h(
        'ul',
        {
          key: String(props.collapse),
          role: 'menubar',
          ref: menu,
          style: ulStyle.value,
          class: {
            [nsMenu.b()]: true,
            [nsMenu.m(props.mode)]: true,
            [nsMenu.m('collapse')]: props.collapse,
          },
        },
        [...slot, ...vShowMore]
      )

      if (props.collapseTransition && props.mode === 'vertical') {
        return h(ElMenuCollapseTransition, () => vMenu)
      }

      return vMenu
    }
  },
})

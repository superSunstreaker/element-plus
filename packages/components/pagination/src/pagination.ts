/**
 * @summary ElPagination 分页 - 当数据量过多时，使用分页分解数据，常用于列表、表格底部的页码导航
 *
 * @attr {number} pageSize - 每页显示的数据条数，支持 v-model:page-size 双向绑定；不设置时由组件内部维护，默认 10
 * @attr {number} defaultPageSize - 每页条数的默认初始值，不设置等同于 10；用于非受控场景，避免与 pageSize 同时设置
 * @attr {number} total - 数据总条数，用于计算总页数；与 page-count 二选一设置
 * @attr {number} pageCount - 总页数，设置后分页器按该值显示页码；与 total 二选一，page-count 优先级更高
 * @attr {number} pagerCount - 页码按钮的最大数量（含省略号），必须是 5 到 21 之间的奇数，默认 7；总页数超过该值时会折叠显示
 * @attr {number} currentPage - 当前页码，支持 v-model:current-page 双向绑定；不设置时由组件内部维护，默认 1
 * @attr {number} defaultCurrentPage - 当前页码的默认初始值，不设置等同于 1；用于非受控场景
 * @attr {string} layout - 分页组件的布局，子组件名用逗号分隔，可选值：prev / pager / next / jumper / -> / total / sizes / slot，其中 '->' 后的元素右对齐
 * @attr {number[]} pageSizes - 每页显示个数选择器的选项列表，默认 [10, 20, 30, 40, 50, 100]
 * @attr {string} popperClass - 每页条数选择器下拉框的自定义类名
 * @attr {string} prevText - 替代图标显示的上一页按钮文字
 * @attr {Component | string} prevIcon - 上一页按钮的图标组件，优先级高于 prev-text，默认 ArrowLeft
 * @attr {string} nextText - 替代图标显示的下一页按钮文字
 * @attr {Component | string} nextIcon - 下一页按钮的图标组件，优先级高于 next-text，默认 ArrowRight
 * @attr {boolean} small - 是否使用小型分页样式，默认 false
 * @attr {boolean} background - 是否为分页按钮添加背景色，默认 false
 * @attr {boolean} disabled - 是否禁用分页，默认 false
 * @attr {boolean} hideOnSinglePage - 只有一页时是否隐藏，默认 false
 *
 * @event {number} update:current-page - 当前页码变化时触发（v-model:current-page），参数为新页码
 * @event {number} update:page-size - 每页条数变化时触发（v-model:page-size），参数为新每页条数
 * @event {number} size-change - 每页条数变化时触发，参数为新的 pageSize
 * @event {number} current-change - 当前页码变化时触发，参数为新的 currentPage
 * @event {number} prev-click - 用户点击上一页按钮时触发，参数为当前页码
 * @event {number} next-click - 用户点击下一页按钮时触发，参数为当前页码
 *
 * @example
 * ```vue
 * <el-pagination
 *   v-model:current-page="currentPage"
 *   v-model:page-size="pageSize"
 *   :page-sizes="[10, 20, 50, 100]"
 *   :total="total"
 *   layout="total, sizes, prev, pager, next, jumper"
 *   background
 *   @size-change="handleSizeChange"
 *   @current-change="handleCurrentChange"
 * />
 * ```
 *
 * @example
 * ```vue
 * <el-pagination :total="100" layout="prev, pager, next" small @current-change="onPageChange" />
 * ```
 *
 * @example
 * ```vue
 * <el-pagination :total="50" :hide-on-single-page="true" layout="prev, pager, next" />
 * ```
 */

import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  provide,
  ref,
  watch,
} from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import {
  buildProps,
  debugWarn,
  definePropType,
  iconPropType,
  isNumber,
  mutable,
} from '@element-plus/utils'
import { useLocale, useNamespace } from '@element-plus/hooks'
import { elPaginationKey } from './constants'

import Prev from './components/prev.vue'
import Next from './components/next.vue'
import Sizes from './components/sizes.vue'
import Jumper from './components/jumper.vue'
import Total from './components/total.vue'
import Pager from './components/pager.vue'

import type { ExtractPropTypes, VNode } from 'vue'

/**
 * It it user's responsibility to guarantee that the value of props.total... is number
 * (same as pageSize, defaultPageSize, currentPage, defaultCurrentPage, pageCount)
 * Otherwise we can reasonable infer that the corresponding field is absent
 */
const isAbsent = (v: unknown): v is undefined => typeof v !== 'number'

type LayoutKey =
  | 'prev'
  | 'pager'
  | 'next'
  | 'jumper'
  | '->'
  | 'total'
  | 'sizes'
  | 'slot'

export const paginationProps = buildProps({
  /**
   * @description options of item count per page
   */
  pageSize: Number,
  /**
   * @description default initial value of page size, not setting is the same as setting 10
   */
  defaultPageSize: Number,
  /**
   * @description total item count
   */
  total: Number,
  /**
   * @description total page count. Set either `total` or `page-count` and pages will be displayed; if you need `page-sizes`, `total` is required
   */
  pageCount: Number,
  /**
   * @description number of pagers. Pagination collapses when the total page count exceeds this value
   */
  pagerCount: {
    type: Number,
    validator: (value: unknown) => {
      return (
        isNumber(value) &&
        Math.trunc(value) === value &&
        value > 4 &&
        value < 22 &&
        value % 2 === 1
      )
    },
    default: 7,
  },
  /**
   * @description current page number
   */
  currentPage: Number,
  /**
   * @description default initial value of current-page, not setting is the same as setting 1
   */
  defaultCurrentPage: Number,
  /**
   * @description layout of Pagination, elements separated with a comma
   */
  layout: {
    type: String,
    default: (
      ['prev', 'pager', 'next', 'jumper', '->', 'total'] as LayoutKey[]
    ).join(', '),
  },
  /**
   * @description item count of each page
   */
  pageSizes: {
    type: definePropType<number[]>(Array),
    default: () => mutable([10, 20, 30, 40, 50, 100] as const),
  },
  /**
   * @description custom class name for the page size Select's dropdown
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * @description text for the prev button
   */
  prevText: {
    type: String,
    default: '',
  },
  /**
   * @description icon for the prev button, higher priority of `prev-text`
   */
  prevIcon: {
    type: iconPropType,
    default: () => ArrowLeft,
  },
  /**
   * @description text for the next button
   */
  nextText: {
    type: String,
    default: '',
  },
  /**
   * @description icon for the next button, higher priority of `next-text`
   */
  nextIcon: {
    type: iconPropType,
    default: () => ArrowRight,
  },
  /**
   * @description whether to use small pagination
   */
  small: Boolean,
  /**
   * @description whether the buttons have a background color
   */
  background: Boolean,
  /**
   * @description whether Pagination is disabled
   */
  disabled: Boolean,
  /**
   * @description whether to hide when there's only one page
   */
  hideOnSinglePage: Boolean,
} as const)
export type PaginationProps = ExtractPropTypes<typeof paginationProps>

export const paginationEmits = {
  'update:current-page': (val: number) => isNumber(val),
  'update:page-size': (val: number) => isNumber(val),
  'size-change': (val: number) => isNumber(val),
  'current-change': (val: number) => isNumber(val),
  'prev-click': (val: number) => isNumber(val),
  'next-click': (val: number) => isNumber(val),
}
export type PaginationEmits = typeof paginationEmits

const componentName = 'ElPagination'
export default defineComponent({
  name: componentName,

  props: paginationProps,
  emits: paginationEmits,

  setup(props, { emit, slots }) {
    const { t } = useLocale()
    const ns = useNamespace('pagination')
    const vnodeProps = getCurrentInstance()!.vnode.props || {}
    // we can find @xxx="xxx" props on `vnodeProps` to check if user bind corresponding events
    const hasCurrentPageListener =
      'onUpdate:currentPage' in vnodeProps ||
      'onUpdate:current-page' in vnodeProps ||
      'onCurrentChange' in vnodeProps
    const hasPageSizeListener =
      'onUpdate:pageSize' in vnodeProps ||
      'onUpdate:page-size' in vnodeProps ||
      'onSizeChange' in vnodeProps
    const assertValidUsage = computed(() => {
      // Users have to set either one, otherwise count of pages cannot be determined
      if (isAbsent(props.total) && isAbsent(props.pageCount)) return false
      // <el-pagination ...otherProps :current-page="xxx" /> without corresponding listener is forbidden now
      // Users have to use two way binding of `currentPage`
      // If users just want to provide a default value, `defaultCurrentPage` is here for you
      if (!isAbsent(props.currentPage) && !hasCurrentPageListener) return false
      // When you want to change sizes, things get more complex, detailed below
      // Basically the most important value we need is page count
      // either directly from props.pageCount
      // or calculated from props.total
      // we will take props.pageCount precedence over props.total
      if (props.layout.includes('sizes')) {
        if (!isAbsent(props.pageCount)) {
          // if props.pageCount is assign by user, then user have to watch pageSize change
          // and recalculate pageCount
          if (!hasPageSizeListener) return false
        } else if (!isAbsent(props.total)) {
          // Otherwise, we will see if user have props.pageSize defined
          // If so, meaning user want to have pageSize controlled himself/herself from component
          // Thus page size listener is required
          // users are account for page size change
          if (!isAbsent(props.pageSize)) {
            if (!hasPageSizeListener) {
              return false
            }
          } else {
            // (else block just for explaination)
            // else page size is controlled by el-pagination internally
          }
        }
      }
      return true
    })

    const innerPageSize = ref(
      isAbsent(props.defaultPageSize) ? 10 : props.defaultPageSize
    )
    const innerCurrentPage = ref(
      isAbsent(props.defaultCurrentPage) ? 1 : props.defaultCurrentPage
    )

    const pageSizeBridge = computed({
      get() {
        return isAbsent(props.pageSize) ? innerPageSize.value : props.pageSize
      },
      set(v: number) {
        if (isAbsent(props.pageSize)) {
          innerPageSize.value = v
        }
        if (hasPageSizeListener) {
          emit('update:page-size', v)
          emit('size-change', v)
        }
      },
    })

    const pageCountBridge = computed<number>(() => {
      let pageCount = 0
      if (!isAbsent(props.pageCount)) {
        pageCount = props.pageCount
      } else if (!isAbsent(props.total)) {
        pageCount = Math.max(1, Math.ceil(props.total / pageSizeBridge.value))
      }
      return pageCount
    })

    const currentPageBridge = computed<number>({
      get() {
        return isAbsent(props.currentPage)
          ? innerCurrentPage.value
          : props.currentPage
      },
      set(v) {
        let newCurrentPage = v
        if (v < 1) {
          newCurrentPage = 1
        } else if (v > pageCountBridge.value) {
          newCurrentPage = pageCountBridge.value
        }
        if (isAbsent(props.currentPage)) {
          innerCurrentPage.value = newCurrentPage
        }
        if (hasCurrentPageListener) {
          emit('update:current-page', newCurrentPage)
          emit('current-change', newCurrentPage)
        }
      },
    })

    watch(pageCountBridge, (val) => {
      if (currentPageBridge.value > val) currentPageBridge.value = val
    })

    function handleCurrentChange(val: number) {
      currentPageBridge.value = val
    }

    function handleSizeChange(val: number) {
      pageSizeBridge.value = val
      const newPageCount = pageCountBridge.value
      if (currentPageBridge.value > newPageCount) {
        currentPageBridge.value = newPageCount
      }
    }

    function prev() {
      if (props.disabled) return
      currentPageBridge.value -= 1
      emit('prev-click', currentPageBridge.value)
    }

    function next() {
      if (props.disabled) return
      currentPageBridge.value += 1
      emit('next-click', currentPageBridge.value)
    }

    function addClass(element: any, cls: string) {
      if (element) {
        if (!element.props) {
          element.props = {}
        }
        element.props.class = [element.props.class, cls].join(' ')
      }
    }

    provide(elPaginationKey, {
      pageCount: pageCountBridge,
      disabled: computed(() => props.disabled),
      currentPage: currentPageBridge,
      changeEvent: handleCurrentChange,
      handleSizeChange,
    })

    return () => {
      if (!assertValidUsage.value) {
        debugWarn(componentName, t('el.pagination.deprecationWarning'))
        return null
      }
      if (!props.layout) return null
      if (props.hideOnSinglePage && pageCountBridge.value <= 1) return null
      const rootChildren: Array<VNode | VNode[] | null> = []
      const rightWrapperChildren: Array<VNode | VNode[] | null> = []
      const rightWrapperRoot = h(
        'div',
        { class: ns.e('rightwrapper') },
        rightWrapperChildren
      )
      const TEMPLATE_MAP: Record<
        Exclude<LayoutKey, '->'>,
        VNode | VNode[] | null
      > = {
        prev: h(Prev, {
          disabled: props.disabled,
          currentPage: currentPageBridge.value,
          prevText: props.prevText,
          prevIcon: props.prevIcon,
          onClick: prev,
        }),
        jumper: h(Jumper, {
          size: props.small ? 'small' : 'default',
        }),
        pager: h(Pager, {
          currentPage: currentPageBridge.value,
          pageCount: pageCountBridge.value,
          pagerCount: props.pagerCount,
          onChange: handleCurrentChange,
          disabled: props.disabled,
        }),
        next: h(Next, {
          disabled: props.disabled,
          currentPage: currentPageBridge.value,
          pageCount: pageCountBridge.value,
          nextText: props.nextText,
          nextIcon: props.nextIcon,
          onClick: next,
        }),
        sizes: h(Sizes, {
          pageSize: pageSizeBridge.value,
          pageSizes: props.pageSizes,
          popperClass: props.popperClass,
          disabled: props.disabled,
          size: props.small ? 'small' : 'default',
        }),
        slot: slots?.default?.() ?? null,
        total: h(Total, { total: isAbsent(props.total) ? 0 : props.total }),
      }

      const components = props.layout
        .split(',')
        .map((item: string) => item.trim()) as LayoutKey[]

      let haveRightWrapper = false

      components.forEach((c) => {
        if (c === '->') {
          haveRightWrapper = true
          return
        }
        if (!haveRightWrapper) {
          rootChildren.push(TEMPLATE_MAP[c])
        } else {
          rightWrapperChildren.push(TEMPLATE_MAP[c])
        }
      })

      addClass(rootChildren[0], ns.is('first'))
      addClass(rootChildren[rootChildren.length - 1], ns.is('last'))

      if (haveRightWrapper && rightWrapperChildren.length > 0) {
        addClass(rightWrapperChildren[0], ns.is('first'))
        addClass(
          rightWrapperChildren[rightWrapperChildren.length - 1],
          ns.is('last')
        )
        rootChildren.push(rightWrapperRoot)
      }
      return h(
        'div',
        {
          class: [
            ns.b(),
            ns.is('background', props.background),
            {
              [ns.m('small')]: props.small,
            },
          ],
        },
        rootChildren
      )
    }
  },
})

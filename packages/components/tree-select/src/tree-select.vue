<script lang="ts">
/**
 * @summary ElTreeSelect 树选择器 - 基于 el-select 与 el-tree 组合的下拉树选择组件，继承两者的全部属性，支持单选/多选、懒加载、虚拟树过滤、复选框、check-strictly 等场景，常用于组织结构、地区级联等层级数据选择
 *
 * @attr {string | number | boolean | object | array} modelValue - 选中值，单选为节点 key，多选为 key 数组（v-model）
 * @attr {TreeNodeData[]} data - 树数据源，结构同 el-tree 的 data
 * @attr {string} nodeKey - 树节点的唯一标识字段，默认 'value'（继承自 select 的 valueKey）
 * @attr {boolean} showCheckbox - 是否显示复选框（多选），默认 false
 * @attr {boolean} checkStrictly - 是否严格的父子不关联模式，默认 false；为 true 时父子的选中互不影响
 * @attr {boolean} multiple - 是否多选，默认 false
 * @attr {boolean} filterable - 是否可搜索，默认 false
 * @attr {boolean} lazy - 是否懒加载子节点，默认 false
 * @attr {Function} lazyLoad - 懒加载方法，签名 (node, resolve) => void
 * @attr {boolean} renderAfterExpand - 是否展开后才渲染子节点，默认 true
 * @attr {boolean} expandOnClickNode - 是否点击节点展开，默认 false（仅 checkStrictly 为 false 时生效）
 * @attr {boolean} checkOnClickNode - 是否点击节点即勾选，默认 false
 * @attr {CacheOption[]} cacheData - 懒加载节点的缓存数据，结构与 data 一致，用于在未加载时获取 label
 * @attr {Function} filterMethod - 自定义搜索过滤方法
 * @attr {Function} filterNodeMethod - 自定义节点过滤方法，签名 (value, data, node) => boolean
 * @attr {Function} renderContent - 自定义节点渲染方法，签名 (h, { node, data, store }) => VNode
 * @attr {string} defaultExpandedKeys - 默认展开的节点 key 数组
 *
 * @example
 * ```vue
 * <!-- 单选树 -->
 * <el-tree-select
 *   v-model="value"
 *   :data="treeData"
 *   :props="{ label: 'name', children: 'children' }"
 *   check-strictly
 * />
 *
 * <!-- 多选 + 复选框 + 懒加载 -->
 * <el-tree-select
 *   v-model="values"
 *   :data="data"
 *   multiple
 *   show-checkbox
 *   lazy
 *   :load="loadNode"
 *   :cache-data="cache"
 * />
 * ```
 */
// @ts-nocheck
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { pick } from 'lodash-unified'
import ElSelect from '@element-plus/components/select'
import ElTree from '@element-plus/components/tree'
import { useSelect } from './select'
import { useTree } from './tree'
import CacheOptions from './cache-options'

export default defineComponent({
  name: 'ElTreeSelect',
  // disable `ElSelect` inherit current attrs
  inheritAttrs: false,
  props: {
    ...ElSelect.props,
    ...ElTree.props,
    /**
     * @description The cached data of the lazy node, the structure is the same as the data, used to get the label of the unloaded data
     */
    cacheData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const { slots, expose } = context

    const select = ref<InstanceType<typeof ElSelect>>()
    const tree = ref<InstanceType<typeof ElTree>>()

    const key = computed(() => props.nodeKey || props.valueKey || 'value')

    const selectProps = useSelect(props, context, { select, tree, key })
    const { cacheOptions, ...treeProps } = useTree(props, context, {
      select,
      tree,
      key,
    })

    // expose ElTree/ElSelect methods
    const methods = reactive({})
    expose(methods)
    onMounted(() => {
      Object.assign(methods, {
        ...pick(tree.value, [
          'filter',
          'updateKeyChildren',
          'getCheckedNodes',
          'setCheckedNodes',
          'getCheckedKeys',
          'setCheckedKeys',
          'setChecked',
          'getHalfCheckedNodes',
          'getHalfCheckedKeys',
          'getCurrentKey',
          'getCurrentNode',
          'setCurrentKey',
          'setCurrentNode',
          'getNode',
          'remove',
          'append',
          'insertBefore',
          'insertAfter',
        ]),
        ...pick(select.value, ['focus', 'blur']),
      })
    })

    return () =>
      h(
        ElSelect,
        /**
         * 1. The `props` is processed into `Refs`, but `v-bind` and
         * render function props cannot read `Refs`, so use `reactive`
         * unwrap the `Refs` and keep reactive.
         * 2. The keyword `ref` requires `Ref`, but `reactive` broke it,
         * so use function.
         */
        reactive({
          ...selectProps,
          ref: (ref) => (select.value = ref),
        }),
        {
          ...slots,
          default: () => [
            h(CacheOptions, { data: cacheOptions.value }),
            h(
              ElTree,
              reactive({
                ...treeProps,
                ref: (ref) => (tree.value = ref),
              })
            ),
          ],
        }
      )
  },
})
</script>

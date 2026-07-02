<template>
  <li
    v-show="visible"
    :class="containerKls"
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script lang="ts">
/**
 * @summary ElOption 选择项 - ElSelect 下拉列表中的单个选项
 *
 * ⚠️ 此组件为 ElSelect 的子组件，需配合 ElSelect 使用
 *
 * @attr {string|number|boolean|object} value - 选项的值，必填
 * @attr {string|number} label - 选项展示文本，省略时同 value
 * @attr {boolean} created - 是否为用户创建的新选项（用于可创建模式）
 * @attr {boolean} disabled - 是否禁用该选项
 *
 * @example
 * ```vue
 * <el-select v-model="value">
 *   <el-option label="选项一" value="1" />
 *   <el-option label="选项二" value="2" />
 * </el-select>
 * ```
 */
// @ts-nocheck
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  reactive,
  toRefs,
  unref,
} from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { useOption } from './useOption'
import type { SelectOptionProxy } from './token'

export default defineComponent({
  name: 'ElOption',
  componentName: 'ElOption',

  props: {
    /**
     * @description value of option
     */
    value: {
      required: true,
      type: [String, Number, Boolean, Object],
    },
    /**
     * @description label of option, same as `value` if omitted
     */
    label: [String, Number],
    created: Boolean,
    /**
     * @description whether option is disabled
     */
    disabled: Boolean,
  },

  setup(props) {
    const ns = useNamespace('select')

    const containerKls = computed(() => [
      ns.be('dropdown', 'item'),
      ns.is('disabled', unref(isDisabled)),
      {
        selected: unref(itemSelected),
        hover: unref(hover),
      },
    ])

    const states = reactive({
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false,
    })

    const { currentLabel, itemSelected, isDisabled, select, hoverItem } =
      useOption(props, states)

    const { visible, hover } = toRefs(states)

    const vm = getCurrentInstance().proxy

    select.onOptionCreate(vm as unknown as SelectOptionProxy)

    onBeforeUnmount(() => {
      const key = (vm as unknown as SelectOptionProxy).value
      const { selected } = select
      const selectedOptions = select.props.multiple ? selected : [selected]
      const doesSelected = selectedOptions.some((item) => {
        return item.value === (vm as unknown as SelectOptionProxy).value
      })
      // if option is not selected, remove it from cache
      nextTick(() => {
        if (select.cachedOptions.get(key) === vm && !doesSelected) {
          select.cachedOptions.delete(key)
        }
      })
      select.onOptionDestroy(key, vm)
    })

    function selectOptionClick() {
      if (props.disabled !== true && states.groupDisabled !== true) {
        select.handleOptionSelect(vm)
      }
    }

    return {
      ns,
      containerKls,
      currentLabel,
      itemSelected,
      isDisabled,
      select,
      hoverItem,
      visible,
      hover,
      selectOptionClick,
      states,
    }
  },
})
</script>

/**
 * @summary ElTimePicker 时间选择器 - 选择任意时间点或时间范围
 *
 * 提供一个时间选择面板（时/分/秒），支持单选与范围选择、自定义格式、禁用时间、
 * 默认值、快捷选项等。基于 dayjs 解析与格式化，继承 timePickerDefaultProps 公共属性。
 * 适用于预约、考勤、调度等需要精确时间输入的场景。
 *
 * @attr {String|Array} modelValue - 绑定值，v-model 双向绑定（单选为字符串，范围为数组）
 * @attr {Boolean} isRange - 是否选择时间范围（默认 false）
 * @attr {String} format - 时间显示格式，如 'HH:mm:ss'（默认来自 DEFAULT_FORMATS_TIME）
 * @attr {String} valueFormat - 绑定值的格式（影响 v-model 输出）
 * @attr {String} defaultTime - 默认时间（无选择时面板回退值）
 * @attr {String} placeholder - 单选占位文本
 * @attr {String} startPlaceholder - 范围开始占位文本
 * @attr {String} endPlaceholder - 范围结束占位文本
 * @attr {Boolean} disabled - 是否禁用
 * @attr {Boolean} clearable - 是否可清空
 * @attr {Boolean} editable - 输入框是否可手动编辑
 * @attr {String} size - 尺寸，可选 'large'/'default'/'small'
 * @attr {Object} popperOptions - 传递给底层 popper 的选项
 *
 * @event {*} update:modelValue - 绑定值变化时触发
 *
 * @expose focus(e?) - 聚焦输入框
 * @expose blur(e?) - 失焦输入框
 * @expose handleOpen() - 打开时间选择面板
 * @expose handleClose() - 关闭时间选择面板
 *
 * @example
 * <el-time-picker v-model="value" placeholder="选择时间" format="HH:mm:ss" />
 *
 * @example
 * // 时间范围选择
 * <el-time-picker
 *   v-model="range"
 *   is-range
 *   start-placeholder="开始时间"
 *   end-placeholder="结束时间"
 * />
 */
import { defineComponent, provide, ref } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import { DEFAULT_FORMATS_TIME } from './constants'
import Picker from './common/picker.vue'
import TimePickPanel from './time-picker-com/panel-time-pick.vue'
import TimeRangePanel from './time-picker-com/panel-time-range.vue'
import { timePickerDefaultProps } from './common/props'
dayjs.extend(customParseFormat)

export default defineComponent({
  name: 'ElTimePicker',
  install: null,
  props: {
    ...timePickerDefaultProps,
    /**
     * @description whether to pick a time range
     */
    isRange: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const commonPicker = ref<InstanceType<typeof Picker>>()
    const [type, Panel] = props.isRange
      ? ['timerange', TimeRangePanel]
      : ['time', TimePickPanel]

    const modelUpdater = (value: any) => ctx.emit('update:modelValue', value)
    provide('ElPopperOptions', props.popperOptions)
    ctx.expose({
      /**
       * @description focus the Input component
       */
      focus: (e: FocusEvent | undefined) => {
        commonPicker.value?.handleFocusInput(e)
      },
      /**
       * @description blur the Input component
       */
      blur: (e: FocusEvent | undefined) => {
        commonPicker.value?.handleBlurInput(e)
      },
      /**
       * @description open the TimePicker popper
       */
      handleOpen: () => {
        commonPicker.value?.handleOpen()
      },
      /**
       * @description close the TimePicker popper
       */
      handleClose: () => {
        commonPicker.value?.handleClose()
      },
    })

    return () => {
      const format = props.format ?? DEFAULT_FORMATS_TIME

      return (
        <Picker
          {...props}
          ref={commonPicker}
          type={type}
          format={format}
          onUpdate:modelValue={modelUpdater}
        >
          {{
            default: (props: any) => <Panel {...props} />,
          }}
        </Picker>
      )
    }
  },
})

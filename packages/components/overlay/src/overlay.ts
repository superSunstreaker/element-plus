import { createVNode, defineComponent, h, renderSlot } from 'vue'
import { PatchFlags, buildProps, definePropType } from '@element-plus/utils'
import { useNamespace, useSameTarget } from '@element-plus/hooks'

import type { CSSProperties, ExtractPropTypes } from 'vue'
import type { ZIndexProperty } from 'csstype'

/**
 * @summary ElOverlay 遮罩层 - 覆盖在页面内容之上的全屏/局部遮罩层
 *
 * 🔒 内部组件：主要为 Dialog、Drawer、MessageBox、Loading 等弹层类组件提供底层遮罩能力，也可单独使用
 *
 * @attr {Boolean} mask - 是否显示遮罩背景，默认 true
 * @attr {Boolean} customMaskEvent - 是否自定义遮罩点击事件（关闭默认点击行为），默认 false
 * @attr {String|String[]|Object} overlayClass - 遮罩层自定义类名
 * @attr {String|Number} zIndex - 遮罩层 z-index
 * @emit click - 遮罩被点击时触发（仅当 customMaskEvent 为 false 时由默认行为派发）
 *
 * @usage
 * <!-- 内部用法：Dialog/Drawer 将其作为遮罩层包装默认插槽 -->
 * <el-overlay :mask="true" :z-index="2000" @click="onClose">
 *   <div>弹层内容</div>
 * </el-overlay>
 */
export const overlayProps = buildProps({
  mask: {
    type: Boolean,
    default: true,
  },
  customMaskEvent: {
    type: Boolean,
    default: false,
  },
  overlayClass: {
    type: definePropType<string | string[] | Record<string, boolean>>([
      String,
      Array,
      Object,
    ]),
  },
  zIndex: {
    type: definePropType<ZIndexProperty>([String, Number]),
  },
} as const)
export type OverlayProps = ExtractPropTypes<typeof overlayProps>

export const overlayEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}
export type OverlayEmits = typeof overlayEmits

const BLOCK = 'overlay'

export default defineComponent({
  name: 'ElOverlay',

  props: overlayProps,
  emits: overlayEmits,

  setup(props, { slots, emit }) {
    // No reactivity on this prop because when its rendering with a global
    // component, this will be a constant flag.
    const ns = useNamespace(BLOCK)

    const onMaskClick = (e: MouseEvent) => {
      emit('click', e)
    }

    const { onClick, onMousedown, onMouseup } = useSameTarget(
      props.customMaskEvent ? undefined : onMaskClick
    )

    // init here
    return () => {
      // when the vnode meets the same structure but with different change trigger
      // it will not automatically update, thus we simply use h function to manage updating
      return props.mask
        ? createVNode(
            'div',
            {
              class: [ns.b(), props.overlayClass],
              style: {
                zIndex: props.zIndex,
              },
              onClick,
              onMousedown,
              onMouseup,
            },
            [renderSlot(slots, 'default')],
            PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS,
            ['onClick', 'onMouseup', 'onMousedown']
          )
        : h(
            'div',
            {
              class: props.overlayClass,
              style: {
                zIndex: props.zIndex,
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              } as CSSProperties,
            },
            [renderSlot(slots, 'default')]
          )
    }
  },
})

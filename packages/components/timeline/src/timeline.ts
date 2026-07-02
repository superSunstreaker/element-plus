/**
 * @summary ElTimeline 时间线 - 按时间顺序可视化展示信息流
 *
 * 用于按时间顺序展示一组信息节点（如操作日志、订单进度、版本记录），
 * 通过垂直排列的时间节点清晰呈现事件发展脉络。子节点由 ElTimelineItem 提供。
 *
 * @example
 * <el-timeline>
 *   <el-timeline-item
 *     v-for="(activity, index) in activities"
 *     :key="index"
 *     :timestamp="activity.timestamp"
 *   >
 *     {{ activity.content }}
 *   </el-timeline-item>
 * </el-timeline>
 *
 * @example
 * // 自定义图标与颜色
 * <el-timeline-item timestamp="2024-01-01" placement="top" type="primary">
 *   <template #dot><el-icon><Clock /></el-icon></template>
 *   自定义节点内容
 * </el-timeline-item>
 */
import { defineComponent, h, provide, renderSlot } from 'vue'
import { useNamespace } from '@element-plus/hooks'

const Timeline = defineComponent({
  name: 'ElTimeline',
  setup(_, { slots }) {
    const ns = useNamespace('timeline')

    provide('timeline', slots)

    /**
     *  Maybe ,this component will not support prop 'reverse', why ?
     *
     *  Example 1:
     *   <component-a>
     *     <div>1</div>
     *     <div>2</div>
     *   </component-a>
     *
     *  Example 2:
     *   <component-a>
     *     <div v-for="i in 2" :key="i">{{ i }}</div>
     *   </component-a>
     *
     *  'slots.default()' value in example 1 just like [Vnode, Vnode]
     *  'slots.default()' value in example 2 just like [Vnode]
     *
     *   so i can't reverse the slots, when i use 'v-for' directive.
     */

    return () => {
      return h('ul', { class: [ns.b()] }, [renderSlot(slots, 'default')])
    }
  },
})

export default Timeline
export type TimelineInstance = InstanceType<typeof Timeline>

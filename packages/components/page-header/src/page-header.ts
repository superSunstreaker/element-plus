/**
 * @summary ElPageHeader 页头 - 页面顶部标题与返回导航
 *
 * 用于页面顶部的标题、副标题、返回按钮组合，常作为详情页、表单页的页眉。
 * 内置返回图标，点击触发 back 事件，便于用户在层级页面间导航。
 *
 * @attr {String|Component} icon - 返回图标组件（默认 Back 图标）
 * @attr {String} title - 主标题
 * @attr {String} content - 内容/副标题（默认 ''）
 *
 * @event {*} back - 点击返回按钮时触发
 *
 * @example
 * <el-page-header title="用户管理" content="编辑用户" @back="goBack" />
 *
 * @example
 * // 自定义图标与插槽
 * <el-page-header :icon="ArrowLeft">
 *   <template #content>
 *     <el-tag>编辑中</el-tag>
 *   </template>
 * </el-page-header>
 */
import { buildProps, iconPropType } from '@element-plus/utils'
import { Back } from '@element-plus/icons-vue'
import type { ExtractPropTypes } from 'vue'
import type PageHeader from './page-header.vue'

export const pageHeaderProps = buildProps({
  /**
   * @description icon component of page header
   */
  icon: {
    type: iconPropType,
    default: () => Back,
  },
  /**
   * @description main title of page header
   */
  title: String,
  /**
   * @description content of page header
   */
  content: {
    type: String,
    default: '',
  },
} as const)
export type PageHeaderProps = ExtractPropTypes<typeof pageHeaderProps>

export const pageHeaderEmits = {
  back: () => true,
}
export type PageHeaderEmits = typeof pageHeaderEmits

export type PageHeaderInstance = InstanceType<typeof PageHeader>

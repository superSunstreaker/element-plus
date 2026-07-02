/**
 * @summary ElEmpty 空状态 - 用于空数据提示的占位组件
 *
 * @attr {String} image - 空状态图片地址（默认 ''，不设则使用默认图片）
 * @attr {Number} imageSize - 图片尺寸（宽度，单位 px）
 * @attr {String} description - 描述文字（默认 ''）
 *
 * @example
 * <el-empty description="暂无数据" />
 * <el-empty :image-size="200" description="没有找到相关内容" />
 * <el-empty image="https://example.com/empty.png">自定义内容</el-empty>
 */
import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'

export const emptyProps = buildProps({
  /**
   * @description image URL of empty
   */
  image: {
    type: String,
    default: '',
  },
  /**
   * @description image size (width) of empty
   */
  imageSize: Number,
  /**
   * @description description of empty
   */
  description: {
    type: String,
    default: '',
  },
} as const)

export type EmptyProps = ExtractPropTypes<typeof emptyProps>

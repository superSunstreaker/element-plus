import { defineComponent, renderSlot, watch } from 'vue'
import { provideGlobalConfig } from './hooks/use-global-config'
import { configProviderProps } from './config-provider-props'

import type { MessageConfigContext } from '@element-plus/components/message'

export const messageConfig: MessageConfigContext = {}

/**
 * @summary ElConfigProvider 全局配置 - 为后代所有 Element Plus 组件提供全局配置上下文
 *
 * 🔒 内部组件：作为整个 EP 组件库的全局配置入口，影响 locale/size/zIndex/namespace/message 等所有后代组件行为
 *
 * @attr {Boolean} a11y - 是否启用无障碍特性，默认 true
 * @attr {Language} locale - 语言包对象，控制所有组件文案语言
 * @attr {''|'small'|'default'|'large'} size - 全局组件尺寸，影响所有表单类组件默认尺寸
 * @attr {ButtonConfigContext} button - Button 组件全局配置（如 autoInsertSpace 等）
 * @attr {ExperimentalFeatures} experimentalFeatures - 实验性功能开关（默认均为 false）
 * @attr {Boolean} keyboardNavigation - 是否启用键盘导航，默认 true
 * @attr {MessageConfigContext} message - Message 组件全局配置（如 max/grouping 等）
 * @attr {Number} zIndex - 全局初始 z-index，影响所有弹层类组件的起始层级
 * @attr {String} namespace - 全局组件类名前缀，默认 'el'（与 SCSS $namespace 配合）
 *
 * @usage
 * <!-- 在应用根节点包裹，为所有后代组件提供全局配置 -->
 * <el-config-provider :locale="zhCn" size="default" :z-index="3000">
 *   <app />
 * </el-config-provider>
 *
 * <!-- 嵌套配置：内层覆盖外层 -->
 * <el-config-provider size="small">
 *   <el-config-provider size="large">
 *     <el-form /> <!-- large -->
 *   </el-config-provider>
 * </el-config-provider>
 */
const ConfigProvider = defineComponent({
  name: 'ElConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    watch(
      () => props.message,
      (val) => {
        Object.assign(messageConfig, val ?? {})
      },
      { immediate: true, deep: true }
    )
    const config = provideGlobalConfig(props)
    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})
export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider

// @ts-nocheck
import { isRef, ref } from 'vue'
import { hyphenate, isObject, isString } from '@vue/shared'
import { Loading } from './service'
import type { Directive, DirectiveBinding, UnwrapRef } from 'vue'
import type { LoadingOptions } from './types'
import type { LoadingInstance } from './loading'

const INSTANCE_KEY = Symbol('ElLoading')

/**
 * @summary v-loading 加载指令 - 以指令形式为元素绑定加载遮罩
 *
 * 🔒 内部组件：基于 createLoadingComponent 实现，是 Loading 对外暴露的指令形态（与 ElLoadingService 服务并列）
 *
 * @binding {Boolean|LoadingOptions} value - true 显示加载；或传入完整 LoadingOptions 对象
 * @modifier fullscreen - 全屏遮罩
 * @modifier body - 将遮罩插入 document.body
 * @modifier lock - 锁定滚动
 *
 * @usage
 * <!-- 基本用法 -->
 * <div v-loading="isLoading">内容</div>
 * <!-- 全屏 -->
 * <div v-loading.fullscreen="isLoading">内容</div>
 * <!-- 对象配置 -->
 * <div v-loading="{ text: '加载中', background: 'rgba(0,0,0,0.7)' }">内容</div>
 */
export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>
export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance
    options: LoadingOptions
  }
}

const createInstance = (
  el: ElementLoading,
  binding: DirectiveBinding<LoadingBinding>
) => {
  const vm = binding.instance

  const getBindingProp = <K extends keyof LoadingOptions>(
    key: K
  ): LoadingOptions[K] =>
    isObject(binding.value) ? binding.value[key] : undefined

  const resolveExpression = (key: any) => {
    const data = (isString(key) && vm?.[key]) || key
    if (data) return ref(data)
    else return data
  }

  const getProp = <K extends keyof LoadingOptions>(name: K) =>
    resolveExpression(
      getBindingProp(name) ||
        el.getAttribute(`element-loading-${hyphenate(name)}`)
    )

  const fullscreen =
    getBindingProp('fullscreen') ?? binding.modifiers.fullscreen

  const options: LoadingOptions = {
    text: getProp('text'),
    svg: getProp('svg'),
    svgViewBox: getProp('svgViewBox'),
    spinner: getProp('spinner'),
    background: getProp('background'),
    customClass: getProp('customClass'),
    fullscreen,
    target: getBindingProp('target') ?? (fullscreen ? undefined : el),
    body: getBindingProp('body') ?? binding.modifiers.body,
    lock: getBindingProp('lock') ?? binding.modifiers.lock,
  }
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options),
  }
}

const updateOptions = (
  newOptions: UnwrapRef<LoadingOptions>,
  originalOptions: LoadingOptions
) => {
  for (const key of Object.keys(originalOptions)) {
    if (isRef(originalOptions[key]))
      originalOptions[key].value = newOptions[key]
  }
}

export const vLoading: Directive<ElementLoading, LoadingBinding> = {
  mounted(el, binding) {
    if (binding.value) {
      createInstance(el, binding)
    }
  },
  updated(el, binding) {
    const instance = el[INSTANCE_KEY]
    if (binding.oldValue !== binding.value) {
      if (binding.value && !binding.oldValue) {
        createInstance(el, binding)
      } else if (binding.value && binding.oldValue) {
        if (isObject(binding.value))
          updateOptions(binding.value, instance!.options)
      } else {
        instance?.instance.close()
      }
    }
  },
  unmounted(el) {
    el[INSTANCE_KEY]?.instance.close()
  },
}

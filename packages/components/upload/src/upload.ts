/**
 * @summary ElUpload 上传组件 - 用于将本地文件上传至服务器，支持点击选择、拖拽上传、图片墙、文件列表等多种交互形式
 *
 * @attr {String} action - 上传目标服务端 URL（必填），默认 '#'
 * @attr {Headers|Object} headers - 请求头（可传 Headers 实例或普通对象）
 * @attr {String} method - HTTP 请求方法；默认 'post'
 * @attr {Object} data - 上传时附带的额外业务参数；默认 {}
 * @attr {Boolean} multiple - 是否支持多文件选择；默认 false
 * @attr {String} name - 上传文件的字段名；默认 'file'
 * @attr {Boolean} drag - 是否开启拖拽上传；默认 false
 * @attr {Boolean} withCredentials - 是否发送 cookie 凭证；默认 false
 * @attr {Boolean} showFileList - 是否显示已上传文件列表；默认 true
 * @attr {String} accept - 接受的文件类型（原生 accept）；默认 ''
 * @attr {String} type - 上传触发方式，可选值 'select' | 'drag'；默认 'select'
 * @attr {UploadUserFile[]} fileList - 上传文件列表（用于初始化或受控）；默认 []
 * @attr {Boolean} autoUpload - 选择文件后是否自动上传；默认 true
 * @attr {String} listType - 列表展示样式，可选值 'text' | 'picture' | 'picture-card'；默认 'text'
 * @attr {Function} httpRequest - 自定义上传请求实现，覆盖默认 ajax 行为；签名 `(options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>`；默认 ajaxUpload
 * @attr {Boolean} disabled - 是否禁用；默认 false
 * @attr {Number} limit - 允许上传的最大文件数量
 * @attr {Function} beforeUpload - 上传前钩子，返回 false/File/Blob/Promise 可阻止上传或替换文件；签名 `(rawFile: UploadRawFile) => Awaitable<void|null|boolean|File|Blob>`
 * @attr {Function} beforeRemove - 删除前钩子，返回 false 或 reject 的 Promise 阻止删除；签名 `(uploadFile, uploadFiles) => Awaitable<boolean>`
 * @attr {Function} onRemove - 文件删除时回调；签名 `(uploadFile, uploadFiles) => void`
 * @attr {Function} onChange - 文件状态变化回调；签名 `(uploadFile, uploadFiles) => void`
 * @attr {Function} onPreview - 点击文件列表项预览回调；签名 `(uploadFile) => void`
 * @attr {Function} onSuccess - 上传成功回调；签名 `(response, uploadFile, uploadFiles) => void`
 * @attr {Function} onProgress - 上传进度回调；签名 `(evt: UploadProgressEvent, uploadFile, uploadFiles) => void`
 * @attr {Function} onError - 上传失败回调；签名 `(error: Error, uploadFile, uploadFiles) => void`
 * @attr {Function} onExceed - 超出 limit 时回调；签名 `(files: File[], uploadFiles: UploadUserFile[]) => void`
 *
 * @example
 * ```vue
 * <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15">
 *   <el-button type="primary">点击上传</el-button>
 *   <template #tip>
 *     <div class="el-upload__tip">只能上传 jpg/png 文件</div>
 *   </template>
 * </el-upload>
 *
 * <el-upload
 *   action="/api/upload"
 *   :headers="{ Authorization: token }"
 *   :data="{ bizType: 'avatar' }"
 *   :before-upload="beforeUpload"
 *   :on-success="onSuccess"
 *   :on-error="onError"
 *   :limit="3"
 *   drag
 *   multiple
 * />
 * ```
 */
import { NOOP } from '@vue/shared'
import { buildProps, definePropType, mutable } from '@element-plus/utils'
import { ajaxUpload } from './ajax'

import type { UploadAjaxError } from './ajax'
import type { Awaitable } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Upload from './upload.vue'

export const uploadListTypes = ['text', 'picture', 'picture-card'] as const

let fileId = 1
export const genFileId = () => Date.now() + fileId++

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail'
export interface UploadProgressEvent extends ProgressEvent {
  percent: number
}

export interface UploadRequestOptions {
  action: string
  method: string
  data: Record<string, string | Blob | [string | Blob, string]>
  filename: string
  file: UploadRawFile
  headers: Headers | Record<string, string | number | null | undefined>
  onError: (evt: UploadAjaxError) => void
  onProgress: (evt: UploadProgressEvent) => void
  onSuccess: (response: any) => void
  withCredentials: boolean
}
export interface UploadFile {
  name: string
  percentage?: number
  status: UploadStatus
  size?: number
  response?: unknown
  uid: number
  url?: string
  raw?: UploadRawFile
}
export type UploadUserFile = Omit<UploadFile, 'status' | 'uid'> &
  Partial<Pick<UploadFile, 'status' | 'uid'>>

export type UploadFiles = UploadFile[]
export interface UploadRawFile extends File {
  uid: number
}
export type UploadRequestHandler = (
  options: UploadRequestOptions
) => XMLHttpRequest | Promise<unknown>
export interface UploadHooks {
  beforeUpload: (
    rawFile: UploadRawFile
  ) => Awaitable<void | undefined | null | boolean | File | Blob>
  beforeRemove: (
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => Awaitable<boolean>
  onRemove: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void
  onChange: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void
  onPreview: (uploadFile: UploadFile) => void
  onSuccess: (
    response: any,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => void
  onProgress: (
    evt: UploadProgressEvent,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => void
  onError: (
    error: Error,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => void
  onExceed: (files: File[], uploadFiles: UploadUserFile[]) => void
}

export const uploadBaseProps = buildProps({
  action: {
    type: String,
    default: '#',
  },
  headers: {
    type: definePropType<Headers | Record<string, any>>(Object),
  },
  method: {
    type: String,
    default: 'post',
  },
  data: {
    type: Object,
    default: () => mutable({} as const),
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: 'file',
  },
  drag: {
    type: Boolean,
    default: false,
  },
  withCredentials: Boolean,
  showFileList: {
    type: Boolean,
    default: true,
  },
  accept: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'select',
  },
  fileList: {
    type: definePropType<UploadUserFile[]>(Array),
    default: () => mutable([] as const),
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  listType: {
    type: String,
    values: uploadListTypes,
    default: 'text',
  },
  httpRequest: {
    type: definePropType<UploadRequestHandler>(Function),
    default: ajaxUpload,
  },
  disabled: Boolean,
  limit: Number,
} as const)

export const uploadProps = buildProps({
  ...uploadBaseProps,
  beforeUpload: {
    type: definePropType<UploadHooks['beforeUpload']>(Function),
    default: NOOP,
  },
  beforeRemove: {
    type: definePropType<UploadHooks['beforeRemove']>(Function),
  },
  onRemove: {
    type: definePropType<UploadHooks['onRemove']>(Function),
    default: NOOP,
  },
  onChange: {
    type: definePropType<UploadHooks['onChange']>(Function),
    default: NOOP,
  },
  onPreview: {
    type: definePropType<UploadHooks['onPreview']>(Function),
    default: NOOP,
  },
  onSuccess: {
    type: definePropType<UploadHooks['onSuccess']>(Function),
    default: NOOP,
  },
  onProgress: {
    type: definePropType<UploadHooks['onProgress']>(Function),
    default: NOOP,
  },
  onError: {
    type: definePropType<UploadHooks['onError']>(Function),
    default: NOOP,
  },
  onExceed: {
    type: definePropType<UploadHooks['onExceed']>(Function),
    default: NOOP,
  },
} as const)

export type UploadProps = ExtractPropTypes<typeof uploadProps>

export type UploadInstance = InstanceType<typeof Upload>

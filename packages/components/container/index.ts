/**
 * @summary ElContainer 容器布局 - 用于页面整体布局的容器组件，配合 Header / Aside / Main / Footer 组合使用
 *
 * @attr {String} direction - 子元素排列方向，可选值 'horizontal' / 'vertical'（不设置时自动根据子组件判断）
 *
 * @example
 * <el-container>
 *   <el-header>Header</el-header>
 *   <el-container>
 *     <el-aside width="200px">Aside</el-aside>
 *     <el-main>Main</el-main>
 *   </el-container>
 *   <el-footer>Footer</el-footer>
 * </el-container>
 *
 * @description 子组件说明：
 * - ElHeader：顶部容器，默认高度 60px
 * - ElAside：侧边栏容器，默认宽度 300px
 * - ElMain：主要区域容器
 * - ElFooter：底部容器，默认高度 60px
 */
import { withInstall, withNoopInstall } from '@element-plus/utils'

import Container from './src/container.vue'
import Aside from './src/aside.vue'
import Footer from './src/footer.vue'
import Header from './src/header.vue'
import Main from './src/main.vue'

export const ElContainer = withInstall(Container, {
  Aside,
  Footer,
  Header,
  Main,
})

export default ElContainer
export const ElAside = withNoopInstall(Aside)
export const ElFooter = withNoopInstall(Footer)
export const ElHeader = withNoopInstall(Header)
export const ElMain = withNoopInstall(Main)

export type ContainerInstance = InstanceType<typeof Container>
export type AsideInstance = InstanceType<typeof Aside>
export type FooterInstance = InstanceType<typeof Footer>
export type HeaderInstance = InstanceType<typeof Header>
export type MainInstance = InstanceType<typeof Main>

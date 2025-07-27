import { ModalProps } from 'antd';
import { ReactNode } from 'react';

export type MyModalProps = Omit<ModalProps, 'open' | 'title' | 'footer' | 'destroyOnClose'>;

export interface OpenOptions {
  title?: ModalProps['title'];
  content: ReactNode;
  footer?: ModalProps['footer'];
  /* 弹框样式参考antd Modal的文档 */
  props?: MyModalProps;
}

export interface PopupProps {
  onMounted: () => void;
  onUnmount: () => void;
}

export interface PopupRef {
  /* 打开弹框 */
  open: (options: OpenOptions) => void;
  /* 关闭弹框 */
  close: () => void;
  /* 设置弹框样式 */
  setModalProps: (modalProps: MyModalProps) => void;
}

export interface CurrentPopup extends PopupRef {
  /* 初始化弹框样式 */
  resetModalProps: () => void;
  /* 获取弹框是否打开 - react-status */
  isOpen: boolean;
  /* 获取弹框是否打开 - 函数式获取，不存在闭包 */
  getIsOpen: () => boolean;
}

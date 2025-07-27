import { useMount, useUpdateEffect } from 'ahooks';
import { Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import styles from './style.module.scss';
import { MyModalProps, OpenOptions, PopupProps, PopupRef } from './types';

const Popup = forwardRef<PopupRef, PopupProps>(function Popup(props, ref) {
  const { onMounted, onUnmount } = props;

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState<OpenOptions['title']>(null);
  const [content, setContent] = useState<OpenOptions['content']>(null);
  const [footer, setFooter] = useState<OpenOptions['footer']>(null);

  const [modalProps, setModalProps] = useState<MyModalProps>({});
  const [customProps, setCustomProps] = useState<MyModalProps>({});
  const myModalProps = useMemo(() => {
    // todo 应该深合并 要用的时候记得改
    const obj: ModalProps = Object.assign({}, modalProps, customProps, {
      maskStyle: {},
      wrapClassName: classNames(modalProps.wrapClassName, customProps.wrapClassName),
      className: classNames(modalProps.className, customProps.className, styles.popup),
    });

    obj.afterClose = () => {
      modalProps.afterClose?.();
      queueMicrotask(onUnmount);
    };

    return obj;
  }, [modalProps, customProps, onUnmount]);

  // 挂载通知
  useMount(onMounted);
  // 更新滚动状态
  useUpdateEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);
  useImperativeHandle(ref, () => ({
    open(options) {
      setTitle(options.title || null);
      setContent(options.content);
      setFooter(options.footer || null);
      setCustomProps(options?.props || {});
      setOpen(true);
    },
    close() {
      setOpen(false);
    },
    setModalProps(modalProps) {
      setModalProps(modalProps);
    },
  }));

  return (
    <Modal open={open} title={title} footer={footer} destroyOnClose {...myModalProps}>
      {content}
    </Modal>
  );
});

export default Popup;

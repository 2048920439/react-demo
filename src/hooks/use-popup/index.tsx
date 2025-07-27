import { useGetState, useMemoizedFn } from 'ahooks';
import { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './popup.component';
import { CurrentPopup, MyModalProps, OpenOptions, PopupRef } from './types';

/**
 * 根据产品要求设置的一些统一行为
 */
const DefaultProps: Partial<MyModalProps> = {
  // 右上角关闭按钮
  closable: false,
  // 点击遮罩层关闭
  maskClosable: false,
  // esc关闭
  keyboard: false,
  // 垂直居中
  centered: true,
};

export function usePopup(modalProps: MyModalProps = {}): CurrentPopup {
  const container = useRef<HTMLDivElement>(null);
  const ref = useRef<PopupRef>(null);
  const [isOpen, setIsOpen, getIsOpen] = useGetState(false);

  const createModalPropsRef = useMemoizedFn(
    (modalProps: MyModalProps = {}): MyModalProps => ({
      onCancel: () => close(),
      ...DefaultProps,
      ...modalProps,
    }),
  );

  const modalPropsRef = useRef<MyModalProps>(createModalPropsRef(modalProps));

  const init = useMemoizedFn((onMounted: () => void) => {
    container.current = document.createElement('div');
    const root = createRoot(container.current);
    root.render(<Popup ref={ref} onMounted={onMounted} onUnmount={onUnmount} />);

    function onUnmount() {
      setIsOpen(false);
      root.unmount();
      container.current?.remove();
      container.current = null;
    }
  });

  const open = useMemoizedFn((options: OpenOptions) => {
    setIsOpen(true);
    if (container.current && ref.current) openPopup();
    else init(openPopup);

    function openPopup() {
      ref.current?.setModalProps(modalPropsRef.current);
      ref.current?.open(options);
    }
  });

  const close = useMemoizedFn(() => {
    ref.current?.close();
  });

  const setModalProps = useMemoizedFn((newModalProps: MyModalProps) => {
    modalPropsRef.current = createModalPropsRef({ ...modalPropsRef.current, ...newModalProps });
    ref.current?.setModalProps(modalPropsRef.current);
  });

  const resetModalProps = useMemoizedFn(() => {
    modalPropsRef.current = createModalPropsRef();
    ref.current?.setModalProps(modalPropsRef.current);
  });

  return useMemo<CurrentPopup>(
    () => ({
      isOpen,
      getIsOpen,
      open,
      close,
      setModalProps,
      resetModalProps,
    }),
    [isOpen, getIsOpen, open, close, setModalProps, resetModalProps],
  );
}

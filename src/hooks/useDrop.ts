import { BasicTarget } from 'ahooks/lib/utils/domTarget';
import { useEffect, useMemo, useState } from 'react';
import { getTargetElement } from 'ahooks/es/utils/domTarget';

export interface UseDropParams {
    target: BasicTarget<HTMLElement | Element | Window | Document>;
    disable?: boolean;
    onDrop?: (e: DragEvent) => void;
}

export interface UseDropReturn {
    dragging: boolean;
}

export const useDrop = (params: UseDropParams): UseDropReturn => {
    const { target, disable = false, onDrop } = params;
    const dom = getTargetElement(target);
    const [dragging, setDragging] = useState(false);
    useEffect((): any => {
        if (disable) return;
        if (!dom) return;

        // 记录鼠标是否在目标元素内
        let dragEnterCount = 0;
        const handelDrop = (event: DragEvent) => {
            event.preventDefault();
            dragEnterCount = 0;
            setDragging(false);
             onDrop?.(event);
        };
        const handleDragenter = (event: DragEvent) => {
            event.preventDefault();
            dragEnterCount++;
            setDragging(true);
        };
        const handleDragover = (event: DragEvent) => {
            event.preventDefault();
        };
        const handleDragleave = (event: DragEvent) => {
            event.preventDefault();
            dragEnterCount--;
            if (dragEnterCount === 0) setDragging(false);
        };

        dom.addEventListener('drop', handelDrop as any);
        dom.addEventListener('dragenter', handleDragenter as any);
        dom.addEventListener('dragover', handleDragover as any);
        dom.addEventListener('dragleave', handleDragleave as any);
        return () => {
            setDragging(false);
            dom.removeEventListener('drop', handelDrop as any);
            dom.removeEventListener('dragenter', handleDragenter as any);
            dom.removeEventListener('dragover', handleDragover as any);
            dom.removeEventListener('dragleave', handleDragleave as any);
        };
    }, [dom, disable, onDrop]);

    return useMemo(
        () => ({
            dragging,
        }),
        [dragging],
    );
};

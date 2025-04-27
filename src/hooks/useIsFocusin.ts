import {useDebounce, useEventListener} from "ahooks";
import {BasicTarget, getTargetElement} from "ahooks/es/utils/domTarget";
import {useState} from "react";


export interface UseIsFocusinConfig {
    exclusion?: BasicTarget[]
}

/**
 * 当前元素或子元素是否获取了焦点
 * 基于focusin和focusout事件实现
 */
export const useIsFocusin = (target: BasicTarget, options?: UseIsFocusinConfig): boolean => {
    const [isFocus, setIsFocus] = useState(false);
    useEventListener(
        'focusin',
        (e) => {
            const block = options?.exclusion
                ?.map((t) => getTargetElement(t))
                .filter(Boolean)
                .some((el) => el!.contains(e.target));
            if (!block) {
                setIsFocus(true);
            }
        },
        {target},
    );
    useEventListener(
        'focusout',
        (e) => {
            const dom = getTargetElement(target);
            if (!dom) return;
            if (!dom.contains(e.relatedTarget)) {
                setIsFocus(false);
            }
        },
        {target},
    );
    return useDebounce(isFocus, {wait: 100});
};
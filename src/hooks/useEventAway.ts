import {BasicTarget, getTargetElement} from "ahooks/es/utils/domTarget";
import {useEventListener} from "ahooks";

type HTMLEventName = keyof HTMLElementEventMap

type GetHTMLEvent<TEventName extends HTMLEventName> = HTMLElementEventMap[TEventName]

type UseEventListenerOptions = Parameters<typeof useEventListener>[2]

type UseEventAwayOptions = Omit<UseEventListenerOptions, 'target'>

export const useEventAway = <TEventName extends HTMLEventName>(
    target: BasicTarget | BasicTarget[],
    eventName: HTMLEventName,
    callback: (e: GetHTMLEvent<TEventName>) => void,
    options: UseEventAwayOptions = { capture: true }
) => {
    useEventListener(
        eventName,
        (ev) => {
            const isBreak = (Array.isArray(target) ? target : [target])
                .map((target) => getTargetElement(target))
                .filter((dom) => dom instanceof Element)
                .some((dom) => dom.contains(ev.target as Node))
            if (!isBreak) {
                callback(ev as GetHTMLEvent<TEventName>)
            }
        },
        { ...options, target: document.body }
    )
}
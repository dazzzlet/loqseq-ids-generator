import { RefObject, useRef } from "react"

export const useFocus = (): [RefObject<HTMLInputElement>, Function] => {
    const htmlElRef = useRef<HTMLInputElement>(null)
    const setFocus: Function = () => {
        htmlElRef.current && htmlElRef.current.focus()
    }
    return [htmlElRef, setFocus]
}
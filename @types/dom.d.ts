
import { SLASH_TRIGGER_EVENT } from '../src/const';
import { BlockCursorPosition } from '@logseq/libs/dist/LSPlugin';


interface IdsGeneratorSlashTriggerEvent {
    posision: BlockCursorPosition
}

interface CustomEventMap {
    [SLASH_TRIGGER_EVENT]: CustomEvent<IdsGeneratorSlashTriggerEvent>
}
declare global {
    interface Document { //adds definition to Document, but you can do the same with HTMLElement
        addEventListener<K extends keyof CustomEventMap>(type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void): void;
        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
    }
}
export { IdsGeneratorSlashTriggerEvent }; //keep that for TS compiler.

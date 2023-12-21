import { PrefixDefaultProps } from "models/PrefixDefaultProps";

export const SLASH_TRIGGER_EVENT = 'logseq:ids-generator:slash';

export const KEY_UP = "ArrowUp";
export const KEY_DOWN = "ArrowDown";
export const KEY_LEFT = "ArrowLeft";
export const KEY_RIGHT = "ArrowRight";
export const KEY_ESCAPE = "Escape";
export const KEY_ENTER = "Enter";

export const DEFAULT_PREFIX_PAGE_PROPS: PrefixDefaultProps = {
    padding: '3',
    prefix: '',
    sequence: 'true',
    start: '1',
    type: '[[IdPrefix]]'
};
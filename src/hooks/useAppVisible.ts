import { useEffect, useState } from 'react';
import { useMountedState } from './useMountedState';
import { SLASH_TRIGGER_EVENT } from 'const';
import { BlockCursorPosition } from '@logseq/libs/dist/LSPlugin';

export function useAppVisible() {
    const [visible, setVisible] = useState(logseq.isMainUIVisible);
    const [position, setPosition] = useState<BlockCursorPosition | null>(null);
    const isMounted = useMountedState();
    useEffect(() => {
        const eventName = 'ui:visible:changed';
        const uiVisibleChangedHandler = async ({ visible }: { visible: boolean }) => {
            if (isMounted()) {
                setVisible(visible);
            }
        };
        const slashTriggeredHandler = (evt: any) => {
            const currentPosition = evt.detail.position;
            if (isMounted()) {
                setVisible(true);
                setPosition(currentPosition);
            }
        };
        document.addEventListener(SLASH_TRIGGER_EVENT, slashTriggeredHandler);
        logseq.on(eventName, uiVisibleChangedHandler);
        return () => {
            document.removeEventListener(SLASH_TRIGGER_EVENT, slashTriggeredHandler);
            logseq.off(eventName, uiVisibleChangedHandler);
        };
    }, [isMounted]);
    return [visible, position];
}
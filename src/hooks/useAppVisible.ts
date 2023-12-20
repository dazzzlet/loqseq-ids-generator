import { useEffect, useState } from 'react';
import { useMountedState } from './useMountedState';
import { SLASH_TRIGGER_EVENT } from 'const';
import { BlockCursorPosition } from '@logseq/libs/dist/LSPlugin';
import { VisibleTriggerSource } from 'enums';

export function useAppVisible(): [boolean, BlockCursorPosition | null, VisibleTriggerSource] {
    const [visible, setVisible] = useState(logseq.isMainUIVisible);
    const [visibleTrigger, setVisibleTrigger] = useState(VisibleTriggerSource.None);
    const [position, setPosition] = useState<BlockCursorPosition | null>(null);
    const isMounted = useMountedState();
    useEffect(() => {
        const eventName = 'ui:visible:changed';
        const uiVisibleChangedHandler = async ({ visible }: { visible: boolean }) => {
            if (isMounted()) {
                if (visible) {
                    setVisibleTrigger(VisibleTriggerSource.Toolbar);
                } else {
                    setVisibleTrigger(VisibleTriggerSource.None);
                }
                setVisible(visible);
            }
        };
        const slashTriggeredHandler = (evt: any) => {
            const currentPosition = evt.detail.position;
            if (isMounted()) {
                setVisible(true);
                setVisibleTrigger(VisibleTriggerSource.SlashMenu);
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
    return [visible, position, visibleTrigger];
}
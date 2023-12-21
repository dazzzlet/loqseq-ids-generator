import { QueryResultPageEntity } from "models/logseqQueryResultTypes";
import { useLogseqQuery } from "./useLogseqQuery"
import { useEffect, useMemo } from "react";
import { PrefixPage } from "models/PrefixPage";
import { SLASH_TRIGGER_EVENT } from "const";
import { useMountedState } from "./useMountedState";


export const useIdPrefixPages = (): Record<string, PrefixPage> => {
    const prefixPagesQuery = `
    [
        :find ?name ?prefix ?padding ?sequence ?start (pull ?page [*]) (sum ?sumAttr) (max ?idValue)
        :where
            [?rootPage :block/name "idprefix"]
            [?blockRef :block/refs ?rootPage]
            [?blockRef :block/page ?page]
            [?page :block/original-name ?name]
            [?page :block/properties ?pageProps]
            [(get ?pageProps :type) ?pageType]
            [(contains? ?pageType "IdPrefix")]
            [(get ?pageProps :prefix) ?prefix]
            [(get ?pageProps :padding) ?padding]
            [(get ?pageProps :sequence) ?sequence]
            [(get ?pageProps :start) ?start]
            
            [(str "(?i)^" ?prefix "-\\\\d+$") ?pattern]
            [(re-pattern ?pattern) ?match]
            [(re-pattern "(?i)\\\\d+$") ?idMatch]

            (or-join [?match ?idMatch ?start ?sumAttr ?id ?idValue]
                (and [?usageBlock :block/refs ?idPage]
                         [?idPage :block/name ?id]
                         [(re-find ?match ?id)]
                         [(re-find ?idMatch ?id) ?idValue]
                         [(+ 1) ?sumAttr])
                (and [(+ 0) ?id]
                         [(str "00000000" ?start) ?startValue]
                         [(count ?startValue) ?startValueLen]
                         [(- ?startValueLen ?start) ?subIndex]
                         [(subs ?startValue 6) ?idValue]
                         [(+ 0) ?sumAttr])
            )
    ]`;
    const isMounted = useMountedState();
    const [result, setNewQuery] = useLogseqQuery<[
        string,
        string,
        number,
        boolean,
        string,
        QueryResultPageEntity,
        number,
        string
    ]>(prefixPagesQuery);

    const updateNewQuery = () => {
        setNewQuery(query => query + ' ');
    }

    useEffect(() => {
        const eventName = 'ui:visible:changed';
        const uiVisibleChangedHandler = async ({ visible }: { visible: boolean }) => {
            if (isMounted() && visible) {
                updateNewQuery()
            }
        };
        const slashTriggeredHandler = () => {
            if (isMounted()) {
                updateNewQuery()
            }
        };
        document.addEventListener(SLASH_TRIGGER_EVENT, slashTriggeredHandler);
        logseq.on(eventName, uiVisibleChangedHandler);
        return () => {
            document.removeEventListener(SLASH_TRIGGER_EVENT, slashTriggeredHandler);
            logseq.off(eventName, uiVisibleChangedHandler);
        };
    }, [isMounted]);
    return useMemo(() => {
        console.log("Conbo", result)
        const definedPrefixes: Record<string, PrefixPage> = result.map(
            ([name, prefix, padding, sequence, start, page, usages, max]) => {
                let startValue = 0;
                try {
                    startValue = parseInt(start)
                } catch { }
                let maxValue = startValue;
                try {
                    maxValue = parseInt(max)
                } catch { }
                return {
                    name,
                    prefix: prefix.toUpperCase(),
                    padding,
                    sequence,
                    start: startValue,
                    page: page,
                    usage: usages,
                    max: maxValue
                };
            }).reduce((map, prefix) => {
                map[prefix.prefix] = prefix;
                return map;
            }, {} as Record<string, PrefixPage>);
        return definedPrefixes;
    }, [result])
}
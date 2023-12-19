import { QueryResultPageEntity } from "models/logseqQueryResultTypes";
import { useLogseqQuery } from "./useLogseqQuery"
import { useMemo } from "react";
import { PrefixPage } from "models/PrefixPage";


export const useIdPrefixPages = (): Record<string, PrefixPage> => {
    const [result] = useLogseqQuery<[string, string, number, boolean, string, QueryResultPageEntity, number, string]>(`
        [
            :find ?name ?prefix ?padding ?sequence ?start (pull ?page [*]) (count ?idPage) (max ?idValue)
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

                  [?usageBlock :block/refs ?idPage]
                  [?idPage :block/name ?id]
                  [(re-find ?match ?id)]
                  [(re-find ?idMatch ?id) ?idValue]
        ]
    `);

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
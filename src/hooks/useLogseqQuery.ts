import { useLayoutEffect, useMemo, useState } from "react";
import { useMountedState } from "./useMountedState";


export const useLogseqQuery = <TResult>(initialQuery: string): [TResult[], (newQuery: string) => void] => {
    const isMounted = useMountedState();
    const [query, setNewQuery] = useState<string>(initialQuery);
    const [result, setResult] = useState<TResult[]>([]);

    useLayoutEffect(() => {
        console.log("Conheo1");
        (async () => {
            const queryResultRefs = await logseq.DB.datascriptQuery(query);
            console.log("Conheo", queryResultRefs);

            if (isMounted()) {
                setResult(queryResultRefs)
            }
        })();
    }, [query]);
    return [result, setNewQuery];
}
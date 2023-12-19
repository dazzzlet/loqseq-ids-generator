import { QueryResultPageEntity } from "models/logseqQueryResultTypes";

export function isPage(blockOrPage: any): blockOrPage is QueryResultPageEntity {
    return blockOrPage.hasOwnProperty('tags');
}

export function orderBy<T>(retriever: (v: T) => number, desc?: boolean): (a: T, b: T) => number {
    return desc
        ? (rhs, lhs) => retriever(lhs) - retriever(rhs)
        : (lhs, rhs) => retriever(lhs) - retriever(rhs);
}
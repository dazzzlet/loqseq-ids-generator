import { QueryResultPageEntity } from "./logseqQueryResultTypes";

export type PrefixPage = {
    name: string;
    prefix: string;
    padding: number;
    sequence: boolean;
    start: number;
    usage: number;
    max: number;
    page: QueryResultPageEntity | null
}
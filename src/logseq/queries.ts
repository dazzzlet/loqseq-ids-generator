export const PREFIX_IDS_LIST_QUERY = `
:find (pull ?idPage [*])
:in $ ?currentPage
:where
    [?currentPageRefs :block/name ?currentPage]
    [?currentPageRefs :block/properties ?pageProps]
    [(get ?pageProps :prefix) ?prefix]
    [(str "(?i)^" ?prefix "-\\\\d+$") ?pattern]
    [(re-pattern ?pattern) ?match]
    [?usageBlock :block/refs ?idPage]
    [?idPage :block/name ?id]
    [(re-find ?match ?id)]
`;

export const ID_CONTENT_SECTION_QUERY = `
:find (pull ?contentBlock [*])
:in $ ?currentPage
:where
    [?currentPageRefs :block/name ?currentPage]
    [?contentRefs :block/name "content"]
    [?contentBlock :block/refs ?contentRefs]

    (or-join [?currentPageRefs ?contentBlock]
             [?contentBlock :block/refs ?currentPageRefs]
             (and [?contentBlock :block/parent ?parentBlock]
                  [?parentBlock :block/refs ?currentPageRefs]))

    [?contentBlock :block/page ?page]
    [?page :block/journal? true]
`;
import { ID_CONTENT_SECTION_QUERY, PREFIX_IDS_LIST_QUERY } from "./queries";

export const PREFIX_IDS_LIST_TEMPLATE = `#+BEGIN_QUERY
{
:title [:h1 "IDs list"]
:query [
    ${PREFIX_IDS_LIST_QUERY}
]
:inputs [:current-page]
:breadcrumb-show? true
}
#+END_QUERY`;

export const ID_CONTENT_SECTION_TEMPLATE = `#+BEGIN_QUERY
{
:title [:h1 "Content"]
:query [
    ${ID_CONTENT_SECTION_QUERY}
]
:inputs [:current-page]
:breadcrumb-show? true
}
#+END_QUERY`
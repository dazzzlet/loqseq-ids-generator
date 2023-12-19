import React from 'react';
import { styled } from '../stitches.config';
import { useIdPrefixPages } from 'hooks/useIdPrefixPages';
import { TagSortType } from 'enums';
import { orderBy } from 'utils';
import { PrefixPage } from 'models/PrefixPage';
import { Text } from './Text';
import { PrefixEntry } from './PrefixEntry';

const StyldTagList = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
});

type Props = {
    filter: string;
    sortType: TagSortType;
};

export function PrefixList({ filter, sortType }: Props) {
    const prefixes = useIdPrefixPages();

    const orderByFuncBySorType = {
        [TagSortType.NameAsc]: ([a]: [string, PrefixPage], [b]: [string, PrefixPage]) => a.localeCompare(b),
        [TagSortType.NameDesc]: ([a]: [string, PrefixPage], [b]: [string, PrefixPage]) => b.localeCompare(a),
        [TagSortType.UsageAsc]: orderBy(([, entry]: [string, PrefixPage]) => entry.usage),
        [TagSortType.UsageDesc]: orderBy(([, entry]: [string, PrefixPage]) => entry.usage, true),
    };
    console.log(prefixes);

    return (
        <StyldTagList>
            {Object.entries(prefixes)
                .sort(orderByFuncBySorType[sortType])
                .filter(prefix => {
                    if (filter.trim() === '') return true;
                    return prefix.includes(filter);
                })
                .map(([prefix, page], index) => {
                    return (
                        <PrefixEntry key={prefix} prefixPage={page} />
                    );
                })}
        </StyldTagList>
    );
}
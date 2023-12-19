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
    selected: number;
};

const isActive = (activeIndex: number, index: number, total: number): boolean => {
    if (total == 0) {
        total = 1;
    }
    if (activeIndex < 0) {
        activeIndex = total + activeIndex;
    }
    activeIndex = activeIndex % total;
    return activeIndex === index;
}

export function PrefixList({ filter, sortType, selected }: Props) {
    const prefixes = useIdPrefixPages();

    const orderByFuncBySorType = {
        [TagSortType.NameAsc]: ([a]: [string, PrefixPage], [b]: [string, PrefixPage]) => a.localeCompare(b),
        [TagSortType.NameDesc]: ([a]: [string, PrefixPage], [b]: [string, PrefixPage]) => b.localeCompare(a),
        [TagSortType.UsageAsc]: orderBy(([, entry]: [string, PrefixPage]) => entry.usage),
        [TagSortType.UsageDesc]: orderBy(([, entry]: [string, PrefixPage]) => entry.usage, true),
    };

    return (
        <StyldTagList>
            {Object.entries(prefixes)
                .sort(orderByFuncBySorType[sortType])
                .filter(prefix => {
                    if (filter.trim() === '') return true;
                    return prefix.includes(filter);
                })
                .map(([prefix, page], index, array) => {
                    return (
                        <PrefixEntry key={prefix}
                            active={isActive(selected, index, array.length)}
                            prefixPage={page} />
                    );
                })}
        </StyldTagList>
    );
}
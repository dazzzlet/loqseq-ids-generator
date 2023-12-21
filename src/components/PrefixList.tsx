import React from 'react';
import { styled } from '../stitches.config';
import { PrefixPage } from 'models/PrefixPage';
import { PrefixEntry } from './PrefixEntry';

const StyldTagList = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
});

type Props = {
    prefixes: PrefixPage[];
    selected: string;
    showNextId?: boolean;
    onClick?: (prefixPage: PrefixPage) => void;
};

export function PrefixList({ prefixes, selected, showNextId, onClick }: Props) {
    const handleItemClick = (prefixPage: PrefixPage) => {
        return () => {
            if (onClick) {
                onClick(prefixPage);
            }
        }
    }
    return (
        <StyldTagList>
            {
                prefixes.map((page) => {
                    return (
                        <PrefixEntry key={page.prefix}
                            active={page.prefix == selected}
                            prefixPage={page}
                            showNextId={showNextId}
                            onClick={handleItemClick(page)} />
                    );
                })}
        </StyldTagList>
    );
}
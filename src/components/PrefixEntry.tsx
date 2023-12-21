import { styled } from "@stitches/react";
import React from "react";
import { Text } from "./Text";
import { PrefixPage } from "models/PrefixPage";


const StyledTagHeader = styled('div', {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '$3',
    paddingBottom: '$3',
    paddingLeft: '$1',
    paddingRight: '$3',
    cursor: 'pointer',

    borderRadius: '$2',
    '&:hover, &.active': {
        backgroundColor: '$elevation2Hover',
    },
    [`& ${Text}`]: {
        cursor: 'pointer',
    },
});

type Props = {
    prefixPage: PrefixPage;
    showNextId?: boolean;
    active?: boolean;
    onClick?: () => void;
};

export const PrefixEntry = ({ prefixPage, active, showNextId, onClick }: Props) => {

    const handleItemClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <StyledTagHeader className={(active ? 'active' : '')} onClick={handleItemClick}>
            <Text size='2' css={{ flex: 1 }}>
                [{prefixPage.prefix}] {prefixPage.name}
            </Text>
            <Text
                size='1'
                css={{
                    padding: '$2',
                    marginRight: '$1',
                    borderRadius: '$round',
                    backgroundColor: '$blue4',
                    color: '$slate9',
                }}
            >
                {prefixPage.max + (showNextId ? 1 : 0)}
            </Text>
            <Text
                size='1'
                css={{
                    padding: '$2',
                    borderRadius: '$1',
                    backgroundColor: '$elevation2',
                    color: '$slate9',
                }}
            >
                {prefixPage.usage}
            </Text>
        </StyledTagHeader>
    );
};
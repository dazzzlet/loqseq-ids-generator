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
    cursor: 'default',

    borderRadius: '$2',
    '&:hover, &.active': {
        backgroundColor: '$elevation2Hover',
    },
    [`& ${Text}`]: {
        cursor: 'default',
    },
});

type Props = {
    prefixPage: PrefixPage;
    active?: boolean;
};

export const PrefixEntry = ({ prefixPage, active }: Props) => {
    return (
        <StyledTagHeader className={(active ? 'active' : '')}>
            <Text size='2' css={{ flex: 1 }}>
                [{prefixPage.prefix}] {prefixPage.name}
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
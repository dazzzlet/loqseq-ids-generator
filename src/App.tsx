import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { Input } from 'components/Input';
import React, { useEffect, useRef, useState } from 'react';
import { css, darkTheme } from './stitches.config';
import { useAppVisible } from 'hooks/useAppVisible';
import { useThemeMode } from 'hooks/useThemeMode';
import { useFocus } from 'hooks/useFocus';
import { PrefixList } from 'components/PrefixList';
import { TagSortType } from 'enums';
import { KEY_DOWN, KEY_ESCAPE, KEY_UP } from 'const';

type Props = {
    themeMode: AppUserConfigs['preferredThemeMode'];
};

const body = css({
    position: 'relative',
    height: '100%',

    '& ::-webkit-scrollbar': {
        width: '6px',
    },
    '& ::-webkit-scrollbar-corner': {
        background: '0 0',
    },
    '& ::-webkit-scrollbar-thumb': {
        backgroundColor: '$interactiveBorder',
    },
});

const app = css({
    position: 'absolute',
    top: 'calc(48px + $4)',
    right: '$4',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    backgroundColor: '$elevation0',
    borderRadius: '$2',
    padding: '$4',
    width: '400px',
    height: 'calc(100% - (48px + $4) * 2)',
    maxWidth: '50%',
    overflow: 'auto',

    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
});

export function App({ themeMode: initialThemeMode }: Props) {
    const innerRef = useRef<HTMLDivElement>(null);
    const [inputRef, setFocus] = useFocus();
    const [isVisible] = useAppVisible();
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(0);
    const themeMode = useThemeMode(initialThemeMode);

    useEffect(() => {
        if (isVisible) {
            setFocus();
        }
    }, [isVisible])

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setSelected(0);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.code == KEY_UP) {
            e.stopPropagation();
            setSelected(value => value - 1);
        } else if (e.key == KEY_DOWN) {
            e.stopPropagation();
            setSelected(value => value + 1);
        } else if (e.key == KEY_ESCAPE) {
            window.logseq.hideMainUI();
        }
    }

    if (isVisible) {
        return (
            <main
                className={`${body()} ${themeMode === 'dark' ? darkTheme.className : ''}`}
                onClick={e => {
                    if (!innerRef.current?.contains(e.target as any)) {
                        window.logseq.hideMainUI();
                    }
                }}
            >
                <div ref={innerRef} className={app()}>
                    <Input
                        css={{ padding: '$3', borderRadius: '$2' }}
                        size='2'
                        ref={inputRef}
                        placeholder='Search id'
                        onChange={handleSearchInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                    <PrefixList filter={filter} selected={selected} sortType={TagSortType.NameAsc} />
                </div>
            </main>
        );
    }

    return null;
}

export default App;
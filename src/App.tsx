import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { Input } from 'components/Input';
import React, { useEffect, useRef, useState } from 'react';
import { css, darkTheme } from './stitches.config';
import { useAppVisible } from 'hooks/useAppVisible';
import { useThemeMode } from 'hooks/useThemeMode';
import { useFocus } from 'hooks/useFocus';
import { PrefixList } from 'components/PrefixList';
import { TagSortType as PrefixSortType, VisibleTriggerSource } from 'enums';
import { KEY_DOWN, KEY_ENTER, KEY_ESCAPE, KEY_UP } from 'const';
import { useIdPrefixPages } from 'hooks/useIdPrefixPages';
import { PrefixPage } from 'models/PrefixPage';
import { orderBy } from 'utils';
import { prefix } from '@fortawesome/free-solid-svg-icons';

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

const getActivePrefixId = (prefixes: PrefixPage[], step: number): (selected: string) => string => {
    return (selected: string) => {
        const selectedIndex = prefixes.findIndex(prefix => prefix.prefix == selected);
        if (prefixes.length) {
            if (selectedIndex == -1) {
                return prefixes[0].prefix;
            } else {
                const nextIndex = (step + prefixes.length + selectedIndex) % prefixes.length;
                return prefixes[nextIndex].prefix;
            }
        } else {
            return '';
        }
    }
}

export function App({ themeMode: initialThemeMode }: Props) {
    const innerRef = useRef<HTMLDivElement>(null);
    const [inputRef, setFocus] = useFocus();
    const [isVisible, position, triggerSource] = useAppVisible();
    const [filter, setFilter] = useState('');
    const [sortType, setSortType] = useState(PrefixSortType.NameAsc);
    const [selected, setSelected] = useState('');
    const themeMode = useThemeMode(initialThemeMode);
    const prefixes = useIdPrefixPages();

    useEffect(() => {
        if (isVisible) {
            setFocus();
        }
    }, [isVisible])

    const orderByFuncBySorType = {
        [PrefixSortType.NameAsc]: ([a]: [string, PrefixPage], [b]: [string, PrefixPage]) => a.localeCompare(b),
        [PrefixSortType.NameDesc]: ([a]: [string, PrefixPage], [b]: [string, PrefixPage]) => b.localeCompare(a),
        [PrefixSortType.UsageAsc]: orderBy(([, entry]: [string, PrefixPage]) => entry.usage),
        [PrefixSortType.UsageDesc]: orderBy(([, entry]: [string, PrefixPage]) => entry.usage, true),
    };
    const pages = Object.entries(prefixes)
        .sort(orderByFuncBySorType[sortType])
        .filter(prefix => {
            if (filter.trim() === '') return true;
            return prefix.includes(filter);
        })
        .map(([, page]) => page);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        if (pages.length) {
            setSelected(pages[0].prefix);
        } else {
            setSelected('');
        }
    };

    const executeSelectedPrefix = () => {
        const page = pages.find(p => p.prefix == selected);
        if (page) {
            if (triggerSource == VisibleTriggerSource.SlashMenu) {

            } else if (triggerSource == VisibleTriggerSource.Toolbar) {
                logseq.App.pushState('page', { name: page.name.toLowerCase() })
            }
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        console.log('keydown', e.code, selected);
        if (e.code == KEY_UP) {
            e.stopPropagation();
            setSelected(getActivePrefixId(pages, -1));
        } else if (e.key == KEY_DOWN) {
            e.stopPropagation();
            setSelected(getActivePrefixId(pages, 1));
        } else if (e.key == KEY_ESCAPE) {
            window.logseq.hideMainUI();
        } else if (e.key == KEY_ENTER) {
            executeSelectedPrefix();
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
                    <PrefixList
                        selected={selected}
                        prefixes={pages}
                    />
                </div>
            </main>
        );
    }

    return null;
}

export default App;
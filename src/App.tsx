import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin';
import { Input } from 'components/Input';
import { Text } from 'components/Text';
import React, { useEffect, useRef, useState } from 'react';
import { css, darkTheme, styled } from './stitches.config';
import { useAppVisible } from 'hooks/useAppVisible';
import { useThemeMode } from 'hooks/useThemeMode';
import { useFocus } from 'hooks/useFocus';
import { PrefixList } from 'components/PrefixList';
import { TagSortType as PrefixSortType, VisibleTriggerSource } from 'enums';
import { KEY_DOWN, KEY_ENTER, KEY_ESCAPE, KEY_UP } from 'const';
import { useIdPrefixPages } from 'hooks/useIdPrefixPages';
import { PrefixPage } from 'models/PrefixPage';
import { orderBy } from 'utils';
import { prependNewIdToCurrentBlock } from 'logseq/utils';

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

const ModelTitle = styled(Text, {
    textAlign: 'center',
    marginBottom: '$3',
    color: '$highContrast'
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
    const [pages, setPages] = useState<PrefixPage[]>([]);
    const themeMode = useThemeMode(initialThemeMode);
    const prefixes = useIdPrefixPages();

    const executeSelectedPrefix = async (page?: PrefixPage) => {
        if (page) {
            if (triggerSource == VisibleTriggerSource.SlashMenu) {
                await prependNewIdToCurrentBlock(page, position);
            } else if (triggerSource == VisibleTriggerSource.Toolbar) {
                logseq.App.pushState('page', { name: page.name.toLowerCase() })
            }
        }
    }

    const getModalTitle = () => {
        if (triggerSource == VisibleTriggerSource.SlashMenu) {
            return "Generate new ID";
        } else if (triggerSource == VisibleTriggerSource.Toolbar) {
            return "List of existed prefixes";
        }
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        if (pages.length) {
            setSelected(pages[0].prefix);
        } else {
            setSelected('');
        }
    };

    const handleInputKeyDown = async (e: React.KeyboardEvent) => {
        console.log('keydown', e.code, selected);
        if (e.code == KEY_UP) {
            e.stopPropagation();
            setSelected(getActivePrefixId(pages, -1));
        } else if (e.key == KEY_DOWN) {
            e.stopPropagation();
            setSelected(getActivePrefixId(pages, 1));
        } else if (e.key == KEY_ESCAPE) {
            window.logseq.hideMainUI();
            await window.logseq.Editor.restoreEditingCursor();
        } else if (e.key == KEY_ENTER) {
            const page = pages.find(p => p.prefix == selected);
            await executeSelectedPrefix(page);
            window.logseq.hideMainUI();
            await window.logseq.Editor.restoreEditingCursor();
        }
    }

    const handleItemOnClick = async (page: PrefixPage) => {
        await executeSelectedPrefix(page);
        window.logseq.hideMainUI();
    }

    useEffect(() => {
        const orderByFuncBySorType = {
            [PrefixSortType.NameAsc]: (a: PrefixPage, b: PrefixPage) => a.prefix.localeCompare(b.prefix),
            [PrefixSortType.NameDesc]: (a: PrefixPage, b: PrefixPage) => b.prefix.localeCompare(a.prefix),
            [PrefixSortType.UsageAsc]: orderBy((entry: PrefixPage) => entry.usage),
            [PrefixSortType.UsageDesc]: orderBy((entry: PrefixPage) => entry.usage, true),
        };
        const searchString = filter.toLowerCase();
        const exactMatch = Object.entries(prefixes).find(([prefix]) => prefix.toLowerCase() == searchString);
        const filteredPages = Object.entries(prefixes)
            .filter(([prefix, page]) => {
                if (searchString.trim() === '') return true;
                return prefix.toLowerCase().includes(searchString)
                    || page.name.toLowerCase().includes(searchString)
            })
            .map(([, page]) => page)
            .sort(orderByFuncBySorType[sortType]);
        if (triggerSource == VisibleTriggerSource.SlashMenu) {
            if (!exactMatch && !/\s/.test(searchString) && searchString.length >= 2) {
                const newPrefix: PrefixPage = {
                    max: 0,
                    name: `Create new prefix with "${filter}"`,
                    prefix: filter,
                    padding: 0,
                    page: null,
                    sequence: true,
                    start: 1,
                    usage: 0
                }
                setPages([
                    ...filteredPages,
                    newPrefix
                ]);
                return;
            }
        }
        setPages(filteredPages);
    }, [filter, sortType, prefixes]);

    useEffect(() => {
        if (isVisible) {
            setFocus();
            setFilter('');
        }
    }, [isVisible, prefixes])

    useEffect(() => {
        isVisible && pages.length
            && setSelected(pages[0].prefix);
    }, [pages])

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
                    <ModelTitle>{getModalTitle()}</ModelTitle>
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
                        showNextId={triggerSource == VisibleTriggerSource.SlashMenu}
                        onClick={handleItemOnClick}
                    />
                </div>
            </main>
        );
    }

    return null;
}

export default App;
import { DEFAULT_PREFIX_PAGE_PROPS } from "const";
import { PrefixPage } from "models/PrefixPage";
import { PREFIX_IDS_LIST_TEMPLATE } from "./blockTemplates";
import { BlockCursorPosition } from "@logseq/libs/dist/LSPlugin.user";

const generatePrefixPage = async (prefix: string) => {
    try {
        const prefixPage = await logseq.Editor.createPage(prefix, {
            ...DEFAULT_PREFIX_PAGE_PROPS,
            prefix: prefix,
        }, {
            redirect: false,
            createFirstBlock: true,
            format: 'markdown',
            journal: false
        });
        if (prefixPage) {
            logseq.Editor.openInRightSidebar(prefixPage.uuid);
            await logseq.Editor.appendBlockInPage(prefixPage.uuid, PREFIX_IDS_LIST_TEMPLATE);
            return prefixPage;
        }
    } catch (e) {
        console.log(e);

    }
}

export const prependNewIdToCurrentBlock = async (prefixPage: PrefixPage, position: BlockCursorPosition | null) => {
    const currentBlock = await logseq.Editor.getCurrentBlock();
    if (!prefixPage.page) {
        const page = await generatePrefixPage(prefixPage.prefix);
        if (page) {
            prefixPage.name = page.name;
            prefixPage.padding = page.properties?.padding
            prefixPage.start = page.properties?.start
            prefixPage.max = page.properties?.start - 1;
        }
    }

    const nextId = `${(prefixPage.max + 1)}`.padStart(prefixPage.padding || 0, '0');
    const newId = `${prefixPage.prefix}-${nextId}`;
    if (currentBlock) {
        const newContent = `[[${newId}]] ${currentBlock.content}`
        await logseq.Editor.updateBlock(currentBlock.uuid, newContent);
        await logseq.Editor.exitEditingMode();
    }
}
import { PrefixPage } from "models/PrefixPage";

export const prependNewIdToCurrentBlock = async (prefixPage: PrefixPage) => {
    const nextId = `${(prefixPage.max + 1)}`.padStart(prefixPage.padding || 0, '0');
    const newId = `${prefixPage.prefix}-${nextId}`;
    const currentBlock = await logseq.Editor.getCurrentBlock();
    if (currentBlock) {
        const newContent = `[[${newId}]] ${currentBlock.content}`
        logseq.Editor.updateBlock(currentBlock.uuid, newContent)
    }
}
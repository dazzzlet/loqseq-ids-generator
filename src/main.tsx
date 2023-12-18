import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SLASH_TRIGGER_EVENT } from 'const';



async function main() {
    const key = logseq.baseInfo.id;
    console.info(`${key}: MAIN`);

    const { preferredThemeMode } = await logseq.App.getUserConfigs();

    ReactDOM.render(
        <React.StrictMode>
            <App themeMode={preferredThemeMode} />
        </React.StrictMode>,
        document.getElementById('root'),
    );

    logseq.provideModel({
        show() {
            logseq.showMainUI();
        },
    });

    const toolbarButtonKey = 'ids-generator-plugin-open';

    logseq.provideStyle(`
        div[data-injected-ui=${toolbarButtonKey}-${key}] {
          display: flex;
          align-items: center;
          font-weight: 500;
          position: relative;
        }
      `);

    logseq.setMainUIInlineStyle({
        position: 'fixed',
        zIndex: 11,
    });

    logseq.App.registerUIItem('toolbar', {
        key: toolbarButtonKey,
        template: `
        <a data-on-click="show" class="button" style="font-size: 20px">
          IDs
        </a>
      `,
    });

    logseq.Editor.registerSlashCommand(
        'New ID', async () => {
            const position = await logseq.Editor.getEditingCursorPosition()
            if (position != null) {
                logseq.showMainUI()
                setTimeout(() => {
                    var event = new CustomEvent(SLASH_TRIGGER_EVENT, {
                        "detail": {
                            position
                        }
                    });
                    document.dispatchEvent(event);
                }, 10)
            }
        },
    )
}

logseq.ready().then(main).catch(console.error);      
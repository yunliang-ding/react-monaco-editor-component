/* eslint-disable no-bitwise */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect } from 'react';
import './index.less';

export interface MonacoDiffProps {
  language?: string;
  value: string;
  originalValue?: string;
  theme?: 'vs-dark' | 'vs';
  renderSideBySide?: boolean;
  id?: string;
}
/**
 * 编辑器
 */
export default ({
  id = 'monaco-container-diff',
  value = '',
  originalValue = '',
  language = 'javascript',
  theme = 'vs-dark',
  renderSideBySide = true,
}: MonacoDiffProps) => {
  useEffect(() => {
    const diffEditor: monaco.editor.IStandaloneDiffEditor =
      monaco.editor.createDiffEditor(document.getElementById(id), {
        readOnly: true,
        theme,
        renderSideBySide,
        fontSize: 14,
        minimap: {
          enabled: false,
        },
      });
    const originalModel = monaco.editor.createModel(originalValue, language);
    const modifiedModal = monaco.editor.createModel(value, language);
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModal,
    });
  }, []);
  return <div id={id} className="app-monaco-editor" />;
};

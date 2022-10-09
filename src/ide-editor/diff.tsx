/* eslint-disable no-bitwise */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect } from 'react';
import './index.less';

export interface MonacoDiffProps {
  id?: string;
  value: string;
  originalValue?: string;
  language?: string;
  monacoOptions?: editor.IStandaloneDiffEditorConstructionOptions;
}

const defaultOptions: editor.IStandaloneDiffEditorConstructionOptions = {
  theme: 'vs-dark',
  selectOnLineNumbers: true,
  automaticLayout: true,
  fontFamily: 'monaco',
  readOnly: true,
  renderSideBySide: true,
  fontSize: 14,
  fontWeight: '600',
  minimap: {
    enabled: false,
  },
};

export default ({
  id = 'monaco-container-diff',
  value = '',
  language = 'javascript',
  originalValue = '',
  monacoOptions = {},
}: MonacoDiffProps) => {
  useEffect(() => {
    const diffEditor: monaco.editor.IStandaloneDiffEditor =
      monaco.editor.createDiffEditor(document.getElementById(id), {
        ...Object.assign(
          {
            value,
            originalValue,
          },
          defaultOptions,
          monacoOptions,
        ),
      });
    const originalModel = monaco.editor.createModel(originalValue, language);
    const modifiedModal = monaco.editor.createModel(value, language);
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModal,
    });
  }, []);
  return <div id={id} className="app-ide-editor-diff" />;
};

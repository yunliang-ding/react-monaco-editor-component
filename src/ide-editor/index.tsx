/* eslint-disable no-bitwise */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from 'monaco-editor';
import { useEffect, useRef, CSSProperties, MutableRefObject } from 'react';
import './index.less';

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  value: '',
  language: 'javascript',
  theme: 'vs-dark',
  selectOnLineNumbers: true,
  automaticLayout: true,
  tabSize: 2,
  fontSize: 14,
  fontFamily: 'monaco',
  fontWeight: '600',
  minimap: {
    enabled: true,
  },
};

export interface MonacoProps {
  value: string;
  id?: string;
  style?: CSSProperties;
  onChange?: Function;
  monacoOptions?: editor.IStandaloneEditorConstructionOptions;
  editorMonacoRef?: MutableRefObject<monaco.editor.IStandaloneCodeEditor>;
}
export default ({
  id = 'ide-editor',
  style = {},
  onChange = () => {},
  editorMonacoRef = useRef<monaco.editor.IStandaloneCodeEditor>(),
  monacoOptions = {},
  value = '',
}: MonacoProps) => {
  useEffect(() => {
    const monacoInstance: monaco.editor.IStandaloneCodeEditor =
      monaco.editor.create(document.getElementById(id), {
        ...Object.assign(
          {
            value,
          },
          defaultOptions,
          monacoOptions,
        ),
      });
    // onChange
    monacoInstance.onDidChangeModelContent((e) => {
      const code = monacoInstance.getValue();
      if (!e.isFlush) {
        onChange(code);
      }
    });
    editorMonacoRef.current = monacoInstance; // 挂到ref
    window[id] = monacoInstance; // 挂在到 window
    return () => {
      delete window[id];
    };
  }, []);
  useEffect(() => {
    if (editorMonacoRef.current) {
      editorMonacoRef.current.setValue?.(value);
    }
  }, [value]);
  return <div style={style} id={id} className="app-ide-editor" />;
};

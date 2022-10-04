/* eslint-disable no-bitwise */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useRef, CSSProperties } from 'react';
import './index.less';

export interface MonacoProps {
  language?: string;
  value: string;
  originalValue?: string;
  theme?: 'vs-dark' | 'vs';
  style?: CSSProperties;
  onChange?: Function;
  onSave?: Function;
  reload?: any;
  options?: any;
  className?: string;
  onMount?: Function;
  editorMonacoRef?: any;
  id?: string;
  mode?: 'nomal' | 'diff';
  renderSideBySide?: boolean;
}
/**
 * 编辑器
 */
export default ({
  value = '',
  onChange = () => {},
  onSave = () => {},
  language = 'javascript',
  theme = 'vs-dark',
  id = 'monaco-container',
  editorMonacoRef = useRef<any>({}),
  options = {},
  ...rest
}: MonacoProps) => {
  useEffect(() => {
    const monacoInstance: monaco.editor.IStandaloneCodeEditor =
      monaco.editor.create(document.getElementById(id), {
        value,
        language,
        selectOnLineNumbers: true,
        automaticLayout: true,
        tabSize: 2,
        fontSize: 14,
        theme,
        fontWeight: '400',
        minimap: {
          enabled: true,
        },
        ...options,
        ...rest,
      });
    // ctrl + s 执行 onSave
    monacoInstance.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        const code = monacoInstance.getValue();
        onSave(code);
      },
    );
    // onChange
    monacoInstance.onDidChangeModelContent((e) => {
      const code = monacoInstance.getValue();
      if (!e.isFlush) {
        onChange(code);
      }
    });
    editorMonacoRef.current = monacoInstance; // 挂到ref
  }, []);
  // update
  useEffect(() => {
    if (editorMonacoRef.current) {
      editorMonacoRef.current.setValue?.(value);
    }
  }, [value]);
  return <div id={id} className="app-monaco-editor" />;
};

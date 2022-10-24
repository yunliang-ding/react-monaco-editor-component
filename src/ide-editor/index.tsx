/* eslint-disable no-bitwise */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from 'monaco-editor';
import { useEffect, useRef, CSSProperties, MutableRefObject } from 'react';
import './index.less';

// default options
const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  value: '',
  language: 'javascript',
  theme: 'vs-dark',
  selectOnLineNumbers: true,
  automaticLayout: true,
  tabSize: 2,
  fontSize: 14,
  fontWeight: '500',
  minimap: {
    enabled: true,
  },
};

// compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2016,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  typeRoots: ['node_modules/@types'],
});

// extra libraries
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  `export declare function next() : string`,
  'node_modules/@types/external/index.d.ts',
);

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
});

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
    // 设置主题
    import('monaco-themes/themes/Tomorrow-Night.json').then((data: any) => {
      console.log(data);
      // monaco.editor.defineTheme('vs-dark', data);
    });
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

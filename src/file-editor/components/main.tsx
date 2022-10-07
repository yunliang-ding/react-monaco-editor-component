import MonacoEditor from '@/ide-editor';
import MonacoEditorDiff from '@/ide-editor/diff';
import { MutableRefObject, useRef } from 'react';
import { editor } from 'monaco-editor';

export default ({
  id,
  mode,
  value = '',
  originalValue = '',
  onChange,
  editorMonacoRef = useRef(),
  options,
}: {
  id?: string;
  onChange?: any;
  mode?: 'diff' | undefined;
  editorMonacoRef?: MutableRefObject<editor.IStandaloneCodeEditor>;
  options: editor.IStandaloneEditorConstructionOptions;
  originalValue?: string;
  value?: string;
}) => {
  return (
    <>
      {mode === 'diff' ? (
        <MonacoEditorDiff
          id={id}
          value={value}
          originalValue={originalValue}
          monacoOptions={options}
        />
      ) : (
        <MonacoEditor
          id={id}
          monacoOptions={options}
          value={value}
          onChange={onChange}
          editorMonacoRef={editorMonacoRef}
        />
      )}
    </>
  );
};

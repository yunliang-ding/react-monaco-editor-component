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
  monacoOptions,
}: {
  id?: string;
  onChange?: any;
  mode?: 'diff' | undefined;
  editorMonacoRef?: MutableRefObject<editor.IStandaloneCodeEditor>;
  monacoOptions: editor.IStandaloneEditorConstructionOptions;
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
          monacoOptions={monacoOptions}
        />
      ) : (
        <MonacoEditor
          id={id}
          monacoOptions={monacoOptions}
          value={value}
          onChange={onChange}
          editorMonacoRef={editorMonacoRef}
        />
      )}
    </>
  );
};

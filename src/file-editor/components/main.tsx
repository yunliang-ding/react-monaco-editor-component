import MonacoEditor from '@/ide-editor';
import MonacoEditorDiff from '@/ide-editor/diff';
import { useRef } from 'react';

export default ({
  mode,
  originalValue = '',
  id,
  value = '',
  onChange,
  editorMonacoRef = useRef({}),
  options,
}) => {
  return (
    <>
      {mode === 'diff' ? (
        <MonacoEditorDiff
          id={id}
          value={value}
          originalValue={originalValue}
          {...options}
        />
      ) : (
        <MonacoEditor
          id={id}
          value={value}
          onChange={onChange}
          editorMonacoRef={editorMonacoRef}
          {...options}
        />
      )}
    </>
  );
};

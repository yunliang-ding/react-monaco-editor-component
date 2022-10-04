/* eslint-disable react/jsx-no-bind */
import { useState } from 'react';
import MonacoEditor from '@/ide-editor';
import MonacoEditorDiff from '@/ide-editor/diff';
import WebTerminal from '@/web-terminal';

export default ({
  mode,
  originalValue = '',
  id,
  value = '',
  onSave,
  onChange,
  options,
}) => {
  const [errorInfo, setErrorInfo]: any = useState(false);
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
          onSave={async (code) => {
            try {
              await onSave?.(code);
              setErrorInfo(false);
            } catch (error) {
              setErrorInfo(String(error));
            }
          }}
          {...options}
        />
      )}
      {errorInfo && (
        <WebTerminal onClose={setErrorInfo.bind(null, false)}>
          <pre>解析失败:</pre>
          <pre>{errorInfo}</pre>
        </WebTerminal>
      )}
    </>
  );
};

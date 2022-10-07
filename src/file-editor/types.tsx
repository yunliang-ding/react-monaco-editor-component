import { FileProps } from '../file-explorer/types';
import { CSSProperties, MutableRefObject, ReactNode } from 'react';
import { editor } from 'monaco-editor';

export interface FileEditorProps {
  files: FileProps[];
  style?: CSSProperties;
  selectedKey: string;
  onClick: (file: FileProps) => void;
  onClose: (file: FileProps, index?: number) => void;
  options?: object;
  editorMonacoRef?: MutableRefObject<editor.IStandaloneCodeEditor>;
  editorRef?: MutableRefObject<fileEditorRefInstance>;
  extra?: {
    key: string;
    icon: string;
    title: string;
    onClick?: (file: FileProps) => void;
    visible?: (file: FileProps) => boolean;
  }[];
}

export interface fileEditorRefInstance {
  addTab: (tabProps: {
    path: string;
    name: string;
    render: () => ReactNode;
  }) => void;
  checkTab: (key: string) => void;
}

export interface FileEditorMainProps extends FileEditorProps {
  onChange: (code: string) => void;
  onSave: (code: string) => void;
}

import { FileProps } from '../file-explorer/types';
import { CSSProperties, MutableRefObject, ReactNode } from 'react';

export interface FileEditorProps {
  files: FileProps[];
  style?: CSSProperties;
  selectedKey: string;
  onClick: (file: FileProps) => void;
  onClose: (file: FileProps, index?: number) => void;
  options?: object;
  editorMonacoRef?: MutableRefObject<{}>;
  extraExpansionRender?: (file: FileProps) => any[];
  extra?: {
    key: string;
    icon: string;
    title: string;
  }[];
  onExtraClick?: any;
}

export interface FileEditorMainProps extends FileEditorProps {
  onChange: (code: string) => void;
  onSave: (code: string) => void;
  editorExpansionRender: any;
}

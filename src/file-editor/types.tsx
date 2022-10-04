import { FileProps } from '../file-explorer/types';
import { CSSProperties, MutableRefObject } from 'react';

export interface FileEditorProps {
  files: FileProps[];
  style?: CSSProperties;
  extra?: {
    key: string;
    icon: string;
    title: string;
  }[];
  onExtraClick?: any;
  selectedKey: string;
  onClick: (key: string) => void;
  onClose: (file: FileProps) => void;
  options?: object;
  editorMonacoRef?: MutableRefObject<{}>;
  extraExpansionRender: any;
}

export interface FileEditorMainProps extends FileEditorProps {
  onChange: (code: string) => void;
  onSave: (code: string) => void;
  editorExpansionRender: any;
}

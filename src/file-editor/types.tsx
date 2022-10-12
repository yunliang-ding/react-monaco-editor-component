import { FileProps } from '../file-explorer/types';
import { CSSProperties, MutableRefObject, ReactNode } from 'react';
import { editor } from 'monaco-editor';

export interface FileEditorProps {
  /** 默认文件列表 */
  defaultFiles?: FileProps[];
  /** 住容器样式 */
  style?: CSSProperties;
  /** 选中的key */
  defaultSelectedKey?: string;
  /** 点击事件 */
  onClick?: (file: FileProps) => void;
  /** 关闭事件 */
  onClose?: (selectedFile: FileProps) => void;
  /** monaco 属性配置 */
  monacoOptions?: editor.IStandaloneEditorConstructionOptions;
  /** monaco实例 */
  editorMonacoRef?: MutableRefObject<editor.IStandaloneCodeEditor>;
  /** api 实例 */
  editorRef?: MutableRefObject<editorRefInstance>;
  /** 右侧图标 */
  extra?: {
    key: string;
    icon: string;
    title: string;
    onClick?: (file: FileProps) => void;
    visible?: (file: FileProps) => boolean;
  }[];
  /** 文件改变钩子 */
  onChange?: (code: string, notSaveCount: number) => void;
  /** ctrl + s 保存钩子 */
  onSave?: (code: string) => void;
  onTabClose?: any;
}

export interface editorRefInstance {
  addTab: (tabProps: {
    path: string;
    name: string;
    render: () => ReactNode;
  }) => void;
  checkTab: (key: string) => void;
  getTabs: () => FileProps[];
}

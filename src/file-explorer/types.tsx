import { CSSProperties, MutableRefObject } from 'react';

export interface FileProps {
  /** 文件路径 */
  path: string;
  /** 文件类型 */
  type: 'file' | 'directory';
  /** 文件后缀名 */
  extension: string;
  /** 文件名 */
  name: string;
  /** 文件大小 */
  size?: number;
  /** 文件状态 */
  status?: 'new' | 'nomal' | 'open' | 'expanded';
  /** 文件是否未保存 */
  notSave?: boolean;
  /** 文件子节点 */
  children?: FileProps[];
  /** 文件内容 */
  content?: string;
}

export interface FileExplorerProps {
  /** */
  explorerRef?: MutableRefObject<explorerRefInstance>;
  /** 主容器样式 */
  style?: CSSProperties;
  /** 打开的文件 */
  onOpenFileChange?: (files: FileProps[]) => void;
  /** 文件点击 */
  onClick?: (file: FileProps) => void;
  /** */
  onAddFile?: (file: FileProps) => void;
  /** */
  onAddFolder?: (file: FileProps) => void;
  /** */
  onRefresh?: () => void;
  /** 项目名称 */
  projectName?: string;
  /** 是否展示头部 */
  header?: boolean;
}

export interface explorerRefInstance {
  getFields: () => FileProps[];
  setFiles: (files: FileProps[]) => void;
  setSelectedKey: (path: string) => void;
  openSpin: () => void;
  closeSpin: () => void;
}

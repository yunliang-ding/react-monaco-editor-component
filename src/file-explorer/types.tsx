import { CSSProperties, MutableRefObject, ReactNode } from 'react';

export interface FileProps {
  /** 文件路径 */
  path: string;
  /** 文件类型 */
  type: 'file' | 'directory';
  /** 文件名 */
  name: string;
  /** 文件后缀名 */
  extension?: string;
  /** 文件大小 */
  size?: number;
  /** 文件状态 */
  status?: 'edit' | 'nomal' | 'open' | 'expanded';
  /** 文件是否未保存 */
  notSave?: boolean;
  /** 文件子节点 */
  children?: FileProps[];
  /** 文件内容 */
  content?: string;
  /** 自定义渲染 */
  render?: (file: FileProps) => ReactNode;
  /** 和 git 相关 */
  gitStatus?: 'U' | 'M' | undefined;
  /** 暂存区文件内容 */
  stageContent?: string;
}

export interface FileExplorerProps {
  /** 获取 ref 实例*/
  explorerRef?: MutableRefObject<explorerRefInstance>;
  /** 主容器样式 */
  style?: CSSProperties;
  /** 打开的文件 */
  onOpenFileChange?: (files: FileProps[]) => void;
  /** 文件点击 */
  onClick?: (file: FileProps) => void;
  /** 创建文件或者文件夹 */
  onCreateFile?: (file: FileProps) => Promise<void>;
  /** 重命名文件 */
  onRenameFile?: (file: FileProps) => Promise<void>;
  /** 删除文件 */
  onDeleteFile?: (file: FileProps) => Promise<void>;
  /** 刷新文件 */
  onRefresh?: () => void;
  /** 项目名称 */
  projectName?: string;
  /** 是否展示头部 */
  header?: boolean;
  /** 右键菜单配置 */
  menus?: any[] | boolean;
  spinWapper?: any;
}

export interface explorerRefInstance {
  getFields: () => FileProps[];
  setFiles: (files: FileProps[]) => void;
  setSelectedKey: (path: string) => void;
  openSpin: () => void;
  closeSpin: () => void;
}

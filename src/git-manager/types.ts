import { FileProps } from '../file-explorer/types';

export interface GitManageProps {
  /** 文件 */
  diff: FileProps[];
  /** 提交 */
  onCommit?: (message: string) => any;
  /** 推送 */
  onPush?: () => any;
  /** 更新 */
  onPull?: () => any;
  /** 撤销修改 */
  onReset?: () => any;
  /** 打开文件 */
  onOpenFileChange?: (tabs: FileProps[]) => any;
  /** 刷新 */
  onRefresh?: () => any;
  onSelected?: (key: string) => any;
}

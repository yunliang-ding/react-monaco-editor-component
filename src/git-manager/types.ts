import { FileExplorerProps } from '../file-explorer/types';

export interface GitManageProps extends FileExplorerProps {
  /** 提交 */
  onCommit?: (message: string) => any;
  /** 推送 */
  onPush?: () => any;
  /** 更新 */
  onPull?: () => any;
  /** 撤销修改 */
  onReset?: () => any;
}

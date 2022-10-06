import { FileExplorerProps } from '@/file-explorer/types';

export interface FileSearchProps extends FileExplorerProps {
  onSearch?: (keyword: string) => any;
  exclude?: string[];
  include?: string[];
}

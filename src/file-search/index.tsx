/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileSearchProps } from './types';
import Header from '@/compontent/header';
import './index.less';

const prefixCls = 'ide-editor-file-search';

export default ({ onSerach, exclude, include }: FileSearchProps) => {
  return (
    <div className={prefixCls}>
      <Header
        title="Search"
        actions={[
          {
            icon: 'codicon codicon-search-clear-results',
            title: 'Clear',
          },
          {
            icon: 'codicon codicon-refresh',
            title: 'New File',
          },
        ]}
      />
    </div>
  );
};

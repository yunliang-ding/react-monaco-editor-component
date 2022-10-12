/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileSearchProps } from './types';
import Header from '@/compontent/header';
import CreateSpin from '@/compontent/create-spin';
import { useRef } from 'react';
import { isEmpty } from 'lodash';
import { FileExplorer } from '..';
import './index.less';
import { sleep } from '@/file-explorer';

const prefixCls = 'ide-editor-file-search';

const spin = CreateSpin({
  getContainer: () => document.querySelector(`.${prefixCls}`),
  text: '查找中...',
});

export default ({
  style = {},
  onRefresh,
  explorerRef = useRef<any>({}),
  onClick,
  onSearch = sleep,
  treeData = [],
  exclude,
  include,
}: FileSearchProps) => {
  const keywordRef = useRef<HTMLInputElement>();
  const search = async () => {
    try {
      const keyword = keywordRef.current.value;
      if (!isEmpty(keyword)) {
        spin.open({
          text: '查询中...',
        });
        await onSearch(keyword);
      }
    } catch (error) {
      console.log(error);
    } finally {
      spin.close();
    }
  };
  return (
    <div className={prefixCls} style={style}>
      <Header
        title="SEARCH"
        actions={[
          {
            icon: 'codicon codicon-refresh',
            title: 'Search',
            onClick: search,
          },
          {
            icon: 'codicon codicon-search-clear-results',
            title: 'Clear',
            onClick() {
              keywordRef.current.value = '';
              keywordRef.current.focus();
            },
          },
        ]}
      />
      <div className={`${prefixCls}-search`}>
        <input
          placeholder="请输入查找的关键字"
          autoFocus
          ref={keywordRef}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter') {
              search();
            }
          }}
        />
      </div>
      <div className={`${prefixCls}-body`}>
        <FileExplorer
          explorerRef={explorerRef}
          spinWapper={spin}
          header={false}
          style={{
            width: '100%',
            height: '100%',
          }}
          onRefresh={onRefresh}
          onClick={onClick}
          treeData={treeData}
          menus={false}
        />
      </div>
    </div>
  );
};

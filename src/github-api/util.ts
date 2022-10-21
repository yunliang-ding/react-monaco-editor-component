/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { FileProps } from '@/file-explorer/types';
import request from './request';
/** 递归节点 */
export const loopTree = async (
  tree: any[],
  gitUrl,
  getContent,
  partent?,
): Promise<FileProps[]> => {
  const arr = [];
  const directory = tree.filter((i) => i.type === 'tree');
  const file = tree.filter((i) => i.type === 'blob');
  // 排序逻辑
  const sortTree = [
    directory.sort((a, b) => (a.path > b.path ? 1 : -1)),
    file.sort((a, b) => (a.path > b.path ? 1 : -1)),
  ].flat();
  for (let i = 0; i < tree.length; i++) {
    const item = sortTree[i];
    const fileItem: FileProps = {
      status: 'nomal',
      name: item.path,
      sha: item.sha,
      path: partent ? partent.path + '/' + item.path : item.path,
      remotePath: partent ? partent.path + '/' + item.path : item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
      extension: getFileExtension(item.path),
    };
    if (item.type === 'blob') {
      fileItem.extension = getFileExtension(fileItem.path);
      fileItem.size = item.size;
    }
    if (item.type === 'tree') {
      fileItem.children = await loopTree(
        await request(item.url),
        gitUrl,
        getContent,
        item,
      );
    }
    arr.push(fileItem);
  }
  return arr;
};

const getFileExtension = (name: string) => {
  return name.substring(name.lastIndexOf('.'));
};

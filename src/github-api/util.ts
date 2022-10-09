import { FileProps } from '@/file-explorer/types';

/** 递归节点 */
export const loopTree = async (tree: any[], partent?): Promise<FileProps[]> => {
  const arr = [];
  const directory = tree.filter((i) => i.type === 'tree');
  const file = tree.filter((i) => i.type === 'blob');
  // 排序逻辑
  const sortTree = [
    directory.sort((a, b) => (a.path > b.path ? -1 : 1)),
    file.sort((a, b) => (a.path > b.path ? -1 : 1)),
  ].flat();
  for (let i = 0; i < tree.length; i++) {
    const item = sortTree[i];
    const file: FileProps = {
      status: 'nomal',
      name: item.path,
      path: partent ? partent.path + '/' + item.path : item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
      extension: getFileExtension(item.path),
    };
    if (item.type === 'blob') {
      file.extension = getFileExtension(item.path);
      file.size = item.size;
      file.content = item.sha;
    }
    if (item.type === 'tree') {
      file.children = await loopTree(await request(item.url), item);
    }
    arr.push(file);
  }
  return arr;
};

const getFileExtension = (name: string) => {
  return name.substring(name.lastIndexOf('.'));
};

const request = async (url: string) => {
  return (await (await fetch(url)).json()).tree;
};

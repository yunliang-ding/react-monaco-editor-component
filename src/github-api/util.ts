import { FileProps } from '@/file-explorer/types';

/** 递归节点 */
export const loopTree = async (tree, partent?): Promise<FileProps[]> => {
  const arr = [];
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    const file: FileProps = {
      status: 'nomal',
      name: item.path,
      path: partent ? partent.path + '/' + item.path : item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
      extension: getFileExtension(item.path),
      size: item.size,
      content: item.sha,
    };
    if (item.type === 'blob') {
      file.extension = getFileExtension(item.path);
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
  return (await fetch(url)).json();
};

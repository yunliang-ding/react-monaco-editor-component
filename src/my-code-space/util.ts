import { FileProps } from '..';

/** 获取 diff 树 */
export const getDiffTreeData = (treeData: FileProps[]) => {
  const diffTree = {
    data: [],
  };
  getDiffTreeDataByLoop(treeData, diffTree.data);
  return diffTree.data;
};

export const getDiffTreeDataByLoop = (treeData: FileProps[], diffTree) => {
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i];
    if (item.type === 'directory') {
      getDiffTreeDataByLoop(item.children, diffTree);
    } else if (item.gitStatus !== undefined) {
      diffTree.push({
        ...item,
        showDiff: true,
      });
    }
  }
};

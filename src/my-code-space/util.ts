/* eslint-disable no-await-in-loop */
import { FileProps } from '..';

/** 获取 diff 树 */
export const getDiffTreeData = (treeData: FileProps[], isDeep = true) => {
  const diffTree = {
    data: [],
  };
  getDiffTreeDataByLoop(treeData, diffTree.data, isDeep);
  return diffTree.data;
};

/** diff Tree */
export const getDiffTreeDataByLoop = (
  treeData: FileProps[],
  diffTree,
  isDeep,
) => {
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i];
    if (item.type === 'directory') {
      getDiffTreeDataByLoop(item.children, diffTree, isDeep);
    } else if (item.gitStatus !== undefined) {
      if (isDeep) {
        diffTree.push({
          ...item,
          showDiff: true,
        });
      } else {
        diffTree.push(item);
      }
    }
  }
};

/** 推送代码 */
export const commitAndPushCode = async (
  message: string,
  diffTree: FileProps[],
  githubInstance,
) => {
  const {
    data: { sha: sha1 },
  } = await githubInstance.getTree();
  const diffFileSha = [];
  for (let i = 0; i < diffTree.length; i++) {
    const item = diffTree[i];
    const {
      data: { sha: sha2 },
    } = await githubInstance.createNewFile(item.content);
    diffFileSha.push({
      path: item.path,
      mode: '100644',
      type: 'blob',
      sha: sha2,
    });
  }
  const {
    data: { sha: sha3 },
  } = await githubInstance.createNewTree(sha1, diffFileSha);
  // 推送到 git
  await githubInstance.commitAndPushNewTree({
    message,
    tree: sha3,
  });
};

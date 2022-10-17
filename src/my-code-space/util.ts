/* eslint-disable no-await-in-loop */
import { FileProps } from '..';

/** 获取 diff 树 */
export const getDiffTree = (): FileProps[] => {
  const diffData = JSON.parse(localStorage.getItem('my-code-space-diff-tree'));
  return diffData || [];
};

// 本地存 diff 信息
export const setDiffTree = (treeData) => {
  const diffTree = {
    data: [],
  };
  setDiffTreeDataByLoop(treeData, diffTree.data);
  localStorage.setItem(
    'my-code-space-diff-tree',
    JSON.stringify(diffTree.data),
  );
};

export const addDiffTreeFile = (diffFile: FileProps) => {
  const diffData = getDiffTree();
  diffData.push(diffFile);
  localStorage.setItem('my-code-space-diff-tree', JSON.stringify(diffData));
};

export const deleteDiffTreeFile = () => {};

/** diff Tree */
export const setDiffTreeDataByLoop = (treeData: FileProps[], diffTree) => {
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i];
    if (item.type === 'directory') {
      setDiffTreeDataByLoop(item.children, diffTree);
    } else if (item.gitStatus !== undefined) {
      diffTree.push({
        ...item,
        showDiff: true,
      });
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

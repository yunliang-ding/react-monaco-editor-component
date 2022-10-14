interface DiffTreeMapProps {
  oldPath: string;
  path: string;
  oldContent: string;
  content: string;
  status: string;
}
export const getDiffTreeMap = () => {
  return JSON.parse(localStorage.getItem('diffTreeMap') || '{}');
};

export const createDiffTreeMap = (
  gitDiff: DiffTreeMapProps,
  type: 'modify' | 'rename' | 'create' | 'delete',
) => {
  const treeMap = getDiffTreeMap();
  if (type === 'modify') {
    if (treeMap[gitDiff.path]) {
      treeMap[gitDiff.path].content = gitDiff.content; // 更新工作区间内容
    } else {
      treeMap[gitDiff.path] = {
        ...gitDiff,
        status: 'M',
      };
    }
  }
};

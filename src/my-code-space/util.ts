interface DiffTreeMapProps {
  oldPath: string;
  newPath: string;
  oldContent: string;
  newContent: string;
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
    if (treeMap[gitDiff.newPath]) {
      treeMap;
    }
  }
};

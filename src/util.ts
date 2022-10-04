import { FileProps } from './file-explorer/types';

/** 判断空 */
export const isEmpty = (param: any) => {
  if (param === null || param === undefined) {
    return true;
  }
  if (Array.isArray(param)) {
    return param.length === 0;
  }
  if (typeof param === 'string') {
    return param.trim() === '';
  }
  if (typeof param === 'object') {
    return Object.keys(param).length === 0;
  }
  return false;
};
/**
 * 简易uuid
 */
export const uuid = (size: number) => {
  return Math.random().toString().substr(2, size);
};

/** 获取制定路径的文件 */
export const getFileByPath = (path: string, files: FileProps[], custom?) => {
  console.log('getFileByPath', path, files);
  const currentFile = {
    file: undefined,
  };
  getCurrentFile(files, path, currentFile, custom);
  return currentFile.file;
};
/** 获取当前选中的文件 */
export const getCurrentFile = (
  files: FileProps[],
  path,
  currentFile,
  custom,
) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type === 'directory') {
      getCurrentFile(file.children, path, currentFile, custom);
    }
    if (typeof custom === 'function') {
      if (custom(file)) {
        currentFile.file = file;
      }
    } else if (file.path === path) {
      currentFile.file = file;
    }
  }
};

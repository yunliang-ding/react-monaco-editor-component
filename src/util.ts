/* eslint-disable @iceworks/best-practices/recommend-polyfill */
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
  const currentFile = {
    file: undefined,
  };
  getCurrentFile(path, files, currentFile, custom);
  return currentFile.file;
};
/** 获取当前选中的文件 */
export const getCurrentFile = (
  path,
  files: FileProps[],
  currentFile,
  custom,
) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type === 'directory') {
      getCurrentFile(path, file.children, currentFile, custom);
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

export const getUrlSearchParams: any = (
  search = decodeURIComponent(location.hash).split('?')[1],
) => {
  const params = {};
  const searchParams: any = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

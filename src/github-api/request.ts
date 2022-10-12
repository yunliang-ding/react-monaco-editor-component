/* eslint-disable @iceworks/best-practices/recommend-polyfill */
export default async (url: string, type = 'json') => {
  if (type === 'json') {
    return (await (await fetch(url)).json()).tree;
  } else {
    return await (await fetch(url)).text();
  }
};

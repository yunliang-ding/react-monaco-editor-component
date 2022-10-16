// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

import { Octokit } from '@octokit/core';
import { loopTree } from './util';

export interface GitHubApiProps {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export default {
  create: ({ owner, repo, branch, token }: GitHubApiProps) => {
    const octokit = new Octokit({
      auth: token.replace('_xXydYL03', '_'),
    });
    const getTree = async () => {
      return octokit.request(`GET /repos/${owner}/${repo}/git/trees/${branch}`);
    };
    const getContent = async (content: string) => {
      return octokit.request(
        `GET /repos/${owner}/${repo}/git/blobs/${content}`,
      );
    };
    const createNewFile = async (content: string) => {
      return await octokit.request(`POST /repos/${owner}/${repo}/git/blobs`, {
        content,
      });
    };
    const createNewTree = async (base_tree: string, treeList: any[]) => {
      return octokit.request(`POST /repos/${owner}/${repo}/git/trees`, {
        base_tree,
        tree: treeList,
      });
    };
    const commitAndPushNewTree = async ({ message, tree }) => {
      // step1: 获取 parents sha
      const res1: any = await octokit.request(
        `GET /repos/${owner}/${repo}/git/refs/heads/${branch}`,
      );
      // step2: 获取 提交的 sha
      const res2: any = await octokit.request(
        `POST /repos/${owner}/${repo}/git/commits`,
        {
          message,
          tree,
          parents: [res1.data.object.sha],
        },
      );
      // step3: 提交到远程
      return await octokit.request(
        `POST /repos/${owner}/${repo}/git/refs/heads/${branch}`,
        {
          sha: res2.data.sha,
        },
      );
    };
    const getTreeAndContent = async () => {
      const { data } = await octokit.request(
        `GET /repos/${owner}/${repo}/git/trees/${branch}`,
      );
      return loopTree(
        data.tree,
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`,
        getContent,
      );
    };
    return {
      getTree,
      /** 获取远程文件的内容 */
      getContent,
      /** 创建水滴 */
      createNewFile,
      /** 创建树 */
      createNewTree,
      /** 提交树 */
      commitAndPushNewTree,
      /** 递归获取树内容 */
      getTreeAndContent,
    };
  },
};

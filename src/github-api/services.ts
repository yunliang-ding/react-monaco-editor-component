// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: 'ghp_abuBqJnnQIeQniuyGIsl6I3o8i1Jm4Fv4aKpny',
});

const gitInfo = {
  branch: 'main',
  owner: 'yunliang-ding',
  repo: 'code-review',
};

/** 获取远程树节点 */
export const getTree = async () => {
  return octokit.request(
    `GET /repos/${gitInfo.owner}/${gitInfo.repo}/git/trees/${gitInfo.branch}`,
  );
};

/** 获取远程文件的内容 */
export const getContent = async (content: string) => {
  return octokit.request(
    `GET /repos/${gitInfo.owner}/${gitInfo.repo}/git/blobs/${content}`,
  );
};

/** 创建一个远程文件 */
export const createFileContent = async (content: string) => {
  return octokit.request(
    `POST /repos/${gitInfo.owner}/${gitInfo.repo}/git/blobs`,
    {
      content,
      encoding: 'utf-8',
    },
  );
};

/** 提交代码 */
export const commitCode = async ({ message }) => {
  return octokit.request(
    `POST /repos/${gitInfo.owner}/${gitInfo.repo}/git/commits`,
    {
      message,
      author: {
        name: 'Mona Octocat',
        email: 'octocat@github.com',
        date: new Date(),
      },
      parents: ['7d1b31e74ee336d15cbd21741bc88a537ed063a0'],
      tree: '827efc6d56897b048c772eb4087f854f46256132',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n\niQIzBAABAQAdFiEESn/54jMNIrGSE6Tp6cQjvhfv7nAFAlnT71cACgkQ6cQjvhfv\n7nCWwA//XVqBKWO0zF+bZl6pggvky3Oc2j1pNFuRWZ29LXpNuD5WUGXGG209B0hI\nDkmcGk19ZKUTnEUJV2Xd0R7AW01S/YSub7OYcgBkI7qUE13FVHN5ln1KvH2all2n\n2+JCV1HcJLEoTjqIFZSSu/sMdhkLQ9/NsmMAzpf/iIM0nQOyU4YRex9eD1bYj6nA\nOQPIDdAuaTQj1gFPHYLzM4zJnCqGdRlg0sOM/zC5apBNzIwlgREatOYQSCfCKV7k\nnrU34X8b9BzQaUx48Qa+Dmfn5KQ8dl27RNeWAqlkuWyv3pUauH9UeYW+KyuJeMkU\n+NyHgAsWFaCFl23kCHThbLStMZOYEnGagrd0hnm1TPS4GJkV4wfYMwnI4KuSlHKB\njHl3Js9vNzEUQipQJbgCgTiWvRJoK3ENwBTMVkKHaqT4x9U4Jk/XZB6Q8MA09ezJ\n3QgiTjTAGcum9E9QiJqMYdWQPWkaBIRRz5cET6HPB48YNXAAUsfmuYsGrnVLYbG+\nUpC6I97VybYHTy2O9XSGoaLeMI9CsFn38ycAxxbWagk5mhclNTP5mezIq6wKSwmr\nX11FW3n1J23fWZn5HJMBsRnUCgzqzX3871IqLYHqRJ/bpZ4h20RhTyPj5c/z7QXp\neSakNQMfbbMcljkha+ZMuVQX1K9aRlVqbmv3ZMWh+OijLYVU2bc=\n=5Io4\n-----END PGP SIGNATURE-----\n',
    },
  );
};

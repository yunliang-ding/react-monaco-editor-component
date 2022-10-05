import { Menu, Item } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
const MENU_ID = 'justTest';

export default ({ createFile, renameFile, deleteFile }) => {
  /** 渲染 vNode */
  return (
    <Menu id={MENU_ID} theme="dark">
      {[
        {
          key: 'new folder',
          label: '新建文件夹',
          hidden: ({ props }) => props.type === 'file',
          onClick({ props }) {
            createFile(props, 'directory');
          },
        },
        {
          key: 'new file',
          label: '新建文件',
          hidden: ({ props }) => props.type === 'file',
          onClick({ props }) {
            createFile(props, 'file');
          },
        },
        {
          key: 'rename',
          label: '重命名',
          onClick({ props }) {
            renameFile(props);
          },
        },
        {
          key: 'delete',
          label: '删除',
          onClick({ props }) {
            deleteFile(props);
          },
        },
      ].map((item: any) => {
        return <Item {...item}>{item.label}</Item>;
      })}
    </Menu>
  );
};

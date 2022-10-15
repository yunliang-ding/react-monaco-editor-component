import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { getTools } from 'react-core-form-designer';
import CreateSpin from '@/compontent/create-spin';
// import { getUrlSearchParams } from '@/util';
import './index.less';

const explorerSpin = CreateSpin({
  getContainer: () => document.querySelector('#playground-root'),
  text: '加载中...',
});
export default (props) => {
  const { code } = props; // getUrlSearchParams(props.location.search);
  const { babelParse } = getTools();
  // 运行代码
  const runCode = async (esCode: string) => {
    try {
      // 检查代码是否有报错
      explorerSpin.open();
      const ComponentApp = await babelParse({
        code: esCode,
        prefix: '',
      });
      ReactDOM.render(
        <ComponentApp />,
        document.querySelector('#playground-root'),
      ); // 渲染
    } catch (error) {
      ReactDOM.render(
        <div className="playground-error-info">
          <pre>解析失败:</pre>
          <pre>{String(error)}</pre>
        </div>,
        document.querySelector('#playground-root'),
      ); // 渲染
    } finally {
      explorerSpin.close();
    }
  };
  useEffect(() => {
    runCode(code);
  }, []);
  return <div id="playground-root" />;
};

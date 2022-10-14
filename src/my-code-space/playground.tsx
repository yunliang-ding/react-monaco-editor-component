import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { getTools } from 'react-core-form-designer';
// import { getUrlSearchParams } from '@/util';
import './index.less';

export default (props) => {
  const { code } = props; // getUrlSearchParams(props.location.search);
  const { babelParse } = getTools();
  const [spin, setSpin] = useState(true);
  const [errorInfo, setErrorInfo]: any = useState(false);
  // 运行代码
  const runCode = async (esCode: string) => {
    try {
      // 检查代码是否有报错
      setSpin(true);
      await new Promise((res) => setTimeout(res, 1000));
      const ComponentApp = await babelParse({
        code: esCode,
        prefix: '',
      });
      setErrorInfo(false);
      ReactDOM.render(<ComponentApp />, document.querySelector('#app')); // 渲染
    } catch (error) {
      setErrorInfo(String(error));
    }
  };
  useEffect(() => {
    runCode(code);
  }, []);
  return (
    <div
      id="app"
      style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        padding: 10,
      }}
    >
      {spin ? (
        <span>loading</span>
      ) : (
        errorInfo && (
          <div className="playground-error-info">
            <pre>解析失败:</pre>
            <pre>{errorInfo}</pre>
          </div>
        )
      )}
    </div>
  );
};

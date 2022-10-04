import ReactDOM from 'react-dom';
import './index.less';

const $: any = document.querySelector.bind(document);

export interface CreateSpinProps {
  getContainer: () => HTMLElement | null;
  text?: string;
}

const close = () => {
  $('#spinid_20220520')?.remove();
};

const SpinComponent = ({ text = '加载中...' }) => {
  return (
    <div className="create-spin-loading">
      <div className="create-spin-loading-content">{text}</div>
      <div className="create-spin-loading-mask" />
    </div>
  );
};

const CreateSpin = ({ getContainer, ...props }: CreateSpinProps) => {
  const tag = document.createElement('div');
  tag.setAttribute('id', 'spinid_20220520');
  tag.style.width = '100%';
  tag.style.height = '100%';
  tag.style.position = 'absolute';
  tag.style.top = '0';
  getContainer()?.appendChild(tag);
  ReactDOM.render(<SpinComponent {...props} />, tag);
  return null;
};

export default (options: CreateSpinProps) => {
  return {
    open: () => {
      CreateSpin(options);
    },
    close,
  };
};

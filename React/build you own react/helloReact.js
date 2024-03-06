const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = document.getElementById('root');

const root = ReactDOM.createRoot(domContainer);

root.render(React.createElement(LikeButton));

function _add(...args) {
  return args.reduce((prev, curr) => prev + curr, 0);
}

function curryFn(fn) {
  let args = [];
  return function cb(..._args) {
    if (_args.length) {
      args.push(..._args);
      return cb;
    } else {
      const val = fn.apply(this, args);
      args = [];
      return val;
    }
  };
};

const add = curryFn(_add);

add(1)(2)(3)

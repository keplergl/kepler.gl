import React, {PropTypes, Component} from 'react';

const identity = state => state;

const mergeSelectors = (parentSelector, childSelector) => state =>
  childSelector(parentSelector(state));

const computeSelector = (props, ctx) =>
  mergeSelectors(
    ctx.selector ? ctx.selector : identity,
    props.selector ? props.selector : identity
  );

// store the parent selector in the parent context
// and return the parent component
// when a selector is passed to a container component,
// it will be stored in the context and passed down to child components,
// as well as prop to the given component
const withLocalSelector = ParentComponent => {
  class WithConnectSelector extends Component {
    constructor(props, ctx) {
      super(props, ctx);

      this.selector = computeSelector(props, ctx);
      this.id = props.id;
    }

    getChildContext() {
      return {
        selector: this.selector,
        id: this.id
      };
    }

    componentWillReceiveProps(nextProps, nextContext) {
      this.selector = computeSelector(nextProps, nextContext);
      this.id = nextProps.id;
    }

    render() {
      return <ParentComponent {...this.props} selector={this.selector} />;
    }
  }

  WithConnectSelector.contextTypes = {
    selector: PropTypes.func,
    id: PropTypes.string
  };

  WithConnectSelector.childContextTypes = {
    selector: PropTypes.func,
    id: PropTypes.string
  };

  return WithConnectSelector;
};

export default withLocalSelector;

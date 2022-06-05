"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _shallow = _interopRequireDefault(require("react-test-renderer/shallow"));

var _testUtils = _interopRequireDefault(require("react-dom/test-utils"));

var _checkPropTypes2 = _interopRequireDefault(require("prop-types/checkPropTypes"));

var _has = _interopRequireDefault(require("has"));

var _reactIs = require("react-is");

var _enzyme = require("enzyme");

var _Utils = require("enzyme/build/Utils");

var _enzymeShallowEqual = _interopRequireDefault(require("enzyme-shallow-equal"));

var _enzymeAdapterUtils = require("@wojtekmaj/enzyme-adapter-utils");

var _findCurrentFiberUsingSlowPath = _interopRequireDefault(require("./findCurrentFiberUsingSlowPath"));

var _detectFiberTags = _interopRequireDefault(require("./detectFiberTags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Lazily populated if DOM is available.
var FiberTags = null;

function nodeAndSiblingsArray(nodeWithSibling) {
  var array = [];
  var node = nodeWithSibling;

  while (node != null) {
    array.push(node);
    node = node.sibling;
  }

  return array;
}

function flatten(arr) {
  var result = [];
  var stack = [{
    i: 0,
    array: arr
  }];

  while (stack.length) {
    var n = stack.pop();

    while (n.i < n.array.length) {
      var el = n.array[n.i];
      n.i += 1;

      if (Array.isArray(el)) {
        stack.push(n);
        stack.push({
          i: 0,
          array: el
        });
        break;
      }

      result.push(el);
    }
  }

  return result;
}

function nodeTypeFromType(type) {
  if (type === _reactIs.Portal) {
    return 'portal';
  }

  return (0, _enzymeAdapterUtils.nodeTypeFromType)(type);
}

function isMemo(type) {
  return (0, _enzymeAdapterUtils.compareNodeTypeOf)(type, _reactIs.Memo);
}

function isLazy(type) {
  return (0, _enzymeAdapterUtils.compareNodeTypeOf)(type, _reactIs.Lazy);
}

function unmemoType(type) {
  return isMemo(type) ? type.type : type;
}

function checkIsSuspenseAndCloneElement(el, _ref) {
  var suspenseFallback = _ref.suspenseFallback;

  if (!(0, _reactIs.isSuspense)(el)) {
    return el;
  }

  var children = el.props.children;

  if (suspenseFallback) {
    var fallback = el.props.fallback;
    children = replaceLazyWithFallback(children, fallback);
  }

  var FakeSuspenseWrapper = function FakeSuspenseWrapper(props) {
    return /*#__PURE__*/_react["default"].createElement(el.type, _objectSpread(_objectSpread({}, el.props), props), children);
  };

  return /*#__PURE__*/_react["default"].createElement(FakeSuspenseWrapper, null, children);
}

function elementToTree(el) {
  if (!(0, _reactIs.isPortal)(el)) {
    return (0, _enzymeAdapterUtils.elementToTree)(el, elementToTree);
  }

  var children = el.children,
      containerInfo = el.containerInfo;
  var props = {
    children: children,
    containerInfo: containerInfo
  };
  return {
    nodeType: 'portal',
    type: _reactIs.Portal,
    props: props,
    key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(el.key),
    ref: el.ref || null,
    instance: null,
    rendered: elementToTree(el.children)
  };
}

function _toTree(vnode) {
  if (vnode == null) {
    return null;
  } // TODO(lmr): I'm not really sure I understand whether or not this is what
  // i should be doing, or if this is a hack for something i'm doing wrong
  // somewhere else. Should talk to sebastian about this perhaps


  var node = (0, _findCurrentFiberUsingSlowPath["default"])(vnode);

  switch (node.tag) {
    case FiberTags.HostRoot:
      return childrenToTree(node.child);

    case FiberTags.HostPortal:
      {
        var containerInfo = node.stateNode.containerInfo,
            children = node.memoizedProps;
        var props = {
          containerInfo: containerInfo,
          children: children
        };
        return {
          nodeType: 'portal',
          type: _reactIs.Portal,
          props: props,
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.ClassComponent:
      return {
        nodeType: 'class',
        type: node.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child)
      };

    case FiberTags.FunctionalComponent:
      return {
        nodeType: 'function',
        type: node.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: null,
        rendered: childrenToTree(node.child)
      };

    case FiberTags.MemoClass:
      return {
        nodeType: 'class',
        type: node.elementType.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child.child)
      };

    case FiberTags.MemoSFC:
      {
        var renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(_toTree));

        if (renderedNodes.length === 0) {
          renderedNodes = [node.memoizedProps.children];
        }

        return {
          nodeType: 'function',
          type: node.elementType,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: renderedNodes
        };
      }

    case FiberTags.HostComponent:
      {
        var _renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(_toTree));

        if (_renderedNodes.length === 0) {
          _renderedNodes = [node.memoizedProps.children];
        }

        return {
          nodeType: 'host',
          type: node.type,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: node.stateNode,
          rendered: _renderedNodes
        };
      }

    case FiberTags.HostText:
      return node.memoizedProps;

    case FiberTags.Fragment:
    case FiberTags.Mode:
    case FiberTags.ContextProvider:
    case FiberTags.ContextConsumer:
      return childrenToTree(node.child);

    case FiberTags.Profiler:
    case FiberTags.ForwardRef:
      {
        return {
          nodeType: 'function',
          type: node.type,
          props: _objectSpread({}, node.pendingProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.Suspense:
      {
        return {
          nodeType: 'function',
          type: _reactIs.Suspense,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.Lazy:
      return childrenToTree(node.child);

    case FiberTags.OffscreenComponent:
      return _toTree(node.child);

    default:
      throw new Error("Enzyme Internal Error: unknown node with tag ".concat(node.tag));
  }
}

function childrenToTree(node) {
  if (!node) {
    return null;
  }

  var children = nodeAndSiblingsArray(node);

  if (children.length === 0) {
    return null;
  }

  if (children.length === 1) {
    return _toTree(children[0]);
  }

  return flatten(children.map(_toTree));
}

function _nodeToHostNode(_node) {
  // NOTE(lmr): node could be a function component
  // which wont have an instance prop, but we can get the
  // host node associated with its return value at that point.
  // Although this breaks down if the return value is an array,
  // as is possible with React 16.
  var node = _node;

  while (node && !Array.isArray(node) && node.instance === null) {
    node = node.rendered;
  } // if the SFC returned null effectively, there is no host node.


  if (!node) {
    return null;
  }

  var mapper = function mapper(item) {
    if (item && item.instance) return _reactDom["default"].findDOMNode(item.instance);
    return null;
  };

  if (Array.isArray(node)) {
    return node.map(mapper);
  }

  if (Array.isArray(node.rendered) && node.nodeType === 'class') {
    return node.rendered.map(mapper);
  }

  return mapper(node);
}

function replaceLazyWithFallback(node, fallback) {
  if (!node) {
    return null;
  }

  if (Array.isArray(node)) {
    return node.map(function (el) {
      return replaceLazyWithFallback(el, fallback);
    });
  }

  if (isLazy(node.type)) {
    return fallback;
  }

  return _objectSpread(_objectSpread({}, node), {}, {
    props: _objectSpread(_objectSpread({}, node.props), {}, {
      children: replaceLazyWithFallback(node.props.children, fallback)
    })
  });
}

function getEmptyStateValue() {
  // this handles a bug in React 16.0 - 16.2
  // see https://github.com/facebook/react/commit/39be83565c65f9c522150e52375167568a2a1459
  // also see https://github.com/facebook/react/pull/11965
  var EmptyState = /*#__PURE__*/function (_React$Component) {
    _inherits(EmptyState, _React$Component);

    var _super = _createSuper(EmptyState);

    function EmptyState() {
      _classCallCheck(this, EmptyState);

      return _super.apply(this, arguments);
    }

    _createClass(EmptyState, [{
      key: "render",
      value: function render() {
        return null;
      }
    }]);

    return EmptyState;
  }(_react["default"].Component);

  var testRenderer = new _shallow["default"]();
  testRenderer.render( /*#__PURE__*/_react["default"].createElement(EmptyState));
  return testRenderer._instance.state;
}

function wrapAct(fn) {
  var returnVal;

  _testUtils["default"].act(function () {
    returnVal = fn();
  });

  return returnVal;
}

function getProviderDefaultValue(Provider) {
  // React stores references to the Provider's defaultValue differently across versions.
  if ('_defaultValue' in Provider._context) {
    return Provider._context._defaultValue;
  }

  if ('_currentValue' in Provider._context) {
    return Provider._context._currentValue;
  }

  throw new Error('Enzyme Internal Error: can’t figure out how to get Provider’s default value');
}

function makeFakeElement(type) {
  return {
    $$typeof: _reactIs.Element,
    type: type
  };
}

function isStateful(Component) {
  return Component.prototype && (Component.prototype.isReactComponent || Array.isArray(Component.__reactAutoBindPairs)) // fallback for createClass components
  ;
}

var ReactSeventeenAdapter = /*#__PURE__*/function (_EnzymeAdapter) {
  _inherits(ReactSeventeenAdapter, _EnzymeAdapter);

  var _super2 = _createSuper(ReactSeventeenAdapter);

  function ReactSeventeenAdapter() {
    var _this;

    _classCallCheck(this, ReactSeventeenAdapter);

    _this = _super2.call(this);
    var lifecycles = _this.options.lifecycles;
    _this.options = _objectSpread(_objectSpread({}, _this.options), {}, {
      enableComponentDidUpdateOnSetState: true,
      // TODO: remove, semver-major
      legacyContextMode: 'parent',
      lifecycles: _objectSpread(_objectSpread({}, lifecycles), {}, {
        componentDidUpdate: {
          onSetState: true
        },
        getDerivedStateFromProps: {
          hasShouldComponentUpdateBug: false
        },
        getSnapshotBeforeUpdate: true,
        setState: {
          skipsComponentDidUpdateOnNullish: true
        },
        getChildContext: {
          calledByRenderer: false
        },
        getDerivedStateFromError: true
      })
    });
    return _this;
  }

  _createClass(ReactSeventeenAdapter, [{
    key: "createMountRenderer",
    value: function createMountRenderer(options) {
      (0, _enzymeAdapterUtils.assertDomAvailable)('mount');

      if ((0, _has["default"])(options, 'suspenseFallback')) {
        throw new TypeError('`suspenseFallback` is not supported by the `mount` renderer');
      }

      if (FiberTags === null) {
        // Requires DOM.
        FiberTags = (0, _detectFiberTags["default"])();
      }

      var attachTo = options.attachTo,
          hydrateIn = options.hydrateIn,
          wrappingComponentProps = options.wrappingComponentProps;
      var domNode = hydrateIn || attachTo || global.document.createElement('div');
      var instance = null;
      var adapter = this;
      return {
        render: function render(el, context, callback) {
          return wrapAct(function () {
            if (instance === null) {
              var type = el.type,
                  props = el.props,
                  ref = el.ref;

              var wrapperProps = _objectSpread({
                Component: type,
                props: props,
                wrappingComponentProps: wrappingComponentProps,
                context: context
              }, ref && {
                refProp: ref
              });

              var ReactWrapperComponent = (0, _enzymeAdapterUtils.createMountWrapper)(el, _objectSpread(_objectSpread({}, options), {}, {
                adapter: adapter
              }));

              var wrappedEl = /*#__PURE__*/_react["default"].createElement(ReactWrapperComponent, wrapperProps);

              instance = hydrateIn ? _reactDom["default"].hydrate(wrappedEl, domNode) : _reactDom["default"].render(wrappedEl, domNode);

              if (typeof callback === 'function') {
                callback();
              }
            } else {
              instance.setChildProps(el.props, context, callback);
            }
          });
        },
        unmount: function unmount() {
          wrapAct(function () {
            _reactDom["default"].unmountComponentAtNode(domNode);
          });
          instance = null;
        },
        getNode: function getNode() {
          if (!instance) {
            return null;
          }

          return (0, _enzymeAdapterUtils.getNodeFromRootFinder)(adapter.isCustomComponent, _toTree(instance._reactInternals), options);
        },
        simulateError: function simulateError(nodeHierarchy, rootNode, error) {
          var isErrorBoundary = function isErrorBoundary(_ref2) {
            var elInstance = _ref2.instance,
                type = _ref2.type;

            if (type && type.getDerivedStateFromError) {
              return true;
            }

            return elInstance && elInstance.componentDidCatch;
          };

          var _ref3 = nodeHierarchy.find(isErrorBoundary) || {},
              catchingInstance = _ref3.instance,
              catchingType = _ref3.type;

          (0, _enzymeAdapterUtils.simulateError)(error, catchingInstance, rootNode, nodeHierarchy, nodeTypeFromType, adapter.displayNameOfNode, catchingType);
        },
        simulateEvent: function simulateEvent(node, event, mock) {
          var mappedEvent = (0, _enzymeAdapterUtils.mapNativeEventNames)(event);
          var eventFn = _testUtils["default"].Simulate[mappedEvent];

          if (!eventFn) {
            throw new TypeError("ReactWrapper::simulate() event '".concat(event, "' does not exist"));
          }

          wrapAct(function () {
            eventFn(adapter.nodeToHostNode(node), mock);
          });
        },
        batchedUpdates: function batchedUpdates(fn) {
          return fn(); // return ReactDOM.unstable_batchedUpdates(fn);
        },
        getWrappingComponentRenderer: function getWrappingComponentRenderer() {
          return _objectSpread(_objectSpread({}, this), (0, _enzymeAdapterUtils.getWrappingComponentMountRenderer)({
            toTree: function toTree(inst) {
              return _toTree(inst._reactInternals);
            },
            getMountWrapperInstance: function getMountWrapperInstance() {
              return instance;
            }
          }));
        },
        wrapInvoke: wrapAct
      };
    }
  }, {
    key: "createShallowRenderer",
    value: function createShallowRenderer() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var adapter = this;
      var renderer = new _shallow["default"]();
      var suspenseFallback = options.suspenseFallback;

      if (typeof suspenseFallback !== 'undefined' && typeof suspenseFallback !== 'boolean') {
        throw TypeError('`options.suspenseFallback` should be boolean or undefined');
      }

      var isDOM = false;
      var cachedNode = null;
      var lastComponent = null;
      var wrappedComponent = null;
      var sentinel = {}; // wrap memo components with a PureComponent, or a class component with sCU

      var wrapPureComponent = function wrapPureComponent(Component, compare) {
        if (lastComponent !== Component) {
          if (isStateful(Component)) {
            wrappedComponent = /*#__PURE__*/function (_Component) {
              _inherits(wrappedComponent, _Component);

              var _super3 = _createSuper(wrappedComponent);

              function wrappedComponent() {
                _classCallCheck(this, wrappedComponent);

                return _super3.apply(this, arguments);
              }

              return _createClass(wrappedComponent);
            }(Component);

            if (compare) {
              wrappedComponent.prototype.shouldComponentUpdate = function (nextProps) {
                return !compare(_this2.props, nextProps);
              };
            } else {
              wrappedComponent.prototype.isPureReactComponent = true;
            }
          } else {
            var memoized = sentinel;
            var prevProps;

            wrappedComponent = function wrappedComponentFn(props) {
              var shouldUpdate = memoized === sentinel || (compare ? !compare(prevProps, props) : !(0, _enzymeShallowEqual["default"])(prevProps, props));

              if (shouldUpdate) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                memoized = Component.apply(void 0, [_objectSpread(_objectSpread({}, Component.defaultProps), props)].concat(args));
                prevProps = props;
              }

              return memoized;
            };
          }

          Object.assign(wrappedComponent, Component, {
            displayName: adapter.displayNameOfNode({
              type: Component
            })
          });
          lastComponent = Component;
        }

        return wrappedComponent;
      }; // Wrap functional components on versions prior to 16.5,
      // to avoid inadvertently pass a `this` instance to it.


      var wrapFunctionalComponent = function wrapFunctionalComponent(Component) {
        if ((0, _has["default"])(Component, 'defaultProps')) {
          if (lastComponent !== Component) {
            wrappedComponent = Object.assign(function (props) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              return Component.apply(void 0, [_objectSpread(_objectSpread({}, Component.defaultProps), props)].concat(args));
            }, Component, {
              displayName: adapter.displayNameOfNode({
                type: Component
              })
            });
            lastComponent = Component;
          }

          return wrappedComponent;
        }

        return Component;
      };

      var renderElement = function renderElement(elConfig) {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          rest[_key3 - 1] = arguments[_key3];
        }

        var renderedEl = renderer.render.apply(renderer, [elConfig].concat(rest));
        var typeIsExisted = !!(renderedEl && renderedEl.type);

        if (typeIsExisted) {
          var clonedEl = checkIsSuspenseAndCloneElement(renderedEl, {
            suspenseFallback: suspenseFallback
          });
          var elementIsChanged = clonedEl.type !== renderedEl.type;

          if (elementIsChanged) {
            return renderer.render.apply(renderer, [_objectSpread(_objectSpread({}, elConfig), {}, {
              type: clonedEl.type
            })].concat(rest));
          }
        }

        return renderedEl;
      };

      return {
        render: function render(el, unmaskedContext) {
          var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
              _ref4$providerValues = _ref4.providerValues,
              providerValues = _ref4$providerValues === void 0 ? new Map() : _ref4$providerValues;

          cachedNode = el;

          if (typeof el.type === 'string') {
            isDOM = true;
          } else if ((0, _reactIs.isContextProvider)(el)) {
            providerValues.set(el.type, el.props.value);
            var MockProvider = Object.assign(function (props) {
              return props.children;
            }, el.type);
            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                type: MockProvider
              }));
            });
          } else if ((0, _reactIs.isContextConsumer)(el)) {
            var Provider = adapter.getProviderFromConsumer(el.type);
            var value = providerValues.has(Provider) ? providerValues.get(Provider) : getProviderDefaultValue(Provider);
            var MockConsumer = Object.assign(function (props) {
              return props.children(value);
            }, el.type);
            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                type: MockConsumer
              }));
            });
          } else {
            isDOM = false;
            var renderedEl = el;

            if (isLazy(renderedEl)) {
              throw TypeError('`React.lazy` is not supported by shallow rendering.');
            }

            renderedEl = checkIsSuspenseAndCloneElement(renderedEl, {
              suspenseFallback: suspenseFallback
            });
            var _renderedEl = renderedEl,
                Component = _renderedEl.type;
            var context = (0, _enzymeAdapterUtils.getMaskedContext)(Component.contextTypes, unmaskedContext);

            if (isMemo(el.type)) {
              var _el$type = el.type,
                  InnerComp = _el$type.type,
                  compare = _el$type.compare;
              return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
                return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                  type: wrapPureComponent(InnerComp, compare)
                }), context);
              });
            }

            var isComponentStateful = isStateful(Component);

            if (!isComponentStateful && typeof Component === 'function') {
              return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
                return renderElement(_objectSpread(_objectSpread({}, renderedEl), {}, {
                  type: wrapFunctionalComponent(Component)
                }), context);
              });
            }

            if (isComponentStateful) {
              if (renderer._instance && el.props === renderer._instance.props && !(0, _enzymeShallowEqual["default"])(context, renderer._instance.context)) {
                var _spyMethod = (0, _enzymeAdapterUtils.spyMethod)(renderer, '_updateClassComponent', function (originalMethod) {
                  return function _updateClassComponent() {
                    var props = renderer._instance.props;

                    var clonedProps = _objectSpread({}, props);

                    renderer._instance.props = clonedProps;

                    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                      args[_key4] = arguments[_key4];
                    }

                    var result = originalMethod.apply(renderer, args);
                    renderer._instance.props = props;
                    restore();
                    return result;
                  };
                }),
                    restore = _spyMethod.restore;
              } // fix react bug; see implementation of `getEmptyStateValue`


              var emptyStateValue = getEmptyStateValue();

              if (emptyStateValue) {
                Object.defineProperty(Component.prototype, 'state', {
                  configurable: true,
                  enumerable: true,
                  get: function get() {
                    return null;
                  },
                  set: function set(value) {
                    if (value !== emptyStateValue) {
                      Object.defineProperty(this, 'state', {
                        configurable: true,
                        enumerable: true,
                        value: value,
                        writable: true
                      });
                    }
                  }
                });
              }
            }

            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(renderedEl, context);
            });
          }
        },
        unmount: function unmount() {
          renderer.unmount();
        },
        getNode: function getNode() {
          if (isDOM) {
            return elementToTree(cachedNode);
          }

          var output = renderer.getRenderOutput();
          return {
            nodeType: nodeTypeFromType(cachedNode.type),
            type: cachedNode.type,
            props: cachedNode.props,
            key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(cachedNode.key),
            ref: cachedNode.ref,
            instance: renderer._instance,
            rendered: Array.isArray(output) ? flatten(output).map(function (el) {
              return elementToTree(el);
            }) : elementToTree(output)
          };
        },
        simulateError: function simulateError(nodeHierarchy, rootNode, error) {
          (0, _enzymeAdapterUtils.simulateError)(error, renderer._instance, cachedNode, nodeHierarchy.concat(cachedNode), nodeTypeFromType, adapter.displayNameOfNode, cachedNode.type);
        },
        simulateEvent: function simulateEvent(node, event) {
          for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
            args[_key5 - 2] = arguments[_key5];
          }

          var handler = node.props[(0, _enzymeAdapterUtils.propFromEvent)(event)];

          if (handler) {
            (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              // TODO(lmr): create/use synthetic events
              // TODO(lmr): emulate React's event propagation
              // ReactDOM.unstable_batchedUpdates(() => {
              handler.apply(void 0, args); // });
            });
          }
        },
        batchedUpdates: function batchedUpdates(fn) {
          return fn(); // return ReactDOM.unstable_batchedUpdates(fn);
        },
        checkPropTypes: function checkPropTypes(typeSpecs, values, location, hierarchy) {
          return (0, _checkPropTypes2["default"])(typeSpecs, values, location, (0, _enzymeAdapterUtils.displayNameOfNode)(cachedNode), function () {
            return (0, _enzymeAdapterUtils.getComponentStack)(hierarchy.concat([cachedNode]));
          });
        }
      };
    }
  }, {
    key: "createStringRenderer",
    value: function createStringRenderer(options) {
      if ((0, _has["default"])(options, 'suspenseFallback')) {
        throw new TypeError('`suspenseFallback` should not be specified in options of string renderer');
      }

      return {
        render: function render(el, context) {
          if (options.context && (el.type.contextTypes || options.childContextTypes)) {
            var childContextTypes = _objectSpread(_objectSpread({}, el.type.contextTypes || {}), options.childContextTypes);

            var ContextWrapper = (0, _enzymeAdapterUtils.createRenderWrapper)(el, context, childContextTypes);
            return _server["default"].renderToStaticMarkup( /*#__PURE__*/_react["default"].createElement(ContextWrapper));
          }

          return _server["default"].renderToStaticMarkup(el);
        }
      };
    } // Provided a bag of options, return an `EnzymeRenderer`. Some options can be implementation
    // specific, like `attach` etc. for React, but not part of this interface explicitly.

  }, {
    key: "createRenderer",
    value: function createRenderer(options) {
      switch (options.mode) {
        case _enzyme.EnzymeAdapter.MODES.MOUNT:
          return this.createMountRenderer(options);

        case _enzyme.EnzymeAdapter.MODES.SHALLOW:
          return this.createShallowRenderer(options);

        case _enzyme.EnzymeAdapter.MODES.STRING:
          return this.createStringRenderer(options);

        default:
          throw new Error("Enzyme Internal Error: Unrecognized mode: ".concat(options.mode));
      }
    }
  }, {
    key: "wrap",
    value: function wrap(element) {
      return (0, _enzymeAdapterUtils.wrap)(element);
    } // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
    // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
    // be pretty straightforward for people to implement.

  }, {
    key: "nodeToElement",
    value: function nodeToElement(node) {
      if (!node || _typeof(node) !== 'object') return null;
      var type = node.type;
      return /*#__PURE__*/_react["default"].createElement(unmemoType(type), (0, _enzymeAdapterUtils.propsWithKeysAndRef)(node));
    }
  }, {
    key: "matchesElementType",
    value: function matchesElementType(node, matchingType) {
      if (!node) {
        return node;
      }

      var type = node.type;
      return unmemoType(type) === unmemoType(matchingType);
    }
  }, {
    key: "elementToNode",
    value: function elementToNode(element) {
      return elementToTree(element);
    }
  }, {
    key: "nodeToHostNode",
    value: function nodeToHostNode(node) {
      var supportsArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var nodes = _nodeToHostNode(node);

      if (Array.isArray(nodes) && !supportsArray) {
        // get the first non-null node
        return nodes.filter(Boolean)[0];
      }

      return nodes;
    }
  }, {
    key: "displayNameOfNode",
    value: function displayNameOfNode(node) {
      if (!node) return null;
      var type = node.type,
          $$typeof = node.$$typeof;
      var adapter = this;
      var nodeType = type || $$typeof; // newer node types may be undefined, so only test if the nodeType exists

      if (nodeType) {
        switch (nodeType) {
          case _reactIs.ConcurrentMode || NaN:
            return 'ConcurrentMode';

          case _reactIs.Fragment || NaN:
            return 'Fragment';

          case _reactIs.StrictMode || NaN:
            return 'StrictMode';

          case _reactIs.Profiler || NaN:
            return 'Profiler';

          case _reactIs.Portal || NaN:
            return 'Portal';

          case _reactIs.Suspense || NaN:
            return 'Suspense';

          default:
        }
      }

      var $$typeofType = type && type.$$typeof;

      switch ($$typeofType) {
        case _reactIs.ContextConsumer || NaN:
          return 'ContextConsumer';

        case _reactIs.ContextProvider || NaN:
          return 'ContextProvider';

        case _reactIs.Memo || NaN:
          {
            var nodeName = (0, _enzymeAdapterUtils.displayNameOfNode)(node);
            return typeof nodeName === 'string' ? nodeName : "Memo(".concat(adapter.displayNameOfNode(type), ")");
          }

        case _reactIs.ForwardRef || NaN:
          {
            if (type.displayName) {
              return type.displayName;
            }

            var name = adapter.displayNameOfNode({
              type: type.render
            });
            return name ? "ForwardRef(".concat(name, ")") : 'ForwardRef';
          }

        case _reactIs.Lazy || NaN:
          {
            return 'lazy';
          }

        default:
          return (0, _enzymeAdapterUtils.displayNameOfNode)(node);
      }
    }
  }, {
    key: "isValidElement",
    value: function isValidElement(element) {
      return (0, _reactIs.isElement)(element);
    }
  }, {
    key: "isValidElementType",
    value: function isValidElementType(object) {
      return !!object && (0, _reactIs.isValidElementType)(object);
    }
  }, {
    key: "isFragment",
    value: function isFragment(fragment) {
      return (0, _Utils.typeOfNode)(fragment) === _reactIs.Fragment;
    }
  }, {
    key: "isCustomComponent",
    value: function isCustomComponent(type) {
      var fakeElement = makeFakeElement(type);
      return !!type && (typeof type === 'function' || (0, _reactIs.isForwardRef)(fakeElement) || (0, _reactIs.isContextProvider)(fakeElement) || (0, _reactIs.isContextConsumer)(fakeElement) || (0, _reactIs.isSuspense)(fakeElement));
    }
  }, {
    key: "isContextConsumer",
    value: function isContextConsumer(type) {
      return !!type && (0, _reactIs.isContextConsumer)(makeFakeElement(type));
    }
  }, {
    key: "isCustomComponentElement",
    value: function isCustomComponentElement(inst) {
      if (!inst || !this.isValidElement(inst)) {
        return false;
      }

      return this.isCustomComponent(inst.type);
    }
  }, {
    key: "getProviderFromConsumer",
    value: function getProviderFromConsumer(Consumer) {
      // React stores references to the Provider on a Consumer differently across versions.
      if (Consumer) {
        var Provider;

        if (Consumer._context) {
          // check this first, to avoid a deprecation warning
          Provider = Consumer._context.Provider;
        } else if (Consumer.Provider) {
          Provider = Consumer.Provider;
        }

        if (Provider) {
          return Provider;
        }
      }

      throw new Error('Enzyme Internal Error: can’t figure out how to get Provider from Consumer');
    }
  }, {
    key: "createElement",
    value: function createElement() {
      return /*#__PURE__*/_react["default"].createElement.apply(_react["default"], arguments);
    }
  }, {
    key: "wrapWithWrappingComponent",
    value: function wrapWithWrappingComponent(node, options) {
      return {
        RootFinder: _enzymeAdapterUtils.RootFinder,
        node: (0, _enzymeAdapterUtils.wrapWithWrappingComponent)(_react["default"].createElement, node, options)
      };
    }
  }]);

  return ReactSeventeenAdapter;
}(_enzyme.EnzymeAdapter);

module.exports = ReactSeventeenAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWJlclRhZ3MiLCJub2RlQW5kU2libGluZ3NBcnJheSIsIm5vZGVXaXRoU2libGluZyIsImFycmF5Iiwibm9kZSIsInB1c2giLCJzaWJsaW5nIiwiZmxhdHRlbiIsImFyciIsInJlc3VsdCIsInN0YWNrIiwiaSIsImxlbmd0aCIsIm4iLCJwb3AiLCJlbCIsIkFycmF5IiwiaXNBcnJheSIsIm5vZGVUeXBlRnJvbVR5cGUiLCJ0eXBlIiwiUG9ydGFsIiwidXRpbE5vZGVUeXBlRnJvbVR5cGUiLCJpc01lbW8iLCJjb21wYXJlTm9kZVR5cGVPZiIsIk1lbW8iLCJpc0xhenkiLCJMYXp5IiwidW5tZW1vVHlwZSIsImNoZWNrSXNTdXNwZW5zZUFuZENsb25lRWxlbWVudCIsInN1c3BlbnNlRmFsbGJhY2siLCJpc1N1c3BlbnNlIiwiY2hpbGRyZW4iLCJwcm9wcyIsImZhbGxiYWNrIiwicmVwbGFjZUxhenlXaXRoRmFsbGJhY2siLCJGYWtlU3VzcGVuc2VXcmFwcGVyIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudFRvVHJlZSIsImlzUG9ydGFsIiwidXRpbEVsZW1lbnRUb1RyZWUiLCJjb250YWluZXJJbmZvIiwibm9kZVR5cGUiLCJrZXkiLCJlbnN1cmVLZXlPclVuZGVmaW5lZCIsInJlZiIsImluc3RhbmNlIiwicmVuZGVyZWQiLCJ0b1RyZWUiLCJ2bm9kZSIsImZpbmRDdXJyZW50RmliZXJVc2luZ1Nsb3dQYXRoIiwidGFnIiwiSG9zdFJvb3QiLCJjaGlsZHJlblRvVHJlZSIsImNoaWxkIiwiSG9zdFBvcnRhbCIsInN0YXRlTm9kZSIsIm1lbW9pemVkUHJvcHMiLCJDbGFzc0NvbXBvbmVudCIsIkZ1bmN0aW9uYWxDb21wb25lbnQiLCJNZW1vQ2xhc3MiLCJlbGVtZW50VHlwZSIsIk1lbW9TRkMiLCJyZW5kZXJlZE5vZGVzIiwibWFwIiwiSG9zdENvbXBvbmVudCIsIkhvc3RUZXh0IiwiRnJhZ21lbnQiLCJNb2RlIiwiQ29udGV4dFByb3ZpZGVyIiwiQ29udGV4dENvbnN1bWVyIiwiUHJvZmlsZXIiLCJGb3J3YXJkUmVmIiwicGVuZGluZ1Byb3BzIiwiU3VzcGVuc2UiLCJPZmZzY3JlZW5Db21wb25lbnQiLCJFcnJvciIsIm5vZGVUb0hvc3ROb2RlIiwiX25vZGUiLCJtYXBwZXIiLCJpdGVtIiwiUmVhY3RET00iLCJmaW5kRE9NTm9kZSIsImdldEVtcHR5U3RhdGVWYWx1ZSIsIkVtcHR5U3RhdGUiLCJDb21wb25lbnQiLCJ0ZXN0UmVuZGVyZXIiLCJTaGFsbG93UmVuZGVyZXIiLCJyZW5kZXIiLCJfaW5zdGFuY2UiLCJzdGF0ZSIsIndyYXBBY3QiLCJmbiIsInJldHVyblZhbCIsIlRlc3RVdGlscyIsImFjdCIsImdldFByb3ZpZGVyRGVmYXVsdFZhbHVlIiwiUHJvdmlkZXIiLCJfY29udGV4dCIsIl9kZWZhdWx0VmFsdWUiLCJfY3VycmVudFZhbHVlIiwibWFrZUZha2VFbGVtZW50IiwiJCR0eXBlb2YiLCJFbGVtZW50IiwiaXNTdGF0ZWZ1bCIsInByb3RvdHlwZSIsImlzUmVhY3RDb21wb25lbnQiLCJfX3JlYWN0QXV0b0JpbmRQYWlycyIsIlJlYWN0U2V2ZW50ZWVuQWRhcHRlciIsImxpZmVjeWNsZXMiLCJvcHRpb25zIiwiZW5hYmxlQ29tcG9uZW50RGlkVXBkYXRlT25TZXRTdGF0ZSIsImxlZ2FjeUNvbnRleHRNb2RlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwib25TZXRTdGF0ZSIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsImhhc1Nob3VsZENvbXBvbmVudFVwZGF0ZUJ1ZyIsImdldFNuYXBzaG90QmVmb3JlVXBkYXRlIiwic2V0U3RhdGUiLCJza2lwc0NvbXBvbmVudERpZFVwZGF0ZU9uTnVsbGlzaCIsImdldENoaWxkQ29udGV4dCIsImNhbGxlZEJ5UmVuZGVyZXIiLCJnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IiLCJhc3NlcnREb21BdmFpbGFibGUiLCJoYXMiLCJUeXBlRXJyb3IiLCJkZXRlY3RGaWJlclRhZ3MiLCJhdHRhY2hUbyIsImh5ZHJhdGVJbiIsIndyYXBwaW5nQ29tcG9uZW50UHJvcHMiLCJkb21Ob2RlIiwiZ2xvYmFsIiwiZG9jdW1lbnQiLCJhZGFwdGVyIiwiY29udGV4dCIsImNhbGxiYWNrIiwid3JhcHBlclByb3BzIiwicmVmUHJvcCIsIlJlYWN0V3JhcHBlckNvbXBvbmVudCIsImNyZWF0ZU1vdW50V3JhcHBlciIsIndyYXBwZWRFbCIsImh5ZHJhdGUiLCJzZXRDaGlsZFByb3BzIiwidW5tb3VudCIsInVubW91bnRDb21wb25lbnRBdE5vZGUiLCJnZXROb2RlIiwiZ2V0Tm9kZUZyb21Sb290RmluZGVyIiwiaXNDdXN0b21Db21wb25lbnQiLCJfcmVhY3RJbnRlcm5hbHMiLCJzaW11bGF0ZUVycm9yIiwibm9kZUhpZXJhcmNoeSIsInJvb3ROb2RlIiwiZXJyb3IiLCJpc0Vycm9yQm91bmRhcnkiLCJlbEluc3RhbmNlIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJmaW5kIiwiY2F0Y2hpbmdJbnN0YW5jZSIsImNhdGNoaW5nVHlwZSIsImRpc3BsYXlOYW1lT2ZOb2RlIiwic2ltdWxhdGVFdmVudCIsImV2ZW50IiwibW9jayIsIm1hcHBlZEV2ZW50IiwibWFwTmF0aXZlRXZlbnROYW1lcyIsImV2ZW50Rm4iLCJTaW11bGF0ZSIsImJhdGNoZWRVcGRhdGVzIiwiZ2V0V3JhcHBpbmdDb21wb25lbnRSZW5kZXJlciIsImdldFdyYXBwaW5nQ29tcG9uZW50TW91bnRSZW5kZXJlciIsImluc3QiLCJnZXRNb3VudFdyYXBwZXJJbnN0YW5jZSIsIndyYXBJbnZva2UiLCJyZW5kZXJlciIsImlzRE9NIiwiY2FjaGVkTm9kZSIsImxhc3RDb21wb25lbnQiLCJ3cmFwcGVkQ29tcG9uZW50Iiwic2VudGluZWwiLCJ3cmFwUHVyZUNvbXBvbmVudCIsImNvbXBhcmUiLCJzaG91bGRDb21wb25lbnRVcGRhdGUiLCJuZXh0UHJvcHMiLCJpc1B1cmVSZWFjdENvbXBvbmVudCIsIm1lbW9pemVkIiwicHJldlByb3BzIiwid3JhcHBlZENvbXBvbmVudEZuIiwic2hvdWxkVXBkYXRlIiwic2hhbGxvd0VxdWFsIiwiYXJncyIsImRlZmF1bHRQcm9wcyIsIk9iamVjdCIsImFzc2lnbiIsImRpc3BsYXlOYW1lIiwid3JhcEZ1bmN0aW9uYWxDb21wb25lbnQiLCJyZW5kZXJFbGVtZW50IiwiZWxDb25maWciLCJyZXN0IiwicmVuZGVyZWRFbCIsInR5cGVJc0V4aXN0ZWQiLCJjbG9uZWRFbCIsImVsZW1lbnRJc0NoYW5nZWQiLCJ1bm1hc2tlZENvbnRleHQiLCJwcm92aWRlclZhbHVlcyIsIk1hcCIsImlzQ29udGV4dFByb3ZpZGVyIiwic2V0IiwidmFsdWUiLCJNb2NrUHJvdmlkZXIiLCJ3aXRoU2V0U3RhdGVBbGxvd2VkIiwiaXNDb250ZXh0Q29uc3VtZXIiLCJnZXRQcm92aWRlckZyb21Db25zdW1lciIsImdldCIsIk1vY2tDb25zdW1lciIsImdldE1hc2tlZENvbnRleHQiLCJjb250ZXh0VHlwZXMiLCJJbm5lckNvbXAiLCJpc0NvbXBvbmVudFN0YXRlZnVsIiwic3B5TWV0aG9kIiwib3JpZ2luYWxNZXRob2QiLCJfdXBkYXRlQ2xhc3NDb21wb25lbnQiLCJjbG9uZWRQcm9wcyIsImFwcGx5IiwicmVzdG9yZSIsImVtcHR5U3RhdGVWYWx1ZSIsImRlZmluZVByb3BlcnR5IiwiY29uZmlndXJhYmxlIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwib3V0cHV0IiwiZ2V0UmVuZGVyT3V0cHV0IiwiY29uY2F0IiwiaGFuZGxlciIsInByb3BGcm9tRXZlbnQiLCJjaGVja1Byb3BUeXBlcyIsInR5cGVTcGVjcyIsInZhbHVlcyIsImxvY2F0aW9uIiwiaGllcmFyY2h5IiwiZ2V0Q29tcG9uZW50U3RhY2siLCJjaGlsZENvbnRleHRUeXBlcyIsIkNvbnRleHRXcmFwcGVyIiwiY3JlYXRlUmVuZGVyV3JhcHBlciIsIlJlYWN0RE9NU2VydmVyIiwicmVuZGVyVG9TdGF0aWNNYXJrdXAiLCJtb2RlIiwiRW56eW1lQWRhcHRlciIsIk1PREVTIiwiTU9VTlQiLCJjcmVhdGVNb3VudFJlbmRlcmVyIiwiU0hBTExPVyIsImNyZWF0ZVNoYWxsb3dSZW5kZXJlciIsIlNUUklORyIsImNyZWF0ZVN0cmluZ1JlbmRlcmVyIiwiZWxlbWVudCIsIndyYXAiLCJwcm9wc1dpdGhLZXlzQW5kUmVmIiwibWF0Y2hpbmdUeXBlIiwic3VwcG9ydHNBcnJheSIsIm5vZGVzIiwiZmlsdGVyIiwiQm9vbGVhbiIsIkNvbmN1cnJlbnRNb2RlIiwiTmFOIiwiU3RyaWN0TW9kZSIsIiQkdHlwZW9mVHlwZSIsIm5vZGVOYW1lIiwibmFtZSIsImlzRWxlbWVudCIsIm9iamVjdCIsImlzVmFsaWRFbGVtZW50VHlwZSIsImZyYWdtZW50IiwidHlwZU9mTm9kZSIsImZha2VFbGVtZW50IiwiaXNGb3J3YXJkUmVmIiwiaXNWYWxpZEVsZW1lbnQiLCJDb25zdW1lciIsIlJvb3RGaW5kZXIiLCJ3cmFwV2l0aFdyYXBwaW5nQ29tcG9uZW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWFjdFNldmVudGVlbkFkYXB0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFJlYWN0RE9NU2VydmVyIGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xuaW1wb3J0IFNoYWxsb3dSZW5kZXJlciBmcm9tICdyZWFjdC10ZXN0LXJlbmRlcmVyL3NoYWxsb3cnO1xuaW1wb3J0IFRlc3RVdGlscyBmcm9tICdyZWFjdC1kb20vdGVzdC11dGlscyc7XG5pbXBvcnQgY2hlY2tQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcyc7XG5pbXBvcnQgaGFzIGZyb20gJ2hhcyc7XG5pbXBvcnQge1xuICBDb25jdXJyZW50TW9kZSxcbiAgQ29udGV4dENvbnN1bWVyLFxuICBDb250ZXh0UHJvdmlkZXIsXG4gIEVsZW1lbnQsXG4gIEZvcndhcmRSZWYsXG4gIEZyYWdtZW50LFxuICBpc0NvbnRleHRDb25zdW1lcixcbiAgaXNDb250ZXh0UHJvdmlkZXIsXG4gIGlzRWxlbWVudCxcbiAgaXNGb3J3YXJkUmVmLFxuICBpc1BvcnRhbCxcbiAgaXNTdXNwZW5zZSxcbiAgaXNWYWxpZEVsZW1lbnRUeXBlLFxuICBMYXp5LFxuICBNZW1vLFxuICBQb3J0YWwsXG4gIFByb2ZpbGVyLFxuICBTdHJpY3RNb2RlLFxuICBTdXNwZW5zZSxcbn0gZnJvbSAncmVhY3QtaXMnO1xuaW1wb3J0IHsgRW56eW1lQWRhcHRlciB9IGZyb20gJ2VuenltZSc7XG5pbXBvcnQgeyB0eXBlT2ZOb2RlIH0gZnJvbSAnZW56eW1lL2J1aWxkL1V0aWxzJztcbmltcG9ydCBzaGFsbG93RXF1YWwgZnJvbSAnZW56eW1lLXNoYWxsb3ctZXF1YWwnO1xuaW1wb3J0IHtcbiAgZGlzcGxheU5hbWVPZk5vZGUsXG4gIGVsZW1lbnRUb1RyZWUgYXMgdXRpbEVsZW1lbnRUb1RyZWUsXG4gIG5vZGVUeXBlRnJvbVR5cGUgYXMgdXRpbE5vZGVUeXBlRnJvbVR5cGUsXG4gIG1hcE5hdGl2ZUV2ZW50TmFtZXMsXG4gIHByb3BGcm9tRXZlbnQsXG4gIGFzc2VydERvbUF2YWlsYWJsZSxcbiAgd2l0aFNldFN0YXRlQWxsb3dlZCxcbiAgY3JlYXRlUmVuZGVyV3JhcHBlcixcbiAgY3JlYXRlTW91bnRXcmFwcGVyLFxuICBwcm9wc1dpdGhLZXlzQW5kUmVmLFxuICBlbnN1cmVLZXlPclVuZGVmaW5lZCxcbiAgc2ltdWxhdGVFcnJvcixcbiAgd3JhcCxcbiAgZ2V0TWFza2VkQ29udGV4dCxcbiAgZ2V0Q29tcG9uZW50U3RhY2ssXG4gIFJvb3RGaW5kZXIsXG4gIGdldE5vZGVGcm9tUm9vdEZpbmRlcixcbiAgd3JhcFdpdGhXcmFwcGluZ0NvbXBvbmVudCxcbiAgZ2V0V3JhcHBpbmdDb21wb25lbnRNb3VudFJlbmRlcmVyLFxuICBjb21wYXJlTm9kZVR5cGVPZixcbiAgc3B5TWV0aG9kLFxufSBmcm9tICdAd29qdGVrbWFqL2VuenltZS1hZGFwdGVyLXV0aWxzJztcbmltcG9ydCBmaW5kQ3VycmVudEZpYmVyVXNpbmdTbG93UGF0aCBmcm9tICcuL2ZpbmRDdXJyZW50RmliZXJVc2luZ1Nsb3dQYXRoJztcbmltcG9ydCBkZXRlY3RGaWJlclRhZ3MgZnJvbSAnLi9kZXRlY3RGaWJlclRhZ3MnO1xuXG4vLyBMYXppbHkgcG9wdWxhdGVkIGlmIERPTSBpcyBhdmFpbGFibGUuXG5sZXQgRmliZXJUYWdzID0gbnVsbDtcblxuZnVuY3Rpb24gbm9kZUFuZFNpYmxpbmdzQXJyYXkobm9kZVdpdGhTaWJsaW5nKSB7XG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGxldCBub2RlID0gbm9kZVdpdGhTaWJsaW5nO1xuICB3aGlsZSAobm9kZSAhPSBudWxsKSB7XG4gICAgYXJyYXkucHVzaChub2RlKTtcbiAgICBub2RlID0gbm9kZS5zaWJsaW5nO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZnVuY3Rpb24gZmxhdHRlbihhcnIpIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IHN0YWNrID0gW3sgaTogMCwgYXJyYXk6IGFyciB9XTtcbiAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgIGNvbnN0IG4gPSBzdGFjay5wb3AoKTtcbiAgICB3aGlsZSAobi5pIDwgbi5hcnJheS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVsID0gbi5hcnJheVtuLmldO1xuICAgICAgbi5pICs9IDE7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShlbCkpIHtcbiAgICAgICAgc3RhY2sucHVzaChuKTtcbiAgICAgICAgc3RhY2sucHVzaCh7IGk6IDAsIGFycmF5OiBlbCB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaChlbCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG5vZGVUeXBlRnJvbVR5cGUodHlwZSkge1xuICBpZiAodHlwZSA9PT0gUG9ydGFsKSB7XG4gICAgcmV0dXJuICdwb3J0YWwnO1xuICB9XG5cbiAgcmV0dXJuIHV0aWxOb2RlVHlwZUZyb21UeXBlKHR5cGUpO1xufVxuXG5mdW5jdGlvbiBpc01lbW8odHlwZSkge1xuICByZXR1cm4gY29tcGFyZU5vZGVUeXBlT2YodHlwZSwgTWVtbyk7XG59XG5cbmZ1bmN0aW9uIGlzTGF6eSh0eXBlKSB7XG4gIHJldHVybiBjb21wYXJlTm9kZVR5cGVPZih0eXBlLCBMYXp5KTtcbn1cblxuZnVuY3Rpb24gdW5tZW1vVHlwZSh0eXBlKSB7XG4gIHJldHVybiBpc01lbW8odHlwZSkgPyB0eXBlLnR5cGUgOiB0eXBlO1xufVxuXG5mdW5jdGlvbiBjaGVja0lzU3VzcGVuc2VBbmRDbG9uZUVsZW1lbnQoZWwsIHsgc3VzcGVuc2VGYWxsYmFjayB9KSB7XG4gIGlmICghaXNTdXNwZW5zZShlbCkpIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBsZXQgeyBjaGlsZHJlbiB9ID0gZWwucHJvcHM7XG5cbiAgaWYgKHN1c3BlbnNlRmFsbGJhY2spIHtcbiAgICBjb25zdCB7IGZhbGxiYWNrIH0gPSBlbC5wcm9wcztcbiAgICBjaGlsZHJlbiA9IHJlcGxhY2VMYXp5V2l0aEZhbGxiYWNrKGNoaWxkcmVuLCBmYWxsYmFjayk7XG4gIH1cblxuICBjb25zdCBGYWtlU3VzcGVuc2VXcmFwcGVyID0gKHByb3BzKSA9PlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoZWwudHlwZSwgeyAuLi5lbC5wcm9wcywgLi4ucHJvcHMgfSwgY2hpbGRyZW4pO1xuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGYWtlU3VzcGVuc2VXcmFwcGVyLCBudWxsLCBjaGlsZHJlbik7XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRUb1RyZWUoZWwpIHtcbiAgaWYgKCFpc1BvcnRhbChlbCkpIHtcbiAgICByZXR1cm4gdXRpbEVsZW1lbnRUb1RyZWUoZWwsIGVsZW1lbnRUb1RyZWUpO1xuICB9XG5cbiAgY29uc3QgeyBjaGlsZHJlbiwgY29udGFpbmVySW5mbyB9ID0gZWw7XG4gIGNvbnN0IHByb3BzID0geyBjaGlsZHJlbiwgY29udGFpbmVySW5mbyB9O1xuXG4gIHJldHVybiB7XG4gICAgbm9kZVR5cGU6ICdwb3J0YWwnLFxuICAgIHR5cGU6IFBvcnRhbCxcbiAgICBwcm9wcyxcbiAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKGVsLmtleSksXG4gICAgcmVmOiBlbC5yZWYgfHwgbnVsbCxcbiAgICBpbnN0YW5jZTogbnVsbCxcbiAgICByZW5kZXJlZDogZWxlbWVudFRvVHJlZShlbC5jaGlsZHJlbiksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvVHJlZSh2bm9kZSkge1xuICBpZiAodm5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIFRPRE8obG1yKTogSSdtIG5vdCByZWFsbHkgc3VyZSBJIHVuZGVyc3RhbmQgd2hldGhlciBvciBub3QgdGhpcyBpcyB3aGF0XG4gIC8vIGkgc2hvdWxkIGJlIGRvaW5nLCBvciBpZiB0aGlzIGlzIGEgaGFjayBmb3Igc29tZXRoaW5nIGknbSBkb2luZyB3cm9uZ1xuICAvLyBzb21ld2hlcmUgZWxzZS4gU2hvdWxkIHRhbGsgdG8gc2ViYXN0aWFuIGFib3V0IHRoaXMgcGVyaGFwc1xuICBjb25zdCBub2RlID0gZmluZEN1cnJlbnRGaWJlclVzaW5nU2xvd1BhdGgodm5vZGUpO1xuICBzd2l0Y2ggKG5vZGUudGFnKSB7XG4gICAgY2FzZSBGaWJlclRhZ3MuSG9zdFJvb3Q6XG4gICAgICByZXR1cm4gY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCk7XG4gICAgY2FzZSBGaWJlclRhZ3MuSG9zdFBvcnRhbDoge1xuICAgICAgY29uc3Qge1xuICAgICAgICBzdGF0ZU5vZGU6IHsgY29udGFpbmVySW5mbyB9LFxuICAgICAgICBtZW1vaXplZFByb3BzOiBjaGlsZHJlbixcbiAgICAgIH0gPSBub2RlO1xuICAgICAgY29uc3QgcHJvcHMgPSB7IGNvbnRhaW5lckluZm8sIGNoaWxkcmVuIH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ3BvcnRhbCcsXG4gICAgICAgIHR5cGU6IFBvcnRhbCxcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZWQ6IGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpLFxuICAgICAgfTtcbiAgICB9XG4gICAgY2FzZSBGaWJlclRhZ3MuQ2xhc3NDb21wb25lbnQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2NsYXNzJyxcbiAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLm1lbW9pemVkUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBub2RlLnN0YXRlTm9kZSxcbiAgICAgICAgcmVuZGVyZWQ6IGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpLFxuICAgICAgfTtcbiAgICBjYXNlIEZpYmVyVGFncy5GdW5jdGlvbmFsQ29tcG9uZW50OlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5tZW1vaXplZFByb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZWQ6IGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpLFxuICAgICAgfTtcbiAgICBjYXNlIEZpYmVyVGFncy5NZW1vQ2xhc3M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2NsYXNzJyxcbiAgICAgICAgdHlwZTogbm9kZS5lbGVtZW50VHlwZS50eXBlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLm1lbW9pemVkUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBub2RlLnN0YXRlTm9kZSxcbiAgICAgICAgcmVuZGVyZWQ6IGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQuY2hpbGQpLFxuICAgICAgfTtcbiAgICBjYXNlIEZpYmVyVGFncy5NZW1vU0ZDOiB7XG4gICAgICBsZXQgcmVuZGVyZWROb2RlcyA9IGZsYXR0ZW4obm9kZUFuZFNpYmxpbmdzQXJyYXkobm9kZS5jaGlsZCkubWFwKHRvVHJlZSkpO1xuICAgICAgaWYgKHJlbmRlcmVkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJlbmRlcmVkTm9kZXMgPSBbbm9kZS5tZW1vaXplZFByb3BzLmNoaWxkcmVuXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnZnVuY3Rpb24nLFxuICAgICAgICB0eXBlOiBub2RlLmVsZW1lbnRUeXBlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLm1lbW9pemVkUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICByZW5kZXJlZDogcmVuZGVyZWROb2RlcyxcbiAgICAgIH07XG4gICAgfVxuICAgIGNhc2UgRmliZXJUYWdzLkhvc3RDb21wb25lbnQ6IHtcbiAgICAgIGxldCByZW5kZXJlZE5vZGVzID0gZmxhdHRlbihub2RlQW5kU2libGluZ3NBcnJheShub2RlLmNoaWxkKS5tYXAodG9UcmVlKSk7XG4gICAgICBpZiAocmVuZGVyZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmVuZGVyZWROb2RlcyA9IFtub2RlLm1lbW9pemVkUHJvcHMuY2hpbGRyZW5dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdob3N0JyxcbiAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLm1lbW9pemVkUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBub2RlLnN0YXRlTm9kZSxcbiAgICAgICAgcmVuZGVyZWQ6IHJlbmRlcmVkTm9kZXMsXG4gICAgICB9O1xuICAgIH1cbiAgICBjYXNlIEZpYmVyVGFncy5Ib3N0VGV4dDpcbiAgICAgIHJldHVybiBub2RlLm1lbW9pemVkUHJvcHM7XG4gICAgY2FzZSBGaWJlclRhZ3MuRnJhZ21lbnQ6XG4gICAgY2FzZSBGaWJlclRhZ3MuTW9kZTpcbiAgICBjYXNlIEZpYmVyVGFncy5Db250ZXh0UHJvdmlkZXI6XG4gICAgY2FzZSBGaWJlclRhZ3MuQ29udGV4dENvbnN1bWVyOlxuICAgICAgcmV0dXJuIGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpO1xuICAgIGNhc2UgRmliZXJUYWdzLlByb2ZpbGVyOlxuICAgIGNhc2UgRmliZXJUYWdzLkZvcndhcmRSZWY6IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnZnVuY3Rpb24nLFxuICAgICAgICB0eXBlOiBub2RlLnR5cGUsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUucGVuZGluZ1Byb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZWQ6IGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpLFxuICAgICAgfTtcbiAgICB9XG4gICAgY2FzZSBGaWJlclRhZ3MuU3VzcGVuc2U6IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnZnVuY3Rpb24nLFxuICAgICAgICB0eXBlOiBTdXNwZW5zZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5tZW1vaXplZFByb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZWQ6IGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpLFxuICAgICAgfTtcbiAgICB9XG4gICAgY2FzZSBGaWJlclRhZ3MuTGF6eTpcbiAgICAgIHJldHVybiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKTtcbiAgICBjYXNlIEZpYmVyVGFncy5PZmZzY3JlZW5Db21wb25lbnQ6XG4gICAgICByZXR1cm4gdG9UcmVlKG5vZGUuY2hpbGQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuenltZSBJbnRlcm5hbCBFcnJvcjogdW5rbm93biBub2RlIHdpdGggdGFnICR7bm9kZS50YWd9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5Ub1RyZWUobm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBjaGlsZHJlbiA9IG5vZGVBbmRTaWJsaW5nc0FycmF5KG5vZGUpO1xuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB0b1RyZWUoY2hpbGRyZW5bMF0pO1xuICB9XG4gIHJldHVybiBmbGF0dGVuKGNoaWxkcmVuLm1hcCh0b1RyZWUpKTtcbn1cblxuZnVuY3Rpb24gbm9kZVRvSG9zdE5vZGUoX25vZGUpIHtcbiAgLy8gTk9URShsbXIpOiBub2RlIGNvdWxkIGJlIGEgZnVuY3Rpb24gY29tcG9uZW50XG4gIC8vIHdoaWNoIHdvbnQgaGF2ZSBhbiBpbnN0YW5jZSBwcm9wLCBidXQgd2UgY2FuIGdldCB0aGVcbiAgLy8gaG9zdCBub2RlIGFzc29jaWF0ZWQgd2l0aCBpdHMgcmV0dXJuIHZhbHVlIGF0IHRoYXQgcG9pbnQuXG4gIC8vIEFsdGhvdWdoIHRoaXMgYnJlYWtzIGRvd24gaWYgdGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSxcbiAgLy8gYXMgaXMgcG9zc2libGUgd2l0aCBSZWFjdCAxNi5cbiAgbGV0IG5vZGUgPSBfbm9kZTtcbiAgd2hpbGUgKG5vZGUgJiYgIUFycmF5LmlzQXJyYXkobm9kZSkgJiYgbm9kZS5pbnN0YW5jZSA9PT0gbnVsbCkge1xuICAgIG5vZGUgPSBub2RlLnJlbmRlcmVkO1xuICB9XG4gIC8vIGlmIHRoZSBTRkMgcmV0dXJuZWQgbnVsbCBlZmZlY3RpdmVseSwgdGhlcmUgaXMgbm8gaG9zdCBub2RlLlxuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IG1hcHBlciA9IChpdGVtKSA9PiB7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5pbnN0YW5jZSkgcmV0dXJuIFJlYWN0RE9NLmZpbmRET01Ob2RlKGl0ZW0uaW5zdGFuY2UpO1xuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIHJldHVybiBub2RlLm1hcChtYXBwZXIpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUucmVuZGVyZWQpICYmIG5vZGUubm9kZVR5cGUgPT09ICdjbGFzcycpIHtcbiAgICByZXR1cm4gbm9kZS5yZW5kZXJlZC5tYXAobWFwcGVyKTtcbiAgfVxuICByZXR1cm4gbWFwcGVyKG5vZGUpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlTGF6eVdpdGhGYWxsYmFjayhub2RlLCBmYWxsYmFjaykge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIHJldHVybiBub2RlLm1hcCgoZWwpID0+IHJlcGxhY2VMYXp5V2l0aEZhbGxiYWNrKGVsLCBmYWxsYmFjaykpO1xuICB9XG4gIGlmIChpc0xhenkobm9kZS50eXBlKSkge1xuICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuICByZXR1cm4ge1xuICAgIC4uLm5vZGUsXG4gICAgcHJvcHM6IHtcbiAgICAgIC4uLm5vZGUucHJvcHMsXG4gICAgICBjaGlsZHJlbjogcmVwbGFjZUxhenlXaXRoRmFsbGJhY2sobm9kZS5wcm9wcy5jaGlsZHJlbiwgZmFsbGJhY2spLFxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEVtcHR5U3RhdGVWYWx1ZSgpIHtcbiAgLy8gdGhpcyBoYW5kbGVzIGEgYnVnIGluIFJlYWN0IDE2LjAgLSAxNi4yXG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvY29tbWl0LzM5YmU4MzU2NWM2NWY5YzUyMjE1MGU1MjM3NTE2NzU2OGEyYTE0NTlcbiAgLy8gYWxzbyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3B1bGwvMTE5NjVcblxuICBjbGFzcyBFbXB0eVN0YXRlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgY29uc3QgdGVzdFJlbmRlcmVyID0gbmV3IFNoYWxsb3dSZW5kZXJlcigpO1xuICB0ZXN0UmVuZGVyZXIucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRW1wdHlTdGF0ZSkpO1xuICByZXR1cm4gdGVzdFJlbmRlcmVyLl9pbnN0YW5jZS5zdGF0ZTtcbn1cblxuZnVuY3Rpb24gd3JhcEFjdChmbikge1xuICBsZXQgcmV0dXJuVmFsO1xuICBUZXN0VXRpbHMuYWN0KCgpID0+IHtcbiAgICByZXR1cm5WYWwgPSBmbigpO1xuICB9KTtcbiAgcmV0dXJuIHJldHVyblZhbDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvdmlkZXJEZWZhdWx0VmFsdWUoUHJvdmlkZXIpIHtcbiAgLy8gUmVhY3Qgc3RvcmVzIHJlZmVyZW5jZXMgdG8gdGhlIFByb3ZpZGVyJ3MgZGVmYXVsdFZhbHVlIGRpZmZlcmVudGx5IGFjcm9zcyB2ZXJzaW9ucy5cbiAgaWYgKCdfZGVmYXVsdFZhbHVlJyBpbiBQcm92aWRlci5fY29udGV4dCkge1xuICAgIHJldHVybiBQcm92aWRlci5fY29udGV4dC5fZGVmYXVsdFZhbHVlO1xuICB9XG4gIGlmICgnX2N1cnJlbnRWYWx1ZScgaW4gUHJvdmlkZXIuX2NvbnRleHQpIHtcbiAgICByZXR1cm4gUHJvdmlkZXIuX2NvbnRleHQuX2N1cnJlbnRWYWx1ZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0VuenltZSBJbnRlcm5hbCBFcnJvcjogY2Fu4oCZdCBmaWd1cmUgb3V0IGhvdyB0byBnZXQgUHJvdmlkZXLigJlzIGRlZmF1bHQgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gbWFrZUZha2VFbGVtZW50KHR5cGUpIHtcbiAgcmV0dXJuIHsgJCR0eXBlb2Y6IEVsZW1lbnQsIHR5cGUgfTtcbn1cblxuZnVuY3Rpb24gaXNTdGF0ZWZ1bChDb21wb25lbnQpIHtcbiAgcmV0dXJuIChcbiAgICBDb21wb25lbnQucHJvdG90eXBlICYmXG4gICAgKENvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCB8fCBBcnJheS5pc0FycmF5KENvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRQYWlycykpIC8vIGZhbGxiYWNrIGZvciBjcmVhdGVDbGFzcyBjb21wb25lbnRzXG4gICk7XG59XG5cbmNsYXNzIFJlYWN0U2V2ZW50ZWVuQWRhcHRlciBleHRlbmRzIEVuenltZUFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHsgbGlmZWN5Y2xlcyB9ID0gdGhpcy5vcHRpb25zO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIGVuYWJsZUNvbXBvbmVudERpZFVwZGF0ZU9uU2V0U3RhdGU6IHRydWUsIC8vIFRPRE86IHJlbW92ZSwgc2VtdmVyLW1ham9yXG4gICAgICBsZWdhY3lDb250ZXh0TW9kZTogJ3BhcmVudCcsXG4gICAgICBsaWZlY3ljbGVzOiB7XG4gICAgICAgIC4uLmxpZmVjeWNsZXMsXG4gICAgICAgIGNvbXBvbmVudERpZFVwZGF0ZToge1xuICAgICAgICAgIG9uU2V0U3RhdGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wczoge1xuICAgICAgICAgIGhhc1Nob3VsZENvbXBvbmVudFVwZGF0ZUJ1ZzogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGdldFNuYXBzaG90QmVmb3JlVXBkYXRlOiB0cnVlLFxuICAgICAgICBzZXRTdGF0ZToge1xuICAgICAgICAgIHNraXBzQ29tcG9uZW50RGlkVXBkYXRlT25OdWxsaXNoOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBnZXRDaGlsZENvbnRleHQ6IHtcbiAgICAgICAgICBjYWxsZWRCeVJlbmRlcmVyOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yOiB0cnVlLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlTW91bnRSZW5kZXJlcihvcHRpb25zKSB7XG4gICAgYXNzZXJ0RG9tQXZhaWxhYmxlKCdtb3VudCcpO1xuICAgIGlmIChoYXMob3B0aW9ucywgJ3N1c3BlbnNlRmFsbGJhY2snKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHN1c3BlbnNlRmFsbGJhY2tgIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBtb3VudGAgcmVuZGVyZXInKTtcbiAgICB9XG4gICAgaWYgKEZpYmVyVGFncyA9PT0gbnVsbCkge1xuICAgICAgLy8gUmVxdWlyZXMgRE9NLlxuICAgICAgRmliZXJUYWdzID0gZGV0ZWN0RmliZXJUYWdzKCk7XG4gICAgfVxuICAgIGNvbnN0IHsgYXR0YWNoVG8sIGh5ZHJhdGVJbiwgd3JhcHBpbmdDb21wb25lbnRQcm9wcyB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBkb21Ob2RlID0gaHlkcmF0ZUluIHx8IGF0dGFjaFRvIHx8IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBudWxsO1xuICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzO1xuICAgIHJldHVybiB7XG4gICAgICByZW5kZXIoZWwsIGNvbnRleHQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB3cmFwQWN0KCgpID0+IHtcbiAgICAgICAgICBpZiAoaW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgcHJvcHMsIHJlZiB9ID0gZWw7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyUHJvcHMgPSB7XG4gICAgICAgICAgICAgIENvbXBvbmVudDogdHlwZSxcbiAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgIHdyYXBwaW5nQ29tcG9uZW50UHJvcHMsXG4gICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgIC4uLihyZWYgJiYgeyByZWZQcm9wOiByZWYgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgUmVhY3RXcmFwcGVyQ29tcG9uZW50ID0gY3JlYXRlTW91bnRXcmFwcGVyKGVsLCB7IC4uLm9wdGlvbnMsIGFkYXB0ZXIgfSk7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVkRWwgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0V3JhcHBlckNvbXBvbmVudCwgd3JhcHBlclByb3BzKTtcbiAgICAgICAgICAgIGluc3RhbmNlID0gaHlkcmF0ZUluXG4gICAgICAgICAgICAgID8gUmVhY3RET00uaHlkcmF0ZSh3cmFwcGVkRWwsIGRvbU5vZGUpXG4gICAgICAgICAgICAgIDogUmVhY3RET00ucmVuZGVyKHdyYXBwZWRFbCwgZG9tTm9kZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnNldENoaWxkUHJvcHMoZWwucHJvcHMsIGNvbnRleHQsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVubW91bnQoKSB7XG4gICAgICAgIHdyYXBBY3QoKCkgPT4ge1xuICAgICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZG9tTm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpbnN0YW5jZSA9IG51bGw7XG4gICAgICB9LFxuICAgICAgZ2V0Tm9kZSgpIHtcbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXROb2RlRnJvbVJvb3RGaW5kZXIoXG4gICAgICAgICAgYWRhcHRlci5pc0N1c3RvbUNvbXBvbmVudCxcbiAgICAgICAgICB0b1RyZWUoaW5zdGFuY2UuX3JlYWN0SW50ZXJuYWxzKSxcbiAgICAgICAgICBvcHRpb25zLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIHNpbXVsYXRlRXJyb3Iobm9kZUhpZXJhcmNoeSwgcm9vdE5vZGUsIGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGlzRXJyb3JCb3VuZGFyeSA9ICh7IGluc3RhbmNlOiBlbEluc3RhbmNlLCB0eXBlIH0pID0+IHtcbiAgICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlbEluc3RhbmNlICYmIGVsSW5zdGFuY2UuY29tcG9uZW50RGlkQ2F0Y2g7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZTogY2F0Y2hpbmdJbnN0YW5jZSwgdHlwZTogY2F0Y2hpbmdUeXBlIH0gPVxuICAgICAgICAgIG5vZGVIaWVyYXJjaHkuZmluZChpc0Vycm9yQm91bmRhcnkpIHx8IHt9O1xuXG4gICAgICAgIHNpbXVsYXRlRXJyb3IoXG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgY2F0Y2hpbmdJbnN0YW5jZSxcbiAgICAgICAgICByb290Tm9kZSxcbiAgICAgICAgICBub2RlSGllcmFyY2h5LFxuICAgICAgICAgIG5vZGVUeXBlRnJvbVR5cGUsXG4gICAgICAgICAgYWRhcHRlci5kaXNwbGF5TmFtZU9mTm9kZSxcbiAgICAgICAgICBjYXRjaGluZ1R5cGUsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgc2ltdWxhdGVFdmVudChub2RlLCBldmVudCwgbW9jaykge1xuICAgICAgICBjb25zdCBtYXBwZWRFdmVudCA9IG1hcE5hdGl2ZUV2ZW50TmFtZXMoZXZlbnQpO1xuICAgICAgICBjb25zdCBldmVudEZuID0gVGVzdFV0aWxzLlNpbXVsYXRlW21hcHBlZEV2ZW50XTtcbiAgICAgICAgaWYgKCFldmVudEZuKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgUmVhY3RXcmFwcGVyOjpzaW11bGF0ZSgpIGV2ZW50ICcke2V2ZW50fScgZG9lcyBub3QgZXhpc3RgKTtcbiAgICAgICAgfVxuICAgICAgICB3cmFwQWN0KCgpID0+IHtcbiAgICAgICAgICBldmVudEZuKGFkYXB0ZXIubm9kZVRvSG9zdE5vZGUobm9kZSksIG1vY2spO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBiYXRjaGVkVXBkYXRlcyhmbikge1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgICAgLy8gcmV0dXJuIFJlYWN0RE9NLnVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzKGZuKTtcbiAgICAgIH0sXG4gICAgICBnZXRXcmFwcGluZ0NvbXBvbmVudFJlbmRlcmVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRoaXMsXG4gICAgICAgICAgLi4uZ2V0V3JhcHBpbmdDb21wb25lbnRNb3VudFJlbmRlcmVyKHtcbiAgICAgICAgICAgIHRvVHJlZTogKGluc3QpID0+IHRvVHJlZShpbnN0Ll9yZWFjdEludGVybmFscyksXG4gICAgICAgICAgICBnZXRNb3VudFdyYXBwZXJJbnN0YW5jZTogKCkgPT4gaW5zdGFuY2UsXG4gICAgICAgICAgfSksXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JhcEludm9rZTogd3JhcEFjdCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlU2hhbGxvd1JlbmRlcmVyKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzO1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFNoYWxsb3dSZW5kZXJlcigpO1xuICAgIGNvbnN0IHsgc3VzcGVuc2VGYWxsYmFjayB9ID0gb3B0aW9ucztcbiAgICBpZiAodHlwZW9mIHN1c3BlbnNlRmFsbGJhY2sgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBzdXNwZW5zZUZhbGxiYWNrICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignYG9wdGlvbnMuc3VzcGVuc2VGYWxsYmFja2Agc2hvdWxkIGJlIGJvb2xlYW4gb3IgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIGxldCBpc0RPTSA9IGZhbHNlO1xuICAgIGxldCBjYWNoZWROb2RlID0gbnVsbDtcblxuICAgIGxldCBsYXN0Q29tcG9uZW50ID0gbnVsbDtcbiAgICBsZXQgd3JhcHBlZENvbXBvbmVudCA9IG51bGw7XG4gICAgY29uc3Qgc2VudGluZWwgPSB7fTtcblxuICAgIC8vIHdyYXAgbWVtbyBjb21wb25lbnRzIHdpdGggYSBQdXJlQ29tcG9uZW50LCBvciBhIGNsYXNzIGNvbXBvbmVudCB3aXRoIHNDVVxuICAgIGNvbnN0IHdyYXBQdXJlQ29tcG9uZW50ID0gKENvbXBvbmVudCwgY29tcGFyZSkgPT4ge1xuICAgICAgaWYgKGxhc3RDb21wb25lbnQgIT09IENvbXBvbmVudCkge1xuICAgICAgICBpZiAoaXNTdGF0ZWZ1bChDb21wb25lbnQpKSB7XG4gICAgICAgICAgd3JhcHBlZENvbXBvbmVudCA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IHt9O1xuICAgICAgICAgIGlmIChjb21wYXJlKSB7XG4gICAgICAgICAgICB3cmFwcGVkQ29tcG9uZW50LnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGUgPSAobmV4dFByb3BzKSA9PlxuICAgICAgICAgICAgICAhY29tcGFyZSh0aGlzLnByb3BzLCBuZXh0UHJvcHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3cmFwcGVkQ29tcG9uZW50LnByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBtZW1vaXplZCA9IHNlbnRpbmVsO1xuICAgICAgICAgIGxldCBwcmV2UHJvcHM7XG4gICAgICAgICAgd3JhcHBlZENvbXBvbmVudCA9IGZ1bmN0aW9uIHdyYXBwZWRDb21wb25lbnRGbihwcm9wcywgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkVXBkYXRlID1cbiAgICAgICAgICAgICAgbWVtb2l6ZWQgPT09IHNlbnRpbmVsIHx8XG4gICAgICAgICAgICAgIChjb21wYXJlID8gIWNvbXBhcmUocHJldlByb3BzLCBwcm9wcykgOiAhc2hhbGxvd0VxdWFsKHByZXZQcm9wcywgcHJvcHMpKTtcbiAgICAgICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICAgICAgbWVtb2l6ZWQgPSBDb21wb25lbnQoeyAuLi5Db21wb25lbnQuZGVmYXVsdFByb3BzLCAuLi5wcm9wcyB9LCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgcHJldlByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVtb2l6ZWQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3QuYXNzaWduKHdyYXBwZWRDb21wb25lbnQsIENvbXBvbmVudCwge1xuICAgICAgICAgIGRpc3BsYXlOYW1lOiBhZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKHsgdHlwZTogQ29tcG9uZW50IH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgbGFzdENvbXBvbmVudCA9IENvbXBvbmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB3cmFwcGVkQ29tcG9uZW50O1xuICAgIH07XG5cbiAgICAvLyBXcmFwIGZ1bmN0aW9uYWwgY29tcG9uZW50cyBvbiB2ZXJzaW9ucyBwcmlvciB0byAxNi41LFxuICAgIC8vIHRvIGF2b2lkIGluYWR2ZXJ0ZW50bHkgcGFzcyBhIGB0aGlzYCBpbnN0YW5jZSB0byBpdC5cbiAgICBjb25zdCB3cmFwRnVuY3Rpb25hbENvbXBvbmVudCA9IChDb21wb25lbnQpID0+IHtcbiAgICAgIGlmIChoYXMoQ29tcG9uZW50LCAnZGVmYXVsdFByb3BzJykpIHtcbiAgICAgICAgaWYgKGxhc3RDb21wb25lbnQgIT09IENvbXBvbmVudCkge1xuICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgKHByb3BzLCAuLi5hcmdzKSA9PiBDb21wb25lbnQoeyAuLi5Db21wb25lbnQuZGVmYXVsdFByb3BzLCAuLi5wcm9wcyB9LCAuLi5hcmdzKSxcbiAgICAgICAgICAgIENvbXBvbmVudCxcbiAgICAgICAgICAgIHsgZGlzcGxheU5hbWU6IGFkYXB0ZXIuZGlzcGxheU5hbWVPZk5vZGUoeyB0eXBlOiBDb21wb25lbnQgfSkgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGxhc3RDb21wb25lbnQgPSBDb21wb25lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdyYXBwZWRDb21wb25lbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlckVsZW1lbnQgPSAoZWxDb25maWcsIC4uLnJlc3QpID0+IHtcbiAgICAgIGNvbnN0IHJlbmRlcmVkRWwgPSByZW5kZXJlci5yZW5kZXIoZWxDb25maWcsIC4uLnJlc3QpO1xuXG4gICAgICBjb25zdCB0eXBlSXNFeGlzdGVkID0gISEocmVuZGVyZWRFbCAmJiByZW5kZXJlZEVsLnR5cGUpO1xuICAgICAgaWYgKHR5cGVJc0V4aXN0ZWQpIHtcbiAgICAgICAgY29uc3QgY2xvbmVkRWwgPSBjaGVja0lzU3VzcGVuc2VBbmRDbG9uZUVsZW1lbnQocmVuZGVyZWRFbCwgeyBzdXNwZW5zZUZhbGxiYWNrIH0pO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRJc0NoYW5nZWQgPSBjbG9uZWRFbC50eXBlICE9PSByZW5kZXJlZEVsLnR5cGU7XG4gICAgICAgIGlmIChlbGVtZW50SXNDaGFuZ2VkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlcmVyLnJlbmRlcih7IC4uLmVsQ29uZmlnLCB0eXBlOiBjbG9uZWRFbC50eXBlIH0sIC4uLnJlc3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZW5kZXJlZEVsO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVuZGVyKGVsLCB1bm1hc2tlZENvbnRleHQsIHsgcHJvdmlkZXJWYWx1ZXMgPSBuZXcgTWFwKCkgfSA9IHt9KSB7XG4gICAgICAgIGNhY2hlZE5vZGUgPSBlbDtcbiAgICAgICAgaWYgKHR5cGVvZiBlbC50eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlzRE9NID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0NvbnRleHRQcm92aWRlcihlbCkpIHtcbiAgICAgICAgICBwcm92aWRlclZhbHVlcy5zZXQoZWwudHlwZSwgZWwucHJvcHMudmFsdWUpO1xuICAgICAgICAgIGNvbnN0IE1vY2tQcm92aWRlciA9IE9iamVjdC5hc3NpZ24oKHByb3BzKSA9PiBwcm9wcy5jaGlsZHJlbiwgZWwudHlwZSk7XG4gICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4gcmVuZGVyRWxlbWVudCh7IC4uLmVsLCB0eXBlOiBNb2NrUHJvdmlkZXIgfSkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQ29udGV4dENvbnN1bWVyKGVsKSkge1xuICAgICAgICAgIGNvbnN0IFByb3ZpZGVyID0gYWRhcHRlci5nZXRQcm92aWRlckZyb21Db25zdW1lcihlbC50eXBlKTtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHByb3ZpZGVyVmFsdWVzLmhhcyhQcm92aWRlcilcbiAgICAgICAgICAgID8gcHJvdmlkZXJWYWx1ZXMuZ2V0KFByb3ZpZGVyKVxuICAgICAgICAgICAgOiBnZXRQcm92aWRlckRlZmF1bHRWYWx1ZShQcm92aWRlcik7XG4gICAgICAgICAgY29uc3QgTW9ja0NvbnN1bWVyID0gT2JqZWN0LmFzc2lnbigocHJvcHMpID0+IHByb3BzLmNoaWxkcmVuKHZhbHVlKSwgZWwudHlwZSk7XG4gICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4gcmVuZGVyRWxlbWVudCh7IC4uLmVsLCB0eXBlOiBNb2NrQ29uc3VtZXIgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRE9NID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHJlbmRlcmVkRWwgPSBlbDtcbiAgICAgICAgICBpZiAoaXNMYXp5KHJlbmRlcmVkRWwpKSB7XG4gICAgICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ2BSZWFjdC5sYXp5YCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHNoYWxsb3cgcmVuZGVyaW5nLicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlbmRlcmVkRWwgPSBjaGVja0lzU3VzcGVuc2VBbmRDbG9uZUVsZW1lbnQocmVuZGVyZWRFbCwgeyBzdXNwZW5zZUZhbGxiYWNrIH0pO1xuICAgICAgICAgIGNvbnN0IHsgdHlwZTogQ29tcG9uZW50IH0gPSByZW5kZXJlZEVsO1xuXG4gICAgICAgICAgY29uc3QgY29udGV4dCA9IGdldE1hc2tlZENvbnRleHQoQ29tcG9uZW50LmNvbnRleHRUeXBlcywgdW5tYXNrZWRDb250ZXh0KTtcblxuICAgICAgICAgIGlmIChpc01lbW8oZWwudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZTogSW5uZXJDb21wLCBjb21wYXJlIH0gPSBlbC50eXBlO1xuXG4gICAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PlxuICAgICAgICAgICAgICByZW5kZXJFbGVtZW50KHsgLi4uZWwsIHR5cGU6IHdyYXBQdXJlQ29tcG9uZW50KElubmVyQ29tcCwgY29tcGFyZSkgfSwgY29udGV4dCksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGlzQ29tcG9uZW50U3RhdGVmdWwgPSBpc1N0YXRlZnVsKENvbXBvbmVudCk7XG5cbiAgICAgICAgICBpZiAoIWlzQ29tcG9uZW50U3RhdGVmdWwgJiYgdHlwZW9mIENvbXBvbmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT5cbiAgICAgICAgICAgICAgcmVuZGVyRWxlbWVudCh7IC4uLnJlbmRlcmVkRWwsIHR5cGU6IHdyYXBGdW5jdGlvbmFsQ29tcG9uZW50KENvbXBvbmVudCkgfSwgY29udGV4dCksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0NvbXBvbmVudFN0YXRlZnVsKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHJlbmRlcmVyLl9pbnN0YW5jZSAmJlxuICAgICAgICAgICAgICBlbC5wcm9wcyA9PT0gcmVuZGVyZXIuX2luc3RhbmNlLnByb3BzICYmXG4gICAgICAgICAgICAgICFzaGFsbG93RXF1YWwoY29udGV4dCwgcmVuZGVyZXIuX2luc3RhbmNlLmNvbnRleHQpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29uc3QgeyByZXN0b3JlIH0gPSBzcHlNZXRob2QoXG4gICAgICAgICAgICAgICAgcmVuZGVyZXIsXG4gICAgICAgICAgICAgICAgJ191cGRhdGVDbGFzc0NvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgKG9yaWdpbmFsTWV0aG9kKSA9PlxuICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZUNsYXNzQ29tcG9uZW50KC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcm9wcyB9ID0gcmVuZGVyZXIuX2luc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbG9uZWRQcm9wcyA9IHsgLi4ucHJvcHMgfTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuX2luc3RhbmNlLnByb3BzID0gY2xvbmVkUHJvcHM7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gb3JpZ2luYWxNZXRob2QuYXBwbHkocmVuZGVyZXIsIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLl9pbnN0YW5jZS5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgICAgICAgICByZXN0b3JlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpeCByZWFjdCBidWc7IHNlZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0RW1wdHlTdGF0ZVZhbHVlYFxuICAgICAgICAgICAgY29uc3QgZW1wdHlTdGF0ZVZhbHVlID0gZ2V0RW1wdHlTdGF0ZVZhbHVlKCk7XG4gICAgICAgICAgICBpZiAoZW1wdHlTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCAnc3RhdGUnLCB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gZW1wdHlTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc3RhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiByZW5kZXJFbGVtZW50KHJlbmRlcmVkRWwsIGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVubW91bnQoKSB7XG4gICAgICAgIHJlbmRlcmVyLnVubW91bnQoKTtcbiAgICAgIH0sXG4gICAgICBnZXROb2RlKCkge1xuICAgICAgICBpZiAoaXNET00pIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudFRvVHJlZShjYWNoZWROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvdXRwdXQgPSByZW5kZXJlci5nZXRSZW5kZXJPdXRwdXQoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBub2RlVHlwZTogbm9kZVR5cGVGcm9tVHlwZShjYWNoZWROb2RlLnR5cGUpLFxuICAgICAgICAgIHR5cGU6IGNhY2hlZE5vZGUudHlwZSxcbiAgICAgICAgICBwcm9wczogY2FjaGVkTm9kZS5wcm9wcyxcbiAgICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKGNhY2hlZE5vZGUua2V5KSxcbiAgICAgICAgICByZWY6IGNhY2hlZE5vZGUucmVmLFxuICAgICAgICAgIGluc3RhbmNlOiByZW5kZXJlci5faW5zdGFuY2UsXG4gICAgICAgICAgcmVuZGVyZWQ6IEFycmF5LmlzQXJyYXkob3V0cHV0KVxuICAgICAgICAgICAgPyBmbGF0dGVuKG91dHB1dCkubWFwKChlbCkgPT4gZWxlbWVudFRvVHJlZShlbCkpXG4gICAgICAgICAgICA6IGVsZW1lbnRUb1RyZWUob3V0cHV0KSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzaW11bGF0ZUVycm9yKG5vZGVIaWVyYXJjaHksIHJvb3ROb2RlLCBlcnJvcikge1xuICAgICAgICBzaW11bGF0ZUVycm9yKFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIHJlbmRlcmVyLl9pbnN0YW5jZSxcbiAgICAgICAgICBjYWNoZWROb2RlLFxuICAgICAgICAgIG5vZGVIaWVyYXJjaHkuY29uY2F0KGNhY2hlZE5vZGUpLFxuICAgICAgICAgIG5vZGVUeXBlRnJvbVR5cGUsXG4gICAgICAgICAgYWRhcHRlci5kaXNwbGF5TmFtZU9mTm9kZSxcbiAgICAgICAgICBjYWNoZWROb2RlLnR5cGUsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgc2ltdWxhdGVFdmVudChub2RlLCBldmVudCwgLi4uYXJncykge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gbm9kZS5wcm9wc1twcm9wRnJvbUV2ZW50KGV2ZW50KV07XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPKGxtcik6IGNyZWF0ZS91c2Ugc3ludGhldGljIGV2ZW50c1xuICAgICAgICAgICAgLy8gVE9ETyhsbXIpOiBlbXVsYXRlIFJlYWN0J3MgZXZlbnQgcHJvcGFnYXRpb25cbiAgICAgICAgICAgIC8vIFJlYWN0RE9NLnVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzKCgpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZXIoLi4uYXJncyk7XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGJhdGNoZWRVcGRhdGVzKGZuKSB7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgICAvLyByZXR1cm4gUmVhY3RET00udW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMoZm4pO1xuICAgICAgfSxcbiAgICAgIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgaGllcmFyY2h5KSB7XG4gICAgICAgIHJldHVybiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGRpc3BsYXlOYW1lT2ZOb2RlKGNhY2hlZE5vZGUpLCAoKSA9PlxuICAgICAgICAgIGdldENvbXBvbmVudFN0YWNrKGhpZXJhcmNoeS5jb25jYXQoW2NhY2hlZE5vZGVdKSksXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVTdHJpbmdSZW5kZXJlcihvcHRpb25zKSB7XG4gICAgaWYgKGhhcyhvcHRpb25zLCAnc3VzcGVuc2VGYWxsYmFjaycpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnYHN1c3BlbnNlRmFsbGJhY2tgIHNob3VsZCBub3QgYmUgc3BlY2lmaWVkIGluIG9wdGlvbnMgb2Ygc3RyaW5nIHJlbmRlcmVyJyxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICByZW5kZXIoZWwsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiAoZWwudHlwZS5jb250ZXh0VHlwZXMgfHwgb3B0aW9ucy5jaGlsZENvbnRleHRUeXBlcykpIHtcbiAgICAgICAgICBjb25zdCBjaGlsZENvbnRleHRUeXBlcyA9IHtcbiAgICAgICAgICAgIC4uLihlbC50eXBlLmNvbnRleHRUeXBlcyB8fCB7fSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLmNoaWxkQ29udGV4dFR5cGVzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgQ29udGV4dFdyYXBwZXIgPSBjcmVhdGVSZW5kZXJXcmFwcGVyKGVsLCBjb250ZXh0LCBjaGlsZENvbnRleHRUeXBlcyk7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0RE9NU2VydmVyLnJlbmRlclRvU3RhdGljTWFya3VwKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udGV4dFdyYXBwZXIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3RET01TZXJ2ZXIucmVuZGVyVG9TdGF0aWNNYXJrdXAoZWwpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLy8gUHJvdmlkZWQgYSBiYWcgb2Ygb3B0aW9ucywgcmV0dXJuIGFuIGBFbnp5bWVSZW5kZXJlcmAuIFNvbWUgb3B0aW9ucyBjYW4gYmUgaW1wbGVtZW50YXRpb25cbiAgLy8gc3BlY2lmaWMsIGxpa2UgYGF0dGFjaGAgZXRjLiBmb3IgUmVhY3QsIGJ1dCBub3QgcGFydCBvZiB0aGlzIGludGVyZmFjZSBleHBsaWNpdGx5LlxuICBjcmVhdGVSZW5kZXJlcihvcHRpb25zKSB7XG4gICAgc3dpdGNoIChvcHRpb25zLm1vZGUpIHtcbiAgICAgIGNhc2UgRW56eW1lQWRhcHRlci5NT0RFUy5NT1VOVDpcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTW91bnRSZW5kZXJlcihvcHRpb25zKTtcbiAgICAgIGNhc2UgRW56eW1lQWRhcHRlci5NT0RFUy5TSEFMTE9XOlxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVTaGFsbG93UmVuZGVyZXIob3B0aW9ucyk7XG4gICAgICBjYXNlIEVuenltZUFkYXB0ZXIuTU9ERVMuU1RSSU5HOlxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVTdHJpbmdSZW5kZXJlcihvcHRpb25zKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRW56eW1lIEludGVybmFsIEVycm9yOiBVbnJlY29nbml6ZWQgbW9kZTogJHtvcHRpb25zLm1vZGV9YCk7XG4gICAgfVxuICB9XG5cbiAgd3JhcChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHdyYXAoZWxlbWVudCk7XG4gIH1cblxuICAvLyBjb252ZXJ0cyBhbiBSU1ROb2RlIHRvIHRoZSBjb3JyZXNwb25kaW5nIEpTWCBQcmFnbWEgRWxlbWVudC4gVGhpcyB3aWxsIGJlIG5lZWRlZFxuICAvLyBpbiBvcmRlciB0byBpbXBsZW1lbnQgdGhlIGBXcmFwcGVyLm1vdW50KClgIGFuZCBgV3JhcHBlci5zaGFsbG93KClgIG1ldGhvZHMsIGJ1dCBzaG91bGRcbiAgLy8gYmUgcHJldHR5IHN0cmFpZ2h0Zm9yd2FyZCBmb3IgcGVvcGxlIHRvIGltcGxlbWVudC5cbiAgbm9kZVRvRWxlbWVudChub2RlKSB7XG4gICAgaWYgKCFub2RlIHx8IHR5cGVvZiBub2RlICE9PSAnb2JqZWN0JykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBub2RlO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KHVubWVtb1R5cGUodHlwZSksIHByb3BzV2l0aEtleXNBbmRSZWYobm9kZSkpO1xuICB9XG5cbiAgbWF0Y2hlc0VsZW1lbnRUeXBlKG5vZGUsIG1hdGNoaW5nVHlwZSkge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGNvbnN0IHsgdHlwZSB9ID0gbm9kZTtcbiAgICByZXR1cm4gdW5tZW1vVHlwZSh0eXBlKSA9PT0gdW5tZW1vVHlwZShtYXRjaGluZ1R5cGUpO1xuICB9XG5cbiAgZWxlbWVudFRvTm9kZShlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnRUb1RyZWUoZWxlbWVudCk7XG4gIH1cblxuICBub2RlVG9Ib3N0Tm9kZShub2RlLCBzdXBwb3J0c0FycmF5ID0gZmFsc2UpIHtcbiAgICBjb25zdCBub2RlcyA9IG5vZGVUb0hvc3ROb2RlKG5vZGUpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGVzKSAmJiAhc3VwcG9ydHNBcnJheSkge1xuICAgICAgLy8gZ2V0IHRoZSBmaXJzdCBub24tbnVsbCBub2RlXG4gICAgICByZXR1cm4gbm9kZXMuZmlsdGVyKEJvb2xlYW4pWzBdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICBkaXNwbGF5TmFtZU9mTm9kZShub2RlKSB7XG4gICAgaWYgKCFub2RlKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCB7IHR5cGUsICQkdHlwZW9mIH0gPSBub2RlO1xuICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzO1xuXG4gICAgY29uc3Qgbm9kZVR5cGUgPSB0eXBlIHx8ICQkdHlwZW9mO1xuXG4gICAgLy8gbmV3ZXIgbm9kZSB0eXBlcyBtYXkgYmUgdW5kZWZpbmVkLCBzbyBvbmx5IHRlc3QgaWYgdGhlIG5vZGVUeXBlIGV4aXN0c1xuICAgIGlmIChub2RlVHlwZSkge1xuICAgICAgc3dpdGNoIChub2RlVHlwZSkge1xuICAgICAgICBjYXNlIENvbmN1cnJlbnRNb2RlIHx8IE5hTjpcbiAgICAgICAgICByZXR1cm4gJ0NvbmN1cnJlbnRNb2RlJztcbiAgICAgICAgY2FzZSBGcmFnbWVudCB8fCBOYU46XG4gICAgICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG4gICAgICAgIGNhc2UgU3RyaWN0TW9kZSB8fCBOYU46XG4gICAgICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcbiAgICAgICAgY2FzZSBQcm9maWxlciB8fCBOYU46XG4gICAgICAgICAgcmV0dXJuICdQcm9maWxlcic7XG4gICAgICAgIGNhc2UgUG9ydGFsIHx8IE5hTjpcbiAgICAgICAgICByZXR1cm4gJ1BvcnRhbCc7XG4gICAgICAgIGNhc2UgU3VzcGVuc2UgfHwgTmFOOlxuICAgICAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0ICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcblxuICAgIHN3aXRjaCAoJCR0eXBlb2ZUeXBlKSB7XG4gICAgICBjYXNlIENvbnRleHRDb25zdW1lciB8fCBOYU46XG4gICAgICAgIHJldHVybiAnQ29udGV4dENvbnN1bWVyJztcbiAgICAgIGNhc2UgQ29udGV4dFByb3ZpZGVyIHx8IE5hTjpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0UHJvdmlkZXInO1xuICAgICAgY2FzZSBNZW1vIHx8IE5hTjoge1xuICAgICAgICBjb25zdCBub2RlTmFtZSA9IGRpc3BsYXlOYW1lT2ZOb2RlKG5vZGUpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG5vZGVOYW1lID09PSAnc3RyaW5nJyA/IG5vZGVOYW1lIDogYE1lbW8oJHthZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKHR5cGUpfSlgO1xuICAgICAgfVxuICAgICAgY2FzZSBGb3J3YXJkUmVmIHx8IE5hTjoge1xuICAgICAgICBpZiAodHlwZS5kaXNwbGF5TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBhZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKHsgdHlwZTogdHlwZS5yZW5kZXIgfSk7XG4gICAgICAgIHJldHVybiBuYW1lID8gYEZvcndhcmRSZWYoJHtuYW1lfSlgIDogJ0ZvcndhcmRSZWYnO1xuICAgICAgfVxuICAgICAgY2FzZSBMYXp5IHx8IE5hTjoge1xuICAgICAgICByZXR1cm4gJ2xhenknO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRpc3BsYXlOYW1lT2ZOb2RlKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGlzVmFsaWRFbGVtZW50KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50KGVsZW1lbnQpO1xuICB9XG5cbiAgaXNWYWxpZEVsZW1lbnRUeXBlKG9iamVjdCkge1xuICAgIHJldHVybiAhIW9iamVjdCAmJiBpc1ZhbGlkRWxlbWVudFR5cGUob2JqZWN0KTtcbiAgfVxuXG4gIGlzRnJhZ21lbnQoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gdHlwZU9mTm9kZShmcmFnbWVudCkgPT09IEZyYWdtZW50O1xuICB9XG5cbiAgaXNDdXN0b21Db21wb25lbnQodHlwZSkge1xuICAgIGNvbnN0IGZha2VFbGVtZW50ID0gbWFrZUZha2VFbGVtZW50KHR5cGUpO1xuICAgIHJldHVybiAoXG4gICAgICAhIXR5cGUgJiZcbiAgICAgICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICBpc0ZvcndhcmRSZWYoZmFrZUVsZW1lbnQpIHx8XG4gICAgICAgIGlzQ29udGV4dFByb3ZpZGVyKGZha2VFbGVtZW50KSB8fFxuICAgICAgICBpc0NvbnRleHRDb25zdW1lcihmYWtlRWxlbWVudCkgfHxcbiAgICAgICAgaXNTdXNwZW5zZShmYWtlRWxlbWVudCkpXG4gICAgKTtcbiAgfVxuXG4gIGlzQ29udGV4dENvbnN1bWVyKHR5cGUpIHtcbiAgICByZXR1cm4gISF0eXBlICYmIGlzQ29udGV4dENvbnN1bWVyKG1ha2VGYWtlRWxlbWVudCh0eXBlKSk7XG4gIH1cblxuICBpc0N1c3RvbUNvbXBvbmVudEVsZW1lbnQoaW5zdCkge1xuICAgIGlmICghaW5zdCB8fCAhdGhpcy5pc1ZhbGlkRWxlbWVudChpbnN0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pc0N1c3RvbUNvbXBvbmVudChpbnN0LnR5cGUpO1xuICB9XG5cbiAgZ2V0UHJvdmlkZXJGcm9tQ29uc3VtZXIoQ29uc3VtZXIpIHtcbiAgICAvLyBSZWFjdCBzdG9yZXMgcmVmZXJlbmNlcyB0byB0aGUgUHJvdmlkZXIgb24gYSBDb25zdW1lciBkaWZmZXJlbnRseSBhY3Jvc3MgdmVyc2lvbnMuXG4gICAgaWYgKENvbnN1bWVyKSB7XG4gICAgICBsZXQgUHJvdmlkZXI7XG4gICAgICBpZiAoQ29uc3VtZXIuX2NvbnRleHQpIHtcbiAgICAgICAgLy8gY2hlY2sgdGhpcyBmaXJzdCwgdG8gYXZvaWQgYSBkZXByZWNhdGlvbiB3YXJuaW5nXG4gICAgICAgICh7IFByb3ZpZGVyIH0gPSBDb25zdW1lci5fY29udGV4dCk7XG4gICAgICB9IGVsc2UgaWYgKENvbnN1bWVyLlByb3ZpZGVyKSB7XG4gICAgICAgICh7IFByb3ZpZGVyIH0gPSBDb25zdW1lcik7XG4gICAgICB9XG4gICAgICBpZiAoUHJvdmlkZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb3ZpZGVyO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VuenltZSBJbnRlcm5hbCBFcnJvcjogY2Fu4oCZdCBmaWd1cmUgb3V0IGhvdyB0byBnZXQgUHJvdmlkZXIgZnJvbSBDb25zdW1lcicpO1xuICB9XG5cbiAgY3JlYXRlRWxlbWVudCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoLi4uYXJncyk7XG4gIH1cblxuICB3cmFwV2l0aFdyYXBwaW5nQ29tcG9uZW50KG5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgUm9vdEZpbmRlcixcbiAgICAgIG5vZGU6IHdyYXBXaXRoV3JhcHBpbmdDb21wb25lbnQoUmVhY3QuY3JlYXRlRWxlbWVudCwgbm9kZSwgb3B0aW9ucyksXG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0U2V2ZW50ZWVuQWRhcHRlcjtcbiJdLCJtYXBwaW5n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
//# sourceMappingURL=ReactSeventeenAdapter.js.map
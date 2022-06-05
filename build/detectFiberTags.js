"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _enzymeAdapterUtils = require("@wojtekmaj/enzyme-adapter-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function getFiber(element) {
  var container = global.document.createElement('div');
  var inst = null;

  var Tester = /*#__PURE__*/function (_React$Component) {
    _inherits(Tester, _React$Component);

    var _super = _createSuper(Tester);

    function Tester() {
      _classCallCheck(this, Tester);

      return _super.apply(this, arguments);
    }

    _createClass(Tester, [{
      key: "render",
      value: function render() {
        inst = this;
        return element;
      }
    }]);

    return Tester;
  }(_react["default"].Component);

  _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(Tester), container);

  return inst._reactInternals.child;
}

function getLazyFiber(LazyComponent) {
  var container = global.document.createElement('div');
  var inst = null;

  var Tester = /*#__PURE__*/function (_React$Component2) {
    _inherits(Tester, _React$Component2);

    var _super2 = _createSuper(Tester);

    function Tester() {
      _classCallCheck(this, Tester);

      return _super2.apply(this, arguments);
    }

    _createClass(Tester, [{
      key: "render",
      value: function render() {
        inst = this;
        return /*#__PURE__*/_react["default"].createElement(LazyComponent);
      }
    }]);

    return Tester;
  }(_react["default"].Component);

  var SuspenseWrapper = /*#__PURE__*/function (_React$Component3) {
    _inherits(SuspenseWrapper, _React$Component3);

    var _super3 = _createSuper(SuspenseWrapper);

    function SuspenseWrapper() {
      _classCallCheck(this, SuspenseWrapper);

      return _super3.apply(this, arguments);
    }

    _createClass(SuspenseWrapper, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Suspense, {
          fallback: false
        }, /*#__PURE__*/_react["default"].createElement(Tester));
      }
    }]);

    return SuspenseWrapper;
  }(_react["default"].Component);

  _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(SuspenseWrapper), container);

  return inst._reactInternals.child;
}

module.exports = function detectFiberTags() {
  function Fn() {
    return null;
  }

  var Cls = /*#__PURE__*/function (_React$Component4) {
    _inherits(Cls, _React$Component4);

    var _super4 = _createSuper(Cls);

    function Cls() {
      _classCallCheck(this, Cls);

      return _super4.apply(this, arguments);
    }

    _createClass(Cls, [{
      key: "render",
      value: function render() {
        return null;
      }
    }]);

    return Cls;
  }(_react["default"].Component);

  var Ctx = /*#__PURE__*/_react["default"].createContext(); // React will warn if we don't have both arguments.
  // eslint-disable-next-line no-unused-vars


  var FwdRef = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
    return null;
  });

  var LazyComponent = /*#__PURE__*/_react["default"].lazy(function () {
    return (0, _enzymeAdapterUtils.fakeDynamicImport)(function () {
      return null;
    });
  });

  return {
    HostRoot: getFiber('test')["return"]["return"].tag,
    // Go two levels above to find the root
    ClassComponent: getFiber( /*#__PURE__*/_react["default"].createElement(Cls)).tag,
    Fragment: getFiber([['nested']]).tag,
    FunctionalComponent: getFiber( /*#__PURE__*/_react["default"].createElement(Fn)).tag,
    MemoSFC: getFiber( /*#__PURE__*/_react["default"].createElement( /*#__PURE__*/_react["default"].memo(Fn))).tag,
    MemoClass: getFiber( /*#__PURE__*/_react["default"].createElement( /*#__PURE__*/_react["default"].memo(Cls))).tag,
    HostPortal: getFiber( /*#__PURE__*/_reactDom["default"].createPortal(null, global.document.createElement('div'))).tag,
    HostComponent: getFiber( /*#__PURE__*/_react["default"].createElement('span')).tag,
    HostText: getFiber('text').tag,
    Mode: getFiber( /*#__PURE__*/_react["default"].createElement(_react["default"].StrictMode)).tag,
    ContextConsumer: getFiber( /*#__PURE__*/_react["default"].createElement(Ctx.Consumer, null, function () {
      return null;
    })).tag,
    ContextProvider: getFiber( /*#__PURE__*/_react["default"].createElement(Ctx.Provider, {
      value: null
    }, null)).tag,
    ForwardRef: getFiber( /*#__PURE__*/_react["default"].createElement(FwdRef)).tag,
    Profiler: getFiber( /*#__PURE__*/_react["default"].createElement(_react["default"].Profiler, {
      id: 'mock',
      onRender: function onRender() {}
    })).tag,
    Suspense: getFiber( /*#__PURE__*/_react["default"].createElement(_react["default"].Suspense, {
      fallback: false
    })).tag,
    Lazy: getLazyFiber(LazyComponent).tag,
    OffscreenComponent: getLazyFiber('div')["return"]["return"].tag // Go two levels above to find the root

  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRGaWJlciIsImVsZW1lbnQiLCJjb250YWluZXIiLCJnbG9iYWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbnN0IiwiVGVzdGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJSZWFjdERPTSIsInJlbmRlciIsIl9yZWFjdEludGVybmFscyIsImNoaWxkIiwiZ2V0TGF6eUZpYmVyIiwiTGF6eUNvbXBvbmVudCIsIlN1c3BlbnNlV3JhcHBlciIsIlN1c3BlbnNlIiwiZmFsbGJhY2siLCJtb2R1bGUiLCJleHBvcnRzIiwiZGV0ZWN0RmliZXJUYWdzIiwiRm4iLCJDbHMiLCJDdHgiLCJjcmVhdGVDb250ZXh0IiwiRndkUmVmIiwiZm9yd2FyZFJlZiIsInByb3BzIiwicmVmIiwibGF6eSIsImZha2VEeW5hbWljSW1wb3J0IiwiSG9zdFJvb3QiLCJ0YWciLCJDbGFzc0NvbXBvbmVudCIsIkZyYWdtZW50IiwiRnVuY3Rpb25hbENvbXBvbmVudCIsIk1lbW9TRkMiLCJtZW1vIiwiTWVtb0NsYXNzIiwiSG9zdFBvcnRhbCIsImNyZWF0ZVBvcnRhbCIsIkhvc3RDb21wb25lbnQiLCJIb3N0VGV4dCIsIk1vZGUiLCJTdHJpY3RNb2RlIiwiQ29udGV4dENvbnN1bWVyIiwiQ29uc3VtZXIiLCJDb250ZXh0UHJvdmlkZXIiLCJQcm92aWRlciIsInZhbHVlIiwiRm9yd2FyZFJlZiIsIlByb2ZpbGVyIiwiaWQiLCJvblJlbmRlciIsIkxhenkiLCJPZmZzY3JlZW5Db21wb25lbnQiXSwic291cmNlcyI6WyIuLi9zcmMvZGV0ZWN0RmliZXJUYWdzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGZha2VEeW5hbWljSW1wb3J0IH0gZnJvbSAnQHdvanRla21hai9lbnp5bWUtYWRhcHRlci11dGlscyc7XG5cbmZ1bmN0aW9uIGdldEZpYmVyKGVsZW1lbnQpIHtcbiAgY29uc3QgY29udGFpbmVyID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZXQgaW5zdCA9IG51bGw7XG4gIGNsYXNzIFRlc3RlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgaW5zdCA9IHRoaXM7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gIH1cbiAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdGVyKSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIGluc3QuX3JlYWN0SW50ZXJuYWxzLmNoaWxkO1xufVxuXG5mdW5jdGlvbiBnZXRMYXp5RmliZXIoTGF6eUNvbXBvbmVudCkge1xuICBjb25zdCBjb250YWluZXIgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxldCBpbnN0ID0gbnVsbDtcblxuICBjbGFzcyBUZXN0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGluc3QgPSB0aGlzO1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGF6eUNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgU3VzcGVuc2VXcmFwcGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5TdXNwZW5zZSwgeyBmYWxsYmFjazogZmFsc2UgfSwgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0ZXIpKTtcbiAgICB9XG4gIH1cbiAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VzcGVuc2VXcmFwcGVyKSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIGluc3QuX3JlYWN0SW50ZXJuYWxzLmNoaWxkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRldGVjdEZpYmVyVGFncygpIHtcbiAgZnVuY3Rpb24gRm4oKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY2xhc3MgQ2xzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgbGV0IEN0eCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoKTtcbiAgLy8gUmVhY3Qgd2lsbCB3YXJuIGlmIHdlIGRvbid0IGhhdmUgYm90aCBhcmd1bWVudHMuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBsZXQgRndkUmVmID0gUmVhY3QuZm9yd2FyZFJlZigocHJvcHMsIHJlZikgPT4gbnVsbCk7XG4gIGxldCBMYXp5Q29tcG9uZW50ID0gUmVhY3QubGF6eSgoKSA9PiBmYWtlRHluYW1pY0ltcG9ydCgoKSA9PiBudWxsKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBIb3N0Um9vdDogZ2V0RmliZXIoJ3Rlc3QnKS5yZXR1cm4ucmV0dXJuLnRhZywgLy8gR28gdHdvIGxldmVscyBhYm92ZSB0byBmaW5kIHRoZSByb290XG4gICAgQ2xhc3NDb21wb25lbnQ6IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2xzKSkudGFnLFxuICAgIEZyYWdtZW50OiBnZXRGaWJlcihbWyduZXN0ZWQnXV0pLnRhZyxcbiAgICBGdW5jdGlvbmFsQ29tcG9uZW50OiBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KEZuKSkudGFnLFxuICAgIE1lbW9TRkM6IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QubWVtbyhGbikpKS50YWcsXG4gICAgTWVtb0NsYXNzOiBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0Lm1lbW8oQ2xzKSkpLnRhZyxcbiAgICBIb3N0UG9ydGFsOiBnZXRGaWJlcihSZWFjdERPTS5jcmVhdGVQb3J0YWwobnVsbCwgZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKSkudGFnLFxuICAgIEhvc3RDb21wb25lbnQ6IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSkudGFnLFxuICAgIEhvc3RUZXh0OiBnZXRGaWJlcigndGV4dCcpLnRhZyxcbiAgICBNb2RlOiBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LlN0cmljdE1vZGUpKS50YWcsXG4gICAgQ29udGV4dENvbnN1bWVyOiBnZXRGaWJlcihSZWFjdC5jcmVhdGVFbGVtZW50KEN0eC5Db25zdW1lciwgbnVsbCwgKCkgPT4gbnVsbCkpLnRhZyxcbiAgICBDb250ZXh0UHJvdmlkZXI6IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ3R4LlByb3ZpZGVyLCB7IHZhbHVlOiBudWxsIH0sIG51bGwpKS50YWcsXG4gICAgRm9yd2FyZFJlZjogZ2V0RmliZXIoUmVhY3QuY3JlYXRlRWxlbWVudChGd2RSZWYpKS50YWcsXG4gICAgUHJvZmlsZXI6IGdldEZpYmVyKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5Qcm9maWxlciwge1xuICAgICAgICBpZDogJ21vY2snLFxuICAgICAgICBvblJlbmRlcigpIHt9LFxuICAgICAgfSksXG4gICAgKS50YWcsXG4gICAgU3VzcGVuc2U6IGdldEZpYmVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuU3VzcGVuc2UsIHsgZmFsbGJhY2s6IGZhbHNlIH0pKS50YWcsXG4gICAgTGF6eTogZ2V0TGF6eUZpYmVyKExhenlDb21wb25lbnQpLnRhZyxcbiAgICBPZmZzY3JlZW5Db21wb25lbnQ6IGdldExhenlGaWJlcignZGl2JykucmV0dXJuLnJldHVybi50YWcsIC8vIEdvIHR3byBsZXZlbHMgYWJvdmUgdG8gZmluZCB0aGUgcm9vdFxuICB9O1xufTtcbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSxRQUFULENBQWtCQyxPQUFsQixFQUEyQjtFQUN6QixJQUFNQyxT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
//# sourceMappingURL=detectFiberTags.js.map
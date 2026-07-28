function RC(l, o) {
  for (var r = 0; r < o.length; r++) {
    const i = o[r];
    if (typeof i != "string" && !Array.isArray(i)) {
      for (const c in i)
        if (c !== "default" && !(c in l)) {
          const f = Object.getOwnPropertyDescriptor(i, c);
          f && Object.defineProperty(l, c, f.get ? f : { enumerable: !0, get: () => i[c] });
        }
    }
  }
  return Object.freeze(Object.defineProperty(l, Symbol.toStringTag, { value: "Module" }));
}
function jf(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var Ks = { exports: {} },
  qo = {};
var xm;
function TC() {
  if (xm) return qo;
  xm = 1;
  var l = Symbol.for("react.transitional.element"),
    o = Symbol.for("react.fragment");
  function r(i, c, f) {
    var d = null;
    if ((f !== void 0 && (d = "" + f), c.key !== void 0 && (d = "" + c.key), "key" in c)) {
      f = {};
      for (var h in c) h !== "key" && (f[h] = c[h]);
    } else f = c;
    return ((c = f.ref), { $$typeof: l, type: i, key: d, ref: c !== void 0 ? c : null, props: f });
  }
  return ((qo.Fragment = o), (qo.jsx = r), (qo.jsxs = r), qo);
}
var Em;
function wC() {
  return (Em || ((Em = 1), (Ks.exports = TC())), Ks.exports);
}
var E = wC(),
  $s = { exports: {} },
  me = {};
var Cm;
function AC() {
  if (Cm) return me;
  Cm = 1;
  var l = Symbol.for("react.transitional.element"),
    o = Symbol.for("react.portal"),
    r = Symbol.for("react.fragment"),
    i = Symbol.for("react.strict_mode"),
    c = Symbol.for("react.profiler"),
    f = Symbol.for("react.consumer"),
    d = Symbol.for("react.context"),
    h = Symbol.for("react.forward_ref"),
    v = Symbol.for("react.suspense"),
    m = Symbol.for("react.memo"),
    S = Symbol.for("react.lazy"),
    y = Symbol.for("react.activity"),
    b = Symbol.iterator;
  function R(M) {
    return M === null || typeof M != "object"
      ? null
      : ((M = (b && M[b]) || M["@@iterator"]), typeof M == "function" ? M : null);
  }
  var w = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    C = Object.assign,
    T = {};
  function _(M, Y, J) {
    ((this.props = M), (this.context = Y), (this.refs = T), (this.updater = J || w));
  }
  ((_.prototype.isReactComponent = {}),
    (_.prototype.setState = function (M, Y) {
      if (typeof M != "object" && typeof M != "function" && M != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, M, Y, "setState");
    }),
    (_.prototype.forceUpdate = function (M) {
      this.updater.enqueueForceUpdate(this, M, "forceUpdate");
    }));
  function D() {}
  D.prototype = _.prototype;
  function N(M, Y, J) {
    ((this.props = M), (this.context = Y), (this.refs = T), (this.updater = J || w));
  }
  var B = (N.prototype = new D());
  ((B.constructor = N), C(B, _.prototype), (B.isPureReactComponent = !0));
  var K = Array.isArray;
  function F() {}
  var V = { H: null, A: null, T: null, S: null },
    ee = Object.prototype.hasOwnProperty;
  function te(M, Y, J) {
    var W = J.ref;
    return { $$typeof: l, type: M, key: Y, ref: W !== void 0 ? W : null, props: J };
  }
  function le(M, Y) {
    return te(M.type, Y, M.props);
  }
  function ne(M) {
    return typeof M == "object" && M !== null && M.$$typeof === l;
  }
  function ie(M) {
    var Y = { "=": "=0", ":": "=2" };
    return (
      "$" +
      M.replace(/[=:]/g, function (J) {
        return Y[J];
      })
    );
  }
  var ve = /\/+/g;
  function pe(M, Y) {
    return typeof M == "object" && M !== null && M.key != null ? ie("" + M.key) : Y.toString(36);
  }
  function ge(M) {
    switch (M.status) {
      case "fulfilled":
        return M.value;
      case "rejected":
        throw M.reason;
      default:
        switch (
          (typeof M.status == "string"
            ? M.then(F, F)
            : ((M.status = "pending"),
              M.then(
                function (Y) {
                  M.status === "pending" && ((M.status = "fulfilled"), (M.value = Y));
                },
                function (Y) {
                  M.status === "pending" && ((M.status = "rejected"), (M.reason = Y));
                },
              )),
          M.status)
        ) {
          case "fulfilled":
            return M.value;
          case "rejected":
            throw M.reason;
        }
    }
    throw M;
  }
  function j(M, Y, J, W, ce) {
    var se = typeof M;
    (se === "undefined" || se === "boolean") && (M = null);
    var k = !1;
    if (M === null) k = !0;
    else
      switch (se) {
        case "bigint":
        case "string":
        case "number":
          k = !0;
          break;
        case "object":
          switch (M.$$typeof) {
            case l:
            case o:
              k = !0;
              break;
            case S:
              return ((k = M._init), j(k(M._payload), Y, J, W, ce));
          }
      }
    if (k)
      return (
        (ce = ce(M)),
        (k = W === "" ? "." + pe(M, 0) : W),
        K(ce)
          ? ((J = ""),
            k != null && (J = k.replace(ve, "$&/") + "/"),
            j(ce, Y, J, "", function (Me) {
              return Me;
            }))
          : ce != null &&
            (ne(ce) &&
              (ce = le(
                ce,
                J +
                  (ce.key == null || (M && M.key === ce.key)
                    ? ""
                    : ("" + ce.key).replace(ve, "$&/") + "/") +
                  k,
              )),
            Y.push(ce)),
        1
      );
    k = 0;
    var Se = W === "" ? "." : W + ":";
    if (K(M))
      for (var xe = 0; xe < M.length; xe++)
        ((W = M[xe]), (se = Se + pe(W, xe)), (k += j(W, Y, J, se, ce)));
    else if (((xe = R(M)), typeof xe == "function"))
      for (M = xe.call(M), xe = 0; !(W = M.next()).done; )
        ((W = W.value), (se = Se + pe(W, xe++)), (k += j(W, Y, J, se, ce)));
    else if (se === "object") {
      if (typeof M.then == "function") return j(ge(M), Y, J, W, ce);
      throw (
        (Y = String(M)),
        Error(
          "Objects are not valid as a React child (found: " +
            (Y === "[object Object]" ? "object with keys {" + Object.keys(M).join(", ") + "}" : Y) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return k;
  }
  function I(M, Y, J) {
    if (M == null) return M;
    var W = [],
      ce = 0;
    return (
      j(M, W, "", "", function (se) {
        return Y.call(J, se, ce++);
      }),
      W
    );
  }
  function $(M) {
    if (M._status === -1) {
      var Y = M._result;
      ((Y = Y()),
        Y.then(
          function (J) {
            (M._status === 0 || M._status === -1) && ((M._status = 1), (M._result = J));
          },
          function (J) {
            (M._status === 0 || M._status === -1) && ((M._status = 2), (M._result = J));
          },
        ),
        M._status === -1 && ((M._status = 0), (M._result = Y)));
    }
    if (M._status === 1) return M._result.default;
    throw M._result;
  }
  var Q =
      typeof reportError == "function"
        ? reportError
        : function (M) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var Y = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof M == "object" && M !== null && typeof M.message == "string"
                    ? String(M.message)
                    : String(M),
                error: M,
              });
              if (!window.dispatchEvent(Y)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", M);
              return;
            }
            console.error(M);
          },
    he = {
      map: I,
      forEach: function (M, Y, J) {
        I(
          M,
          function () {
            Y.apply(this, arguments);
          },
          J,
        );
      },
      count: function (M) {
        var Y = 0;
        return (
          I(M, function () {
            Y++;
          }),
          Y
        );
      },
      toArray: function (M) {
        return (
          I(M, function (Y) {
            return Y;
          }) || []
        );
      },
      only: function (M) {
        if (!ne(M))
          throw Error("React.Children.only expected to receive a single React element child.");
        return M;
      },
    };
  return (
    (me.Activity = y),
    (me.Children = he),
    (me.Component = _),
    (me.Fragment = r),
    (me.Profiler = c),
    (me.PureComponent = N),
    (me.StrictMode = i),
    (me.Suspense = v),
    (me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V),
    (me.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (M) {
        return V.H.useMemoCache(M);
      },
    }),
    (me.cache = function (M) {
      return function () {
        return M.apply(null, arguments);
      };
    }),
    (me.cacheSignal = function () {
      return null;
    }),
    (me.cloneElement = function (M, Y, J) {
      if (M == null) throw Error("The argument must be a React element, but you passed " + M + ".");
      var W = C({}, M.props),
        ce = M.key;
      if (Y != null)
        for (se in (Y.key !== void 0 && (ce = "" + Y.key), Y))
          !ee.call(Y, se) ||
            se === "key" ||
            se === "__self" ||
            se === "__source" ||
            (se === "ref" && Y.ref === void 0) ||
            (W[se] = Y[se]);
      var se = arguments.length - 2;
      if (se === 1) W.children = J;
      else if (1 < se) {
        for (var k = Array(se), Se = 0; Se < se; Se++) k[Se] = arguments[Se + 2];
        W.children = k;
      }
      return te(M.type, ce, W);
    }),
    (me.createContext = function (M) {
      return (
        (M = {
          $$typeof: d,
          _currentValue: M,
          _currentValue2: M,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (M.Provider = M),
        (M.Consumer = { $$typeof: f, _context: M }),
        M
      );
    }),
    (me.createElement = function (M, Y, J) {
      var W,
        ce = {},
        se = null;
      if (Y != null)
        for (W in (Y.key !== void 0 && (se = "" + Y.key), Y))
          ee.call(Y, W) && W !== "key" && W !== "__self" && W !== "__source" && (ce[W] = Y[W]);
      var k = arguments.length - 2;
      if (k === 1) ce.children = J;
      else if (1 < k) {
        for (var Se = Array(k), xe = 0; xe < k; xe++) Se[xe] = arguments[xe + 2];
        ce.children = Se;
      }
      if (M && M.defaultProps)
        for (W in ((k = M.defaultProps), k)) ce[W] === void 0 && (ce[W] = k[W]);
      return te(M, se, ce);
    }),
    (me.createRef = function () {
      return { current: null };
    }),
    (me.forwardRef = function (M) {
      return { $$typeof: h, render: M };
    }),
    (me.isValidElement = ne),
    (me.lazy = function (M) {
      return { $$typeof: S, _payload: { _status: -1, _result: M }, _init: $ };
    }),
    (me.memo = function (M, Y) {
      return { $$typeof: m, type: M, compare: Y === void 0 ? null : Y };
    }),
    (me.startTransition = function (M) {
      var Y = V.T,
        J = {};
      V.T = J;
      try {
        var W = M(),
          ce = V.S;
        (ce !== null && ce(J, W),
          typeof W == "object" && W !== null && typeof W.then == "function" && W.then(F, Q));
      } catch (se) {
        Q(se);
      } finally {
        (Y !== null && J.types !== null && (Y.types = J.types), (V.T = Y));
      }
    }),
    (me.unstable_useCacheRefresh = function () {
      return V.H.useCacheRefresh();
    }),
    (me.use = function (M) {
      return V.H.use(M);
    }),
    (me.useActionState = function (M, Y, J) {
      return V.H.useActionState(M, Y, J);
    }),
    (me.useCallback = function (M, Y) {
      return V.H.useCallback(M, Y);
    }),
    (me.useContext = function (M) {
      return V.H.useContext(M);
    }),
    (me.useDebugValue = function () {}),
    (me.useDeferredValue = function (M, Y) {
      return V.H.useDeferredValue(M, Y);
    }),
    (me.useEffect = function (M, Y) {
      return V.H.useEffect(M, Y);
    }),
    (me.useEffectEvent = function (M) {
      return V.H.useEffectEvent(M);
    }),
    (me.useId = function () {
      return V.H.useId();
    }),
    (me.useImperativeHandle = function (M, Y, J) {
      return V.H.useImperativeHandle(M, Y, J);
    }),
    (me.useInsertionEffect = function (M, Y) {
      return V.H.useInsertionEffect(M, Y);
    }),
    (me.useLayoutEffect = function (M, Y) {
      return V.H.useLayoutEffect(M, Y);
    }),
    (me.useMemo = function (M, Y) {
      return V.H.useMemo(M, Y);
    }),
    (me.useOptimistic = function (M, Y) {
      return V.H.useOptimistic(M, Y);
    }),
    (me.useReducer = function (M, Y, J) {
      return V.H.useReducer(M, Y, J);
    }),
    (me.useRef = function (M) {
      return V.H.useRef(M);
    }),
    (me.useState = function (M) {
      return V.H.useState(M);
    }),
    (me.useSyncExternalStore = function (M, Y, J) {
      return V.H.useSyncExternalStore(M, Y, J);
    }),
    (me.useTransition = function () {
      return V.H.useTransition();
    }),
    (me.version = "19.2.4"),
    me
  );
}
var Rm;
function ki() {
  return (Rm || ((Rm = 1), ($s.exports = AC())), $s.exports);
}
var p = ki();
const rl = jf(p),
  Fi = RC({ __proto__: null, default: rl }, [p]);
var Qs = { exports: {} },
  Xo = {},
  Zs = { exports: {} },
  ks = {};
var Tm;
function _C() {
  return (
    Tm ||
      ((Tm = 1),
      (function (l) {
        function o(j, I) {
          var $ = j.length;
          j.push(I);
          e: for (; 0 < $; ) {
            var Q = ($ - 1) >>> 1,
              he = j[Q];
            if (0 < c(he, I)) ((j[Q] = I), (j[$] = he), ($ = Q));
            else break e;
          }
        }
        function r(j) {
          return j.length === 0 ? null : j[0];
        }
        function i(j) {
          if (j.length === 0) return null;
          var I = j[0],
            $ = j.pop();
          if ($ !== I) {
            j[0] = $;
            e: for (var Q = 0, he = j.length, M = he >>> 1; Q < M; ) {
              var Y = 2 * (Q + 1) - 1,
                J = j[Y],
                W = Y + 1,
                ce = j[W];
              if (0 > c(J, $))
                W < he && 0 > c(ce, J)
                  ? ((j[Q] = ce), (j[W] = $), (Q = W))
                  : ((j[Q] = J), (j[Y] = $), (Q = Y));
              else if (W < he && 0 > c(ce, $)) ((j[Q] = ce), (j[W] = $), (Q = W));
              else break e;
            }
          }
          return I;
        }
        function c(j, I) {
          var $ = j.sortIndex - I.sortIndex;
          return $ !== 0 ? $ : j.id - I.id;
        }
        if (
          ((l.unstable_now = void 0),
          typeof performance == "object" && typeof performance.now == "function")
        ) {
          var f = performance;
          l.unstable_now = function () {
            return f.now();
          };
        } else {
          var d = Date,
            h = d.now();
          l.unstable_now = function () {
            return d.now() - h;
          };
        }
        var v = [],
          m = [],
          S = 1,
          y = null,
          b = 3,
          R = !1,
          w = !1,
          C = !1,
          T = !1,
          _ = typeof setTimeout == "function" ? setTimeout : null,
          D = typeof clearTimeout == "function" ? clearTimeout : null,
          N = typeof setImmediate < "u" ? setImmediate : null;
        function B(j) {
          for (var I = r(m); I !== null; ) {
            if (I.callback === null) i(m);
            else if (I.startTime <= j) (i(m), (I.sortIndex = I.expirationTime), o(v, I));
            else break;
            I = r(m);
          }
        }
        function K(j) {
          if (((C = !1), B(j), !w))
            if (r(v) !== null) ((w = !0), F || ((F = !0), ie()));
            else {
              var I = r(m);
              I !== null && ge(K, I.startTime - j);
            }
        }
        var F = !1,
          V = -1,
          ee = 5,
          te = -1;
        function le() {
          return T ? !0 : !(l.unstable_now() - te < ee);
        }
        function ne() {
          if (((T = !1), F)) {
            var j = l.unstable_now();
            te = j;
            var I = !0;
            try {
              e: {
                ((w = !1), C && ((C = !1), D(V), (V = -1)), (R = !0));
                var $ = b;
                try {
                  t: {
                    for (B(j), y = r(v); y !== null && !(y.expirationTime > j && le()); ) {
                      var Q = y.callback;
                      if (typeof Q == "function") {
                        ((y.callback = null), (b = y.priorityLevel));
                        var he = Q(y.expirationTime <= j);
                        if (((j = l.unstable_now()), typeof he == "function")) {
                          ((y.callback = he), B(j), (I = !0));
                          break t;
                        }
                        (y === r(v) && i(v), B(j));
                      } else i(v);
                      y = r(v);
                    }
                    if (y !== null) I = !0;
                    else {
                      var M = r(m);
                      (M !== null && ge(K, M.startTime - j), (I = !1));
                    }
                  }
                  break e;
                } finally {
                  ((y = null), (b = $), (R = !1));
                }
                I = void 0;
              }
            } finally {
              I ? ie() : (F = !1);
            }
          }
        }
        var ie;
        if (typeof N == "function")
          ie = function () {
            N(ne);
          };
        else if (typeof MessageChannel < "u") {
          var ve = new MessageChannel(),
            pe = ve.port2;
          ((ve.port1.onmessage = ne),
            (ie = function () {
              pe.postMessage(null);
            }));
        } else
          ie = function () {
            _(ne, 0);
          };
        function ge(j, I) {
          V = _(function () {
            j(l.unstable_now());
          }, I);
        }
        ((l.unstable_IdlePriority = 5),
          (l.unstable_ImmediatePriority = 1),
          (l.unstable_LowPriority = 4),
          (l.unstable_NormalPriority = 3),
          (l.unstable_Profiling = null),
          (l.unstable_UserBlockingPriority = 2),
          (l.unstable_cancelCallback = function (j) {
            j.callback = null;
          }),
          (l.unstable_forceFrameRate = function (j) {
            0 > j || 125 < j
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (ee = 0 < j ? Math.floor(1e3 / j) : 5);
          }),
          (l.unstable_getCurrentPriorityLevel = function () {
            return b;
          }),
          (l.unstable_next = function (j) {
            switch (b) {
              case 1:
              case 2:
              case 3:
                var I = 3;
                break;
              default:
                I = b;
            }
            var $ = b;
            b = I;
            try {
              return j();
            } finally {
              b = $;
            }
          }),
          (l.unstable_requestPaint = function () {
            T = !0;
          }),
          (l.unstable_runWithPriority = function (j, I) {
            switch (j) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                j = 3;
            }
            var $ = b;
            b = j;
            try {
              return I();
            } finally {
              b = $;
            }
          }),
          (l.unstable_scheduleCallback = function (j, I, $) {
            var Q = l.unstable_now();
            switch (
              (typeof $ == "object" && $ !== null
                ? (($ = $.delay), ($ = typeof $ == "number" && 0 < $ ? Q + $ : Q))
                : ($ = Q),
              j)
            ) {
              case 1:
                var he = -1;
                break;
              case 2:
                he = 250;
                break;
              case 5:
                he = 1073741823;
                break;
              case 4:
                he = 1e4;
                break;
              default:
                he = 5e3;
            }
            return (
              (he = $ + he),
              (j = {
                id: S++,
                callback: I,
                priorityLevel: j,
                startTime: $,
                expirationTime: he,
                sortIndex: -1,
              }),
              $ > Q
                ? ((j.sortIndex = $),
                  o(m, j),
                  r(v) === null && j === r(m) && (C ? (D(V), (V = -1)) : (C = !0), ge(K, $ - Q)))
                : ((j.sortIndex = he), o(v, j), w || R || ((w = !0), F || ((F = !0), ie()))),
              j
            );
          }),
          (l.unstable_shouldYield = le),
          (l.unstable_wrapCallback = function (j) {
            var I = b;
            return function () {
              var $ = b;
              b = I;
              try {
                return j.apply(this, arguments);
              } finally {
                b = $;
              }
            };
          }));
      })(ks)),
    ks
  );
}
var wm;
function MC() {
  return (wm || ((wm = 1), (Zs.exports = _C())), Zs.exports);
}
var Fs = { exports: {} },
  ct = {};
var Am;
function OC() {
  if (Am) return ct;
  Am = 1;
  var l = ki();
  function o(v) {
    var m = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      m += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var S = 2; S < arguments.length; S++) m += "&args[]=" + encodeURIComponent(arguments[S]);
    }
    return (
      "Minified React error #" +
      v +
      "; visit " +
      m +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function r() {}
  var i = {
      d: {
        f: r,
        r: function () {
          throw Error(o(522));
        },
        D: r,
        C: r,
        L: r,
        m: r,
        X: r,
        S: r,
        M: r,
      },
      p: 0,
      findDOMNode: null,
    },
    c = Symbol.for("react.portal");
  function f(v, m, S) {
    var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: y == null ? null : "" + y,
      children: v,
      containerInfo: m,
      implementation: S,
    };
  }
  var d = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(v, m) {
    if (v === "font") return "";
    if (typeof m == "string") return m === "use-credentials" ? m : "";
  }
  return (
    (ct.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
    (ct.createPortal = function (v, m) {
      var S = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!m || (m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11)) throw Error(o(299));
      return f(v, m, null, S);
    }),
    (ct.flushSync = function (v) {
      var m = d.T,
        S = i.p;
      try {
        if (((d.T = null), (i.p = 2), v)) return v();
      } finally {
        ((d.T = m), (i.p = S), i.d.f());
      }
    }),
    (ct.preconnect = function (v, m) {
      typeof v == "string" &&
        (m
          ? ((m = m.crossOrigin),
            (m = typeof m == "string" ? (m === "use-credentials" ? m : "") : void 0))
          : (m = null),
        i.d.C(v, m));
    }),
    (ct.prefetchDNS = function (v) {
      typeof v == "string" && i.d.D(v);
    }),
    (ct.preinit = function (v, m) {
      if (typeof v == "string" && m && typeof m.as == "string") {
        var S = m.as,
          y = h(S, m.crossOrigin),
          b = typeof m.integrity == "string" ? m.integrity : void 0,
          R = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
        S === "style"
          ? i.d.S(v, typeof m.precedence == "string" ? m.precedence : void 0, {
              crossOrigin: y,
              integrity: b,
              fetchPriority: R,
            })
          : S === "script" &&
            i.d.X(v, {
              crossOrigin: y,
              integrity: b,
              fetchPriority: R,
              nonce: typeof m.nonce == "string" ? m.nonce : void 0,
            });
      }
    }),
    (ct.preinitModule = function (v, m) {
      if (typeof v == "string")
        if (typeof m == "object" && m !== null) {
          if (m.as == null || m.as === "script") {
            var S = h(m.as, m.crossOrigin);
            i.d.M(v, {
              crossOrigin: S,
              integrity: typeof m.integrity == "string" ? m.integrity : void 0,
              nonce: typeof m.nonce == "string" ? m.nonce : void 0,
            });
          }
        } else m == null && i.d.M(v);
    }),
    (ct.preload = function (v, m) {
      if (typeof v == "string" && typeof m == "object" && m !== null && typeof m.as == "string") {
        var S = m.as,
          y = h(S, m.crossOrigin);
        i.d.L(v, S, {
          crossOrigin: y,
          integrity: typeof m.integrity == "string" ? m.integrity : void 0,
          nonce: typeof m.nonce == "string" ? m.nonce : void 0,
          type: typeof m.type == "string" ? m.type : void 0,
          fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
          referrerPolicy: typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
          imageSrcSet: typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
          imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
          media: typeof m.media == "string" ? m.media : void 0,
        });
      }
    }),
    (ct.preloadModule = function (v, m) {
      if (typeof v == "string")
        if (m) {
          var S = h(m.as, m.crossOrigin);
          i.d.m(v, {
            as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
            crossOrigin: S,
            integrity: typeof m.integrity == "string" ? m.integrity : void 0,
          });
        } else i.d.m(v);
    }),
    (ct.requestFormReset = function (v) {
      i.d.r(v);
    }),
    (ct.unstable_batchedUpdates = function (v, m) {
      return v(m);
    }),
    (ct.useFormState = function (v, m, S) {
      return d.H.useFormState(v, m, S);
    }),
    (ct.useFormStatus = function () {
      return d.H.useHostTransitionStatus();
    }),
    (ct.version = "19.2.4"),
    ct
  );
}
var _m;
function gg() {
  if (_m) return Fs.exports;
  _m = 1;
  function l() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (o) {
        console.error(o);
      }
  }
  return (l(), (Fs.exports = OC()), Fs.exports);
}
var Mm;
function DC() {
  if (Mm) return Xo;
  Mm = 1;
  var l = MC(),
    o = ki(),
    r = gg();
  function i(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function c(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function f(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function v(e) {
    if (f(e) !== e) throw Error(i(188));
  }
  function m(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = f(e)), t === null)) throw Error(i(188));
      return t !== e ? null : e;
    }
    for (var n = e, a = t; ; ) {
      var u = n.return;
      if (u === null) break;
      var s = u.alternate;
      if (s === null) {
        if (((a = u.return), a !== null)) {
          n = a;
          continue;
        }
        break;
      }
      if (u.child === s.child) {
        for (s = u.child; s; ) {
          if (s === n) return (v(u), e);
          if (s === a) return (v(u), t);
          s = s.sibling;
        }
        throw Error(i(188));
      }
      if (n.return !== a.return) ((n = u), (a = s));
      else {
        for (var g = !1, x = u.child; x; ) {
          if (x === n) {
            ((g = !0), (n = u), (a = s));
            break;
          }
          if (x === a) {
            ((g = !0), (a = u), (n = s));
            break;
          }
          x = x.sibling;
        }
        if (!g) {
          for (x = s.child; x; ) {
            if (x === n) {
              ((g = !0), (n = s), (a = u));
              break;
            }
            if (x === a) {
              ((g = !0), (a = s), (n = u));
              break;
            }
            x = x.sibling;
          }
          if (!g) throw Error(i(189));
        }
      }
      if (n.alternate !== a) throw Error(i(190));
    }
    if (n.tag !== 3) throw Error(i(188));
    return n.stateNode.current === n ? e : t;
  }
  function S(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (((t = S(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  var y = Object.assign,
    b = Symbol.for("react.element"),
    R = Symbol.for("react.transitional.element"),
    w = Symbol.for("react.portal"),
    C = Symbol.for("react.fragment"),
    T = Symbol.for("react.strict_mode"),
    _ = Symbol.for("react.profiler"),
    D = Symbol.for("react.consumer"),
    N = Symbol.for("react.context"),
    B = Symbol.for("react.forward_ref"),
    K = Symbol.for("react.suspense"),
    F = Symbol.for("react.suspense_list"),
    V = Symbol.for("react.memo"),
    ee = Symbol.for("react.lazy"),
    te = Symbol.for("react.activity"),
    le = Symbol.for("react.memo_cache_sentinel"),
    ne = Symbol.iterator;
  function ie(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (ne && e[ne]) || e["@@iterator"]), typeof e == "function" ? e : null);
  }
  var ve = Symbol.for("react.client.reference");
  function pe(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.$$typeof === ve ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case C:
        return "Fragment";
      case _:
        return "Profiler";
      case T:
        return "StrictMode";
      case K:
        return "Suspense";
      case F:
        return "SuspenseList";
      case te:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case w:
          return "Portal";
        case N:
          return e.displayName || "Context";
        case D:
          return (e._context.displayName || "Context") + ".Consumer";
        case B:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case V:
          return ((t = e.displayName || null), t !== null ? t : pe(e.type) || "Memo");
        case ee:
          ((t = e._payload), (e = e._init));
          try {
            return pe(e(t));
          } catch {}
      }
    return null;
  }
  var ge = Array.isArray,
    j = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    I = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    $ = { pending: !1, data: null, method: null, action: null },
    Q = [],
    he = -1;
  function M(e) {
    return { current: e };
  }
  function Y(e) {
    0 > he || ((e.current = Q[he]), (Q[he] = null), he--);
  }
  function J(e, t) {
    (he++, (Q[he] = e.current), (e.current = t));
  }
  var W = M(null),
    ce = M(null),
    se = M(null),
    k = M(null);
  function Se(e, t) {
    switch ((J(se, t), J(ce, e), J(W, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Xv(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI))) ((t = Xv(t)), (e = Iv(t, e)));
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (Y(W), J(W, e));
  }
  function xe() {
    (Y(W), Y(ce), Y(se));
  }
  function Me(e) {
    e.memoizedState !== null && J(k, e);
    var t = W.current,
      n = Iv(t, e.type);
    t !== n && (J(ce, e), J(W, n));
  }
  function De(e) {
    (ce.current === e && (Y(W), Y(ce)), k.current === e && (Y(k), (Po._currentValue = $)));
  }
  var Ve, st;
  function ft(e) {
    if (Ve === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ((Ve = (t && t[1]) || ""),
          (st =
            -1 <
            n.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < n.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      Ve +
      e +
      st
    );
  }
  var yl = !1;
  function Sl(e, t) {
    if (!e || yl) return "";
    yl = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var X = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(X.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(X, []);
                } catch (P) {
                  var H = P;
                }
                Reflect.construct(e, [], X);
              } else {
                try {
                  X.call();
                } catch (P) {
                  H = P;
                }
                e.call(X.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (P) {
                H = P;
              }
              (X = e()) && typeof X.catch == "function" && X.catch(function () {});
            }
          } catch (P) {
            if (P && H && typeof P.stack == "string") return [P.stack, H.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
      u &&
        u.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var s = a.DetermineComponentFrameRoot(),
        g = s[0],
        x = s[1];
      if (g && x) {
        var A = g.split(`
`),
          U = x.split(`
`);
        for (u = a = 0; a < A.length && !A[a].includes("DetermineComponentFrameRoot"); ) a++;
        for (; u < U.length && !U[u].includes("DetermineComponentFrameRoot"); ) u++;
        if (a === A.length || u === U.length)
          for (a = A.length - 1, u = U.length - 1; 1 <= a && 0 <= u && A[a] !== U[u]; ) u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (A[a] !== U[u]) {
            if (a !== 1 || u !== 1)
              do
                if ((a--, u--, 0 > u || A[a] !== U[u])) {
                  var G =
                    `
` + A[a].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      G.includes("<anonymous>") &&
                      (G = G.replace("<anonymous>", e.displayName)),
                    G
                  );
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      ((yl = !1), (Error.prepareStackTrace = n));
    }
    return (n = e ? e.displayName || e.name : "") ? ft(n) : "";
  }
  function Za(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return ft(e.type);
      case 16:
        return ft("Lazy");
      case 13:
        return e.child !== t && t !== null ? ft("Suspense Fallback") : ft("Suspense");
      case 19:
        return ft("SuspenseList");
      case 0:
      case 15:
        return Sl(e.type, !1);
      case 11:
        return Sl(e.type.render, !1);
      case 1:
        return Sl(e.type, !0);
      case 31:
        return ft("Activity");
      default:
        return "";
    }
  }
  function xd(e) {
    try {
      var t = "",
        n = null;
      do ((t += Za(e, n)), (n = e), (e = e.return));
      while (e);
      return t;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var Du = Object.prototype.hasOwnProperty,
    Nu = l.unstable_scheduleCallback,
    zu = l.unstable_cancelCallback,
    nx = l.unstable_shouldYield,
    lx = l.unstable_requestPaint,
    Et = l.unstable_now,
    ax = l.unstable_getCurrentPriorityLevel,
    Ed = l.unstable_ImmediatePriority,
    Cd = l.unstable_UserBlockingPriority,
    fr = l.unstable_NormalPriority,
    ox = l.unstable_LowPriority,
    Rd = l.unstable_IdlePriority,
    rx = l.log,
    ix = l.unstable_setDisableYieldValue,
    ka = null,
    Ct = null;
  function Ln(e) {
    if ((typeof rx == "function" && ix(e), Ct && typeof Ct.setStrictMode == "function"))
      try {
        Ct.setStrictMode(ka, e);
      } catch {}
  }
  var Rt = Math.clz32 ? Math.clz32 : sx,
    ux = Math.log,
    cx = Math.LN2;
  function sx(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((ux(e) / cx) | 0)) | 0);
  }
  var dr = 256,
    pr = 262144,
    hr = 4194304;
  function bl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function vr(e, t, n) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var u = 0,
      s = e.suspendedLanes,
      g = e.pingedLanes;
    e = e.warmLanes;
    var x = a & 134217727;
    return (
      x !== 0
        ? ((a = x & ~s),
          a !== 0
            ? (u = bl(a))
            : ((g &= x), g !== 0 ? (u = bl(g)) : n || ((n = x & ~e), n !== 0 && (u = bl(n)))))
        : ((x = a & ~s),
          x !== 0
            ? (u = bl(x))
            : g !== 0
              ? (u = bl(g))
              : n || ((n = a & ~e), n !== 0 && (u = bl(n)))),
      u === 0
        ? 0
        : t !== 0 &&
            t !== u &&
            (t & s) === 0 &&
            ((s = u & -u), (n = t & -t), s >= n || (s === 32 && (n & 4194048) !== 0))
          ? t
          : u
    );
  }
  function Fa(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function fx(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Td() {
    var e = hr;
    return ((hr <<= 1), (hr & 62914560) === 0 && (hr = 4194304), e);
  }
  function ju(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Ja(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function dx(e, t, n, a, u, s) {
    var g = e.pendingLanes;
    ((e.pendingLanes = n),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= n),
      (e.entangledLanes &= n),
      (e.errorRecoveryDisabledLanes &= n),
      (e.shellSuspendCounter = 0));
    var x = e.entanglements,
      A = e.expirationTimes,
      U = e.hiddenUpdates;
    for (n = g & ~n; 0 < n; ) {
      var G = 31 - Rt(n),
        X = 1 << G;
      ((x[G] = 0), (A[G] = -1));
      var H = U[G];
      if (H !== null)
        for (U[G] = null, G = 0; G < H.length; G++) {
          var P = H[G];
          P !== null && (P.lane &= -536870913);
        }
      n &= ~X;
    }
    (a !== 0 && wd(e, a, 0),
      s !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= s & ~(g & ~t)));
  }
  function wd(e, t, n) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var a = 31 - Rt(t);
    ((e.entangledLanes |= t),
      (e.entanglements[a] = e.entanglements[a] | 1073741824 | (n & 261930)));
  }
  function Ad(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var a = 31 - Rt(n),
        u = 1 << a;
      ((u & t) | (e[a] & t) && (e[a] |= t), (n &= ~u));
    }
  }
  function _d(e, t) {
    var n = t & -t;
    return ((n = (n & 42) !== 0 ? 1 : Lu(n)), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n);
  }
  function Lu(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Uu(e) {
    return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function Md() {
    var e = I.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : hm(e.type));
  }
  function Od(e, t) {
    var n = I.p;
    try {
      return ((I.p = e), t());
    } finally {
      I.p = n;
    }
  }
  var Un = Math.random().toString(36).slice(2),
    lt = "__reactFiber$" + Un,
    vt = "__reactProps$" + Un,
    Il = "__reactContainer$" + Un,
    Bu = "__reactEvents$" + Un,
    px = "__reactListeners$" + Un,
    hx = "__reactHandles$" + Un,
    Dd = "__reactResources$" + Un,
    Wa = "__reactMarker$" + Un;
  function Hu(e) {
    (delete e[lt], delete e[vt], delete e[Bu], delete e[px], delete e[hx]);
  }
  function Kl(e) {
    var t = e[lt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[Il] || n[lt])) {
        if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
          for (e = Jv(e); e !== null; ) {
            if ((n = e[lt])) return n;
            e = Jv(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function $l(e) {
    if ((e = e[lt] || e[Il])) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function eo(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(i(33));
  }
  function Ql(e) {
    var t = e[Dd];
    return (t || (t = e[Dd] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function tt(e) {
    e[Wa] = !0;
  }
  var Nd = new Set(),
    zd = {};
  function xl(e, t) {
    (Zl(e, t), Zl(e + "Capture", t));
  }
  function Zl(e, t) {
    for (zd[e] = t, e = 0; e < t.length; e++) Nd.add(t[e]);
  }
  var vx = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    jd = {},
    Ld = {};
  function mx(e) {
    return Du.call(Ld, e)
      ? !0
      : Du.call(jd, e)
        ? !1
        : vx.test(e)
          ? (Ld[e] = !0)
          : ((jd[e] = !0), !1);
  }
  function mr(e, t, n) {
    if (mx(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function gr(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function pn(e, t, n, a) {
    if (a === null) e.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + a);
    }
  }
  function Lt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Ud(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function gx(e, t, n) {
    var a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof a < "u" &&
      typeof a.get == "function" &&
      typeof a.set == "function"
    ) {
      var u = a.get,
        s = a.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (g) {
            ((n = "" + g), s.call(this, g));
          },
        }),
        Object.defineProperty(e, t, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return n;
          },
          setValue: function (g) {
            n = "" + g;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Pu(e) {
    if (!e._valueTracker) {
      var t = Ud(e) ? "checked" : "value";
      e._valueTracker = gx(e, t, "" + e[t]);
    }
  }
  function Bd(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      a = "";
    return (
      e && (a = Ud(e) ? (e.checked ? "true" : "false") : e.value),
      (e = a),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  function yr(e) {
    if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var yx = /[\n"\\]/g;
  function Ut(e) {
    return e.replace(yx, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function Vu(e, t, n, a, u, s, g, x) {
    ((e.name = ""),
      g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean"
        ? (e.type = g)
        : e.removeAttribute("type"),
      t != null
        ? g === "number"
          ? ((t === 0 && e.value === "") || e.value != t) && (e.value = "" + Lt(t))
          : e.value !== "" + Lt(t) && (e.value = "" + Lt(t))
        : (g !== "submit" && g !== "reset") || e.removeAttribute("value"),
      t != null
        ? Gu(e, g, Lt(t))
        : n != null
          ? Gu(e, g, Lt(n))
          : a != null && e.removeAttribute("value"),
      u == null && s != null && (e.defaultChecked = !!s),
      u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"),
      x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean"
        ? (e.name = "" + Lt(x))
        : e.removeAttribute("name"));
  }
  function Hd(e, t, n, a, u, s, g, x) {
    if (
      (s != null &&
        typeof s != "function" &&
        typeof s != "symbol" &&
        typeof s != "boolean" &&
        (e.type = s),
      t != null || n != null)
    ) {
      if (!((s !== "submit" && s !== "reset") || t != null)) {
        Pu(e);
        return;
      }
      ((n = n != null ? "" + Lt(n) : ""),
        (t = t != null ? "" + Lt(t) : n),
        x || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((a = a ?? u),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (e.checked = x ? e.checked : !!a),
      (e.defaultChecked = !!a),
      g != null &&
        typeof g != "function" &&
        typeof g != "symbol" &&
        typeof g != "boolean" &&
        (e.name = g),
      Pu(e));
  }
  function Gu(e, t, n) {
    (t === "number" && yr(e.ownerDocument) === e) ||
      e.defaultValue === "" + n ||
      (e.defaultValue = "" + n);
  }
  function kl(e, t, n, a) {
    if (((e = e.options), t)) {
      t = {};
      for (var u = 0; u < n.length; u++) t["$" + n[u]] = !0;
      for (n = 0; n < e.length; n++)
        ((u = t.hasOwnProperty("$" + e[n].value)),
          e[n].selected !== u && (e[n].selected = u),
          u && a && (e[n].defaultSelected = !0));
    } else {
      for (n = "" + Lt(n), t = null, u = 0; u < e.length; u++) {
        if (e[u].value === n) {
          ((e[u].selected = !0), a && (e[u].defaultSelected = !0));
          return;
        }
        t !== null || e[u].disabled || (t = e[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Pd(e, t, n) {
    if (t != null && ((t = "" + Lt(t)), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Lt(n) : "";
  }
  function Vd(e, t, n, a) {
    if (t == null) {
      if (a != null) {
        if (n != null) throw Error(i(92));
        if (ge(a)) {
          if (1 < a.length) throw Error(i(93));
          a = a[0];
        }
        n = a;
      }
      (n == null && (n = ""), (t = n));
    }
    ((n = Lt(t)),
      (e.defaultValue = n),
      (a = e.textContent),
      a === n && a !== "" && a !== null && (e.value = a),
      Pu(e));
  }
  function Fl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Sx = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Gd(e, t, n) {
    var a = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === ""
      ? a
        ? e.setProperty(t, "")
        : t === "float"
          ? (e.cssFloat = "")
          : (e[t] = "")
      : a
        ? e.setProperty(t, n)
        : typeof n != "number" || n === 0 || Sx.has(t)
          ? t === "float"
            ? (e.cssFloat = n)
            : (e[t] = ("" + n).trim())
          : (e[t] = n + "px");
  }
  function Yd(e, t, n) {
    if (t != null && typeof t != "object") throw Error(i(62));
    if (((e = e.style), n != null)) {
      for (var a in n)
        !n.hasOwnProperty(a) ||
          (t != null && t.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0
            ? e.setProperty(a, "")
            : a === "float"
              ? (e.cssFloat = "")
              : (e[a] = ""));
      for (var u in t) ((a = t[u]), t.hasOwnProperty(u) && n[u] !== a && Gd(e, u, a));
    } else for (var s in t) t.hasOwnProperty(s) && Gd(e, s, t[s]);
  }
  function Yu(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var bx = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    xx =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Sr(e) {
    return xx.test("" + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function hn() {}
  var qu = null;
  function Xu(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var Jl = null,
    Wl = null;
  function qd(e) {
    var t = $l(e);
    if (t && (e = t.stateNode)) {
      var n = e[vt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case "input":
          if (
            (Vu(
              e,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (t = n.name),
            n.type === "radio" && t != null)
          ) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll('input[name="' + Ut("" + t) + '"][type="radio"]'), t = 0;
              t < n.length;
              t++
            ) {
              var a = n[t];
              if (a !== e && a.form === e.form) {
                var u = a[vt] || null;
                if (!u) throw Error(i(90));
                Vu(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name,
                );
              }
            }
            for (t = 0; t < n.length; t++) ((a = n[t]), a.form === e.form && Bd(a));
          }
          break e;
        case "textarea":
          Pd(e, n.value, n.defaultValue);
          break e;
        case "select":
          ((t = n.value), t != null && kl(e, !!n.multiple, t, !1));
      }
    }
  }
  var Iu = !1;
  function Xd(e, t, n) {
    if (Iu) return e(t, n);
    Iu = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (
        ((Iu = !1),
        (Jl !== null || Wl !== null) &&
          (ri(), Jl && ((t = Jl), (e = Wl), (Wl = Jl = null), qd(t), e)))
      )
        for (t = 0; t < e.length; t++) qd(e[t]);
    }
  }
  function to(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var a = n[vt] || null;
    if (a === null) return null;
    n = a[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((a = !a.disabled) ||
          ((e = e.type),
          (a = !(e === "button" || e === "input" || e === "select" || e === "textarea"))),
          (e = !a));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(i(231, t, typeof n));
    return n;
  }
  var vn = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    Ku = !1;
  if (vn)
    try {
      var no = {};
      (Object.defineProperty(no, "passive", {
        get: function () {
          Ku = !0;
        },
      }),
        window.addEventListener("test", no, no),
        window.removeEventListener("test", no, no));
    } catch {
      Ku = !1;
    }
  var Bn = null,
    $u = null,
    br = null;
  function Id() {
    if (br) return br;
    var e,
      t = $u,
      n = t.length,
      a,
      u = "value" in Bn ? Bn.value : Bn.textContent,
      s = u.length;
    for (e = 0; e < n && t[e] === u[e]; e++);
    var g = n - e;
    for (a = 1; a <= g && t[n - a] === u[s - a]; a++);
    return (br = u.slice(e, 1 < a ? 1 - a : void 0));
  }
  function xr(e) {
    var t = e.keyCode;
    return (
      "charCode" in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Er() {
    return !0;
  }
  function Kd() {
    return !1;
  }
  function mt(e) {
    function t(n, a, u, s, g) {
      ((this._reactName = n),
        (this._targetInst = u),
        (this.type = a),
        (this.nativeEvent = s),
        (this.target = g),
        (this.currentTarget = null));
      for (var x in e) e.hasOwnProperty(x) && ((n = e[x]), (this[x] = n ? n(s) : s[x]));
      return (
        (this.isDefaultPrevented = (
          s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1
        )
          ? Er
          : Kd),
        (this.isPropagationStopped = Kd),
        this
      );
    }
    return (
      y(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = Er));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = Er));
        },
        persist: function () {},
        isPersistent: Er,
      }),
      t
    );
  }
  var El = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Cr = mt(El),
    lo = y({}, El, { view: 0, detail: 0 }),
    Ex = mt(lo),
    Qu,
    Zu,
    ao,
    Rr = y({}, lo, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Fu,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== ao &&
              (ao && e.type === "mousemove"
                ? ((Qu = e.screenX - ao.screenX), (Zu = e.screenY - ao.screenY))
                : (Zu = Qu = 0),
              (ao = e)),
            Qu);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : Zu;
      },
    }),
    $d = mt(Rr),
    Cx = y({}, Rr, { dataTransfer: 0 }),
    Rx = mt(Cx),
    Tx = y({}, lo, { relatedTarget: 0 }),
    ku = mt(Tx),
    wx = y({}, El, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Ax = mt(wx),
    _x = y({}, El, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    Mx = mt(_x),
    Ox = y({}, El, { data: 0 }),
    Qd = mt(Ox),
    Dx = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    Nx = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    zx = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function jx(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = zx[e]) ? !!t[e] : !1;
  }
  function Fu() {
    return jx;
  }
  var Lx = y({}, lo, {
      key: function (e) {
        if (e.key) {
          var t = Dx[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = xr(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? Nx[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Fu,
      charCode: function (e) {
        return e.type === "keypress" ? xr(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? xr(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    Ux = mt(Lx),
    Bx = y({}, Rr, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Zd = mt(Bx),
    Hx = y({}, lo, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Fu,
    }),
    Px = mt(Hx),
    Vx = y({}, El, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Gx = mt(Vx),
    Yx = y({}, Rr, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    qx = mt(Yx),
    Xx = y({}, El, { newState: 0, oldState: 0 }),
    Ix = mt(Xx),
    Kx = [9, 13, 27, 32],
    Ju = vn && "CompositionEvent" in window,
    oo = null;
  vn && "documentMode" in document && (oo = document.documentMode);
  var $x = vn && "TextEvent" in window && !oo,
    kd = vn && (!Ju || (oo && 8 < oo && 11 >= oo)),
    Fd = " ",
    Jd = !1;
  function Wd(e, t) {
    switch (e) {
      case "keyup":
        return Kx.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ep(e) {
    return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
  }
  var ea = !1;
  function Qx(e, t) {
    switch (e) {
      case "compositionend":
        return ep(t);
      case "keypress":
        return t.which !== 32 ? null : ((Jd = !0), Fd);
      case "textInput":
        return ((e = t.data), e === Fd && Jd ? null : e);
      default:
        return null;
    }
  }
  function Zx(e, t) {
    if (ea)
      return e === "compositionend" || (!Ju && Wd(e, t))
        ? ((e = Id()), (br = $u = Bn = null), (ea = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return kd && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var kx = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function tp(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!kx[e.type] : t === "textarea";
  }
  function np(e, t, n, a) {
    (Jl ? (Wl ? Wl.push(a) : (Wl = [a])) : (Jl = a),
      (t = pi(t, "onChange")),
      0 < t.length &&
        ((n = new Cr("onChange", "change", null, n, a)), e.push({ event: n, listeners: t })));
  }
  var ro = null,
    io = null;
  function Fx(e) {
    Hv(e, 0);
  }
  function Tr(e) {
    var t = eo(e);
    if (Bd(t)) return e;
  }
  function lp(e, t) {
    if (e === "change") return t;
  }
  var ap = !1;
  if (vn) {
    var Wu;
    if (vn) {
      var ec = "oninput" in document;
      if (!ec) {
        var op = document.createElement("div");
        (op.setAttribute("oninput", "return;"), (ec = typeof op.oninput == "function"));
      }
      Wu = ec;
    } else Wu = !1;
    ap = Wu && (!document.documentMode || 9 < document.documentMode);
  }
  function rp() {
    ro && (ro.detachEvent("onpropertychange", ip), (io = ro = null));
  }
  function ip(e) {
    if (e.propertyName === "value" && Tr(io)) {
      var t = [];
      (np(t, io, e, Xu(e)), Xd(Fx, t));
    }
  }
  function Jx(e, t, n) {
    e === "focusin"
      ? (rp(), (ro = t), (io = n), ro.attachEvent("onpropertychange", ip))
      : e === "focusout" && rp();
  }
  function Wx(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Tr(io);
  }
  function eE(e, t) {
    if (e === "click") return Tr(t);
  }
  function tE(e, t) {
    if (e === "input" || e === "change") return Tr(t);
  }
  function nE(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var Tt = typeof Object.is == "function" ? Object.is : nE;
  function uo(e, t) {
    if (Tt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e),
      a = Object.keys(t);
    if (n.length !== a.length) return !1;
    for (a = 0; a < n.length; a++) {
      var u = n[a];
      if (!Du.call(t, u) || !Tt(e[u], t[u])) return !1;
    }
    return !0;
  }
  function up(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function cp(e, t) {
    var n = up(e);
    e = 0;
    for (var a; n; ) {
      if (n.nodeType === 3) {
        if (((a = e + n.textContent.length), e <= t && a >= t)) return { node: n, offset: t - e };
        e = a;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = up(n);
    }
  }
  function sp(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? sp(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function fp(e) {
    e =
      e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = yr(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = yr(e.document);
    }
    return t;
  }
  function tc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  var lE = vn && "documentMode" in document && 11 >= document.documentMode,
    ta = null,
    nc = null,
    co = null,
    lc = !1;
  function dp(e, t, n) {
    var a = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    lc ||
      ta == null ||
      ta !== yr(a) ||
      ((a = ta),
      "selectionStart" in a && tc(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (co && uo(co, a)) ||
        ((co = a),
        (a = pi(nc, "onSelect")),
        0 < a.length &&
          ((t = new Cr("onSelect", "select", null, t, n)),
          e.push({ event: t, listeners: a }),
          (t.target = ta))));
  }
  function Cl(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n["Webkit" + e] = "webkit" + t),
      (n["Moz" + e] = "moz" + t),
      n
    );
  }
  var na = {
      animationend: Cl("Animation", "AnimationEnd"),
      animationiteration: Cl("Animation", "AnimationIteration"),
      animationstart: Cl("Animation", "AnimationStart"),
      transitionrun: Cl("Transition", "TransitionRun"),
      transitionstart: Cl("Transition", "TransitionStart"),
      transitioncancel: Cl("Transition", "TransitionCancel"),
      transitionend: Cl("Transition", "TransitionEnd"),
    },
    ac = {},
    pp = {};
  vn &&
    ((pp = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete na.animationend.animation,
      delete na.animationiteration.animation,
      delete na.animationstart.animation),
    "TransitionEvent" in window || delete na.transitionend.transition);
  function Rl(e) {
    if (ac[e]) return ac[e];
    if (!na[e]) return e;
    var t = na[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in pp) return (ac[e] = t[n]);
    return e;
  }
  var hp = Rl("animationend"),
    vp = Rl("animationiteration"),
    mp = Rl("animationstart"),
    aE = Rl("transitionrun"),
    oE = Rl("transitionstart"),
    rE = Rl("transitioncancel"),
    gp = Rl("transitionend"),
    yp = new Map(),
    oc =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  oc.push("scrollEnd");
  function Qt(e, t) {
    (yp.set(e, t), xl(t, [e]));
  }
  var wr =
      typeof reportError == "function"
        ? reportError
        : function (e) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var t = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == "object" && e !== null && typeof e.message == "string"
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", e);
              return;
            }
            console.error(e);
          },
    Bt = [],
    la = 0,
    rc = 0;
  function Ar() {
    for (var e = la, t = (rc = la = 0); t < e; ) {
      var n = Bt[t];
      Bt[t++] = null;
      var a = Bt[t];
      Bt[t++] = null;
      var u = Bt[t];
      Bt[t++] = null;
      var s = Bt[t];
      if (((Bt[t++] = null), a !== null && u !== null)) {
        var g = a.pending;
        (g === null ? (u.next = u) : ((u.next = g.next), (g.next = u)), (a.pending = u));
      }
      s !== 0 && Sp(n, u, s);
    }
  }
  function _r(e, t, n, a) {
    ((Bt[la++] = e),
      (Bt[la++] = t),
      (Bt[la++] = n),
      (Bt[la++] = a),
      (rc |= a),
      (e.lanes |= a),
      (e = e.alternate),
      e !== null && (e.lanes |= a));
  }
  function ic(e, t, n, a) {
    return (_r(e, t, n, a), Mr(e));
  }
  function Tl(e, t) {
    return (_r(e, null, null, t), Mr(e));
  }
  function Sp(e, t, n) {
    e.lanes |= n;
    var a = e.alternate;
    a !== null && (a.lanes |= n);
    for (var u = !1, s = e.return; s !== null; )
      ((s.childLanes |= n),
        (a = s.alternate),
        a !== null && (a.childLanes |= n),
        s.tag === 22 && ((e = s.stateNode), e === null || e._visibility & 1 || (u = !0)),
        (e = s),
        (s = s.return));
    return e.tag === 3
      ? ((s = e.stateNode),
        u &&
          t !== null &&
          ((u = 31 - Rt(n)),
          (e = s.hiddenUpdates),
          (a = e[u]),
          a === null ? (e[u] = [t]) : a.push(t),
          (t.lane = n | 536870912)),
        s)
      : null;
  }
  function Mr(e) {
    if (50 < No) throw ((No = 0), (ms = null), Error(i(185)));
    for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var aa = {};
  function iE(e, t, n, a) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function wt(e, t, n, a) {
    return new iE(e, t, n, a);
  }
  function uc(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function mn(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = wt(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 65011712),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      (n.refCleanup = e.refCleanup),
      n
    );
  }
  function bp(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return (
      n === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = n.childLanes),
          (e.lanes = n.lanes),
          (e.child = n.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = n.memoizedProps),
          (e.memoizedState = n.memoizedState),
          (e.updateQueue = n.updateQueue),
          (e.type = n.type),
          (t = n.dependencies),
          (e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function Or(e, t, n, a, u, s) {
    var g = 0;
    if (((a = e), typeof e == "function")) uc(e) && (g = 1);
    else if (typeof e == "string")
      g = dC(e, n, W.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case te:
          return ((e = wt(31, n, t, u)), (e.elementType = te), (e.lanes = s), e);
        case C:
          return wl(n.children, u, s, t);
        case T:
          ((g = 8), (u |= 24));
          break;
        case _:
          return ((e = wt(12, n, t, u | 2)), (e.elementType = _), (e.lanes = s), e);
        case K:
          return ((e = wt(13, n, t, u)), (e.elementType = K), (e.lanes = s), e);
        case F:
          return ((e = wt(19, n, t, u)), (e.elementType = F), (e.lanes = s), e);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case N:
                g = 10;
                break e;
              case D:
                g = 9;
                break e;
              case B:
                g = 11;
                break e;
              case V:
                g = 14;
                break e;
              case ee:
                ((g = 16), (a = null));
                break e;
            }
          ((g = 29), (n = Error(i(130, e === null ? "null" : typeof e, ""))), (a = null));
      }
    return ((t = wt(g, n, t, u)), (t.elementType = e), (t.type = a), (t.lanes = s), t);
  }
  function wl(e, t, n, a) {
    return ((e = wt(7, e, a, t)), (e.lanes = n), e);
  }
  function cc(e, t, n) {
    return ((e = wt(6, e, null, t)), (e.lanes = n), e);
  }
  function xp(e) {
    var t = wt(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function sc(e, t, n) {
    return (
      (t = wt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var Ep = new WeakMap();
  function Ht(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Ep.get(e);
      return n !== void 0 ? n : ((t = { value: e, source: t, stack: xd(t) }), Ep.set(e, t), t);
    }
    return { value: e, source: t, stack: xd(t) };
  }
  var oa = [],
    ra = 0,
    Dr = null,
    so = 0,
    Pt = [],
    Vt = 0,
    Hn = null,
    tn = 1,
    nn = "";
  function gn(e, t) {
    ((oa[ra++] = so), (oa[ra++] = Dr), (Dr = e), (so = t));
  }
  function Cp(e, t, n) {
    ((Pt[Vt++] = tn), (Pt[Vt++] = nn), (Pt[Vt++] = Hn), (Hn = e));
    var a = tn;
    e = nn;
    var u = 32 - Rt(a) - 1;
    ((a &= ~(1 << u)), (n += 1));
    var s = 32 - Rt(t) + u;
    if (30 < s) {
      var g = u - (u % 5);
      ((s = (a & ((1 << g) - 1)).toString(32)),
        (a >>= g),
        (u -= g),
        (tn = (1 << (32 - Rt(t) + u)) | (n << u) | a),
        (nn = s + e));
    } else ((tn = (1 << s) | (n << u) | a), (nn = e));
  }
  function fc(e) {
    e.return !== null && (gn(e, 1), Cp(e, 1, 0));
  }
  function dc(e) {
    for (; e === Dr; ) ((Dr = oa[--ra]), (oa[ra] = null), (so = oa[--ra]), (oa[ra] = null));
    for (; e === Hn; )
      ((Hn = Pt[--Vt]),
        (Pt[Vt] = null),
        (nn = Pt[--Vt]),
        (Pt[Vt] = null),
        (tn = Pt[--Vt]),
        (Pt[Vt] = null));
  }
  function Rp(e, t) {
    ((Pt[Vt++] = tn), (Pt[Vt++] = nn), (Pt[Vt++] = Hn), (tn = t.id), (nn = t.overflow), (Hn = e));
  }
  var at = null,
    He = null,
    we = !1,
    Pn = null,
    Gt = !1,
    pc = Error(i(519));
  function Vn(e) {
    var t = Error(
      i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""),
    );
    throw (fo(Ht(t, e)), pc);
  }
  function Tp(e) {
    var t = e.stateNode,
      n = e.type,
      a = e.memoizedProps;
    switch (((t[lt] = e), (t[vt] = a), n)) {
      case "dialog":
        (Ce("cancel", t), Ce("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        Ce("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < jo.length; n++) Ce(jo[n], t);
        break;
      case "source":
        Ce("error", t);
        break;
      case "img":
      case "image":
      case "link":
        (Ce("error", t), Ce("load", t));
        break;
      case "details":
        Ce("toggle", t);
        break;
      case "input":
        (Ce("invalid", t),
          Hd(t, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
        break;
      case "select":
        Ce("invalid", t);
        break;
      case "textarea":
        (Ce("invalid", t), Vd(t, a.value, a.defaultValue, a.children));
    }
    ((n = a.children),
      (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
      t.textContent === "" + n ||
      a.suppressHydrationWarning === !0 ||
      Yv(t.textContent, n)
        ? (a.popover != null && (Ce("beforetoggle", t), Ce("toggle", t)),
          a.onScroll != null && Ce("scroll", t),
          a.onScrollEnd != null && Ce("scrollend", t),
          a.onClick != null && (t.onclick = hn),
          (t = !0))
        : (t = !1),
      t || Vn(e, !0));
  }
  function wp(e) {
    for (at = e.return; at; )
      switch (at.tag) {
        case 5:
        case 31:
        case 13:
          Gt = !1;
          return;
        case 27:
        case 3:
          Gt = !0;
          return;
        default:
          at = at.return;
      }
  }
  function ia(e) {
    if (e !== at) return !1;
    if (!we) return (wp(e), (we = !0), !1);
    var t = e.tag,
      n;
    if (
      ((n = t !== 3 && t !== 27) &&
        ((n = t === 5) &&
          ((n = e.type), (n = !(n !== "form" && n !== "button") || Ds(e.type, e.memoizedProps))),
        (n = !n)),
      n && He && Vn(e),
      wp(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(i(317));
      He = Fv(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(i(317));
      He = Fv(e);
    } else
      t === 27
        ? ((t = He), el(e.type) ? ((e = Us), (Us = null), (He = e)) : (He = t))
        : (He = at ? qt(e.stateNode.nextSibling) : null);
    return !0;
  }
  function Al() {
    ((He = at = null), (we = !1));
  }
  function hc() {
    var e = Pn;
    return (e !== null && (bt === null ? (bt = e) : bt.push.apply(bt, e), (Pn = null)), e);
  }
  function fo(e) {
    Pn === null ? (Pn = [e]) : Pn.push(e);
  }
  var vc = M(null),
    _l = null,
    yn = null;
  function Gn(e, t, n) {
    (J(vc, t._currentValue), (t._currentValue = n));
  }
  function Sn(e) {
    ((e._currentValue = vc.current), Y(vc));
  }
  function mc(e, t, n) {
    for (; e !== null; ) {
      var a = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), a !== null && (a.childLanes |= t))
          : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function gc(e, t, n, a) {
    var u = e.child;
    for (u !== null && (u.return = e); u !== null; ) {
      var s = u.dependencies;
      if (s !== null) {
        var g = u.child;
        s = s.firstContext;
        e: for (; s !== null; ) {
          var x = s;
          s = u;
          for (var A = 0; A < t.length; A++)
            if (x.context === t[A]) {
              ((s.lanes |= n),
                (x = s.alternate),
                x !== null && (x.lanes |= n),
                mc(s.return, n, e),
                a || (g = null));
              break e;
            }
          s = x.next;
        }
      } else if (u.tag === 18) {
        if (((g = u.return), g === null)) throw Error(i(341));
        ((g.lanes |= n), (s = g.alternate), s !== null && (s.lanes |= n), mc(g, n, e), (g = null));
      } else g = u.child;
      if (g !== null) g.return = u;
      else
        for (g = u; g !== null; ) {
          if (g === e) {
            g = null;
            break;
          }
          if (((u = g.sibling), u !== null)) {
            ((u.return = g.return), (g = u));
            break;
          }
          g = g.return;
        }
      u = g;
    }
  }
  function ua(e, t, n, a) {
    e = null;
    for (var u = t, s = !1; u !== null; ) {
      if (!s) {
        if ((u.flags & 524288) !== 0) s = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var g = u.alternate;
        if (g === null) throw Error(i(387));
        if (((g = g.memoizedProps), g !== null)) {
          var x = u.type;
          Tt(u.pendingProps.value, g.value) || (e !== null ? e.push(x) : (e = [x]));
        }
      } else if (u === k.current) {
        if (((g = u.alternate), g === null)) throw Error(i(387));
        g.memoizedState.memoizedState !== u.memoizedState.memoizedState &&
          (e !== null ? e.push(Po) : (e = [Po]));
      }
      u = u.return;
    }
    (e !== null && gc(t, e, n, a), (t.flags |= 262144));
  }
  function Nr(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Tt(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function Ml(e) {
    ((_l = e), (yn = null), (e = e.dependencies), e !== null && (e.firstContext = null));
  }
  function ot(e) {
    return Ap(_l, e);
  }
  function zr(e, t) {
    return (_l === null && Ml(e), Ap(e, t));
  }
  function Ap(e, t) {
    var n = t._currentValue;
    if (((t = { context: t, memoizedValue: n, next: null }), yn === null)) {
      if (e === null) throw Error(i(308));
      ((yn = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
    } else yn = yn.next = t;
    return n;
  }
  var uE =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (n, a) {
                  e.push(a);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (n) {
                  return n();
                }));
            };
          },
    cE = l.unstable_scheduleCallback,
    sE = l.unstable_NormalPriority,
    Qe = {
      $$typeof: N,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function yc() {
    return { controller: new uE(), data: new Map(), refCount: 0 };
  }
  function po(e) {
    (e.refCount--,
      e.refCount === 0 &&
        cE(sE, function () {
          e.controller.abort();
        }));
  }
  var ho = null,
    Sc = 0,
    ca = 0,
    sa = null;
  function fE(e, t) {
    if (ho === null) {
      var n = (ho = []);
      ((Sc = 0),
        (ca = Es()),
        (sa = {
          status: "pending",
          value: void 0,
          then: function (a) {
            n.push(a);
          },
        }));
    }
    return (Sc++, t.then(_p, _p), t);
  }
  function _p() {
    if (--Sc === 0 && ho !== null) {
      sa !== null && (sa.status = "fulfilled");
      var e = ho;
      ((ho = null), (ca = 0), (sa = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function dE(e, t) {
    var n = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (u) {
          n.push(u);
        },
      };
    return (
      e.then(
        function () {
          ((a.status = "fulfilled"), (a.value = t));
          for (var u = 0; u < n.length; u++) (0, n[u])(t);
        },
        function (u) {
          for (a.status = "rejected", a.reason = u, u = 0; u < n.length; u++) (0, n[u])(void 0);
        },
      ),
      a
    );
  }
  var Mp = j.S;
  j.S = function (e, t) {
    ((dv = Et()),
      typeof t == "object" && t !== null && typeof t.then == "function" && fE(e, t),
      Mp !== null && Mp(e, t));
  };
  var Ol = M(null);
  function bc() {
    var e = Ol.current;
    return e !== null ? e : Be.pooledCache;
  }
  function jr(e, t) {
    t === null ? J(Ol, Ol.current) : J(Ol, t.pool);
  }
  function Op() {
    var e = bc();
    return e === null ? null : { parent: Qe._currentValue, pool: e };
  }
  var fa = Error(i(460)),
    xc = Error(i(474)),
    Lr = Error(i(542)),
    Ur = { then: function () {} };
  function Dp(e) {
    return ((e = e.status), e === "fulfilled" || e === "rejected");
  }
  function Np(e, t, n) {
    switch (
      ((n = e[n]), n === void 0 ? e.push(t) : n !== t && (t.then(hn, hn), (t = n)), t.status)
    ) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((e = t.reason), jp(e), e);
      default:
        if (typeof t.status == "string") t.then(hn, hn);
        else {
          if (((e = Be), e !== null && 100 < e.shellSuspendCounter)) throw Error(i(482));
          ((e = t),
            (e.status = "pending"),
            e.then(
              function (a) {
                if (t.status === "pending") {
                  var u = t;
                  ((u.status = "fulfilled"), (u.value = a));
                }
              },
              function (a) {
                if (t.status === "pending") {
                  var u = t;
                  ((u.status = "rejected"), (u.reason = a));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((e = t.reason), jp(e), e);
        }
        throw ((Nl = t), fa);
    }
  }
  function Dl(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? ((Nl = n), fa) : n;
    }
  }
  var Nl = null;
  function zp() {
    if (Nl === null) throw Error(i(459));
    var e = Nl;
    return ((Nl = null), e);
  }
  function jp(e) {
    if (e === fa || e === Lr) throw Error(i(483));
  }
  var da = null,
    vo = 0;
  function Br(e) {
    var t = vo;
    return ((vo += 1), da === null && (da = []), Np(da, e, t));
  }
  function mo(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function Hr(e, t) {
    throw t.$$typeof === b
      ? Error(i(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          i(
            31,
            e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e,
          ),
        ));
  }
  function Lp(e) {
    function t(z, O) {
      if (e) {
        var L = z.deletions;
        L === null ? ((z.deletions = [O]), (z.flags |= 16)) : L.push(O);
      }
    }
    function n(z, O) {
      if (!e) return null;
      for (; O !== null; ) (t(z, O), (O = O.sibling));
      return null;
    }
    function a(z) {
      for (var O = new Map(); z !== null; )
        (z.key !== null ? O.set(z.key, z) : O.set(z.index, z), (z = z.sibling));
      return O;
    }
    function u(z, O) {
      return ((z = mn(z, O)), (z.index = 0), (z.sibling = null), z);
    }
    function s(z, O, L) {
      return (
        (z.index = L),
        e
          ? ((L = z.alternate),
            L !== null
              ? ((L = L.index), L < O ? ((z.flags |= 67108866), O) : L)
              : ((z.flags |= 67108866), O))
          : ((z.flags |= 1048576), O)
      );
    }
    function g(z) {
      return (e && z.alternate === null && (z.flags |= 67108866), z);
    }
    function x(z, O, L, q) {
      return O === null || O.tag !== 6
        ? ((O = cc(L, z.mode, q)), (O.return = z), O)
        : ((O = u(O, L)), (O.return = z), O);
    }
    function A(z, O, L, q) {
      var ue = L.type;
      return ue === C
        ? G(z, O, L.props.children, q, L.key)
        : O !== null &&
            (O.elementType === ue ||
              (typeof ue == "object" && ue !== null && ue.$$typeof === ee && Dl(ue) === O.type))
          ? ((O = u(O, L.props)), mo(O, L), (O.return = z), O)
          : ((O = Or(L.type, L.key, L.props, null, z.mode, q)), mo(O, L), (O.return = z), O);
    }
    function U(z, O, L, q) {
      return O === null ||
        O.tag !== 4 ||
        O.stateNode.containerInfo !== L.containerInfo ||
        O.stateNode.implementation !== L.implementation
        ? ((O = sc(L, z.mode, q)), (O.return = z), O)
        : ((O = u(O, L.children || [])), (O.return = z), O);
    }
    function G(z, O, L, q, ue) {
      return O === null || O.tag !== 7
        ? ((O = wl(L, z.mode, q, ue)), (O.return = z), O)
        : ((O = u(O, L)), (O.return = z), O);
    }
    function X(z, O, L) {
      if ((typeof O == "string" && O !== "") || typeof O == "number" || typeof O == "bigint")
        return ((O = cc("" + O, z.mode, L)), (O.return = z), O);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case R:
            return ((L = Or(O.type, O.key, O.props, null, z.mode, L)), mo(L, O), (L.return = z), L);
          case w:
            return ((O = sc(O, z.mode, L)), (O.return = z), O);
          case ee:
            return ((O = Dl(O)), X(z, O, L));
        }
        if (ge(O) || ie(O)) return ((O = wl(O, z.mode, L, null)), (O.return = z), O);
        if (typeof O.then == "function") return X(z, Br(O), L);
        if (O.$$typeof === N) return X(z, zr(z, O), L);
        Hr(z, O);
      }
      return null;
    }
    function H(z, O, L, q) {
      var ue = O !== null ? O.key : null;
      if ((typeof L == "string" && L !== "") || typeof L == "number" || typeof L == "bigint")
        return ue !== null ? null : x(z, O, "" + L, q);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case R:
            return L.key === ue ? A(z, O, L, q) : null;
          case w:
            return L.key === ue ? U(z, O, L, q) : null;
          case ee:
            return ((L = Dl(L)), H(z, O, L, q));
        }
        if (ge(L) || ie(L)) return ue !== null ? null : G(z, O, L, q, null);
        if (typeof L.then == "function") return H(z, O, Br(L), q);
        if (L.$$typeof === N) return H(z, O, zr(z, L), q);
        Hr(z, L);
      }
      return null;
    }
    function P(z, O, L, q, ue) {
      if ((typeof q == "string" && q !== "") || typeof q == "number" || typeof q == "bigint")
        return ((z = z.get(L) || null), x(O, z, "" + q, ue));
      if (typeof q == "object" && q !== null) {
        switch (q.$$typeof) {
          case R:
            return ((z = z.get(q.key === null ? L : q.key) || null), A(O, z, q, ue));
          case w:
            return ((z = z.get(q.key === null ? L : q.key) || null), U(O, z, q, ue));
          case ee:
            return ((q = Dl(q)), P(z, O, L, q, ue));
        }
        if (ge(q) || ie(q)) return ((z = z.get(L) || null), G(O, z, q, ue, null));
        if (typeof q.then == "function") return P(z, O, L, Br(q), ue);
        if (q.$$typeof === N) return P(z, O, L, zr(O, q), ue);
        Hr(O, q);
      }
      return null;
    }
    function ae(z, O, L, q) {
      for (
        var ue = null, Ae = null, oe = O, be = (O = 0), Te = null;
        oe !== null && be < L.length;
        be++
      ) {
        oe.index > be ? ((Te = oe), (oe = null)) : (Te = oe.sibling);
        var _e = H(z, oe, L[be], q);
        if (_e === null) {
          oe === null && (oe = Te);
          break;
        }
        (e && oe && _e.alternate === null && t(z, oe),
          (O = s(_e, O, be)),
          Ae === null ? (ue = _e) : (Ae.sibling = _e),
          (Ae = _e),
          (oe = Te));
      }
      if (be === L.length) return (n(z, oe), we && gn(z, be), ue);
      if (oe === null) {
        for (; be < L.length; be++)
          ((oe = X(z, L[be], q)),
            oe !== null &&
              ((O = s(oe, O, be)), Ae === null ? (ue = oe) : (Ae.sibling = oe), (Ae = oe)));
        return (we && gn(z, be), ue);
      }
      for (oe = a(oe); be < L.length; be++)
        ((Te = P(oe, z, be, L[be], q)),
          Te !== null &&
            (e && Te.alternate !== null && oe.delete(Te.key === null ? be : Te.key),
            (O = s(Te, O, be)),
            Ae === null ? (ue = Te) : (Ae.sibling = Te),
            (Ae = Te)));
      return (
        e &&
          oe.forEach(function (ol) {
            return t(z, ol);
          }),
        we && gn(z, be),
        ue
      );
    }
    function fe(z, O, L, q) {
      if (L == null) throw Error(i(151));
      for (
        var ue = null, Ae = null, oe = O, be = (O = 0), Te = null, _e = L.next();
        oe !== null && !_e.done;
        be++, _e = L.next()
      ) {
        oe.index > be ? ((Te = oe), (oe = null)) : (Te = oe.sibling);
        var ol = H(z, oe, _e.value, q);
        if (ol === null) {
          oe === null && (oe = Te);
          break;
        }
        (e && oe && ol.alternate === null && t(z, oe),
          (O = s(ol, O, be)),
          Ae === null ? (ue = ol) : (Ae.sibling = ol),
          (Ae = ol),
          (oe = Te));
      }
      if (_e.done) return (n(z, oe), we && gn(z, be), ue);
      if (oe === null) {
        for (; !_e.done; be++, _e = L.next())
          ((_e = X(z, _e.value, q)),
            _e !== null &&
              ((O = s(_e, O, be)), Ae === null ? (ue = _e) : (Ae.sibling = _e), (Ae = _e)));
        return (we && gn(z, be), ue);
      }
      for (oe = a(oe); !_e.done; be++, _e = L.next())
        ((_e = P(oe, z, be, _e.value, q)),
          _e !== null &&
            (e && _e.alternate !== null && oe.delete(_e.key === null ? be : _e.key),
            (O = s(_e, O, be)),
            Ae === null ? (ue = _e) : (Ae.sibling = _e),
            (Ae = _e)));
      return (
        e &&
          oe.forEach(function (CC) {
            return t(z, CC);
          }),
        we && gn(z, be),
        ue
      );
    }
    function Ue(z, O, L, q) {
      if (
        (typeof L == "object" &&
          L !== null &&
          L.type === C &&
          L.key === null &&
          (L = L.props.children),
        typeof L == "object" && L !== null)
      ) {
        switch (L.$$typeof) {
          case R:
            e: {
              for (var ue = L.key; O !== null; ) {
                if (O.key === ue) {
                  if (((ue = L.type), ue === C)) {
                    if (O.tag === 7) {
                      (n(z, O.sibling), (q = u(O, L.props.children)), (q.return = z), (z = q));
                      break e;
                    }
                  } else if (
                    O.elementType === ue ||
                    (typeof ue == "object" &&
                      ue !== null &&
                      ue.$$typeof === ee &&
                      Dl(ue) === O.type)
                  ) {
                    (n(z, O.sibling), (q = u(O, L.props)), mo(q, L), (q.return = z), (z = q));
                    break e;
                  }
                  n(z, O);
                  break;
                } else t(z, O);
                O = O.sibling;
              }
              L.type === C
                ? ((q = wl(L.props.children, z.mode, q, L.key)), (q.return = z), (z = q))
                : ((q = Or(L.type, L.key, L.props, null, z.mode, q)),
                  mo(q, L),
                  (q.return = z),
                  (z = q));
            }
            return g(z);
          case w:
            e: {
              for (ue = L.key; O !== null; ) {
                if (O.key === ue)
                  if (
                    O.tag === 4 &&
                    O.stateNode.containerInfo === L.containerInfo &&
                    O.stateNode.implementation === L.implementation
                  ) {
                    (n(z, O.sibling), (q = u(O, L.children || [])), (q.return = z), (z = q));
                    break e;
                  } else {
                    n(z, O);
                    break;
                  }
                else t(z, O);
                O = O.sibling;
              }
              ((q = sc(L, z.mode, q)), (q.return = z), (z = q));
            }
            return g(z);
          case ee:
            return ((L = Dl(L)), Ue(z, O, L, q));
        }
        if (ge(L)) return ae(z, O, L, q);
        if (ie(L)) {
          if (((ue = ie(L)), typeof ue != "function")) throw Error(i(150));
          return ((L = ue.call(L)), fe(z, O, L, q));
        }
        if (typeof L.then == "function") return Ue(z, O, Br(L), q);
        if (L.$$typeof === N) return Ue(z, O, zr(z, L), q);
        Hr(z, L);
      }
      return (typeof L == "string" && L !== "") || typeof L == "number" || typeof L == "bigint"
        ? ((L = "" + L),
          O !== null && O.tag === 6
            ? (n(z, O.sibling), (q = u(O, L)), (q.return = z), (z = q))
            : (n(z, O), (q = cc(L, z.mode, q)), (q.return = z), (z = q)),
          g(z))
        : n(z, O);
    }
    return function (z, O, L, q) {
      try {
        vo = 0;
        var ue = Ue(z, O, L, q);
        return ((da = null), ue);
      } catch (oe) {
        if (oe === fa || oe === Lr) throw oe;
        var Ae = wt(29, oe, null, z.mode);
        return ((Ae.lanes = q), (Ae.return = z), Ae);
      }
    };
  }
  var zl = Lp(!0),
    Up = Lp(!1),
    Yn = !1;
  function Ec(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Cc(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function qn(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Xn(e, t, n) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (Oe & 2) !== 0)) {
      var u = a.pending;
      return (
        u === null ? (t.next = t) : ((t.next = u.next), (u.next = t)),
        (a.pending = t),
        (t = Mr(e)),
        Sp(e, null, n),
        t
      );
    }
    return (_r(e, a, t, n), Mr(e));
  }
  function go(e, t, n) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194048) !== 0))) {
      var a = t.lanes;
      ((a &= e.pendingLanes), (n |= a), (t.lanes = n), Ad(e, n));
    }
  }
  function Rc(e, t) {
    var n = e.updateQueue,
      a = e.alternate;
    if (a !== null && ((a = a.updateQueue), n === a)) {
      var u = null,
        s = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var g = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
          (s === null ? (u = s = g) : (s = s.next = g), (n = n.next));
        } while (n !== null);
        s === null ? (u = s = t) : (s = s.next = t);
      } else u = s = t;
      ((n = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: s,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  var Tc = !1;
  function yo() {
    if (Tc) {
      var e = sa;
      if (e !== null) throw e;
    }
  }
  function So(e, t, n, a) {
    Tc = !1;
    var u = e.updateQueue;
    Yn = !1;
    var s = u.firstBaseUpdate,
      g = u.lastBaseUpdate,
      x = u.shared.pending;
    if (x !== null) {
      u.shared.pending = null;
      var A = x,
        U = A.next;
      ((A.next = null), g === null ? (s = U) : (g.next = U), (g = A));
      var G = e.alternate;
      G !== null &&
        ((G = G.updateQueue),
        (x = G.lastBaseUpdate),
        x !== g && (x === null ? (G.firstBaseUpdate = U) : (x.next = U), (G.lastBaseUpdate = A)));
    }
    if (s !== null) {
      var X = u.baseState;
      ((g = 0), (G = U = A = null), (x = s));
      do {
        var H = x.lane & -536870913,
          P = H !== x.lane;
        if (P ? (Re & H) === H : (a & H) === H) {
          (H !== 0 && H === ca && (Tc = !0),
            G !== null &&
              (G = G.next =
                { lane: 0, tag: x.tag, payload: x.payload, callback: null, next: null }));
          e: {
            var ae = e,
              fe = x;
            H = t;
            var Ue = n;
            switch (fe.tag) {
              case 1:
                if (((ae = fe.payload), typeof ae == "function")) {
                  X = ae.call(Ue, X, H);
                  break e;
                }
                X = ae;
                break e;
              case 3:
                ae.flags = (ae.flags & -65537) | 128;
              case 0:
                if (
                  ((ae = fe.payload),
                  (H = typeof ae == "function" ? ae.call(Ue, X, H) : ae),
                  H == null)
                )
                  break e;
                X = y({}, X, H);
                break e;
              case 2:
                Yn = !0;
            }
          }
          ((H = x.callback),
            H !== null &&
              ((e.flags |= 64),
              P && (e.flags |= 8192),
              (P = u.callbacks),
              P === null ? (u.callbacks = [H]) : P.push(H)));
        } else
          ((P = { lane: H, tag: x.tag, payload: x.payload, callback: x.callback, next: null }),
            G === null ? ((U = G = P), (A = X)) : (G = G.next = P),
            (g |= H));
        if (((x = x.next), x === null)) {
          if (((x = u.shared.pending), x === null)) break;
          ((P = x),
            (x = P.next),
            (P.next = null),
            (u.lastBaseUpdate = P),
            (u.shared.pending = null));
        }
      } while (!0);
      (G === null && (A = X),
        (u.baseState = A),
        (u.firstBaseUpdate = U),
        (u.lastBaseUpdate = G),
        s === null && (u.shared.lanes = 0),
        (Zn |= g),
        (e.lanes = g),
        (e.memoizedState = X));
    }
  }
  function Bp(e, t) {
    if (typeof e != "function") throw Error(i(191, e));
    e.call(t);
  }
  function Hp(e, t) {
    var n = e.callbacks;
    if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Bp(n[e], t);
  }
  var pa = M(null),
    Pr = M(0);
  function Pp(e, t) {
    ((e = _n), J(Pr, e), J(pa, t), (_n = e | t.baseLanes));
  }
  function wc() {
    (J(Pr, _n), J(pa, pa.current));
  }
  function Ac() {
    ((_n = Pr.current), Y(pa), Y(Pr));
  }
  var At = M(null),
    Yt = null;
  function In(e) {
    var t = e.alternate;
    (J(Xe, Xe.current & 1),
      J(At, e),
      Yt === null && (t === null || pa.current !== null || t.memoizedState !== null) && (Yt = e));
  }
  function _c(e) {
    (J(Xe, Xe.current), J(At, e), Yt === null && (Yt = e));
  }
  function Vp(e) {
    e.tag === 22 ? (J(Xe, Xe.current), J(At, e), Yt === null && (Yt = e)) : Kn();
  }
  function Kn() {
    (J(Xe, Xe.current), J(At, At.current));
  }
  function _t(e) {
    (Y(At), Yt === e && (Yt = null), Y(Xe));
  }
  var Xe = M(0);
  function Vr(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || js(n) || Ls(n))) return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === "forwards" ||
          t.memoizedProps.revealOrder === "backwards" ||
          t.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          t.memoizedProps.revealOrder === "together")
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var bn = 0,
    ye = null,
    je = null,
    Ze = null,
    Gr = !1,
    ha = !1,
    jl = !1,
    Yr = 0,
    bo = 0,
    va = null,
    pE = 0;
  function Ye() {
    throw Error(i(321));
  }
  function Mc(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Tt(e[n], t[n])) return !1;
    return !0;
  }
  function Oc(e, t, n, a, u, s) {
    return (
      (bn = s),
      (ye = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (j.H = e === null || e.memoizedState === null ? Ch : Ic),
      (jl = !1),
      (s = n(a, u)),
      (jl = !1),
      ha && (s = Yp(t, n, a, u)),
      Gp(e),
      s
    );
  }
  function Gp(e) {
    j.H = Co;
    var t = je !== null && je.next !== null;
    if (((bn = 0), (Ze = je = ye = null), (Gr = !1), (bo = 0), (va = null), t)) throw Error(i(300));
    e === null || ke || ((e = e.dependencies), e !== null && Nr(e) && (ke = !0));
  }
  function Yp(e, t, n, a) {
    ye = e;
    var u = 0;
    do {
      if ((ha && (va = null), (bo = 0), (ha = !1), 25 <= u)) throw Error(i(301));
      if (((u += 1), (Ze = je = null), e.updateQueue != null)) {
        var s = e.updateQueue;
        ((s.lastEffect = null),
          (s.events = null),
          (s.stores = null),
          s.memoCache != null && (s.memoCache.index = 0));
      }
      ((j.H = Rh), (s = t(n, a)));
    } while (ha);
    return s;
  }
  function hE() {
    var e = j.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == "function" ? xo(t) : t),
      (e = e.useState()[0]),
      (je !== null ? je.memoizedState : null) !== e && (ye.flags |= 1024),
      t
    );
  }
  function Dc() {
    var e = Yr !== 0;
    return ((Yr = 0), e);
  }
  function Nc(e, t, n) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
  }
  function zc(e) {
    if (Gr) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      Gr = !1;
    }
    ((bn = 0), (Ze = je = ye = null), (ha = !1), (bo = Yr = 0), (va = null));
  }
  function dt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Ze === null ? (ye.memoizedState = Ze = e) : (Ze = Ze.next = e), Ze);
  }
  function Ie() {
    if (je === null) {
      var e = ye.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = je.next;
    var t = Ze === null ? ye.memoizedState : Ze.next;
    if (t !== null) ((Ze = t), (je = e));
    else {
      if (e === null) throw ye.alternate === null ? Error(i(467)) : Error(i(310));
      ((je = e),
        (e = {
          memoizedState: je.memoizedState,
          baseState: je.baseState,
          baseQueue: je.baseQueue,
          queue: je.queue,
          next: null,
        }),
        Ze === null ? (ye.memoizedState = Ze = e) : (Ze = Ze.next = e));
    }
    return Ze;
  }
  function qr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function xo(e) {
    var t = bo;
    return (
      (bo += 1),
      va === null && (va = []),
      (e = Np(va, e, t)),
      (t = ye),
      (Ze === null ? t.memoizedState : Ze.next) === null &&
        ((t = t.alternate), (j.H = t === null || t.memoizedState === null ? Ch : Ic)),
      e
    );
  }
  function Xr(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return xo(e);
      if (e.$$typeof === N) return ot(e);
    }
    throw Error(i(438, String(e)));
  }
  function jc(e) {
    var t = null,
      n = ye.updateQueue;
    if ((n !== null && (t = n.memoCache), t == null)) {
      var a = ye.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (t = {
              data: a.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      n === null && ((n = qr()), (ye.updateQueue = n)),
      (n.memoCache = t),
      (n = t.data[t.index]),
      n === void 0)
    )
      for (n = t.data[t.index] = Array(e), a = 0; a < e; a++) n[a] = le;
    return (t.index++, n);
  }
  function xn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ir(e) {
    var t = Ie();
    return Lc(t, je, e);
  }
  function Lc(e, t, n) {
    var a = e.queue;
    if (a === null) throw Error(i(311));
    a.lastRenderedReducer = n;
    var u = e.baseQueue,
      s = a.pending;
    if (s !== null) {
      if (u !== null) {
        var g = u.next;
        ((u.next = s.next), (s.next = g));
      }
      ((t.baseQueue = u = s), (a.pending = null));
    }
    if (((s = e.baseState), u === null)) e.memoizedState = s;
    else {
      t = u.next;
      var x = (g = null),
        A = null,
        U = t,
        G = !1;
      do {
        var X = U.lane & -536870913;
        if (X !== U.lane ? (Re & X) === X : (bn & X) === X) {
          var H = U.revertLane;
          if (H === 0)
            (A !== null &&
              (A = A.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: U.action,
                  hasEagerState: U.hasEagerState,
                  eagerState: U.eagerState,
                  next: null,
                }),
              X === ca && (G = !0));
          else if ((bn & H) === H) {
            ((U = U.next), H === ca && (G = !0));
            continue;
          } else
            ((X = {
              lane: 0,
              revertLane: U.revertLane,
              gesture: null,
              action: U.action,
              hasEagerState: U.hasEagerState,
              eagerState: U.eagerState,
              next: null,
            }),
              A === null ? ((x = A = X), (g = s)) : (A = A.next = X),
              (ye.lanes |= H),
              (Zn |= H));
          ((X = U.action), jl && n(s, X), (s = U.hasEagerState ? U.eagerState : n(s, X)));
        } else
          ((H = {
            lane: X,
            revertLane: U.revertLane,
            gesture: U.gesture,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null,
          }),
            A === null ? ((x = A = H), (g = s)) : (A = A.next = H),
            (ye.lanes |= X),
            (Zn |= X));
        U = U.next;
      } while (U !== null && U !== t);
      if (
        (A === null ? (g = s) : (A.next = x),
        !Tt(s, e.memoizedState) && ((ke = !0), G && ((n = sa), n !== null)))
      )
        throw n;
      ((e.memoizedState = s), (e.baseState = g), (e.baseQueue = A), (a.lastRenderedState = s));
    }
    return (u === null && (a.lanes = 0), [e.memoizedState, a.dispatch]);
  }
  function Uc(e) {
    var t = Ie(),
      n = t.queue;
    if (n === null) throw Error(i(311));
    n.lastRenderedReducer = e;
    var a = n.dispatch,
      u = n.pending,
      s = t.memoizedState;
    if (u !== null) {
      n.pending = null;
      var g = (u = u.next);
      do ((s = e(s, g.action)), (g = g.next));
      while (g !== u);
      (Tt(s, t.memoizedState) || (ke = !0),
        (t.memoizedState = s),
        t.baseQueue === null && (t.baseState = s),
        (n.lastRenderedState = s));
    }
    return [s, a];
  }
  function qp(e, t, n) {
    var a = ye,
      u = Ie(),
      s = we;
    if (s) {
      if (n === void 0) throw Error(i(407));
      n = n();
    } else n = t();
    var g = !Tt((je || u).memoizedState, n);
    if (
      (g && ((u.memoizedState = n), (ke = !0)),
      (u = u.queue),
      Pc(Kp.bind(null, a, u, e), [e]),
      u.getSnapshot !== t || g || (Ze !== null && Ze.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        ma(9, { destroy: void 0 }, Ip.bind(null, a, u, n, t), null),
        Be === null)
      )
        throw Error(i(349));
      s || (bn & 127) !== 0 || Xp(a, t, n);
    }
    return n;
  }
  function Xp(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = ye.updateQueue),
      t === null
        ? ((t = qr()), (ye.updateQueue = t), (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function Ip(e, t, n, a) {
    ((t.value = n), (t.getSnapshot = a), $p(t) && Qp(e));
  }
  function Kp(e, t, n) {
    return n(function () {
      $p(t) && Qp(e);
    });
  }
  function $p(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Tt(e, n);
    } catch {
      return !0;
    }
  }
  function Qp(e) {
    var t = Tl(e, 2);
    t !== null && xt(t, e, 2);
  }
  function Bc(e) {
    var t = dt();
    if (typeof e == "function") {
      var n = e;
      if (((e = n()), jl)) {
        Ln(!0);
        try {
          n();
        } finally {
          Ln(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: xn,
        lastRenderedState: e,
      }),
      t
    );
  }
  function Zp(e, t, n, a) {
    return ((e.baseState = n), Lc(e, je, typeof a == "function" ? a : xn));
  }
  function vE(e, t, n, a, u) {
    if (Qr(e)) throw Error(i(485));
    if (((e = t.action), e !== null)) {
      var s = {
        payload: u,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (g) {
          s.listeners.push(g);
        },
      };
      (j.T !== null ? n(!0) : (s.isTransition = !1),
        a(s),
        (n = t.pending),
        n === null
          ? ((s.next = t.pending = s), kp(t, s))
          : ((s.next = n.next), (t.pending = n.next = s)));
    }
  }
  function kp(e, t) {
    var n = t.action,
      a = t.payload,
      u = e.state;
    if (t.isTransition) {
      var s = j.T,
        g = {};
      j.T = g;
      try {
        var x = n(u, a),
          A = j.S;
        (A !== null && A(g, x), Fp(e, t, x));
      } catch (U) {
        Hc(e, t, U);
      } finally {
        (s !== null && g.types !== null && (s.types = g.types), (j.T = s));
      }
    } else
      try {
        ((s = n(u, a)), Fp(e, t, s));
      } catch (U) {
        Hc(e, t, U);
      }
  }
  function Fp(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function"
      ? n.then(
          function (a) {
            Jp(e, t, a);
          },
          function (a) {
            return Hc(e, t, a);
          },
        )
      : Jp(e, t, n);
  }
  function Jp(e, t, n) {
    ((t.status = "fulfilled"),
      (t.value = n),
      Wp(t),
      (e.state = n),
      (t = e.pending),
      t !== null &&
        ((n = t.next), n === t ? (e.pending = null) : ((n = n.next), (t.next = n), kp(e, n))));
  }
  function Hc(e, t, n) {
    var a = e.pending;
    if (((e.pending = null), a !== null)) {
      a = a.next;
      do ((t.status = "rejected"), (t.reason = n), Wp(t), (t = t.next));
      while (t !== a);
    }
    e.action = null;
  }
  function Wp(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function eh(e, t) {
    return t;
  }
  function th(e, t) {
    if (we) {
      var n = Be.formState;
      if (n !== null) {
        e: {
          var a = ye;
          if (we) {
            if (He) {
              t: {
                for (var u = He, s = Gt; u.nodeType !== 8; ) {
                  if (!s) {
                    u = null;
                    break t;
                  }
                  if (((u = qt(u.nextSibling)), u === null)) {
                    u = null;
                    break t;
                  }
                }
                ((s = u.data), (u = s === "F!" || s === "F" ? u : null));
              }
              if (u) {
                ((He = qt(u.nextSibling)), (a = u.data === "F!"));
                break e;
              }
            }
            Vn(a);
          }
          a = !1;
        }
        a && (t = n[0]);
      }
    }
    return (
      (n = dt()),
      (n.memoizedState = n.baseState = t),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: eh,
        lastRenderedState: t,
      }),
      (n.queue = a),
      (n = bh.bind(null, ye, a)),
      (a.dispatch = n),
      (a = Bc(!1)),
      (s = Xc.bind(null, ye, !1, a.queue)),
      (a = dt()),
      (u = { state: t, dispatch: null, action: e, pending: null }),
      (a.queue = u),
      (n = vE.bind(null, ye, u, s, n)),
      (u.dispatch = n),
      (a.memoizedState = e),
      [t, n, !1]
    );
  }
  function nh(e) {
    var t = Ie();
    return lh(t, je, e);
  }
  function lh(e, t, n) {
    if (
      ((t = Lc(e, t, eh)[0]),
      (e = Ir(xn)[0]),
      typeof t == "object" && t !== null && typeof t.then == "function")
    )
      try {
        var a = xo(t);
      } catch (g) {
        throw g === fa ? Lr : g;
      }
    else a = t;
    t = Ie();
    var u = t.queue,
      s = u.dispatch;
    return (
      n !== t.memoizedState &&
        ((ye.flags |= 2048), ma(9, { destroy: void 0 }, mE.bind(null, u, n), null)),
      [a, s, e]
    );
  }
  function mE(e, t) {
    e.action = t;
  }
  function ah(e) {
    var t = Ie(),
      n = je;
    if (n !== null) return lh(t, n, e);
    (Ie(), (t = t.memoizedState), (n = Ie()));
    var a = n.queue.dispatch;
    return ((n.memoizedState = e), [t, a, !1]);
  }
  function ma(e, t, n, a) {
    return (
      (e = { tag: e, create: n, deps: a, inst: t, next: null }),
      (t = ye.updateQueue),
      t === null && ((t = qr()), (ye.updateQueue = t)),
      (n = t.lastEffect),
      n === null
        ? (t.lastEffect = e.next = e)
        : ((a = n.next), (n.next = e), (e.next = a), (t.lastEffect = e)),
      e
    );
  }
  function oh() {
    return Ie().memoizedState;
  }
  function Kr(e, t, n, a) {
    var u = dt();
    ((ye.flags |= e),
      (u.memoizedState = ma(1 | t, { destroy: void 0 }, n, a === void 0 ? null : a)));
  }
  function $r(e, t, n, a) {
    var u = Ie();
    a = a === void 0 ? null : a;
    var s = u.memoizedState.inst;
    je !== null && a !== null && Mc(a, je.memoizedState.deps)
      ? (u.memoizedState = ma(t, s, n, a))
      : ((ye.flags |= e), (u.memoizedState = ma(1 | t, s, n, a)));
  }
  function rh(e, t) {
    Kr(8390656, 8, e, t);
  }
  function Pc(e, t) {
    $r(2048, 8, e, t);
  }
  function gE(e) {
    ye.flags |= 4;
    var t = ye.updateQueue;
    if (t === null) ((t = qr()), (ye.updateQueue = t), (t.events = [e]));
    else {
      var n = t.events;
      n === null ? (t.events = [e]) : n.push(e);
    }
  }
  function ih(e) {
    var t = Ie().memoizedState;
    return (
      gE({ ref: t, nextImpl: e }),
      function () {
        if ((Oe & 2) !== 0) throw Error(i(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function uh(e, t) {
    return $r(4, 2, e, t);
  }
  function ch(e, t) {
    return $r(4, 4, e, t);
  }
  function sh(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function () {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function fh(e, t, n) {
    ((n = n != null ? n.concat([e]) : null), $r(4, 4, sh.bind(null, t, e), n));
  }
  function Vc() {}
  function dh(e, t) {
    var n = Ie();
    t = t === void 0 ? null : t;
    var a = n.memoizedState;
    return t !== null && Mc(t, a[1]) ? a[0] : ((n.memoizedState = [e, t]), e);
  }
  function ph(e, t) {
    var n = Ie();
    t = t === void 0 ? null : t;
    var a = n.memoizedState;
    if (t !== null && Mc(t, a[1])) return a[0];
    if (((a = e()), jl)) {
      Ln(!0);
      try {
        e();
      } finally {
        Ln(!1);
      }
    }
    return ((n.memoizedState = [a, t]), a);
  }
  function Gc(e, t, n) {
    return n === void 0 || ((bn & 1073741824) !== 0 && (Re & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = n), (e = hv()), (ye.lanes |= e), (Zn |= e), n);
  }
  function hh(e, t, n, a) {
    return Tt(n, t)
      ? n
      : pa.current !== null
        ? ((e = Gc(e, n, a)), Tt(e, t) || (ke = !0), e)
        : (bn & 42) === 0 || ((bn & 1073741824) !== 0 && (Re & 261930) === 0)
          ? ((ke = !0), (e.memoizedState = n))
          : ((e = hv()), (ye.lanes |= e), (Zn |= e), t);
  }
  function vh(e, t, n, a, u) {
    var s = I.p;
    I.p = s !== 0 && 8 > s ? s : 8;
    var g = j.T,
      x = {};
    ((j.T = x), Xc(e, !1, t, n));
    try {
      var A = u(),
        U = j.S;
      if (
        (U !== null && U(x, A), A !== null && typeof A == "object" && typeof A.then == "function")
      ) {
        var G = dE(A, a);
        Eo(e, t, G, Dt(e));
      } else Eo(e, t, a, Dt(e));
    } catch (X) {
      Eo(e, t, { then: function () {}, status: "rejected", reason: X }, Dt());
    } finally {
      ((I.p = s), g !== null && x.types !== null && (g.types = x.types), (j.T = g));
    }
  }
  function yE() {}
  function Yc(e, t, n, a) {
    if (e.tag !== 5) throw Error(i(476));
    var u = mh(e).queue;
    vh(
      e,
      u,
      t,
      $,
      n === null
        ? yE
        : function () {
            return (gh(e), n(a));
          },
    );
  }
  function mh(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: $,
      baseState: $,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: xn,
        lastRenderedState: $,
      },
      next: null,
    };
    var n = {};
    return (
      (t.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: xn,
          lastRenderedState: n,
        },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function gh(e) {
    var t = mh(e);
    (t.next === null && (t = e.alternate.memoizedState), Eo(e, t.next.queue, {}, Dt()));
  }
  function qc() {
    return ot(Po);
  }
  function yh() {
    return Ie().memoizedState;
  }
  function Sh() {
    return Ie().memoizedState;
  }
  function SE(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = Dt();
          e = qn(n);
          var a = Xn(t, e, n);
          (a !== null && (xt(a, t, n), go(a, t, n)), (t = { cache: yc() }), (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function bE(e, t, n) {
    var a = Dt();
    ((n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Qr(e) ? xh(t, n) : ((n = ic(e, t, n, a)), n !== null && (xt(n, e, a), Eh(n, t, a))));
  }
  function bh(e, t, n) {
    var a = Dt();
    Eo(e, t, n, a);
  }
  function Eo(e, t, n, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Qr(e)) xh(t, u);
    else {
      var s = e.alternate;
      if (
        e.lanes === 0 &&
        (s === null || s.lanes === 0) &&
        ((s = t.lastRenderedReducer), s !== null)
      )
        try {
          var g = t.lastRenderedState,
            x = s(g, n);
          if (((u.hasEagerState = !0), (u.eagerState = x), Tt(x, g)))
            return (_r(e, t, u, 0), Be === null && Ar(), !1);
        } catch {}
      if (((n = ic(e, t, u, a)), n !== null)) return (xt(n, e, a), Eh(n, t, a), !0);
    }
    return !1;
  }
  function Xc(e, t, n, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: Es(),
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Qr(e))
    ) {
      if (t) throw Error(i(479));
    } else ((t = ic(e, n, a, 2)), t !== null && xt(t, e, 2));
  }
  function Qr(e) {
    var t = e.alternate;
    return e === ye || (t !== null && t === ye);
  }
  function xh(e, t) {
    ha = Gr = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
  }
  function Eh(e, t, n) {
    if ((n & 4194048) !== 0) {
      var a = t.lanes;
      ((a &= e.pendingLanes), (n |= a), (t.lanes = n), Ad(e, n));
    }
  }
  var Co = {
    readContext: ot,
    use: Xr,
    useCallback: Ye,
    useContext: Ye,
    useEffect: Ye,
    useImperativeHandle: Ye,
    useLayoutEffect: Ye,
    useInsertionEffect: Ye,
    useMemo: Ye,
    useReducer: Ye,
    useRef: Ye,
    useState: Ye,
    useDebugValue: Ye,
    useDeferredValue: Ye,
    useTransition: Ye,
    useSyncExternalStore: Ye,
    useId: Ye,
    useHostTransitionStatus: Ye,
    useFormState: Ye,
    useActionState: Ye,
    useOptimistic: Ye,
    useMemoCache: Ye,
    useCacheRefresh: Ye,
  };
  Co.useEffectEvent = Ye;
  var Ch = {
      readContext: ot,
      use: Xr,
      useCallback: function (e, t) {
        return ((dt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: ot,
      useEffect: rh,
      useImperativeHandle: function (e, t, n) {
        ((n = n != null ? n.concat([e]) : null), Kr(4194308, 4, sh.bind(null, t, e), n));
      },
      useLayoutEffect: function (e, t) {
        return Kr(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        Kr(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = dt();
        t = t === void 0 ? null : t;
        var a = e();
        if (jl) {
          Ln(!0);
          try {
            e();
          } finally {
            Ln(!1);
          }
        }
        return ((n.memoizedState = [a, t]), a);
      },
      useReducer: function (e, t, n) {
        var a = dt();
        if (n !== void 0) {
          var u = n(t);
          if (jl) {
            Ln(!0);
            try {
              n(t);
            } finally {
              Ln(!1);
            }
          }
        } else u = t;
        return (
          (a.memoizedState = a.baseState = u),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: u,
          }),
          (a.queue = e),
          (e = e.dispatch = bE.bind(null, ye, e)),
          [a.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = dt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = Bc(e);
        var t = e.queue,
          n = bh.bind(null, ye, t);
        return ((t.dispatch = n), [e.memoizedState, n]);
      },
      useDebugValue: Vc,
      useDeferredValue: function (e, t) {
        var n = dt();
        return Gc(n, e, t);
      },
      useTransition: function () {
        var e = Bc(!1);
        return ((e = vh.bind(null, ye, e.queue, !0, !1)), (dt().memoizedState = e), [!1, e]);
      },
      useSyncExternalStore: function (e, t, n) {
        var a = ye,
          u = dt();
        if (we) {
          if (n === void 0) throw Error(i(407));
          n = n();
        } else {
          if (((n = t()), Be === null)) throw Error(i(349));
          (Re & 127) !== 0 || Xp(a, t, n);
        }
        u.memoizedState = n;
        var s = { value: n, getSnapshot: t };
        return (
          (u.queue = s),
          rh(Kp.bind(null, a, s, e), [e]),
          (a.flags |= 2048),
          ma(9, { destroy: void 0 }, Ip.bind(null, a, s, n, t), null),
          n
        );
      },
      useId: function () {
        var e = dt(),
          t = Be.identifierPrefix;
        if (we) {
          var n = nn,
            a = tn;
          ((n = (a & ~(1 << (32 - Rt(a) - 1))).toString(32) + n),
            (t = "_" + t + "R_" + n),
            (n = Yr++),
            0 < n && (t += "H" + n.toString(32)),
            (t += "_"));
        } else ((n = pE++), (t = "_" + t + "r_" + n.toString(32) + "_"));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: qc,
      useFormState: th,
      useActionState: th,
      useOptimistic: function (e) {
        var t = dt();
        t.memoizedState = t.baseState = e;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return ((t.queue = n), (t = Xc.bind(null, ye, !0, n)), (n.dispatch = t), [e, t]);
      },
      useMemoCache: jc,
      useCacheRefresh: function () {
        return (dt().memoizedState = SE.bind(null, ye));
      },
      useEffectEvent: function (e) {
        var t = dt(),
          n = { impl: e };
        return (
          (t.memoizedState = n),
          function () {
            if ((Oe & 2) !== 0) throw Error(i(440));
            return n.impl.apply(void 0, arguments);
          }
        );
      },
    },
    Ic = {
      readContext: ot,
      use: Xr,
      useCallback: dh,
      useContext: ot,
      useEffect: Pc,
      useImperativeHandle: fh,
      useInsertionEffect: uh,
      useLayoutEffect: ch,
      useMemo: ph,
      useReducer: Ir,
      useRef: oh,
      useState: function () {
        return Ir(xn);
      },
      useDebugValue: Vc,
      useDeferredValue: function (e, t) {
        var n = Ie();
        return hh(n, je.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Ir(xn)[0],
          t = Ie().memoizedState;
        return [typeof e == "boolean" ? e : xo(e), t];
      },
      useSyncExternalStore: qp,
      useId: yh,
      useHostTransitionStatus: qc,
      useFormState: nh,
      useActionState: nh,
      useOptimistic: function (e, t) {
        var n = Ie();
        return Zp(n, je, e, t);
      },
      useMemoCache: jc,
      useCacheRefresh: Sh,
    };
  Ic.useEffectEvent = ih;
  var Rh = {
    readContext: ot,
    use: Xr,
    useCallback: dh,
    useContext: ot,
    useEffect: Pc,
    useImperativeHandle: fh,
    useInsertionEffect: uh,
    useLayoutEffect: ch,
    useMemo: ph,
    useReducer: Uc,
    useRef: oh,
    useState: function () {
      return Uc(xn);
    },
    useDebugValue: Vc,
    useDeferredValue: function (e, t) {
      var n = Ie();
      return je === null ? Gc(n, e, t) : hh(n, je.memoizedState, e, t);
    },
    useTransition: function () {
      var e = Uc(xn)[0],
        t = Ie().memoizedState;
      return [typeof e == "boolean" ? e : xo(e), t];
    },
    useSyncExternalStore: qp,
    useId: yh,
    useHostTransitionStatus: qc,
    useFormState: ah,
    useActionState: ah,
    useOptimistic: function (e, t) {
      var n = Ie();
      return je !== null ? Zp(n, je, e, t) : ((n.baseState = e), [e, n.queue.dispatch]);
    },
    useMemoCache: jc,
    useCacheRefresh: Sh,
  };
  Rh.useEffectEvent = ih;
  function Kc(e, t, n, a) {
    ((t = e.memoizedState),
      (n = n(a, t)),
      (n = n == null ? t : y({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var $c = {
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var a = Dt(),
        u = qn(a);
      ((u.payload = t),
        n != null && (u.callback = n),
        (t = Xn(e, u, a)),
        t !== null && (xt(t, e, a), go(t, e, a)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var a = Dt(),
        u = qn(a);
      ((u.tag = 1),
        (u.payload = t),
        n != null && (u.callback = n),
        (t = Xn(e, u, a)),
        t !== null && (xt(t, e, a), go(t, e, a)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = Dt(),
        a = qn(n);
      ((a.tag = 2),
        t != null && (a.callback = t),
        (t = Xn(e, a, n)),
        t !== null && (xt(t, e, n), go(t, e, n)));
    },
  };
  function Th(e, t, n, a, u, s, g) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(a, s, g)
        : t.prototype && t.prototype.isPureReactComponent
          ? !uo(n, a) || !uo(u, s)
          : !0
    );
  }
  function wh(e, t, n, a) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, a),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(n, a),
      t.state !== e && $c.enqueueReplaceState(t, t.state, null));
  }
  function Ll(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var a in t) a !== "ref" && (n[a] = t[a]);
    }
    if ((e = e.defaultProps)) {
      n === t && (n = y({}, n));
      for (var u in e) n[u] === void 0 && (n[u] = e[u]);
    }
    return n;
  }
  function Ah(e) {
    wr(e);
  }
  function _h(e) {
    console.error(e);
  }
  function Mh(e) {
    wr(e);
  }
  function Zr(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Oh(e, t, n) {
    try {
      var a = e.onCaughtError;
      a(n.value, { componentStack: n.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function Qc(e, t, n) {
    return (
      (n = qn(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        Zr(e, t);
      }),
      n
    );
  }
  function Dh(e) {
    return ((e = qn(e)), (e.tag = 3), e);
  }
  function Nh(e, t, n, a) {
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var s = a.value;
      ((e.payload = function () {
        return u(s);
      }),
        (e.callback = function () {
          Oh(t, n, a);
        }));
    }
    var g = n.stateNode;
    g !== null &&
      typeof g.componentDidCatch == "function" &&
      (e.callback = function () {
        (Oh(t, n, a),
          typeof u != "function" && (kn === null ? (kn = new Set([this])) : kn.add(this)));
        var x = a.stack;
        this.componentDidCatch(a.value, { componentStack: x !== null ? x : "" });
      });
  }
  function xE(e, t, n, a, u) {
    if (((n.flags |= 32768), a !== null && typeof a == "object" && typeof a.then == "function")) {
      if (((t = n.alternate), t !== null && ua(t, n, u, !0), (n = At.current), n !== null)) {
        switch (n.tag) {
          case 31:
          case 13:
            return (
              Yt === null ? ii() : n.alternate === null && qe === 0 && (qe = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = u),
              a === Ur
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null ? (n.updateQueue = new Set([a])) : t.add(a),
                  Ss(e, a, u)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              a === Ur
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }),
                      (n.updateQueue = t))
                    : ((n = t.retryQueue), n === null ? (t.retryQueue = new Set([a])) : n.add(a)),
                  Ss(e, a, u)),
              !1
            );
        }
        throw Error(i(435, n.tag));
      }
      return (Ss(e, a, u), ii(), !1);
    }
    if (we)
      return (
        (t = At.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = u),
            a !== pc && ((e = Error(i(422), { cause: a })), fo(Ht(e, n))))
          : (a !== pc && ((t = Error(i(423), { cause: a })), fo(Ht(t, n))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (u &= -u),
            (e.lanes |= u),
            (a = Ht(a, n)),
            (u = Qc(e.stateNode, a, u)),
            Rc(e, u),
            qe !== 4 && (qe = 2)),
        !1
      );
    var s = Error(i(520), { cause: a });
    if (((s = Ht(s, n)), Do === null ? (Do = [s]) : Do.push(s), qe !== 4 && (qe = 2), t === null))
      return !0;
    ((a = Ht(a, n)), (n = t));
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (e = u & -u),
            (n.lanes |= e),
            (e = Qc(n.stateNode, a, e)),
            Rc(n, e),
            !1
          );
        case 1:
          if (
            ((t = n.type),
            (s = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (s !== null &&
                  typeof s.componentDidCatch == "function" &&
                  (kn === null || !kn.has(s)))))
          )
            return (
              (n.flags |= 65536),
              (u &= -u),
              (n.lanes |= u),
              (u = Dh(u)),
              Nh(u, e, n, a),
              Rc(n, u),
              !1
            );
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Zc = Error(i(461)),
    ke = !1;
  function rt(e, t, n, a) {
    t.child = e === null ? Up(t, null, n, a) : zl(t, e.child, n, a);
  }
  function zh(e, t, n, a, u) {
    n = n.render;
    var s = t.ref;
    if ("ref" in a) {
      var g = {};
      for (var x in a) x !== "ref" && (g[x] = a[x]);
    } else g = a;
    return (
      Ml(t),
      (a = Oc(e, t, n, g, s, u)),
      (x = Dc()),
      e !== null && !ke
        ? (Nc(e, t, u), En(e, t, u))
        : (we && x && fc(t), (t.flags |= 1), rt(e, t, a, u), t.child)
    );
  }
  function jh(e, t, n, a, u) {
    if (e === null) {
      var s = n.type;
      return typeof s == "function" && !uc(s) && s.defaultProps === void 0 && n.compare === null
        ? ((t.tag = 15), (t.type = s), Lh(e, t, s, a, u))
        : ((e = Or(n.type, null, a, t, t.mode, u)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((s = e.child), !ls(e, u))) {
      var g = s.memoizedProps;
      if (((n = n.compare), (n = n !== null ? n : uo), n(g, a) && e.ref === t.ref))
        return En(e, t, u);
    }
    return ((t.flags |= 1), (e = mn(s, a)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function Lh(e, t, n, a, u) {
    if (e !== null) {
      var s = e.memoizedProps;
      if (uo(s, a) && e.ref === t.ref)
        if (((ke = !1), (t.pendingProps = a = s), ls(e, u))) (e.flags & 131072) !== 0 && (ke = !0);
        else return ((t.lanes = e.lanes), En(e, t, u));
    }
    return kc(e, t, n, a, u);
  }
  function Uh(e, t, n, a) {
    var u = a.children,
      s = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      a.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((s = s !== null ? s.baseLanes | n : n), e !== null)) {
          for (a = t.child = e.child, u = 0; a !== null; )
            ((u = u | a.lanes | a.childLanes), (a = a.sibling));
          a = u & ~s;
        } else ((a = 0), (t.child = null));
        return Bh(e, t, s, n, a);
      }
      if ((n & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && jr(t, s !== null ? s.cachePool : null),
          s !== null ? Pp(t, s) : wc(),
          Vp(t));
      else return ((a = t.lanes = 536870912), Bh(e, t, s !== null ? s.baseLanes | n : n, n, a));
    } else
      s !== null
        ? (jr(t, s.cachePool), Pp(t, s), Kn(), (t.memoizedState = null))
        : (e !== null && jr(t, null), wc(), Kn());
    return (rt(e, t, u, n), t.child);
  }
  function Ro(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function Bh(e, t, n, a, u) {
    var s = bc();
    return (
      (s = s === null ? null : { parent: Qe._currentValue, pool: s }),
      (t.memoizedState = { baseLanes: n, cachePool: s }),
      e !== null && jr(t, null),
      wc(),
      Vp(t),
      e !== null && ua(e, t, a, !0),
      (t.childLanes = u),
      null
    );
  }
  function kr(e, t) {
    return (
      (t = Jr({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function Hh(e, t, n) {
    return (
      zl(t, e.child, null, n),
      (e = kr(t, t.pendingProps)),
      (e.flags |= 2),
      _t(t),
      (t.memoizedState = null),
      e
    );
  }
  function EE(e, t, n) {
    var a = t.pendingProps,
      u = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (we) {
        if (a.mode === "hidden") return ((e = kr(t, a)), (t.lanes = 536870912), Ro(null, e));
        if (
          (_c(t),
          (e = He)
            ? ((e = kv(e, Gt)),
              (e = e !== null && e.data === "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: Hn !== null ? { id: tn, overflow: nn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = xp(e)),
                (n.return = t),
                (t.child = n),
                (at = t),
                (He = null)))
            : (e = null),
          e === null)
        )
          throw Vn(t);
        return ((t.lanes = 536870912), null);
      }
      return kr(t, a);
    }
    var s = e.memoizedState;
    if (s !== null) {
      var g = s.dehydrated;
      if ((_c(t), u))
        if (t.flags & 256) ((t.flags &= -257), (t = Hh(e, t, n)));
        else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(i(558));
      else if ((ke || ua(e, t, n, !1), (u = (n & e.childLanes) !== 0), ke || u)) {
        if (((a = Be), a !== null && ((g = _d(a, n)), g !== 0 && g !== s.retryLane)))
          throw ((s.retryLane = g), Tl(e, g), xt(a, e, g), Zc);
        (ii(), (t = Hh(e, t, n)));
      } else
        ((e = s.treeContext),
          (He = qt(g.nextSibling)),
          (at = t),
          (we = !0),
          (Pn = null),
          (Gt = !1),
          e !== null && Rp(t, e),
          (t = kr(t, a)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (e = mn(e.child, { mode: a.mode, children: a.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function Fr(e, t) {
    var n = t.ref;
    if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(i(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function kc(e, t, n, a, u) {
    return (
      Ml(t),
      (n = Oc(e, t, n, a, void 0, u)),
      (a = Dc()),
      e !== null && !ke
        ? (Nc(e, t, u), En(e, t, u))
        : (we && a && fc(t), (t.flags |= 1), rt(e, t, n, u), t.child)
    );
  }
  function Ph(e, t, n, a, u, s) {
    return (
      Ml(t),
      (t.updateQueue = null),
      (n = Yp(t, a, n, u)),
      Gp(e),
      (a = Dc()),
      e !== null && !ke
        ? (Nc(e, t, s), En(e, t, s))
        : (we && a && fc(t), (t.flags |= 1), rt(e, t, n, s), t.child)
    );
  }
  function Vh(e, t, n, a, u) {
    if ((Ml(t), t.stateNode === null)) {
      var s = aa,
        g = n.contextType;
      (typeof g == "object" && g !== null && (s = ot(g)),
        (s = new n(a, s)),
        (t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null),
        (s.updater = $c),
        (t.stateNode = s),
        (s._reactInternals = t),
        (s = t.stateNode),
        (s.props = a),
        (s.state = t.memoizedState),
        (s.refs = {}),
        Ec(t),
        (g = n.contextType),
        (s.context = typeof g == "object" && g !== null ? ot(g) : aa),
        (s.state = t.memoizedState),
        (g = n.getDerivedStateFromProps),
        typeof g == "function" && (Kc(t, n, g, a), (s.state = t.memoizedState)),
        typeof n.getDerivedStateFromProps == "function" ||
          typeof s.getSnapshotBeforeUpdate == "function" ||
          (typeof s.UNSAFE_componentWillMount != "function" &&
            typeof s.componentWillMount != "function") ||
          ((g = s.state),
          typeof s.componentWillMount == "function" && s.componentWillMount(),
          typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(),
          g !== s.state && $c.enqueueReplaceState(s, s.state, null),
          So(t, a, s, u),
          yo(),
          (s.state = t.memoizedState)),
        typeof s.componentDidMount == "function" && (t.flags |= 4194308),
        (a = !0));
    } else if (e === null) {
      s = t.stateNode;
      var x = t.memoizedProps,
        A = Ll(n, x);
      s.props = A;
      var U = s.context,
        G = n.contextType;
      ((g = aa), typeof G == "object" && G !== null && (g = ot(G)));
      var X = n.getDerivedStateFromProps;
      ((G = typeof X == "function" || typeof s.getSnapshotBeforeUpdate == "function"),
        (x = t.pendingProps !== x),
        G ||
          (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
            typeof s.componentWillReceiveProps != "function") ||
          ((x || U !== g) && wh(t, s, a, g)),
        (Yn = !1));
      var H = t.memoizedState;
      ((s.state = H),
        So(t, a, s, u),
        yo(),
        (U = t.memoizedState),
        x || H !== U || Yn
          ? (typeof X == "function" && (Kc(t, n, X, a), (U = t.memoizedState)),
            (A = Yn || Th(t, n, A, a, H, U, g))
              ? (G ||
                  (typeof s.UNSAFE_componentWillMount != "function" &&
                    typeof s.componentWillMount != "function") ||
                  (typeof s.componentWillMount == "function" && s.componentWillMount(),
                  typeof s.UNSAFE_componentWillMount == "function" &&
                    s.UNSAFE_componentWillMount()),
                typeof s.componentDidMount == "function" && (t.flags |= 4194308))
              : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
                (t.memoizedProps = a),
                (t.memoizedState = U)),
            (s.props = a),
            (s.state = U),
            (s.context = g),
            (a = A))
          : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), (a = !1)));
    } else {
      ((s = t.stateNode),
        Cc(e, t),
        (g = t.memoizedProps),
        (G = Ll(n, g)),
        (s.props = G),
        (X = t.pendingProps),
        (H = s.context),
        (U = n.contextType),
        (A = aa),
        typeof U == "object" && U !== null && (A = ot(U)),
        (x = n.getDerivedStateFromProps),
        (U = typeof x == "function" || typeof s.getSnapshotBeforeUpdate == "function") ||
          (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
            typeof s.componentWillReceiveProps != "function") ||
          ((g !== X || H !== A) && wh(t, s, a, A)),
        (Yn = !1),
        (H = t.memoizedState),
        (s.state = H),
        So(t, a, s, u),
        yo());
      var P = t.memoizedState;
      g !== X || H !== P || Yn || (e !== null && e.dependencies !== null && Nr(e.dependencies))
        ? (typeof x == "function" && (Kc(t, n, x, a), (P = t.memoizedState)),
          (G =
            Yn ||
            Th(t, n, G, a, H, P, A) ||
            (e !== null && e.dependencies !== null && Nr(e.dependencies)))
            ? (U ||
                (typeof s.UNSAFE_componentWillUpdate != "function" &&
                  typeof s.componentWillUpdate != "function") ||
                (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(a, P, A),
                typeof s.UNSAFE_componentWillUpdate == "function" &&
                  s.UNSAFE_componentWillUpdate(a, P, A)),
              typeof s.componentDidUpdate == "function" && (t.flags |= 4),
              typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
            : (typeof s.componentDidUpdate != "function" ||
                (g === e.memoizedProps && H === e.memoizedState) ||
                (t.flags |= 4),
              typeof s.getSnapshotBeforeUpdate != "function" ||
                (g === e.memoizedProps && H === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = a),
              (t.memoizedState = P)),
          (s.props = a),
          (s.state = P),
          (s.context = A),
          (a = G))
        : (typeof s.componentDidUpdate != "function" ||
            (g === e.memoizedProps && H === e.memoizedState) ||
            (t.flags |= 4),
          typeof s.getSnapshotBeforeUpdate != "function" ||
            (g === e.memoizedProps && H === e.memoizedState) ||
            (t.flags |= 1024),
          (a = !1));
    }
    return (
      (s = a),
      Fr(e, t),
      (a = (t.flags & 128) !== 0),
      s || a
        ? ((s = t.stateNode),
          (n = a && typeof n.getDerivedStateFromError != "function" ? null : s.render()),
          (t.flags |= 1),
          e !== null && a
            ? ((t.child = zl(t, e.child, null, u)), (t.child = zl(t, null, n, u)))
            : rt(e, t, n, u),
          (t.memoizedState = s.state),
          (e = t.child))
        : (e = En(e, t, u)),
      e
    );
  }
  function Gh(e, t, n, a) {
    return (Al(), (t.flags |= 256), rt(e, t, n, a), t.child);
  }
  var Fc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function Jc(e) {
    return { baseLanes: e, cachePool: Op() };
  }
  function Wc(e, t, n) {
    return ((e = e !== null ? e.childLanes & ~n : 0), t && (e |= Ot), e);
  }
  function Yh(e, t, n) {
    var a = t.pendingProps,
      u = !1,
      s = (t.flags & 128) !== 0,
      g;
    if (
      ((g = s) || (g = e !== null && e.memoizedState === null ? !1 : (Xe.current & 2) !== 0),
      g && ((u = !0), (t.flags &= -129)),
      (g = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (we) {
        if (
          (u ? In(t) : Kn(),
          (e = He)
            ? ((e = kv(e, Gt)),
              (e = e !== null && e.data !== "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: Hn !== null ? { id: tn, overflow: nn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = xp(e)),
                (n.return = t),
                (t.child = n),
                (at = t),
                (He = null)))
            : (e = null),
          e === null)
        )
          throw Vn(t);
        return (Ls(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var x = a.children;
      return (
        (a = a.fallback),
        u
          ? (Kn(),
            (u = t.mode),
            (x = Jr({ mode: "hidden", children: x }, u)),
            (a = wl(a, u, n, null)),
            (x.return = t),
            (a.return = t),
            (x.sibling = a),
            (t.child = x),
            (a = t.child),
            (a.memoizedState = Jc(n)),
            (a.childLanes = Wc(e, g, n)),
            (t.memoizedState = Fc),
            Ro(null, a))
          : (In(t), es(t, x))
      );
    }
    var A = e.memoizedState;
    if (A !== null && ((x = A.dehydrated), x !== null)) {
      if (s)
        t.flags & 256
          ? (In(t), (t.flags &= -257), (t = ts(e, t, n)))
          : t.memoizedState !== null
            ? (Kn(), (t.child = e.child), (t.flags |= 128), (t = null))
            : (Kn(),
              (x = a.fallback),
              (u = t.mode),
              (a = Jr({ mode: "visible", children: a.children }, u)),
              (x = wl(x, u, n, null)),
              (x.flags |= 2),
              (a.return = t),
              (x.return = t),
              (a.sibling = x),
              (t.child = a),
              zl(t, e.child, null, n),
              (a = t.child),
              (a.memoizedState = Jc(n)),
              (a.childLanes = Wc(e, g, n)),
              (t.memoizedState = Fc),
              (t = Ro(null, a)));
      else if ((In(t), Ls(x))) {
        if (((g = x.nextSibling && x.nextSibling.dataset), g)) var U = g.dgst;
        ((g = U),
          (a = Error(i(419))),
          (a.stack = ""),
          (a.digest = g),
          fo({ value: a, source: null, stack: null }),
          (t = ts(e, t, n)));
      } else if ((ke || ua(e, t, n, !1), (g = (n & e.childLanes) !== 0), ke || g)) {
        if (((g = Be), g !== null && ((a = _d(g, n)), a !== 0 && a !== A.retryLane)))
          throw ((A.retryLane = a), Tl(e, a), xt(g, e, a), Zc);
        (js(x) || ii(), (t = ts(e, t, n)));
      } else
        js(x)
          ? ((t.flags |= 192), (t.child = e.child), (t = null))
          : ((e = A.treeContext),
            (He = qt(x.nextSibling)),
            (at = t),
            (we = !0),
            (Pn = null),
            (Gt = !1),
            e !== null && Rp(t, e),
            (t = es(t, a.children)),
            (t.flags |= 4096));
      return t;
    }
    return u
      ? (Kn(),
        (x = a.fallback),
        (u = t.mode),
        (A = e.child),
        (U = A.sibling),
        (a = mn(A, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = A.subtreeFlags & 65011712),
        U !== null ? (x = mn(U, x)) : ((x = wl(x, u, n, null)), (x.flags |= 2)),
        (x.return = t),
        (a.return = t),
        (a.sibling = x),
        (t.child = a),
        Ro(null, a),
        (a = t.child),
        (x = e.child.memoizedState),
        x === null
          ? (x = Jc(n))
          : ((u = x.cachePool),
            u !== null
              ? ((A = Qe._currentValue), (u = u.parent !== A ? { parent: A, pool: A } : u))
              : (u = Op()),
            (x = { baseLanes: x.baseLanes | n, cachePool: u })),
        (a.memoizedState = x),
        (a.childLanes = Wc(e, g, n)),
        (t.memoizedState = Fc),
        Ro(e.child, a))
      : (In(t),
        (n = e.child),
        (e = n.sibling),
        (n = mn(n, { mode: "visible", children: a.children })),
        (n.return = t),
        (n.sibling = null),
        e !== null &&
          ((g = t.deletions), g === null ? ((t.deletions = [e]), (t.flags |= 16)) : g.push(e)),
        (t.child = n),
        (t.memoizedState = null),
        n);
  }
  function es(e, t) {
    return ((t = Jr({ mode: "visible", children: t }, e.mode)), (t.return = e), (e.child = t));
  }
  function Jr(e, t) {
    return ((e = wt(22, e, null, t)), (e.lanes = 0), e);
  }
  function ts(e, t, n) {
    return (
      zl(t, e.child, null, n),
      (e = es(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function qh(e, t, n) {
    e.lanes |= t;
    var a = e.alternate;
    (a !== null && (a.lanes |= t), mc(e.return, t, n));
  }
  function ns(e, t, n, a, u, s) {
    var g = e.memoizedState;
    g === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: n,
          tailMode: u,
          treeForkCount: s,
        })
      : ((g.isBackwards = t),
        (g.rendering = null),
        (g.renderingStartTime = 0),
        (g.last = a),
        (g.tail = n),
        (g.tailMode = u),
        (g.treeForkCount = s));
  }
  function Xh(e, t, n) {
    var a = t.pendingProps,
      u = a.revealOrder,
      s = a.tail;
    a = a.children;
    var g = Xe.current,
      x = (g & 2) !== 0;
    if (
      (x ? ((g = (g & 1) | 2), (t.flags |= 128)) : (g &= 1),
      J(Xe, g),
      rt(e, t, a, n),
      (a = we ? so : 0),
      !x && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && qh(e, n, t);
        else if (e.tag === 19) qh(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (u) {
      case "forwards":
        for (n = t.child, u = null; n !== null; )
          ((e = n.alternate), e !== null && Vr(e) === null && (u = n), (n = n.sibling));
        ((n = u),
          n === null ? ((u = t.child), (t.child = null)) : ((u = n.sibling), (n.sibling = null)),
          ns(t, !1, u, n, s, a));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, u = t.child, t.child = null; u !== null; ) {
          if (((e = u.alternate), e !== null && Vr(e) === null)) {
            t.child = u;
            break;
          }
          ((e = u.sibling), (u.sibling = n), (n = u), (u = e));
        }
        ns(t, !0, n, null, s, a);
        break;
      case "together":
        ns(t, !1, null, null, void 0, a);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function En(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies), (Zn |= t.lanes), (n & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((ua(e, t, n, !1), (n & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(i(153));
    if (t.child !== null) {
      for (e = t.child, n = mn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        ((e = e.sibling), (n = n.sibling = mn(e, e.pendingProps)), (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function ls(e, t) {
    return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Nr(e)));
  }
  function CE(e, t, n) {
    switch (t.tag) {
      case 3:
        (Se(t, t.stateNode.containerInfo), Gn(t, Qe, e.memoizedState.cache), Al());
        break;
      case 27:
      case 5:
        Me(t);
        break;
      case 4:
        Se(t, t.stateNode.containerInfo);
        break;
      case 10:
        Gn(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), _c(t), null);
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (In(t), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? Yh(e, t, n)
              : (In(t), (e = En(e, t, n)), e !== null ? e.sibling : null);
        In(t);
        break;
      case 19:
        var u = (e.flags & 128) !== 0;
        if (
          ((a = (n & t.childLanes) !== 0),
          a || (ua(e, t, n, !1), (a = (n & t.childLanes) !== 0)),
          u)
        ) {
          if (a) return Xh(e, t, n);
          t.flags |= 128;
        }
        if (
          ((u = t.memoizedState),
          u !== null && ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          J(Xe, Xe.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), Uh(e, t, n, t.pendingProps));
      case 24:
        Gn(t, Qe, e.memoizedState.cache);
    }
    return En(e, t, n);
  }
  function Ih(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) ke = !0;
      else {
        if (!ls(e, n) && (t.flags & 128) === 0) return ((ke = !1), CE(e, t, n));
        ke = (e.flags & 131072) !== 0;
      }
    else ((ke = !1), we && (t.flags & 1048576) !== 0 && Cp(t, so, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (((e = Dl(t.elementType)), (t.type = e), typeof e == "function"))
            uc(e)
              ? ((a = Ll(e, a)), (t.tag = 1), (t = Vh(null, t, e, a, n)))
              : ((t.tag = 0), (t = kc(null, t, e, a, n)));
          else {
            if (e != null) {
              var u = e.$$typeof;
              if (u === B) {
                ((t.tag = 11), (t = zh(null, t, e, a, n)));
                break e;
              } else if (u === V) {
                ((t.tag = 14), (t = jh(null, t, e, a, n)));
                break e;
              }
            }
            throw ((t = pe(e) || e), Error(i(306, t, "")));
          }
        }
        return t;
      case 0:
        return kc(e, t, t.type, t.pendingProps, n);
      case 1:
        return ((a = t.type), (u = Ll(a, t.pendingProps)), Vh(e, t, a, u, n));
      case 3:
        e: {
          if ((Se(t, t.stateNode.containerInfo), e === null)) throw Error(i(387));
          a = t.pendingProps;
          var s = t.memoizedState;
          ((u = s.element), Cc(e, t), So(t, a, null, n));
          var g = t.memoizedState;
          if (
            ((a = g.cache),
            Gn(t, Qe, a),
            a !== s.cache && gc(t, [Qe], n, !0),
            yo(),
            (a = g.element),
            s.isDehydrated)
          )
            if (
              ((s = { element: a, isDehydrated: !1, cache: g.cache }),
              (t.updateQueue.baseState = s),
              (t.memoizedState = s),
              t.flags & 256)
            ) {
              t = Gh(e, t, a, n);
              break e;
            } else if (a !== u) {
              ((u = Ht(Error(i(424)), t)), fo(u), (t = Gh(e, t, a, n)));
              break e;
            } else
              for (
                e = t.stateNode.containerInfo,
                  e.nodeType === 9
                    ? (e = e.body)
                    : (e = e.nodeName === "HTML" ? e.ownerDocument.body : e),
                  He = qt(e.firstChild),
                  at = t,
                  we = !0,
                  Pn = null,
                  Gt = !0,
                  n = Up(t, null, a, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
          else {
            if ((Al(), a === u)) {
              t = En(e, t, n);
              break e;
            }
            rt(e, t, a, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          Fr(e, t),
          e === null
            ? (n = nm(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = n)
              : we ||
                ((n = t.type),
                (e = t.pendingProps),
                (a = hi(se.current).createElement(n)),
                (a[lt] = t),
                (a[vt] = e),
                it(a, n, e),
                tt(a),
                (t.stateNode = a))
            : (t.memoizedState = nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
          null
        );
      case 27:
        return (
          Me(t),
          e === null &&
            we &&
            ((a = t.stateNode = Wv(t.type, t.pendingProps, se.current)),
            (at = t),
            (Gt = !0),
            (u = He),
            el(t.type) ? ((Us = u), (He = qt(a.firstChild))) : (He = u)),
          rt(e, t, t.pendingProps.children, n),
          Fr(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            we &&
            ((u = a = He) &&
              ((a = WE(a, t.type, t.pendingProps, Gt)),
              a !== null
                ? ((t.stateNode = a), (at = t), (He = qt(a.firstChild)), (Gt = !1), (u = !0))
                : (u = !1)),
            u || Vn(t)),
          Me(t),
          (u = t.type),
          (s = t.pendingProps),
          (g = e !== null ? e.memoizedProps : null),
          (a = s.children),
          Ds(u, s) ? (a = null) : g !== null && Ds(u, g) && (t.flags |= 32),
          t.memoizedState !== null && ((u = Oc(e, t, hE, null, null, n)), (Po._currentValue = u)),
          Fr(e, t),
          rt(e, t, a, n),
          t.child
        );
      case 6:
        return (
          e === null &&
            we &&
            ((e = n = He) &&
              ((n = eC(n, t.pendingProps, Gt)),
              n !== null ? ((t.stateNode = n), (at = t), (He = null), (e = !0)) : (e = !1)),
            e || Vn(t)),
          null
        );
      case 13:
        return Yh(e, t, n);
      case 4:
        return (
          Se(t, t.stateNode.containerInfo),
          (a = t.pendingProps),
          e === null ? (t.child = zl(t, null, a, n)) : rt(e, t, a, n),
          t.child
        );
      case 11:
        return zh(e, t, t.type, t.pendingProps, n);
      case 7:
        return (rt(e, t, t.pendingProps, n), t.child);
      case 8:
        return (rt(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (rt(e, t, t.pendingProps.children, n), t.child);
      case 10:
        return ((a = t.pendingProps), Gn(t, t.type, a.value), rt(e, t, a.children, n), t.child);
      case 9:
        return (
          (u = t.type._context),
          (a = t.pendingProps.children),
          Ml(t),
          (u = ot(u)),
          (a = a(u)),
          (t.flags |= 1),
          rt(e, t, a, n),
          t.child
        );
      case 14:
        return jh(e, t, t.type, t.pendingProps, n);
      case 15:
        return Lh(e, t, t.type, t.pendingProps, n);
      case 19:
        return Xh(e, t, n);
      case 31:
        return EE(e, t, n);
      case 22:
        return Uh(e, t, n, t.pendingProps);
      case 24:
        return (
          Ml(t),
          (a = ot(Qe)),
          e === null
            ? ((u = bc()),
              u === null &&
                ((u = Be),
                (s = yc()),
                (u.pooledCache = s),
                s.refCount++,
                s !== null && (u.pooledCacheLanes |= n),
                (u = s)),
              (t.memoizedState = { parent: a, cache: u }),
              Ec(t),
              Gn(t, Qe, u))
            : ((e.lanes & n) !== 0 && (Cc(e, t), So(t, null, null, n), yo()),
              (u = e.memoizedState),
              (s = t.memoizedState),
              u.parent !== a
                ? ((u = { parent: a, cache: a }),
                  (t.memoizedState = u),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u),
                  Gn(t, Qe, a))
                : ((a = s.cache), Gn(t, Qe, a), a !== u.cache && gc(t, [Qe], n, !0))),
          rt(e, t, t.pendingProps.children, n),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(i(156, t.tag));
  }
  function Cn(e) {
    e.flags |= 4;
  }
  function as(e, t, n, a, u) {
    if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
      if (((e.flags |= 16777216), (u & 335544128) === u))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (yv()) e.flags |= 8192;
        else throw ((Nl = Ur), xc);
    } else e.flags &= -16777217;
  }
  function Kh(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
    else if (((e.flags |= 16777216), !im(t)))
      if (yv()) e.flags |= 8192;
      else throw ((Nl = Ur), xc);
  }
  function Wr(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 && ((t = e.tag !== 22 ? Td() : 536870912), (e.lanes |= t), (ba |= t)));
  }
  function To(e, t) {
    if (!we)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; ) (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = e.tail;
          for (var a = null; n !== null; ) (n.alternate !== null && (a = n), (n = n.sibling));
          a === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function Pe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      a = 0;
    if (t)
      for (var u = e.child; u !== null; )
        ((n |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags & 65011712),
          (a |= u.flags & 65011712),
          (u.return = e),
          (u = u.sibling));
    else
      for (u = e.child; u !== null; )
        ((n |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags),
          (a |= u.flags),
          (u.return = e),
          (u = u.sibling));
    return ((e.subtreeFlags |= a), (e.childLanes = n), t);
  }
  function RE(e, t, n) {
    var a = t.pendingProps;
    switch ((dc(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Pe(t), null);
      case 1:
        return (Pe(t), null);
      case 3:
        return (
          (n = t.stateNode),
          (a = null),
          e !== null && (a = e.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          Sn(Qe),
          xe(),
          n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
          (e === null || e.child === null) &&
            (ia(t)
              ? Cn(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), hc())),
          Pe(t),
          null
        );
      case 26:
        var u = t.type,
          s = t.memoizedState;
        return (
          e === null
            ? (Cn(t), s !== null ? (Pe(t), Kh(t, s)) : (Pe(t), as(t, u, null, a, n)))
            : s
              ? s !== e.memoizedState
                ? (Cn(t), Pe(t), Kh(t, s))
                : (Pe(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps), e !== a && Cn(t), Pe(t), as(t, u, e, a, n)),
          null
        );
      case 27:
        if ((De(t), (n = se.current), (u = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== a && Cn(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(i(166));
            return (Pe(t), null);
          }
          ((e = W.current), ia(t) ? Tp(t) : ((e = Wv(u, a, n)), (t.stateNode = e), Cn(t)));
        }
        return (Pe(t), null);
      case 5:
        if ((De(t), (u = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== a && Cn(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(i(166));
            return (Pe(t), null);
          }
          if (((s = W.current), ia(t))) Tp(t);
          else {
            var g = hi(se.current);
            switch (s) {
              case 1:
                s = g.createElementNS("http://www.w3.org/2000/svg", u);
                break;
              case 2:
                s = g.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                break;
              default:
                switch (u) {
                  case "svg":
                    s = g.createElementNS("http://www.w3.org/2000/svg", u);
                    break;
                  case "math":
                    s = g.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                    break;
                  case "script":
                    ((s = g.createElement("div")),
                      (s.innerHTML = "<script><\/script>"),
                      (s = s.removeChild(s.firstChild)));
                    break;
                  case "select":
                    ((s =
                      typeof a.is == "string"
                        ? g.createElement("select", { is: a.is })
                        : g.createElement("select")),
                      a.multiple ? (s.multiple = !0) : a.size && (s.size = a.size));
                    break;
                  default:
                    s =
                      typeof a.is == "string"
                        ? g.createElement(u, { is: a.is })
                        : g.createElement(u);
                }
            }
            ((s[lt] = t), (s[vt] = a));
            e: for (g = t.child; g !== null; ) {
              if (g.tag === 5 || g.tag === 6) s.appendChild(g.stateNode);
              else if (g.tag !== 4 && g.tag !== 27 && g.child !== null) {
                ((g.child.return = g), (g = g.child));
                continue;
              }
              if (g === t) break e;
              for (; g.sibling === null; ) {
                if (g.return === null || g.return === t) break e;
                g = g.return;
              }
              ((g.sibling.return = g.return), (g = g.sibling));
            }
            t.stateNode = s;
            e: switch ((it(s, u, a), u)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && Cn(t);
          }
        }
        return (Pe(t), as(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null);
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== a && Cn(t);
        else {
          if (typeof a != "string" && t.stateNode === null) throw Error(i(166));
          if (((e = se.current), ia(t))) {
            if (((e = t.stateNode), (n = t.memoizedProps), (a = null), (u = at), u !== null))
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            ((e[lt] = t),
              (e = !!(
                e.nodeValue === n ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                Yv(e.nodeValue, n)
              )),
              e || Vn(t, !0));
          } else ((e = hi(e).createTextNode(a)), (e[lt] = t), (t.stateNode = e));
        }
        return (Pe(t), null);
      case 31:
        if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((a = ia(t)), n !== null)) {
            if (e === null) {
              if (!a) throw Error(i(318));
              if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                throw Error(i(557));
              e[lt] = t;
            } else (Al(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (Pe(t), (e = !1));
          } else
            ((n = hc()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n),
              (e = !0));
          if (!e) return t.flags & 256 ? (_t(t), t) : (_t(t), null);
          if ((t.flags & 128) !== 0) throw Error(i(558));
        }
        return (Pe(t), null);
      case 13:
        if (
          ((a = t.memoizedState),
          e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((u = ia(t)), a !== null && a.dehydrated !== null)) {
            if (e === null) {
              if (!u) throw Error(i(318));
              if (((u = t.memoizedState), (u = u !== null ? u.dehydrated : null), !u))
                throw Error(i(317));
              u[lt] = t;
            } else (Al(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (Pe(t), (u = !1));
          } else
            ((u = hc()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u),
              (u = !0));
          if (!u) return t.flags & 256 ? (_t(t), t) : (_t(t), null);
        }
        return (
          _t(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = n), t)
            : ((n = a !== null),
              (e = e !== null && e.memoizedState !== null),
              n &&
                ((a = t.child),
                (u = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (u = a.alternate.memoizedState.cachePool.pool),
                (s = null),
                a.memoizedState !== null &&
                  a.memoizedState.cachePool !== null &&
                  (s = a.memoizedState.cachePool.pool),
                s !== u && (a.flags |= 2048)),
              n !== e && n && (t.child.flags |= 8192),
              Wr(t, t.updateQueue),
              Pe(t),
              null)
        );
      case 4:
        return (xe(), e === null && ws(t.stateNode.containerInfo), Pe(t), null);
      case 10:
        return (Sn(t.type), Pe(t), null);
      case 19:
        if ((Y(Xe), (a = t.memoizedState), a === null)) return (Pe(t), null);
        if (((u = (t.flags & 128) !== 0), (s = a.rendering), s === null))
          if (u) To(a, !1);
          else {
            if (qe !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((s = Vr(e)), s !== null)) {
                  for (
                    t.flags |= 128,
                      To(a, !1),
                      e = s.updateQueue,
                      t.updateQueue = e,
                      Wr(t, e),
                      t.subtreeFlags = 0,
                      e = n,
                      n = t.child;
                    n !== null;
                  )
                    (bp(n, e), (n = n.sibling));
                  return (J(Xe, (Xe.current & 1) | 2), we && gn(t, a.treeForkCount), t.child);
                }
                e = e.sibling;
              }
            a.tail !== null &&
              Et() > ai &&
              ((t.flags |= 128), (u = !0), To(a, !1), (t.lanes = 4194304));
          }
        else {
          if (!u)
            if (((e = Vr(s)), e !== null)) {
              if (
                ((t.flags |= 128),
                (u = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                Wr(t, e),
                To(a, !0),
                a.tail === null && a.tailMode === "hidden" && !s.alternate && !we)
              )
                return (Pe(t), null);
            } else
              2 * Et() - a.renderingStartTime > ai &&
                n !== 536870912 &&
                ((t.flags |= 128), (u = !0), To(a, !1), (t.lanes = 4194304));
          a.isBackwards
            ? ((s.sibling = t.child), (t.child = s))
            : ((e = a.last), e !== null ? (e.sibling = s) : (t.child = s), (a.last = s));
        }
        return a.tail !== null
          ? ((e = a.tail),
            (a.rendering = e),
            (a.tail = e.sibling),
            (a.renderingStartTime = Et()),
            (e.sibling = null),
            (n = Xe.current),
            J(Xe, u ? (n & 1) | 2 : n & 1),
            we && gn(t, a.treeForkCount),
            e)
          : (Pe(t), null);
      case 22:
      case 23:
        return (
          _t(t),
          Ac(),
          (a = t.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== a && (t.flags |= 8192)
            : a && (t.flags |= 8192),
          a
            ? (n & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (Pe(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : Pe(t),
          (n = t.updateQueue),
          n !== null && Wr(t, n.retryQueue),
          (n = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (n = e.memoizedState.cachePool.pool),
          (a = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (a = t.memoizedState.cachePool.pool),
          a !== n && (t.flags |= 2048),
          e !== null && Y(Ol),
          null
        );
      case 24:
        return (
          (n = null),
          e !== null && (n = e.memoizedState.cache),
          t.memoizedState.cache !== n && (t.flags |= 2048),
          Sn(Qe),
          Pe(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(i(156, t.tag));
  }
  function TE(e, t) {
    switch ((dc(t), t.tag)) {
      case 1:
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (
          Sn(Qe),
          xe(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (De(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((_t(t), t.alternate === null)) throw Error(i(340));
          Al();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 13:
        if ((_t(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(i(340));
          Al();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (Y(Xe), null);
      case 4:
        return (xe(), null);
      case 10:
        return (Sn(t.type), null);
      case 22:
      case 23:
        return (
          _t(t),
          Ac(),
          e !== null && Y(Ol),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (Sn(Qe), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function $h(e, t) {
    switch ((dc(t), t.tag)) {
      case 3:
        (Sn(Qe), xe());
        break;
      case 26:
      case 27:
      case 5:
        De(t);
        break;
      case 4:
        xe();
        break;
      case 31:
        t.memoizedState !== null && _t(t);
        break;
      case 13:
        _t(t);
        break;
      case 19:
        Y(Xe);
        break;
      case 10:
        Sn(t.type);
        break;
      case 22:
      case 23:
        (_t(t), Ac(), e !== null && Y(Ol));
        break;
      case 24:
        Sn(Qe);
    }
  }
  function wo(e, t) {
    try {
      var n = t.updateQueue,
        a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        n = u;
        do {
          if ((n.tag & e) === e) {
            a = void 0;
            var s = n.create,
              g = n.inst;
            ((a = s()), (g.destroy = a));
          }
          n = n.next;
        } while (n !== u);
      }
    } catch (x) {
      ze(t, t.return, x);
    }
  }
  function $n(e, t, n) {
    try {
      var a = t.updateQueue,
        u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var s = u.next;
        a = s;
        do {
          if ((a.tag & e) === e) {
            var g = a.inst,
              x = g.destroy;
            if (x !== void 0) {
              ((g.destroy = void 0), (u = t));
              var A = n,
                U = x;
              try {
                U();
              } catch (G) {
                ze(u, A, G);
              }
            }
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (G) {
      ze(t, t.return, G);
    }
  }
  function Qh(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Hp(t, n);
      } catch (a) {
        ze(e, e.return, a);
      }
    }
  }
  function Zh(e, t, n) {
    ((n.props = Ll(e.type, e.memoizedProps)), (n.state = e.memoizedState));
    try {
      n.componentWillUnmount();
    } catch (a) {
      ze(e, t, a);
    }
  }
  function Ao(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof n == "function" ? (e.refCleanup = n(a)) : (n.current = a);
      }
    } catch (u) {
      ze(e, t, u);
    }
  }
  function ln(e, t) {
    var n = e.ref,
      a = e.refCleanup;
    if (n !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          ze(e, t, u);
        } finally {
          ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (u) {
          ze(e, t, u);
        }
      else n.current = null;
  }
  function kh(e) {
    var t = e.type,
      n = e.memoizedProps,
      a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && a.focus();
          break e;
        case "img":
          n.src ? (a.src = n.src) : n.srcSet && (a.srcset = n.srcSet);
      }
    } catch (u) {
      ze(e, e.return, u);
    }
  }
  function os(e, t, n) {
    try {
      var a = e.stateNode;
      ($E(a, e.type, n, t), (a[vt] = t));
    } catch (u) {
      ze(e, e.return, u);
    }
  }
  function Fh(e) {
    return (
      e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && el(e.type)) || e.tag === 4
    );
  }
  function rs(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || Fh(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if ((e.tag === 27 && el(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function is(e, t, n) {
    var a = e.tag;
    if (a === 5 || a === 6)
      ((e = e.stateNode),
        t
          ? (n.nodeType === 9
              ? n.body
              : n.nodeName === "HTML"
                ? n.ownerDocument.body
                : n
            ).insertBefore(e, t)
          : ((t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n),
            t.appendChild(e),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = hn)));
    else if (
      a !== 4 &&
      (a === 27 && el(e.type) && ((n = e.stateNode), (t = null)), (e = e.child), e !== null)
    )
      for (is(e, t, n), e = e.sibling; e !== null; ) (is(e, t, n), (e = e.sibling));
  }
  function ei(e, t, n) {
    var a = e.tag;
    if (a === 5 || a === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (a !== 4 && (a === 27 && el(e.type) && (n = e.stateNode), (e = e.child), e !== null))
      for (ei(e, t, n), e = e.sibling; e !== null; ) (ei(e, t, n), (e = e.sibling));
  }
  function Jh(e) {
    var t = e.stateNode,
      n = e.memoizedProps;
    try {
      for (var a = e.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
      (it(t, a, n), (t[lt] = e), (t[vt] = n));
    } catch (s) {
      ze(e, e.return, s);
    }
  }
  var Rn = !1,
    Fe = !1,
    us = !1,
    Wh = typeof WeakSet == "function" ? WeakSet : Set,
    nt = null;
  function wE(e, t) {
    if (((e = e.containerInfo), (Ms = xi), (e = fp(e)), tc(e))) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var a = n.getSelection && n.getSelection();
          if (a && a.rangeCount !== 0) {
            n = a.anchorNode;
            var u = a.anchorOffset,
              s = a.focusNode;
            a = a.focusOffset;
            try {
              (n.nodeType, s.nodeType);
            } catch {
              n = null;
              break e;
            }
            var g = 0,
              x = -1,
              A = -1,
              U = 0,
              G = 0,
              X = e,
              H = null;
            t: for (;;) {
              for (
                var P;
                X !== n || (u !== 0 && X.nodeType !== 3) || (x = g + u),
                  X !== s || (a !== 0 && X.nodeType !== 3) || (A = g + a),
                  X.nodeType === 3 && (g += X.nodeValue.length),
                  (P = X.firstChild) !== null;
              )
                ((H = X), (X = P));
              for (;;) {
                if (X === e) break t;
                if (
                  (H === n && ++U === u && (x = g),
                  H === s && ++G === a && (A = g),
                  (P = X.nextSibling) !== null)
                )
                  break;
                ((X = H), (H = X.parentNode));
              }
              X = P;
            }
            n = x === -1 || A === -1 ? null : { start: x, end: A };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Os = { focusedElem: e, selectionRange: n }, xi = !1, nt = t; nt !== null; )
      if (((t = nt), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (nt = e));
      else
        for (; nt !== null; ) {
          switch (((t = nt), (s = t.alternate), (e = t.flags), t.tag)) {
            case 0:
              if (
                (e & 4) !== 0 &&
                ((e = t.updateQueue), (e = e !== null ? e.events : null), e !== null)
              )
                for (n = 0; n < e.length; n++) ((u = e[n]), (u.ref.impl = u.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && s !== null) {
                ((e = void 0),
                  (n = t),
                  (u = s.memoizedProps),
                  (s = s.memoizedState),
                  (a = n.stateNode));
                try {
                  var ae = Ll(n.type, u);
                  ((e = a.getSnapshotBeforeUpdate(ae, s)),
                    (a.__reactInternalSnapshotBeforeUpdate = e));
                } catch (fe) {
                  ze(n, n.return, fe);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)) zs(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      zs(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(i(163));
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (nt = e));
            break;
          }
          nt = t.return;
        }
  }
  function ev(e, t, n) {
    var a = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        (wn(e, n), a & 4 && wo(5, n));
        break;
      case 1:
        if ((wn(e, n), a & 4))
          if (((e = n.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (g) {
              ze(n, n.return, g);
            }
          else {
            var u = Ll(n.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (g) {
              ze(n, n.return, g);
            }
          }
        (a & 64 && Qh(n), a & 512 && Ao(n, n.return));
        break;
      case 3:
        if ((wn(e, n), a & 64 && ((e = n.updateQueue), e !== null))) {
          if (((t = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            Hp(e, t);
          } catch (g) {
            ze(n, n.return, g);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Jh(n);
      case 26:
      case 5:
        (wn(e, n), t === null && a & 4 && kh(n), a & 512 && Ao(n, n.return));
        break;
      case 12:
        wn(e, n);
        break;
      case 31:
        (wn(e, n), a & 4 && lv(e, n));
        break;
      case 13:
        (wn(e, n),
          a & 4 && av(e, n),
          a & 64 &&
            ((e = n.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null && ((n = LE.bind(null, n)), tC(e, n)))));
        break;
      case 22:
        if (((a = n.memoizedState !== null || Rn), !a)) {
          ((t = (t !== null && t.memoizedState !== null) || Fe), (u = Rn));
          var s = Fe;
          ((Rn = a),
            (Fe = t) && !s ? An(e, n, (n.subtreeFlags & 8772) !== 0) : wn(e, n),
            (Rn = u),
            (Fe = s));
        }
        break;
      case 30:
        break;
      default:
        wn(e, n);
    }
  }
  function tv(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), tv(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && Hu(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var Ge = null,
    gt = !1;
  function Tn(e, t, n) {
    for (n = n.child; n !== null; ) (nv(e, t, n), (n = n.sibling));
  }
  function nv(e, t, n) {
    if (Ct && typeof Ct.onCommitFiberUnmount == "function")
      try {
        Ct.onCommitFiberUnmount(ka, n);
      } catch {}
    switch (n.tag) {
      case 26:
        (Fe || ln(n, t),
          Tn(e, t, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n)));
        break;
      case 27:
        Fe || ln(n, t);
        var a = Ge,
          u = gt;
        (el(n.type) && ((Ge = n.stateNode), (gt = !1)),
          Tn(e, t, n),
          Uo(n.stateNode),
          (Ge = a),
          (gt = u));
        break;
      case 5:
        Fe || ln(n, t);
      case 6:
        if (((a = Ge), (u = gt), (Ge = null), Tn(e, t, n), (Ge = a), (gt = u), Ge !== null))
          if (gt)
            try {
              (Ge.nodeType === 9
                ? Ge.body
                : Ge.nodeName === "HTML"
                  ? Ge.ownerDocument.body
                  : Ge
              ).removeChild(n.stateNode);
            } catch (s) {
              ze(n, t, s);
            }
          else
            try {
              Ge.removeChild(n.stateNode);
            } catch (s) {
              ze(n, t, s);
            }
        break;
      case 18:
        Ge !== null &&
          (gt
            ? ((e = Ge),
              Qv(
                e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
                n.stateNode,
              ),
              _a(e))
            : Qv(Ge, n.stateNode));
        break;
      case 4:
        ((a = Ge),
          (u = gt),
          (Ge = n.stateNode.containerInfo),
          (gt = !0),
          Tn(e, t, n),
          (Ge = a),
          (gt = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ($n(2, n, t), Fe || $n(4, n, t), Tn(e, t, n));
        break;
      case 1:
        (Fe ||
          (ln(n, t), (a = n.stateNode), typeof a.componentWillUnmount == "function" && Zh(n, t, a)),
          Tn(e, t, n));
        break;
      case 21:
        Tn(e, t, n);
        break;
      case 22:
        ((Fe = (a = Fe) || n.memoizedState !== null), Tn(e, t, n), (Fe = a));
        break;
      default:
        Tn(e, t, n);
    }
  }
  function lv(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        _a(e);
      } catch (n) {
        ze(t, t.return, n);
      }
    }
  }
  function av(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        _a(e);
      } catch (n) {
        ze(t, t.return, n);
      }
  }
  function AE(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new Wh()), t);
      case 22:
        return (
          (e = e.stateNode),
          (t = e._retryCache),
          t === null && (t = e._retryCache = new Wh()),
          t
        );
      default:
        throw Error(i(435, e.tag));
    }
  }
  function ti(e, t) {
    var n = AE(e);
    t.forEach(function (a) {
      if (!n.has(a)) {
        n.add(a);
        var u = UE.bind(null, e, a);
        a.then(u, u);
      }
    });
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var u = n[a],
          s = e,
          g = t,
          x = g;
        e: for (; x !== null; ) {
          switch (x.tag) {
            case 27:
              if (el(x.type)) {
                ((Ge = x.stateNode), (gt = !1));
                break e;
              }
              break;
            case 5:
              ((Ge = x.stateNode), (gt = !1));
              break e;
            case 3:
            case 4:
              ((Ge = x.stateNode.containerInfo), (gt = !0));
              break e;
          }
          x = x.return;
        }
        if (Ge === null) throw Error(i(160));
        (nv(s, g, u),
          (Ge = null),
          (gt = !1),
          (s = u.alternate),
          s !== null && (s.return = null),
          (u.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) (ov(t, e), (t = t.sibling));
  }
  var Zt = null;
  function ov(e, t) {
    var n = e.alternate,
      a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (yt(t, e), St(e), a & 4 && ($n(3, e, e.return), wo(3, e), $n(5, e, e.return)));
        break;
      case 1:
        (yt(t, e),
          St(e),
          a & 512 && (Fe || n === null || ln(n, n.return)),
          a & 64 &&
            Rn &&
            ((e = e.updateQueue),
            e !== null &&
              ((a = e.callbacks),
              a !== null &&
                ((n = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = n === null ? a : n.concat(a))))));
        break;
      case 26:
        var u = Zt;
        if ((yt(t, e), St(e), a & 512 && (Fe || n === null || ln(n, n.return)), a & 4)) {
          var s = n !== null ? n.memoizedState : null;
          if (((a = e.memoizedState), n === null))
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  ((a = e.type), (n = e.memoizedProps), (u = u.ownerDocument || u));
                  t: switch (a) {
                    case "title":
                      ((s = u.getElementsByTagName("title")[0]),
                        (!s ||
                          s[Wa] ||
                          s[lt] ||
                          s.namespaceURI === "http://www.w3.org/2000/svg" ||
                          s.hasAttribute("itemprop")) &&
                          ((s = u.createElement(a)),
                          u.head.insertBefore(s, u.querySelector("head > title"))),
                        it(s, a, n),
                        (s[lt] = e),
                        tt(s),
                        (a = s));
                      break e;
                    case "link":
                      var g = om("link", "href", u).get(a + (n.href || ""));
                      if (g) {
                        for (var x = 0; x < g.length; x++)
                          if (
                            ((s = g[x]),
                            s.getAttribute("href") ===
                              (n.href == null || n.href === "" ? null : n.href) &&
                              s.getAttribute("rel") === (n.rel == null ? null : n.rel) &&
                              s.getAttribute("title") === (n.title == null ? null : n.title) &&
                              s.getAttribute("crossorigin") ===
                                (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            g.splice(x, 1);
                            break t;
                          }
                      }
                      ((s = u.createElement(a)), it(s, a, n), u.head.appendChild(s));
                      break;
                    case "meta":
                      if ((g = om("meta", "content", u).get(a + (n.content || "")))) {
                        for (x = 0; x < g.length; x++)
                          if (
                            ((s = g[x]),
                            s.getAttribute("content") ===
                              (n.content == null ? null : "" + n.content) &&
                              s.getAttribute("name") === (n.name == null ? null : n.name) &&
                              s.getAttribute("property") ===
                                (n.property == null ? null : n.property) &&
                              s.getAttribute("http-equiv") ===
                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                              s.getAttribute("charset") === (n.charSet == null ? null : n.charSet))
                          ) {
                            g.splice(x, 1);
                            break t;
                          }
                      }
                      ((s = u.createElement(a)), it(s, a, n), u.head.appendChild(s));
                      break;
                    default:
                      throw Error(i(468, a));
                  }
                  ((s[lt] = e), tt(s), (a = s));
                }
                e.stateNode = a;
              } else rm(u, e.type, e.stateNode);
            else e.stateNode = am(u, a, e.memoizedProps);
          else
            s !== a
              ? (s === null
                  ? n.stateNode !== null && ((n = n.stateNode), n.parentNode.removeChild(n))
                  : s.count--,
                a === null ? rm(u, e.type, e.stateNode) : am(u, a, e.memoizedProps))
              : a === null && e.stateNode !== null && os(e, e.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        (yt(t, e),
          St(e),
          a & 512 && (Fe || n === null || ln(n, n.return)),
          n !== null && a & 4 && os(e, e.memoizedProps, n.memoizedProps));
        break;
      case 5:
        if ((yt(t, e), St(e), a & 512 && (Fe || n === null || ln(n, n.return)), e.flags & 32)) {
          u = e.stateNode;
          try {
            Fl(u, "");
          } catch (ae) {
            ze(e, e.return, ae);
          }
        }
        (a & 4 &&
          e.stateNode != null &&
          ((u = e.memoizedProps), os(e, u, n !== null ? n.memoizedProps : u)),
          a & 1024 && (us = !0));
        break;
      case 6:
        if ((yt(t, e), St(e), a & 4)) {
          if (e.stateNode === null) throw Error(i(162));
          ((a = e.memoizedProps), (n = e.stateNode));
          try {
            n.nodeValue = a;
          } catch (ae) {
            ze(e, e.return, ae);
          }
        }
        break;
      case 3:
        if (
          ((gi = null),
          (u = Zt),
          (Zt = vi(t.containerInfo)),
          yt(t, e),
          (Zt = u),
          St(e),
          a & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            _a(t.containerInfo);
          } catch (ae) {
            ze(e, e.return, ae);
          }
        us && ((us = !1), rv(e));
        break;
      case 4:
        ((a = Zt), (Zt = vi(e.stateNode.containerInfo)), yt(t, e), St(e), (Zt = a));
        break;
      case 12:
        (yt(t, e), St(e));
        break;
      case 31:
        (yt(t, e),
          St(e),
          a & 4 && ((a = e.updateQueue), a !== null && ((e.updateQueue = null), ti(e, a))));
        break;
      case 13:
        (yt(t, e),
          St(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) != (n !== null && n.memoizedState !== null) &&
            (li = Et()),
          a & 4 && ((a = e.updateQueue), a !== null && ((e.updateQueue = null), ti(e, a))));
        break;
      case 22:
        u = e.memoizedState !== null;
        var A = n !== null && n.memoizedState !== null,
          U = Rn,
          G = Fe;
        if (((Rn = U || u), (Fe = G || A), yt(t, e), (Fe = G), (Rn = U), St(e), a & 8192))
          e: for (
            t = e.stateNode,
              t._visibility = u ? t._visibility & -2 : t._visibility | 1,
              u && (n === null || A || Rn || Fe || Ul(e)),
              n = null,
              t = e;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                A = n = t;
                try {
                  if (((s = A.stateNode), u))
                    ((g = s.style),
                      typeof g.setProperty == "function"
                        ? g.setProperty("display", "none", "important")
                        : (g.display = "none"));
                  else {
                    x = A.stateNode;
                    var X = A.memoizedProps.style,
                      H = X != null && X.hasOwnProperty("display") ? X.display : null;
                    x.style.display = H == null || typeof H == "boolean" ? "" : ("" + H).trim();
                  }
                } catch (ae) {
                  ze(A, A.return, ae);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                A = t;
                try {
                  A.stateNode.nodeValue = u ? "" : A.memoizedProps;
                } catch (ae) {
                  ze(A, A.return, ae);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                A = t;
                try {
                  var P = A.stateNode;
                  u ? Zv(P, !0) : Zv(A.stateNode, !1);
                } catch (ae) {
                  ze(A, A.return, ae);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) || t.memoizedState === null || t === e) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              (n === t && (n = null), (t = t.return));
            }
            (n === t && (n = null), (t.sibling.return = t.return), (t = t.sibling));
          }
        a & 4 &&
          ((a = e.updateQueue),
          a !== null && ((n = a.retryQueue), n !== null && ((a.retryQueue = null), ti(e, n))));
        break;
      case 19:
        (yt(t, e),
          St(e),
          a & 4 && ((a = e.updateQueue), a !== null && ((e.updateQueue = null), ti(e, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (yt(t, e), St(e));
    }
  }
  function St(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, a = e.return; a !== null; ) {
          if (Fh(a)) {
            n = a;
            break;
          }
          a = a.return;
        }
        if (n == null) throw Error(i(160));
        switch (n.tag) {
          case 27:
            var u = n.stateNode,
              s = rs(e);
            ei(e, s, u);
            break;
          case 5:
            var g = n.stateNode;
            n.flags & 32 && (Fl(g, ""), (n.flags &= -33));
            var x = rs(e);
            ei(e, x, g);
            break;
          case 3:
          case 4:
            var A = n.stateNode.containerInfo,
              U = rs(e);
            is(e, U, A);
            break;
          default:
            throw Error(i(161));
        }
      } catch (G) {
        ze(e, e.return, G);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function rv(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        (rv(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling));
      }
  }
  function wn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) (ev(e, t.alternate, t), (t = t.sibling));
  }
  function Ul(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ($n(4, t, t.return), Ul(t));
          break;
        case 1:
          ln(t, t.return);
          var n = t.stateNode;
          (typeof n.componentWillUnmount == "function" && Zh(t, t.return, n), Ul(t));
          break;
        case 27:
          Uo(t.stateNode);
        case 26:
        case 5:
          (ln(t, t.return), Ul(t));
          break;
        case 22:
          t.memoizedState === null && Ul(t);
          break;
        case 30:
          Ul(t);
          break;
        default:
          Ul(t);
      }
      e = e.sibling;
    }
  }
  function An(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate,
        u = e,
        s = t,
        g = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          (An(u, s, n), wo(4, s));
          break;
        case 1:
          if ((An(u, s, n), (a = s), (u = a.stateNode), typeof u.componentDidMount == "function"))
            try {
              u.componentDidMount();
            } catch (U) {
              ze(a, a.return, U);
            }
          if (((a = s), (u = a.updateQueue), u !== null)) {
            var x = a.stateNode;
            try {
              var A = u.shared.hiddenCallbacks;
              if (A !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < A.length; u++) Bp(A[u], x);
            } catch (U) {
              ze(a, a.return, U);
            }
          }
          (n && g & 64 && Qh(s), Ao(s, s.return));
          break;
        case 27:
          Jh(s);
        case 26:
        case 5:
          (An(u, s, n), n && a === null && g & 4 && kh(s), Ao(s, s.return));
          break;
        case 12:
          An(u, s, n);
          break;
        case 31:
          (An(u, s, n), n && g & 4 && lv(u, s));
          break;
        case 13:
          (An(u, s, n), n && g & 4 && av(u, s));
          break;
        case 22:
          (s.memoizedState === null && An(u, s, n), Ao(s, s.return));
          break;
        case 30:
          break;
        default:
          An(u, s, n);
      }
      t = t.sibling;
    }
  }
  function cs(e, t) {
    var n = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (n = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== n && (e != null && e.refCount++, n != null && po(n)));
  }
  function ss(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && po(e)));
  }
  function kt(e, t, n, a) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (iv(e, t, n, a), (t = t.sibling));
  }
  function iv(e, t, n, a) {
    var u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (kt(e, t, n, a), u & 2048 && wo(9, t));
        break;
      case 1:
        kt(e, t, n, a);
        break;
      case 3:
        (kt(e, t, n, a),
          u & 2048 &&
            ((e = null),
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== e && (t.refCount++, e != null && po(e))));
        break;
      case 12:
        if (u & 2048) {
          (kt(e, t, n, a), (e = t.stateNode));
          try {
            var s = t.memoizedProps,
              g = s.id,
              x = s.onPostCommit;
            typeof x == "function" &&
              x(g, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
          } catch (A) {
            ze(t, t.return, A);
          }
        } else kt(e, t, n, a);
        break;
      case 31:
        kt(e, t, n, a);
        break;
      case 13:
        kt(e, t, n, a);
        break;
      case 23:
        break;
      case 22:
        ((s = t.stateNode),
          (g = t.alternate),
          t.memoizedState !== null
            ? s._visibility & 2
              ? kt(e, t, n, a)
              : _o(e, t)
            : s._visibility & 2
              ? kt(e, t, n, a)
              : ((s._visibility |= 2), ga(e, t, n, a, (t.subtreeFlags & 10256) !== 0 || !1)),
          u & 2048 && cs(g, t));
        break;
      case 24:
        (kt(e, t, n, a), u & 2048 && ss(t.alternate, t));
        break;
      default:
        kt(e, t, n, a);
    }
  }
  function ga(e, t, n, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var s = e,
        g = t,
        x = n,
        A = a,
        U = g.flags;
      switch (g.tag) {
        case 0:
        case 11:
        case 15:
          (ga(s, g, x, A, u), wo(8, g));
          break;
        case 23:
          break;
        case 22:
          var G = g.stateNode;
          (g.memoizedState !== null
            ? G._visibility & 2
              ? ga(s, g, x, A, u)
              : _o(s, g)
            : ((G._visibility |= 2), ga(s, g, x, A, u)),
            u && U & 2048 && cs(g.alternate, g));
          break;
        case 24:
          (ga(s, g, x, A, u), u && U & 2048 && ss(g.alternate, g));
          break;
        default:
          ga(s, g, x, A, u);
      }
      t = t.sibling;
    }
  }
  function _o(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e,
          a = t,
          u = a.flags;
        switch (a.tag) {
          case 22:
            (_o(n, a), u & 2048 && cs(a.alternate, a));
            break;
          case 24:
            (_o(n, a), u & 2048 && ss(a.alternate, a));
            break;
          default:
            _o(n, a);
        }
        t = t.sibling;
      }
  }
  var Mo = 8192;
  function ya(e, t, n) {
    if (e.subtreeFlags & Mo) for (e = e.child; e !== null; ) (uv(e, t, n), (e = e.sibling));
  }
  function uv(e, t, n) {
    switch (e.tag) {
      case 26:
        (ya(e, t, n),
          e.flags & Mo && e.memoizedState !== null && pC(n, Zt, e.memoizedState, e.memoizedProps));
        break;
      case 5:
        ya(e, t, n);
        break;
      case 3:
      case 4:
        var a = Zt;
        ((Zt = vi(e.stateNode.containerInfo)), ya(e, t, n), (Zt = a));
        break;
      case 22:
        e.memoizedState === null &&
          ((a = e.alternate),
          a !== null && a.memoizedState !== null
            ? ((a = Mo), (Mo = 16777216), ya(e, t, n), (Mo = a))
            : ya(e, t, n));
        break;
      default:
        ya(e, t, n);
    }
  }
  function cv(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function Oo(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var a = t[n];
          ((nt = a), fv(a, e));
        }
      cv(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) (sv(e), (e = e.sibling));
  }
  function sv(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Oo(e), e.flags & 2048 && $n(9, e, e.return));
        break;
      case 3:
        Oo(e);
        break;
      case 12:
        Oo(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), ni(e))
          : Oo(e);
        break;
      default:
        Oo(e);
    }
  }
  function ni(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var a = t[n];
          ((nt = a), fv(a, e));
        }
      cv(e);
    }
    for (e = e.child; e !== null; ) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          ($n(8, t, t.return), ni(t));
          break;
        case 22:
          ((n = t.stateNode), n._visibility & 2 && ((n._visibility &= -3), ni(t)));
          break;
        default:
          ni(t);
      }
      e = e.sibling;
    }
  }
  function fv(e, t) {
    for (; nt !== null; ) {
      var n = nt;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          $n(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var a = n.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          po(n.memoizedState.cache);
      }
      if (((a = n.child), a !== null)) ((a.return = n), (nt = a));
      else
        e: for (n = e; nt !== null; ) {
          a = nt;
          var u = a.sibling,
            s = a.return;
          if ((tv(a), a === n)) {
            nt = null;
            break e;
          }
          if (u !== null) {
            ((u.return = s), (nt = u));
            break e;
          }
          nt = s;
        }
    }
  }
  var _E = {
      getCacheForType: function (e) {
        var t = ot(Qe),
          n = t.data.get(e);
        return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
      },
      cacheSignal: function () {
        return ot(Qe).controller.signal;
      },
    },
    ME = typeof WeakMap == "function" ? WeakMap : Map,
    Oe = 0,
    Be = null,
    Ee = null,
    Re = 0,
    Ne = 0,
    Mt = null,
    Qn = !1,
    Sa = !1,
    fs = !1,
    _n = 0,
    qe = 0,
    Zn = 0,
    Bl = 0,
    ds = 0,
    Ot = 0,
    ba = 0,
    Do = null,
    bt = null,
    ps = !1,
    li = 0,
    dv = 0,
    ai = 1 / 0,
    oi = null,
    kn = null,
    Je = 0,
    Fn = null,
    xa = null,
    Mn = 0,
    hs = 0,
    vs = null,
    pv = null,
    No = 0,
    ms = null;
  function Dt() {
    return (Oe & 2) !== 0 && Re !== 0 ? Re & -Re : j.T !== null ? Es() : Md();
  }
  function hv() {
    if (Ot === 0)
      if ((Re & 536870912) === 0 || we) {
        var e = pr;
        ((pr <<= 1), (pr & 3932160) === 0 && (pr = 262144), (Ot = e));
      } else Ot = 536870912;
    return ((e = At.current), e !== null && (e.flags |= 32), Ot);
  }
  function xt(e, t, n) {
    (((e === Be && (Ne === 2 || Ne === 9)) || e.cancelPendingCommit !== null) &&
      (Ea(e, 0), Jn(e, Re, Ot, !1)),
      Ja(e, n),
      ((Oe & 2) === 0 || e !== Be) &&
        (e === Be && ((Oe & 2) === 0 && (Bl |= n), qe === 4 && Jn(e, Re, Ot, !1)), an(e)));
  }
  function vv(e, t, n) {
    if ((Oe & 6) !== 0) throw Error(i(327));
    var a = (!n && (t & 127) === 0 && (t & e.expiredLanes) === 0) || Fa(e, t),
      u = a ? NE(e, t) : ys(e, t, !0),
      s = a;
    do {
      if (u === 0) {
        Sa && !a && Jn(e, t, 0, !1);
        break;
      } else {
        if (((n = e.current.alternate), s && !OE(n))) {
          ((u = ys(e, t, !1)), (s = !1));
          continue;
        }
        if (u === 2) {
          if (((s = t), e.errorRecoveryDisabledLanes & s)) var g = 0;
          else
            ((g = e.pendingLanes & -536870913), (g = g !== 0 ? g : g & 536870912 ? 536870912 : 0));
          if (g !== 0) {
            t = g;
            e: {
              var x = e;
              u = Do;
              var A = x.current.memoizedState.isDehydrated;
              if ((A && (Ea(x, g).flags |= 256), (g = ys(x, g, !1)), g !== 2)) {
                if (fs && !A) {
                  ((x.errorRecoveryDisabledLanes |= s), (Bl |= s), (u = 4));
                  break e;
                }
                ((s = bt), (bt = u), s !== null && (bt === null ? (bt = s) : bt.push.apply(bt, s)));
              }
              u = g;
            }
            if (((s = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (Ea(e, 0), Jn(e, t, 0, !0));
          break;
        }
        e: {
          switch (((a = e), (s = u), s)) {
            case 0:
            case 1:
              throw Error(i(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Jn(a, t, Ot, !Qn);
              break e;
            case 2:
              bt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(i(329));
          }
          if ((t & 62914560) === t && ((u = li + 300 - Et()), 10 < u)) {
            if ((Jn(a, t, Ot, !Qn), vr(a, 0, !0) !== 0)) break e;
            ((Mn = t),
              (a.timeoutHandle = Kv(
                mv.bind(null, a, n, bt, oi, ps, t, Ot, Bl, ba, Qn, s, "Throttled", -0, 0),
                u,
              )));
            break e;
          }
          mv(a, n, bt, oi, ps, t, Ot, Bl, ba, Qn, s, null, -0, 0);
        }
      }
      break;
    } while (!0);
    an(e);
  }
  function mv(e, t, n, a, u, s, g, x, A, U, G, X, H, P) {
    if (((e.timeoutHandle = -1), (X = t.subtreeFlags), X & 8192 || (X & 16785408) === 16785408)) {
      ((X = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: hn,
      }),
        uv(t, s, X));
      var ae = (s & 62914560) === s ? li - Et() : (s & 4194048) === s ? dv - Et() : 0;
      if (((ae = hC(X, ae)), ae !== null)) {
        ((Mn = s),
          (e.cancelPendingCommit = ae(Rv.bind(null, e, t, s, n, a, u, g, x, A, G, X, null, H, P))),
          Jn(e, s, g, !U));
        return;
      }
    }
    Rv(e, t, s, n, a, u, g, x, A);
  }
  function OE(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        t.flags & 16384 &&
        ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var a = 0; a < n.length; a++) {
          var u = n[a],
            s = u.getSnapshot;
          u = u.value;
          try {
            if (!Tt(s(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function Jn(e, t, n, a) {
    ((t &= ~ds),
      (t &= ~Bl),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      a && (e.warmLanes |= t),
      (a = e.expirationTimes));
    for (var u = t; 0 < u; ) {
      var s = 31 - Rt(u),
        g = 1 << s;
      ((a[s] = -1), (u &= ~g));
    }
    n !== 0 && wd(e, n, t);
  }
  function ri() {
    return (Oe & 6) === 0 ? (zo(0), !1) : !0;
  }
  function gs() {
    if (Ee !== null) {
      if (Ne === 0) var e = Ee.return;
      else ((e = Ee), (yn = _l = null), zc(e), (da = null), (vo = 0), (e = Ee));
      for (; e !== null; ) ($h(e.alternate, e), (e = e.return));
      Ee = null;
    }
  }
  function Ea(e, t) {
    var n = e.timeoutHandle;
    (n !== -1 && ((e.timeoutHandle = -1), kE(n)),
      (n = e.cancelPendingCommit),
      n !== null && ((e.cancelPendingCommit = null), n()),
      (Mn = 0),
      gs(),
      (Be = e),
      (Ee = n = mn(e.current, null)),
      (Re = t),
      (Ne = 0),
      (Mt = null),
      (Qn = !1),
      (Sa = Fa(e, t)),
      (fs = !1),
      (ba = Ot = ds = Bl = Zn = qe = 0),
      (bt = Do = null),
      (ps = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var u = 31 - Rt(a),
          s = 1 << u;
        ((t |= e[u]), (a &= ~s));
      }
    return ((_n = t), Ar(), n);
  }
  function gv(e, t) {
    ((ye = null),
      (j.H = Co),
      t === fa || t === Lr
        ? ((t = zp()), (Ne = 3))
        : t === xc
          ? ((t = zp()), (Ne = 4))
          : (Ne =
              t === Zc
                ? 8
                : t !== null && typeof t == "object" && typeof t.then == "function"
                  ? 6
                  : 1),
      (Mt = t),
      Ee === null && ((qe = 1), Zr(e, Ht(t, e.current))));
  }
  function yv() {
    var e = At.current;
    return e === null
      ? !0
      : (Re & 4194048) === Re
        ? Yt === null
        : (Re & 62914560) === Re || (Re & 536870912) !== 0
          ? e === Yt
          : !1;
  }
  function Sv() {
    var e = j.H;
    return ((j.H = Co), e === null ? Co : e);
  }
  function bv() {
    var e = j.A;
    return ((j.A = _E), e);
  }
  function ii() {
    ((qe = 4),
      Qn || ((Re & 4194048) !== Re && At.current !== null) || (Sa = !0),
      ((Zn & 134217727) === 0 && (Bl & 134217727) === 0) || Be === null || Jn(Be, Re, Ot, !1));
  }
  function ys(e, t, n) {
    var a = Oe;
    Oe |= 2;
    var u = Sv(),
      s = bv();
    ((Be !== e || Re !== t) && ((oi = null), Ea(e, t)), (t = !1));
    var g = qe;
    e: do
      try {
        if (Ne !== 0 && Ee !== null) {
          var x = Ee,
            A = Mt;
          switch (Ne) {
            case 8:
              (gs(), (g = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              At.current === null && (t = !0);
              var U = Ne;
              if (((Ne = 0), (Mt = null), Ca(e, x, A, U), n && Sa)) {
                g = 0;
                break e;
              }
              break;
            default:
              ((U = Ne), (Ne = 0), (Mt = null), Ca(e, x, A, U));
          }
        }
        (DE(), (g = qe));
        break;
      } catch (G) {
        gv(e, G);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (yn = _l = null),
      (Oe = a),
      (j.H = u),
      (j.A = s),
      Ee === null && ((Be = null), (Re = 0), Ar()),
      g
    );
  }
  function DE() {
    for (; Ee !== null; ) xv(Ee);
  }
  function NE(e, t) {
    var n = Oe;
    Oe |= 2;
    var a = Sv(),
      u = bv();
    Be !== e || Re !== t ? ((oi = null), (ai = Et() + 500), Ea(e, t)) : (Sa = Fa(e, t));
    e: do
      try {
        if (Ne !== 0 && Ee !== null) {
          t = Ee;
          var s = Mt;
          t: switch (Ne) {
            case 1:
              ((Ne = 0), (Mt = null), Ca(e, t, s, 1));
              break;
            case 2:
            case 9:
              if (Dp(s)) {
                ((Ne = 0), (Mt = null), Ev(t));
                break;
              }
              ((t = function () {
                ((Ne !== 2 && Ne !== 9) || Be !== e || (Ne = 7), an(e));
              }),
                s.then(t, t));
              break e;
            case 3:
              Ne = 7;
              break e;
            case 4:
              Ne = 5;
              break e;
            case 7:
              Dp(s) ? ((Ne = 0), (Mt = null), Ev(t)) : ((Ne = 0), (Mt = null), Ca(e, t, s, 7));
              break;
            case 5:
              var g = null;
              switch (Ee.tag) {
                case 26:
                  g = Ee.memoizedState;
                case 5:
                case 27:
                  var x = Ee;
                  if (g ? im(g) : x.stateNode.complete) {
                    ((Ne = 0), (Mt = null));
                    var A = x.sibling;
                    if (A !== null) Ee = A;
                    else {
                      var U = x.return;
                      U !== null ? ((Ee = U), ui(U)) : (Ee = null);
                    }
                    break t;
                  }
              }
              ((Ne = 0), (Mt = null), Ca(e, t, s, 5));
              break;
            case 6:
              ((Ne = 0), (Mt = null), Ca(e, t, s, 6));
              break;
            case 8:
              (gs(), (qe = 6));
              break e;
            default:
              throw Error(i(462));
          }
        }
        zE();
        break;
      } catch (G) {
        gv(e, G);
      }
    while (!0);
    return (
      (yn = _l = null),
      (j.H = a),
      (j.A = u),
      (Oe = n),
      Ee !== null ? 0 : ((Be = null), (Re = 0), Ar(), qe)
    );
  }
  function zE() {
    for (; Ee !== null && !nx(); ) xv(Ee);
  }
  function xv(e) {
    var t = Ih(e.alternate, e, _n);
    ((e.memoizedProps = e.pendingProps), t === null ? ui(e) : (Ee = t));
  }
  function Ev(e) {
    var t = e,
      n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Ph(n, t, t.pendingProps, t.type, void 0, Re);
        break;
      case 11:
        t = Ph(n, t, t.pendingProps, t.type.render, t.ref, Re);
        break;
      case 5:
        zc(t);
      default:
        ($h(n, t), (t = Ee = bp(t, _n)), (t = Ih(n, t, _n)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? ui(e) : (Ee = t));
  }
  function Ca(e, t, n, a) {
    ((yn = _l = null), zc(t), (da = null), (vo = 0));
    var u = t.return;
    try {
      if (xE(e, u, t, n, Re)) {
        ((qe = 1), Zr(e, Ht(n, e.current)), (Ee = null));
        return;
      }
    } catch (s) {
      if (u !== null) throw ((Ee = u), s);
      ((qe = 1), Zr(e, Ht(n, e.current)), (Ee = null));
      return;
    }
    t.flags & 32768
      ? (we || a === 1
          ? (e = !0)
          : Sa || (Re & 536870912) !== 0
            ? (e = !1)
            : ((Qn = e = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = At.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
        Cv(t, e))
      : ui(t);
  }
  function ui(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Cv(t, Qn);
        return;
      }
      e = t.return;
      var n = RE(t.alternate, t, _n);
      if (n !== null) {
        Ee = n;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        Ee = t;
        return;
      }
      Ee = t = e;
    } while (t !== null);
    qe === 0 && (qe = 5);
  }
  function Cv(e, t) {
    do {
      var n = TE(e.alternate, e);
      if (n !== null) {
        ((n.flags &= 32767), (Ee = n));
        return;
      }
      if (
        ((n = e.return),
        n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        Ee = e;
        return;
      }
      Ee = e = n;
    } while (e !== null);
    ((qe = 6), (Ee = null));
  }
  function Rv(e, t, n, a, u, s, g, x, A) {
    e.cancelPendingCommit = null;
    do ci();
    while (Je !== 0);
    if ((Oe & 6) !== 0) throw Error(i(327));
    if (t !== null) {
      if (t === e.current) throw Error(i(177));
      if (
        ((s = t.lanes | t.childLanes),
        (s |= rc),
        dx(e, n, s, g, x, A),
        e === Be && ((Ee = Be = null), (Re = 0)),
        (xa = t),
        (Fn = e),
        (Mn = n),
        (hs = s),
        (vs = u),
        (pv = a),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            BE(fr, function () {
              return (Mv(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (a = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = j.T), (j.T = null), (u = I.p), (I.p = 2), (g = Oe), (Oe |= 4));
        try {
          wE(e, t, n);
        } finally {
          ((Oe = g), (I.p = u), (j.T = a));
        }
      }
      ((Je = 1), Tv(), wv(), Av());
    }
  }
  function Tv() {
    if (Je === 1) {
      Je = 0;
      var e = Fn,
        t = xa,
        n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        ((n = j.T), (j.T = null));
        var a = I.p;
        I.p = 2;
        var u = Oe;
        Oe |= 4;
        try {
          ov(t, e);
          var s = Os,
            g = fp(e.containerInfo),
            x = s.focusedElem,
            A = s.selectionRange;
          if (g !== x && x && x.ownerDocument && sp(x.ownerDocument.documentElement, x)) {
            if (A !== null && tc(x)) {
              var U = A.start,
                G = A.end;
              if ((G === void 0 && (G = U), "selectionStart" in x))
                ((x.selectionStart = U), (x.selectionEnd = Math.min(G, x.value.length)));
              else {
                var X = x.ownerDocument || document,
                  H = (X && X.defaultView) || window;
                if (H.getSelection) {
                  var P = H.getSelection(),
                    ae = x.textContent.length,
                    fe = Math.min(A.start, ae),
                    Ue = A.end === void 0 ? fe : Math.min(A.end, ae);
                  !P.extend && fe > Ue && ((g = Ue), (Ue = fe), (fe = g));
                  var z = cp(x, fe),
                    O = cp(x, Ue);
                  if (
                    z &&
                    O &&
                    (P.rangeCount !== 1 ||
                      P.anchorNode !== z.node ||
                      P.anchorOffset !== z.offset ||
                      P.focusNode !== O.node ||
                      P.focusOffset !== O.offset)
                  ) {
                    var L = X.createRange();
                    (L.setStart(z.node, z.offset),
                      P.removeAllRanges(),
                      fe > Ue
                        ? (P.addRange(L), P.extend(O.node, O.offset))
                        : (L.setEnd(O.node, O.offset), P.addRange(L)));
                  }
                }
              }
            }
            for (X = [], P = x; (P = P.parentNode); )
              P.nodeType === 1 && X.push({ element: P, left: P.scrollLeft, top: P.scrollTop });
            for (typeof x.focus == "function" && x.focus(), x = 0; x < X.length; x++) {
              var q = X[x];
              ((q.element.scrollLeft = q.left), (q.element.scrollTop = q.top));
            }
          }
          ((xi = !!Ms), (Os = Ms = null));
        } finally {
          ((Oe = u), (I.p = a), (j.T = n));
        }
      }
      ((e.current = t), (Je = 2));
    }
  }
  function wv() {
    if (Je === 2) {
      Je = 0;
      var e = Fn,
        t = xa,
        n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        ((n = j.T), (j.T = null));
        var a = I.p;
        I.p = 2;
        var u = Oe;
        Oe |= 4;
        try {
          ev(e, t.alternate, t);
        } finally {
          ((Oe = u), (I.p = a), (j.T = n));
        }
      }
      Je = 3;
    }
  }
  function Av() {
    if (Je === 4 || Je === 3) {
      ((Je = 0), lx());
      var e = Fn,
        t = xa,
        n = Mn,
        a = pv;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (Je = 5)
        : ((Je = 0), (xa = Fn = null), _v(e, e.pendingLanes));
      var u = e.pendingLanes;
      if (
        (u === 0 && (kn = null),
        Uu(n),
        (t = t.stateNode),
        Ct && typeof Ct.onCommitFiberRoot == "function")
      )
        try {
          Ct.onCommitFiberRoot(ka, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((t = j.T), (u = I.p), (I.p = 2), (j.T = null));
        try {
          for (var s = e.onRecoverableError, g = 0; g < a.length; g++) {
            var x = a[g];
            s(x.value, { componentStack: x.stack });
          }
        } finally {
          ((j.T = t), (I.p = u));
        }
      }
      ((Mn & 3) !== 0 && ci(),
        an(e),
        (u = e.pendingLanes),
        (n & 261930) !== 0 && (u & 42) !== 0 ? (e === ms ? No++ : ((No = 0), (ms = e))) : (No = 0),
        zo(0));
    }
  }
  function _v(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), po(t)));
  }
  function ci() {
    return (Tv(), wv(), Av(), Mv());
  }
  function Mv() {
    if (Je !== 5) return !1;
    var e = Fn,
      t = hs;
    hs = 0;
    var n = Uu(Mn),
      a = j.T,
      u = I.p;
    try {
      ((I.p = 32 > n ? 32 : n), (j.T = null), (n = vs), (vs = null));
      var s = Fn,
        g = Mn;
      if (((Je = 0), (xa = Fn = null), (Mn = 0), (Oe & 6) !== 0)) throw Error(i(331));
      var x = Oe;
      if (
        ((Oe |= 4),
        sv(s.current),
        iv(s, s.current, g, n),
        (Oe = x),
        zo(0, !1),
        Ct && typeof Ct.onPostCommitFiberRoot == "function")
      )
        try {
          Ct.onPostCommitFiberRoot(ka, s);
        } catch {}
      return !0;
    } finally {
      ((I.p = u), (j.T = a), _v(e, t));
    }
  }
  function Ov(e, t, n) {
    ((t = Ht(n, t)),
      (t = Qc(e.stateNode, t, 2)),
      (e = Xn(e, t, 2)),
      e !== null && (Ja(e, 2), an(e)));
  }
  function ze(e, t, n) {
    if (e.tag === 3) Ov(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Ov(t, e, n);
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" && (kn === null || !kn.has(a)))
          ) {
            ((e = Ht(n, e)),
              (n = Dh(2)),
              (a = Xn(t, n, 2)),
              a !== null && (Nh(n, a, t, e), Ja(a, 2), an(a)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Ss(e, t, n) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new ME();
      var u = new Set();
      a.set(t, u);
    } else ((u = a.get(t)), u === void 0 && ((u = new Set()), a.set(t, u)));
    u.has(n) || ((fs = !0), u.add(n), (e = jE.bind(null, e, t, n)), t.then(e, e));
  }
  function jE(e, t, n) {
    var a = e.pingCache;
    (a !== null && a.delete(t),
      (e.pingedLanes |= e.suspendedLanes & n),
      (e.warmLanes &= ~n),
      Be === e &&
        (Re & n) === n &&
        (qe === 4 || (qe === 3 && (Re & 62914560) === Re && 300 > Et() - li)
          ? (Oe & 2) === 0 && Ea(e, 0)
          : (ds |= n),
        ba === Re && (ba = 0)),
      an(e));
  }
  function Dv(e, t) {
    (t === 0 && (t = Td()), (e = Tl(e, t)), e !== null && (Ja(e, t), an(e)));
  }
  function LE(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), Dv(e, n));
  }
  function UE(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode,
          u = e.memoizedState;
        u !== null && (n = u.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(i(314));
    }
    (a !== null && a.delete(t), Dv(e, n));
  }
  function BE(e, t) {
    return Nu(e, t);
  }
  var si = null,
    Ra = null,
    bs = !1,
    fi = !1,
    xs = !1,
    Wn = 0;
  function an(e) {
    (e !== Ra && e.next === null && (Ra === null ? (si = Ra = e) : (Ra = Ra.next = e)),
      (fi = !0),
      bs || ((bs = !0), PE()));
  }
  function zo(e, t) {
    if (!xs && fi) {
      xs = !0;
      do
        for (var n = !1, a = si; a !== null; ) {
          if (e !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var s = 0;
            else {
              var g = a.suspendedLanes,
                x = a.pingedLanes;
              ((s = (1 << (31 - Rt(42 | e) + 1)) - 1),
                (s &= u & ~(g & ~x)),
                (s = s & 201326741 ? (s & 201326741) | 1 : s ? s | 2 : 0));
            }
            s !== 0 && ((n = !0), Lv(a, s));
          } else
            ((s = Re),
              (s = vr(
                a,
                a === Be ? s : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
              )),
              (s & 3) === 0 || Fa(a, s) || ((n = !0), Lv(a, s)));
          a = a.next;
        }
      while (n);
      xs = !1;
    }
  }
  function HE() {
    Nv();
  }
  function Nv() {
    fi = bs = !1;
    var e = 0;
    Wn !== 0 && ZE() && (e = Wn);
    for (var t = Et(), n = null, a = si; a !== null; ) {
      var u = a.next,
        s = zv(a, t);
      (s === 0
        ? ((a.next = null), n === null ? (si = u) : (n.next = u), u === null && (Ra = n))
        : ((n = a), (e !== 0 || (s & 3) !== 0) && (fi = !0)),
        (a = u));
    }
    ((Je !== 0 && Je !== 5) || zo(e), Wn !== 0 && (Wn = 0));
  }
  function zv(e, t) {
    for (
      var n = e.suspendedLanes,
        a = e.pingedLanes,
        u = e.expirationTimes,
        s = e.pendingLanes & -62914561;
      0 < s;
    ) {
      var g = 31 - Rt(s),
        x = 1 << g,
        A = u[g];
      (A === -1
        ? ((x & n) === 0 || (x & a) !== 0) && (u[g] = fx(x, t))
        : A <= t && (e.expiredLanes |= x),
        (s &= ~x));
    }
    if (
      ((t = Be),
      (n = Re),
      (n = vr(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      (a = e.callbackNode),
      n === 0 || (e === t && (Ne === 2 || Ne === 9)) || e.cancelPendingCommit !== null)
    )
      return (a !== null && a !== null && zu(a), (e.callbackNode = null), (e.callbackPriority = 0));
    if ((n & 3) === 0 || Fa(e, n)) {
      if (((t = n & -n), t === e.callbackPriority)) return t;
      switch ((a !== null && zu(a), Uu(n))) {
        case 2:
        case 8:
          n = Cd;
          break;
        case 32:
          n = fr;
          break;
        case 268435456:
          n = Rd;
          break;
        default:
          n = fr;
      }
      return (
        (a = jv.bind(null, e)),
        (n = Nu(n, a)),
        (e.callbackPriority = t),
        (e.callbackNode = n),
        t
      );
    }
    return (
      a !== null && a !== null && zu(a),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function jv(e, t) {
    if (Je !== 0 && Je !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var n = e.callbackNode;
    if (ci() && e.callbackNode !== n) return null;
    var a = Re;
    return (
      (a = vr(e, e === Be ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      a === 0
        ? null
        : (vv(e, a, t),
          zv(e, Et()),
          e.callbackNode != null && e.callbackNode === n ? jv.bind(null, e) : null)
    );
  }
  function Lv(e, t) {
    if (ci()) return null;
    vv(e, t, !0);
  }
  function PE() {
    FE(function () {
      (Oe & 6) !== 0 ? Nu(Ed, HE) : Nv();
    });
  }
  function Es() {
    if (Wn === 0) {
      var e = ca;
      (e === 0 && ((e = dr), (dr <<= 1), (dr & 261888) === 0 && (dr = 256)), (Wn = e));
    }
    return Wn;
  }
  function Uv(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean"
      ? null
      : typeof e == "function"
        ? e
        : Sr("" + e);
  }
  function Bv(e, t) {
    var n = t.ownerDocument.createElement("input");
    return (
      (n.name = t.name),
      (n.value = t.value),
      e.id && n.setAttribute("form", e.id),
      t.parentNode.insertBefore(n, t),
      (e = new FormData(e)),
      n.parentNode.removeChild(n),
      e
    );
  }
  function VE(e, t, n, a, u) {
    if (t === "submit" && n && n.stateNode === u) {
      var s = Uv((u[vt] || null).action),
        g = a.submitter;
      g &&
        ((t = (t = g[vt] || null) ? Uv(t.formAction) : g.getAttribute("formAction")),
        t !== null && ((s = t), (g = null)));
      var x = new Cr("action", "action", null, a, u);
      e.push({
        event: x,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (Wn !== 0) {
                  var A = g ? Bv(u, g) : new FormData(u);
                  Yc(n, { pending: !0, data: A, method: u.method, action: s }, null, A);
                }
              } else
                typeof s == "function" &&
                  (x.preventDefault(),
                  (A = g ? Bv(u, g) : new FormData(u)),
                  Yc(n, { pending: !0, data: A, method: u.method, action: s }, s, A));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var Cs = 0; Cs < oc.length; Cs++) {
    var Rs = oc[Cs],
      GE = Rs.toLowerCase(),
      YE = Rs[0].toUpperCase() + Rs.slice(1);
    Qt(GE, "on" + YE);
  }
  (Qt(hp, "onAnimationEnd"),
    Qt(vp, "onAnimationIteration"),
    Qt(mp, "onAnimationStart"),
    Qt("dblclick", "onDoubleClick"),
    Qt("focusin", "onFocus"),
    Qt("focusout", "onBlur"),
    Qt(aE, "onTransitionRun"),
    Qt(oE, "onTransitionStart"),
    Qt(rE, "onTransitionCancel"),
    Qt(gp, "onTransitionEnd"),
    Zl("onMouseEnter", ["mouseout", "mouseover"]),
    Zl("onMouseLeave", ["mouseout", "mouseover"]),
    Zl("onPointerEnter", ["pointerout", "pointerover"]),
    Zl("onPointerLeave", ["pointerout", "pointerover"]),
    xl("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    xl(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    xl("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    xl("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    xl(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    xl(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var jo =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    qE = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(jo),
    );
  function Hv(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var a = e[n],
        u = a.event;
      a = a.listeners;
      e: {
        var s = void 0;
        if (t)
          for (var g = a.length - 1; 0 <= g; g--) {
            var x = a[g],
              A = x.instance,
              U = x.currentTarget;
            if (((x = x.listener), A !== s && u.isPropagationStopped())) break e;
            ((s = x), (u.currentTarget = U));
            try {
              s(u);
            } catch (G) {
              wr(G);
            }
            ((u.currentTarget = null), (s = A));
          }
        else
          for (g = 0; g < a.length; g++) {
            if (
              ((x = a[g]),
              (A = x.instance),
              (U = x.currentTarget),
              (x = x.listener),
              A !== s && u.isPropagationStopped())
            )
              break e;
            ((s = x), (u.currentTarget = U));
            try {
              s(u);
            } catch (G) {
              wr(G);
            }
            ((u.currentTarget = null), (s = A));
          }
      }
    }
  }
  function Ce(e, t) {
    var n = t[Bu];
    n === void 0 && (n = t[Bu] = new Set());
    var a = e + "__bubble";
    n.has(a) || (Pv(t, e, 2, !1), n.add(a));
  }
  function Ts(e, t, n) {
    var a = 0;
    (t && (a |= 4), Pv(n, e, a, t));
  }
  var di = "_reactListening" + Math.random().toString(36).slice(2);
  function ws(e) {
    if (!e[di]) {
      ((e[di] = !0),
        Nd.forEach(function (n) {
          n !== "selectionchange" && (qE.has(n) || Ts(n, !1, e), Ts(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[di] || ((t[di] = !0), Ts("selectionchange", !1, t));
    }
  }
  function Pv(e, t, n, a) {
    switch (hm(t)) {
      case 2:
        var u = gC;
        break;
      case 8:
        u = yC;
        break;
      default:
        u = Gs;
    }
    ((n = u.bind(null, t, n, e)),
      (u = void 0),
      !Ku || (t !== "touchstart" && t !== "touchmove" && t !== "wheel") || (u = !0),
      a
        ? u !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: u })
          : e.addEventListener(t, n, !0)
        : u !== void 0
          ? e.addEventListener(t, n, { passive: u })
          : e.addEventListener(t, n, !1));
  }
  function As(e, t, n, a, u) {
    var s = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (;;) {
        if (a === null) return;
        var g = a.tag;
        if (g === 3 || g === 4) {
          var x = a.stateNode.containerInfo;
          if (x === u) break;
          if (g === 4)
            for (g = a.return; g !== null; ) {
              var A = g.tag;
              if ((A === 3 || A === 4) && g.stateNode.containerInfo === u) return;
              g = g.return;
            }
          for (; x !== null; ) {
            if (((g = Kl(x)), g === null)) return;
            if (((A = g.tag), A === 5 || A === 6 || A === 26 || A === 27)) {
              a = s = g;
              continue e;
            }
            x = x.parentNode;
          }
        }
        a = a.return;
      }
    Xd(function () {
      var U = s,
        G = Xu(n),
        X = [];
      e: {
        var H = yp.get(e);
        if (H !== void 0) {
          var P = Cr,
            ae = e;
          switch (e) {
            case "keypress":
              if (xr(n) === 0) break e;
            case "keydown":
            case "keyup":
              P = Ux;
              break;
            case "focusin":
              ((ae = "focus"), (P = ku));
              break;
            case "focusout":
              ((ae = "blur"), (P = ku));
              break;
            case "beforeblur":
            case "afterblur":
              P = ku;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              P = $d;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              P = Rx;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              P = Px;
              break;
            case hp:
            case vp:
            case mp:
              P = Ax;
              break;
            case gp:
              P = Gx;
              break;
            case "scroll":
            case "scrollend":
              P = Ex;
              break;
            case "wheel":
              P = qx;
              break;
            case "copy":
            case "cut":
            case "paste":
              P = Mx;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              P = Zd;
              break;
            case "toggle":
            case "beforetoggle":
              P = Ix;
          }
          var fe = (t & 4) !== 0,
            Ue = !fe && (e === "scroll" || e === "scrollend"),
            z = fe ? (H !== null ? H + "Capture" : null) : H;
          fe = [];
          for (var O = U, L; O !== null; ) {
            var q = O;
            if (
              ((L = q.stateNode),
              (q = q.tag),
              (q !== 5 && q !== 26 && q !== 27) ||
                L === null ||
                z === null ||
                ((q = to(O, z)), q != null && fe.push(Lo(O, q, L))),
              Ue)
            )
              break;
            O = O.return;
          }
          0 < fe.length && ((H = new P(H, ae, null, n, G)), X.push({ event: H, listeners: fe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((H = e === "mouseover" || e === "pointerover"),
            (P = e === "mouseout" || e === "pointerout"),
            H && n !== qu && (ae = n.relatedTarget || n.fromElement) && (Kl(ae) || ae[Il]))
          )
            break e;
          if (
            (P || H) &&
            ((H =
              G.window === G
                ? G
                : (H = G.ownerDocument)
                  ? H.defaultView || H.parentWindow
                  : window),
            P
              ? ((ae = n.relatedTarget || n.toElement),
                (P = U),
                (ae = ae ? Kl(ae) : null),
                ae !== null &&
                  ((Ue = f(ae)), (fe = ae.tag), ae !== Ue || (fe !== 5 && fe !== 27 && fe !== 6)) &&
                  (ae = null))
              : ((P = null), (ae = U)),
            P !== ae)
          ) {
            if (
              ((fe = $d),
              (q = "onMouseLeave"),
              (z = "onMouseEnter"),
              (O = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((fe = Zd), (q = "onPointerLeave"), (z = "onPointerEnter"), (O = "pointer")),
              (Ue = P == null ? H : eo(P)),
              (L = ae == null ? H : eo(ae)),
              (H = new fe(q, O + "leave", P, n, G)),
              (H.target = Ue),
              (H.relatedTarget = L),
              (q = null),
              Kl(G) === U &&
                ((fe = new fe(z, O + "enter", ae, n, G)),
                (fe.target = L),
                (fe.relatedTarget = Ue),
                (q = fe)),
              (Ue = q),
              P && ae)
            )
              t: {
                for (fe = XE, z = P, O = ae, L = 0, q = z; q; q = fe(q)) L++;
                q = 0;
                for (var ue = O; ue; ue = fe(ue)) q++;
                for (; 0 < L - q; ) ((z = fe(z)), L--);
                for (; 0 < q - L; ) ((O = fe(O)), q--);
                for (; L--; ) {
                  if (z === O || (O !== null && z === O.alternate)) {
                    fe = z;
                    break t;
                  }
                  ((z = fe(z)), (O = fe(O)));
                }
                fe = null;
              }
            else fe = null;
            (P !== null && Vv(X, H, P, fe, !1),
              ae !== null && Ue !== null && Vv(X, Ue, ae, fe, !0));
          }
        }
        e: {
          if (
            ((H = U ? eo(U) : window),
            (P = H.nodeName && H.nodeName.toLowerCase()),
            P === "select" || (P === "input" && H.type === "file"))
          )
            var Ae = lp;
          else if (tp(H))
            if (ap) Ae = tE;
            else {
              Ae = Wx;
              var oe = Jx;
            }
          else
            ((P = H.nodeName),
              !P || P.toLowerCase() !== "input" || (H.type !== "checkbox" && H.type !== "radio")
                ? U && Yu(U.elementType) && (Ae = lp)
                : (Ae = eE));
          if (Ae && (Ae = Ae(e, U))) {
            np(X, Ae, n, G);
            break e;
          }
          (oe && oe(e, H, U),
            e === "focusout" &&
              U &&
              H.type === "number" &&
              U.memoizedProps.value != null &&
              Gu(H, "number", H.value));
        }
        switch (((oe = U ? eo(U) : window), e)) {
          case "focusin":
            (tp(oe) || oe.contentEditable === "true") && ((ta = oe), (nc = U), (co = null));
            break;
          case "focusout":
            co = nc = ta = null;
            break;
          case "mousedown":
            lc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((lc = !1), dp(X, n, G));
            break;
          case "selectionchange":
            if (lE) break;
          case "keydown":
          case "keyup":
            dp(X, n, G);
        }
        var be;
        if (Ju)
          e: {
            switch (e) {
              case "compositionstart":
                var Te = "onCompositionStart";
                break e;
              case "compositionend":
                Te = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Te = "onCompositionUpdate";
                break e;
            }
            Te = void 0;
          }
        else
          ea
            ? Wd(e, n) && (Te = "onCompositionEnd")
            : e === "keydown" && n.keyCode === 229 && (Te = "onCompositionStart");
        (Te &&
          (kd &&
            n.locale !== "ko" &&
            (ea || Te !== "onCompositionStart"
              ? Te === "onCompositionEnd" && ea && (be = Id())
              : ((Bn = G), ($u = "value" in Bn ? Bn.value : Bn.textContent), (ea = !0))),
          (oe = pi(U, Te)),
          0 < oe.length &&
            ((Te = new Qd(Te, e, null, n, G)),
            X.push({ event: Te, listeners: oe }),
            be ? (Te.data = be) : ((be = ep(n)), be !== null && (Te.data = be)))),
          (be = $x ? Qx(e, n) : Zx(e, n)) &&
            ((Te = pi(U, "onBeforeInput")),
            0 < Te.length &&
              ((oe = new Qd("onBeforeInput", "beforeinput", null, n, G)),
              X.push({ event: oe, listeners: Te }),
              (oe.data = be))),
          VE(X, e, U, n, G));
      }
      Hv(X, t);
    });
  }
  function Lo(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function pi(e, t) {
    for (var n = t + "Capture", a = []; e !== null; ) {
      var u = e,
        s = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          s === null ||
          ((u = to(e, n)),
          u != null && a.unshift(Lo(e, u, s)),
          (u = to(e, t)),
          u != null && a.push(Lo(e, u, s))),
        e.tag === 3)
      )
        return a;
      e = e.return;
    }
    return [];
  }
  function XE(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Vv(e, t, n, a, u) {
    for (var s = t._reactName, g = []; n !== null && n !== a; ) {
      var x = n,
        A = x.alternate,
        U = x.stateNode;
      if (((x = x.tag), A !== null && A === a)) break;
      ((x !== 5 && x !== 26 && x !== 27) ||
        U === null ||
        ((A = U),
        u
          ? ((U = to(n, s)), U != null && g.unshift(Lo(n, U, A)))
          : u || ((U = to(n, s)), U != null && g.push(Lo(n, U, A)))),
        (n = n.return));
    }
    g.length !== 0 && e.push({ event: t, listeners: g });
  }
  var IE = /\r\n?/g,
    KE = /\u0000|\uFFFD/g;
  function Gv(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        IE,
        `
`,
      )
      .replace(KE, "");
  }
  function Yv(e, t) {
    return ((t = Gv(t)), Gv(e) === t);
  }
  function Le(e, t, n, a, u, s) {
    switch (n) {
      case "children":
        typeof a == "string"
          ? t === "body" || (t === "textarea" && a === "") || Fl(e, a)
          : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Fl(e, "" + a);
        break;
      case "className":
        gr(e, "class", a);
        break;
      case "tabIndex":
        gr(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        gr(e, n, a);
        break;
      case "style":
        Yd(e, a, s);
        break;
      case "data":
        if (t !== "object") {
          gr(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(n);
          break;
        }
        ((a = Sr("" + a)), e.setAttribute(n, a));
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof s == "function" &&
            (n === "formAction"
              ? (t !== "input" && Le(e, t, "name", u.name, u, null),
                Le(e, t, "formEncType", u.formEncType, u, null),
                Le(e, t, "formMethod", u.formMethod, u, null),
                Le(e, t, "formTarget", u.formTarget, u, null))
              : (Le(e, t, "encType", u.encType, u, null),
                Le(e, t, "method", u.method, u, null),
                Le(e, t, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(n);
          break;
        }
        ((a = Sr("" + a)), e.setAttribute(n, a));
        break;
      case "onClick":
        a != null && (e.onclick = hn);
        break;
      case "onScroll":
        a != null && Ce("scroll", e);
        break;
      case "onScrollEnd":
        a != null && Ce("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(i(61));
          if (((n = a.__html), n != null)) {
            if (u.children != null) throw Error(i(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        ((n = Sr("" + a)), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol"
          ? e.setAttribute(n, "" + a)
          : e.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol"
          ? e.setAttribute(n, "")
          : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        a === !0
          ? e.setAttribute(n, "")
          : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol"
            ? e.setAttribute(n, a)
            : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a
          ? e.setAttribute(n, a)
          : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? e.removeAttribute(n)
          : e.setAttribute(n, a);
        break;
      case "popover":
        (Ce("beforetoggle", e), Ce("toggle", e), mr(e, "popover", a));
        break;
      case "xlinkActuate":
        pn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        pn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        pn(e, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        pn(e, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        pn(e, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        pn(e, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        pn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        pn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        pn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        mr(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || (n[0] !== "o" && n[0] !== "O") || (n[1] !== "n" && n[1] !== "N")) &&
          ((n = bx.get(n) || n), mr(e, n, a));
    }
  }
  function _s(e, t, n, a, u, s) {
    switch (n) {
      case "style":
        Yd(e, a, s);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(i(61));
          if (((n = a.__html), n != null)) {
            if (u.children != null) throw Error(i(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof a == "string"
          ? Fl(e, a)
          : (typeof a == "number" || typeof a == "bigint") && Fl(e, "" + a);
        break;
      case "onScroll":
        a != null && Ce("scroll", e);
        break;
      case "onScrollEnd":
        a != null && Ce("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = hn);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!zd.hasOwnProperty(n))
          e: {
            if (
              n[0] === "o" &&
              n[1] === "n" &&
              ((u = n.endsWith("Capture")),
              (t = n.slice(2, u ? n.length - 7 : void 0)),
              (s = e[vt] || null),
              (s = s != null ? s[n] : null),
              typeof s == "function" && e.removeEventListener(t, s, u),
              typeof a == "function")
            ) {
              (typeof s != "function" &&
                s !== null &&
                (n in e ? (e[n] = null) : e.hasAttribute(n) && e.removeAttribute(n)),
                e.addEventListener(t, a, u));
              break e;
            }
            n in e ? (e[n] = a) : a === !0 ? e.setAttribute(n, "") : mr(e, n, a);
          }
    }
  }
  function it(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (Ce("error", e), Ce("load", e));
        var a = !1,
          u = !1,
          s;
        for (s in n)
          if (n.hasOwnProperty(s)) {
            var g = n[s];
            if (g != null)
              switch (s) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(i(137, t));
                default:
                  Le(e, t, s, g, n, null);
              }
          }
        (u && Le(e, t, "srcSet", n.srcSet, n, null), a && Le(e, t, "src", n.src, n, null));
        return;
      case "input":
        Ce("invalid", e);
        var x = (s = g = u = null),
          A = null,
          U = null;
        for (a in n)
          if (n.hasOwnProperty(a)) {
            var G = n[a];
            if (G != null)
              switch (a) {
                case "name":
                  u = G;
                  break;
                case "type":
                  g = G;
                  break;
                case "checked":
                  A = G;
                  break;
                case "defaultChecked":
                  U = G;
                  break;
                case "value":
                  s = G;
                  break;
                case "defaultValue":
                  x = G;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (G != null) throw Error(i(137, t));
                  break;
                default:
                  Le(e, t, a, G, n, null);
              }
          }
        Hd(e, s, x, A, U, g, u, !1);
        return;
      case "select":
        (Ce("invalid", e), (a = g = s = null));
        for (u in n)
          if (n.hasOwnProperty(u) && ((x = n[u]), x != null))
            switch (u) {
              case "value":
                s = x;
                break;
              case "defaultValue":
                g = x;
                break;
              case "multiple":
                a = x;
              default:
                Le(e, t, u, x, n, null);
            }
        ((t = s),
          (n = g),
          (e.multiple = !!a),
          t != null ? kl(e, !!a, t, !1) : n != null && kl(e, !!a, n, !0));
        return;
      case "textarea":
        (Ce("invalid", e), (s = u = a = null));
        for (g in n)
          if (n.hasOwnProperty(g) && ((x = n[g]), x != null))
            switch (g) {
              case "value":
                a = x;
                break;
              case "defaultValue":
                u = x;
                break;
              case "children":
                s = x;
                break;
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(i(91));
                break;
              default:
                Le(e, t, g, x, n, null);
            }
        Vd(e, a, u, s);
        return;
      case "option":
        for (A in n)
          n.hasOwnProperty(A) &&
            ((a = n[A]), a != null) &&
            (A === "selected"
              ? (e.selected = a && typeof a != "function" && typeof a != "symbol")
              : Le(e, t, A, a, n, null));
        return;
      case "dialog":
        (Ce("beforetoggle", e), Ce("toggle", e), Ce("cancel", e), Ce("close", e));
        break;
      case "iframe":
      case "object":
        Ce("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < jo.length; a++) Ce(jo[a], e);
        break;
      case "image":
        (Ce("error", e), Ce("load", e));
        break;
      case "details":
        Ce("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        (Ce("error", e), Ce("load", e));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (U in n)
          if (n.hasOwnProperty(U) && ((a = n[U]), a != null))
            switch (U) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(i(137, t));
              default:
                Le(e, t, U, a, n, null);
            }
        return;
      default:
        if (Yu(t)) {
          for (G in n)
            n.hasOwnProperty(G) && ((a = n[G]), a !== void 0 && _s(e, t, G, a, n, void 0));
          return;
        }
    }
    for (x in n) n.hasOwnProperty(x) && ((a = n[x]), a != null && Le(e, t, x, a, n, null));
  }
  function $E(e, t, n, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null,
          s = null,
          g = null,
          x = null,
          A = null,
          U = null,
          G = null;
        for (P in n) {
          var X = n[P];
          if (n.hasOwnProperty(P) && X != null)
            switch (P) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                A = X;
              default:
                a.hasOwnProperty(P) || Le(e, t, P, null, a, X);
            }
        }
        for (var H in a) {
          var P = a[H];
          if (((X = n[H]), a.hasOwnProperty(H) && (P != null || X != null)))
            switch (H) {
              case "type":
                s = P;
                break;
              case "name":
                u = P;
                break;
              case "checked":
                U = P;
                break;
              case "defaultChecked":
                G = P;
                break;
              case "value":
                g = P;
                break;
              case "defaultValue":
                x = P;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (P != null) throw Error(i(137, t));
                break;
              default:
                P !== X && Le(e, t, H, P, a, X);
            }
        }
        Vu(e, g, x, A, U, G, s, u);
        return;
      case "select":
        P = g = x = H = null;
        for (s in n)
          if (((A = n[s]), n.hasOwnProperty(s) && A != null))
            switch (s) {
              case "value":
                break;
              case "multiple":
                P = A;
              default:
                a.hasOwnProperty(s) || Le(e, t, s, null, a, A);
            }
        for (u in a)
          if (((s = a[u]), (A = n[u]), a.hasOwnProperty(u) && (s != null || A != null)))
            switch (u) {
              case "value":
                H = s;
                break;
              case "defaultValue":
                x = s;
                break;
              case "multiple":
                g = s;
              default:
                s !== A && Le(e, t, u, s, a, A);
            }
        ((t = x),
          (n = g),
          (a = P),
          H != null
            ? kl(e, !!n, H, !1)
            : !!a != !!n && (t != null ? kl(e, !!n, t, !0) : kl(e, !!n, n ? [] : "", !1)));
        return;
      case "textarea":
        P = H = null;
        for (x in n)
          if (((u = n[x]), n.hasOwnProperty(x) && u != null && !a.hasOwnProperty(x)))
            switch (x) {
              case "value":
                break;
              case "children":
                break;
              default:
                Le(e, t, x, null, a, u);
            }
        for (g in a)
          if (((u = a[g]), (s = n[g]), a.hasOwnProperty(g) && (u != null || s != null)))
            switch (g) {
              case "value":
                H = u;
                break;
              case "defaultValue":
                P = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(i(91));
                break;
              default:
                u !== s && Le(e, t, g, u, a, s);
            }
        Pd(e, H, P);
        return;
      case "option":
        for (var ae in n)
          ((H = n[ae]),
            n.hasOwnProperty(ae) &&
              H != null &&
              !a.hasOwnProperty(ae) &&
              (ae === "selected" ? (e.selected = !1) : Le(e, t, ae, null, a, H)));
        for (A in a)
          ((H = a[A]),
            (P = n[A]),
            a.hasOwnProperty(A) &&
              H !== P &&
              (H != null || P != null) &&
              (A === "selected"
                ? (e.selected = H && typeof H != "function" && typeof H != "symbol")
                : Le(e, t, A, H, a, P)));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var fe in n)
          ((H = n[fe]),
            n.hasOwnProperty(fe) && H != null && !a.hasOwnProperty(fe) && Le(e, t, fe, null, a, H));
        for (U in a)
          if (((H = a[U]), (P = n[U]), a.hasOwnProperty(U) && H !== P && (H != null || P != null)))
            switch (U) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (H != null) throw Error(i(137, t));
                break;
              default:
                Le(e, t, U, H, a, P);
            }
        return;
      default:
        if (Yu(t)) {
          for (var Ue in n)
            ((H = n[Ue]),
              n.hasOwnProperty(Ue) &&
                H !== void 0 &&
                !a.hasOwnProperty(Ue) &&
                _s(e, t, Ue, void 0, a, H));
          for (G in a)
            ((H = a[G]),
              (P = n[G]),
              !a.hasOwnProperty(G) ||
                H === P ||
                (H === void 0 && P === void 0) ||
                _s(e, t, G, H, a, P));
          return;
        }
    }
    for (var z in n)
      ((H = n[z]),
        n.hasOwnProperty(z) && H != null && !a.hasOwnProperty(z) && Le(e, t, z, null, a, H));
    for (X in a)
      ((H = a[X]),
        (P = n[X]),
        !a.hasOwnProperty(X) || H === P || (H == null && P == null) || Le(e, t, X, H, a, P));
  }
  function qv(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function QE() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var e = 0, t = 0, n = performance.getEntriesByType("resource"), a = 0;
        a < n.length;
        a++
      ) {
        var u = n[a],
          s = u.transferSize,
          g = u.initiatorType,
          x = u.duration;
        if (s && x && qv(g)) {
          for (g = 0, x = u.responseEnd, a += 1; a < n.length; a++) {
            var A = n[a],
              U = A.startTime;
            if (U > x) break;
            var G = A.transferSize,
              X = A.initiatorType;
            G && qv(X) && ((A = A.responseEnd), (g += G * (A < x ? 1 : (x - U) / (A - U))));
          }
          if ((--a, (t += (8 * (s + g)) / (u.duration / 1e3)), e++, 10 < e)) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && ((e = navigator.connection.downlink), typeof e == "number")
      ? e
      : 5;
  }
  var Ms = null,
    Os = null;
  function hi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Xv(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Iv(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Ds(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      typeof t.children == "bigint" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Ns = null;
  function ZE() {
    var e = window.event;
    return e && e.type === "popstate" ? (e === Ns ? !1 : ((Ns = e), !0)) : ((Ns = null), !1);
  }
  var Kv = typeof setTimeout == "function" ? setTimeout : void 0,
    kE = typeof clearTimeout == "function" ? clearTimeout : void 0,
    $v = typeof Promise == "function" ? Promise : void 0,
    FE =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof $v < "u"
          ? function (e) {
              return $v.resolve(null).then(e).catch(JE);
            }
          : Kv;
  function JE(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function el(e) {
    return e === "head";
  }
  function Qv(e, t) {
    var n = t,
      a = 0;
    do {
      var u = n.nextSibling;
      if ((e.removeChild(n), u && u.nodeType === 8))
        if (((n = u.data), n === "/$" || n === "/&")) {
          if (a === 0) {
            (e.removeChild(u), _a(t));
            return;
          }
          a--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") a++;
        else if (n === "html") Uo(e.ownerDocument.documentElement);
        else if (n === "head") {
          ((n = e.ownerDocument.head), Uo(n));
          for (var s = n.firstChild; s; ) {
            var g = s.nextSibling,
              x = s.nodeName;
            (s[Wa] ||
              x === "SCRIPT" ||
              x === "STYLE" ||
              (x === "LINK" && s.rel.toLowerCase() === "stylesheet") ||
              n.removeChild(s),
              (s = g));
          }
        } else n === "body" && Uo(e.ownerDocument.body);
      n = u;
    } while (n);
    _a(t);
  }
  function Zv(e, t) {
    var n = e;
    e = 0;
    do {
      var a = n.nextSibling;
      if (
        (n.nodeType === 1
          ? t
            ? ((n._stashedDisplay = n.style.display), (n.style.display = "none"))
            : ((n.style.display = n._stashedDisplay || ""),
              n.getAttribute("style") === "" && n.removeAttribute("style"))
          : n.nodeType === 3 &&
            (t
              ? ((n._stashedText = n.nodeValue), (n.nodeValue = ""))
              : (n.nodeValue = n._stashedText || "")),
        a && a.nodeType === 8)
      )
        if (((n = a.data), n === "/$")) {
          if (e === 0) break;
          e--;
        } else (n !== "$" && n !== "$?" && n !== "$~" && n !== "$!") || e++;
      n = a;
    } while (n);
  }
  function zs(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (((t = t.nextSibling), n.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (zs(n), Hu(n));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function WE(e, t, n, a) {
    for (; e.nodeType === 1; ) {
      var u = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (a) {
        if (!e[Wa])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (
                ((s = e.getAttribute("rel")),
                s === "stylesheet" && e.hasAttribute("data-precedence"))
              )
                break;
              if (
                s !== u.rel ||
                e.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) ||
                e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) ||
                e.getAttribute("title") !== (u.title == null ? null : u.title)
              )
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (
                ((s = e.getAttribute("src")),
                (s !== (u.src == null ? null : u.src) ||
                  e.getAttribute("type") !== (u.type == null ? null : u.type) ||
                  e.getAttribute("crossorigin") !==
                    (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  s &&
                  e.hasAttribute("async") &&
                  !e.hasAttribute("itemprop"))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var s = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && e.getAttribute("name") === s) return e;
      } else return e;
      if (((e = qt(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function eC(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n) ||
        ((e = qt(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function kv(e, t) {
    for (; e.nodeType !== 8; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t) ||
        ((e = qt(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function js(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Ls(e) {
    return e.data === "$!" || (e.data === "$?" && e.ownerDocument.readyState !== "loading");
  }
  function tC(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading") t();
    else {
      var a = function () {
        (t(), n.removeEventListener("DOMContentLoaded", a));
      };
      (n.addEventListener("DOMContentLoaded", a), (e._reactRetry = a));
    }
  }
  function qt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = e.data),
          t === "$" ||
            t === "$!" ||
            t === "$?" ||
            t === "$~" ||
            t === "&" ||
            t === "F!" ||
            t === "F")
        )
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var Us = null;
  function Fv(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0) return qt(e.nextSibling);
          t--;
        } else (n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&") || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Jv(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (t === 0) return e;
          t--;
        } else (n !== "/$" && n !== "/&") || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Wv(e, t, n) {
    switch (((t = hi(n)), e)) {
      case "html":
        if (((e = t.documentElement), !e)) throw Error(i(452));
        return e;
      case "head":
        if (((e = t.head), !e)) throw Error(i(453));
        return e;
      case "body":
        if (((e = t.body), !e)) throw Error(i(454));
        return e;
      default:
        throw Error(i(451));
    }
  }
  function Uo(e) {
    for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
    Hu(e);
  }
  var Xt = new Map(),
    em = new Set();
  function vi(e) {
    return typeof e.getRootNode == "function"
      ? e.getRootNode()
      : e.nodeType === 9
        ? e
        : e.ownerDocument;
  }
  var On = I.d;
  I.d = { f: nC, r: lC, D: aC, C: oC, L: rC, m: iC, X: cC, S: uC, M: sC };
  function nC() {
    var e = On.f(),
      t = ri();
    return e || t;
  }
  function lC(e) {
    var t = $l(e);
    t !== null && t.tag === 5 && t.type === "form" ? gh(t) : On.r(e);
  }
  var Ta = typeof document > "u" ? null : document;
  function tm(e, t, n) {
    var a = Ta;
    if (a && typeof t == "string" && t) {
      var u = Ut(t);
      ((u = 'link[rel="' + e + '"][href="' + u + '"]'),
        typeof n == "string" && (u += '[crossorigin="' + n + '"]'),
        em.has(u) ||
          (em.add(u),
          (e = { rel: e, crossOrigin: n, href: t }),
          a.querySelector(u) === null &&
            ((t = a.createElement("link")), it(t, "link", e), tt(t), a.head.appendChild(t))));
    }
  }
  function aC(e) {
    (On.D(e), tm("dns-prefetch", e, null));
  }
  function oC(e, t) {
    (On.C(e, t), tm("preconnect", e, t));
  }
  function rC(e, t, n) {
    On.L(e, t, n);
    var a = Ta;
    if (a && e && t) {
      var u = 'link[rel="preload"][as="' + Ut(t) + '"]';
      t === "image" && n && n.imageSrcSet
        ? ((u += '[imagesrcset="' + Ut(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == "string" && (u += '[imagesizes="' + Ut(n.imageSizes) + '"]'))
        : (u += '[href="' + Ut(e) + '"]');
      var s = u;
      switch (t) {
        case "style":
          s = wa(e);
          break;
        case "script":
          s = Aa(e);
      }
      Xt.has(s) ||
        ((e = y(
          { rel: "preload", href: t === "image" && n && n.imageSrcSet ? void 0 : e, as: t },
          n,
        )),
        Xt.set(s, e),
        a.querySelector(u) !== null ||
          (t === "style" && a.querySelector(Bo(s))) ||
          (t === "script" && a.querySelector(Ho(s))) ||
          ((t = a.createElement("link")), it(t, "link", e), tt(t), a.head.appendChild(t)));
    }
  }
  function iC(e, t) {
    On.m(e, t);
    var n = Ta;
    if (n && e) {
      var a = t && typeof t.as == "string" ? t.as : "script",
        u = 'link[rel="modulepreload"][as="' + Ut(a) + '"][href="' + Ut(e) + '"]',
        s = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = Aa(e);
      }
      if (
        !Xt.has(s) &&
        ((e = y({ rel: "modulepreload", href: e }, t)), Xt.set(s, e), n.querySelector(u) === null)
      ) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Ho(s))) return;
        }
        ((a = n.createElement("link")), it(a, "link", e), tt(a), n.head.appendChild(a));
      }
    }
  }
  function uC(e, t, n) {
    On.S(e, t, n);
    var a = Ta;
    if (a && e) {
      var u = Ql(a).hoistableStyles,
        s = wa(e);
      t = t || "default";
      var g = u.get(s);
      if (!g) {
        var x = { loading: 0, preload: null };
        if ((g = a.querySelector(Bo(s)))) x.loading = 5;
        else {
          ((e = y({ rel: "stylesheet", href: e, "data-precedence": t }, n)),
            (n = Xt.get(s)) && Bs(e, n));
          var A = (g = a.createElement("link"));
          (tt(A),
            it(A, "link", e),
            (A._p = new Promise(function (U, G) {
              ((A.onload = U), (A.onerror = G));
            })),
            A.addEventListener("load", function () {
              x.loading |= 1;
            }),
            A.addEventListener("error", function () {
              x.loading |= 2;
            }),
            (x.loading |= 4),
            mi(g, t, a));
        }
        ((g = { type: "stylesheet", instance: g, count: 1, state: x }), u.set(s, g));
      }
    }
  }
  function cC(e, t) {
    On.X(e, t);
    var n = Ta;
    if (n && e) {
      var a = Ql(n).hoistableScripts,
        u = Aa(e),
        s = a.get(u);
      s ||
        ((s = n.querySelector(Ho(u))),
        s ||
          ((e = y({ src: e, async: !0 }, t)),
          (t = Xt.get(u)) && Hs(e, t),
          (s = n.createElement("script")),
          tt(s),
          it(s, "link", e),
          n.head.appendChild(s)),
        (s = { type: "script", instance: s, count: 1, state: null }),
        a.set(u, s));
    }
  }
  function sC(e, t) {
    On.M(e, t);
    var n = Ta;
    if (n && e) {
      var a = Ql(n).hoistableScripts,
        u = Aa(e),
        s = a.get(u);
      s ||
        ((s = n.querySelector(Ho(u))),
        s ||
          ((e = y({ src: e, async: !0, type: "module" }, t)),
          (t = Xt.get(u)) && Hs(e, t),
          (s = n.createElement("script")),
          tt(s),
          it(s, "link", e),
          n.head.appendChild(s)),
        (s = { type: "script", instance: s, count: 1, state: null }),
        a.set(u, s));
    }
  }
  function nm(e, t, n, a) {
    var u = (u = se.current) ? vi(u) : null;
    if (!u) throw Error(i(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string"
          ? ((t = wa(n.href)),
            (n = Ql(u).hoistableStyles),
            (a = n.get(t)),
            a || ((a = { type: "style", instance: null, count: 0, state: null }), n.set(t, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          n.rel === "stylesheet" &&
          typeof n.href == "string" &&
          typeof n.precedence == "string"
        ) {
          e = wa(n.href);
          var s = Ql(u).hoistableStyles,
            g = s.get(e);
          if (
            (g ||
              ((u = u.ownerDocument || u),
              (g = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              s.set(e, g),
              (s = u.querySelector(Bo(e))) && !s._p && ((g.instance = s), (g.state.loading = 5)),
              Xt.has(e) ||
                ((n = {
                  rel: "preload",
                  as: "style",
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                Xt.set(e, n),
                s || fC(u, e, n, g.state))),
            t && a === null)
          )
            throw Error(i(528, ""));
          return g;
        }
        if (t && a !== null) throw Error(i(529, ""));
        return null;
      case "script":
        return (
          (t = n.async),
          (n = n.src),
          typeof n == "string" && t && typeof t != "function" && typeof t != "symbol"
            ? ((t = Aa(n)),
              (n = Ql(u).hoistableScripts),
              (a = n.get(t)),
              a || ((a = { type: "script", instance: null, count: 0, state: null }), n.set(t, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(i(444, e));
    }
  }
  function wa(e) {
    return 'href="' + Ut(e) + '"';
  }
  function Bo(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function lm(e) {
    return y({}, e, { "data-precedence": e.precedence, precedence: null });
  }
  function fC(e, t, n, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]")
      ? (a.loading = 1)
      : ((t = e.createElement("link")),
        (a.preload = t),
        t.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        t.addEventListener("error", function () {
          return (a.loading |= 2);
        }),
        it(t, "link", n),
        tt(t),
        e.head.appendChild(t));
  }
  function Aa(e) {
    return '[src="' + Ut(e) + '"]';
  }
  function Ho(e) {
    return "script[async]" + e;
  }
  function am(e, t, n) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var a = e.querySelector('style[data-href~="' + Ut(n.href) + '"]');
          if (a) return ((t.instance = a), tt(a), a);
          var u = y({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (e.ownerDocument || e).createElement("style")),
            tt(a),
            it(a, "style", u),
            mi(a, n.precedence, e),
            (t.instance = a)
          );
        case "stylesheet":
          u = wa(n.href);
          var s = e.querySelector(Bo(u));
          if (s) return ((t.state.loading |= 4), (t.instance = s), tt(s), s);
          ((a = lm(n)),
            (u = Xt.get(u)) && Bs(a, u),
            (s = (e.ownerDocument || e).createElement("link")),
            tt(s));
          var g = s;
          return (
            (g._p = new Promise(function (x, A) {
              ((g.onload = x), (g.onerror = A));
            })),
            it(s, "link", a),
            (t.state.loading |= 4),
            mi(s, n.precedence, e),
            (t.instance = s)
          );
        case "script":
          return (
            (s = Aa(n.src)),
            (u = e.querySelector(Ho(s)))
              ? ((t.instance = u), tt(u), u)
              : ((a = n),
                (u = Xt.get(s)) && ((a = y({}, n)), Hs(a, u)),
                (e = e.ownerDocument || e),
                (u = e.createElement("script")),
                tt(u),
                it(u, "link", a),
                e.head.appendChild(u),
                (t.instance = u))
          );
        case "void":
          return null;
        default:
          throw Error(i(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((a = t.instance), (t.state.loading |= 4), mi(a, n.precedence, e));
    return t.instance;
  }
  function mi(e, t, n) {
    for (
      var a = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        u = a.length ? a[a.length - 1] : null,
        s = u,
        g = 0;
      g < a.length;
      g++
    ) {
      var x = a[g];
      if (x.dataset.precedence === t) s = x;
      else if (s !== u) break;
    }
    s
      ? s.parentNode.insertBefore(e, s.nextSibling)
      : ((t = n.nodeType === 9 ? n.head : n), t.insertBefore(e, t.firstChild));
  }
  function Bs(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function Hs(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var gi = null;
  function om(e, t, n) {
    if (gi === null) {
      var a = new Map(),
        u = (gi = new Map());
      u.set(n, a);
    } else ((u = gi), (a = u.get(n)), a || ((a = new Map()), u.set(n, a)));
    if (a.has(e)) return a;
    for (a.set(e, null), n = n.getElementsByTagName(e), u = 0; u < n.length; u++) {
      var s = n[u];
      if (
        !(s[Wa] || s[lt] || (e === "link" && s.getAttribute("rel") === "stylesheet")) &&
        s.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var g = s.getAttribute(t) || "";
        g = e + g;
        var x = a.get(g);
        x ? x.push(s) : a.set(g, [s]);
      }
    }
    return a;
  }
  function rm(e, t, n) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null));
  }
  function dC(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
        return !0;
      case "link":
        if (
          typeof t.rel != "string" ||
          typeof t.href != "string" ||
          t.href === "" ||
          t.onLoad ||
          t.onError
        )
          break;
        return t.rel === "stylesheet"
          ? ((e = t.disabled), typeof t.precedence == "string" && e == null)
          : !0;
      case "script":
        if (
          t.async &&
          typeof t.async != "function" &&
          typeof t.async != "symbol" &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function im(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function pC(e, t, n, a) {
    if (
      n.type === "stylesheet" &&
      (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
      (n.state.loading & 4) === 0
    ) {
      if (n.instance === null) {
        var u = wa(a.href),
          s = t.querySelector(Bo(u));
        if (s) {
          ((t = s._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (e.count++, (e = yi.bind(e)), t.then(e, e)),
            (n.state.loading |= 4),
            (n.instance = s),
            tt(s));
          return;
        }
        ((s = t.ownerDocument || t),
          (a = lm(a)),
          (u = Xt.get(u)) && Bs(a, u),
          (s = s.createElement("link")),
          tt(s));
        var g = s;
        ((g._p = new Promise(function (x, A) {
          ((g.onload = x), (g.onerror = A));
        })),
          it(s, "link", a),
          (n.instance = s));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(n, t),
        (t = n.state.preload) &&
          (n.state.loading & 3) === 0 &&
          (e.count++,
          (n = yi.bind(e)),
          t.addEventListener("load", n),
          t.addEventListener("error", n)));
    }
  }
  var Ps = 0;
  function hC(e, t) {
    return (
      e.stylesheets && e.count === 0 && bi(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (n) {
            var a = setTimeout(function () {
              if ((e.stylesheets && bi(e, e.stylesheets), e.unsuspend)) {
                var s = e.unsuspend;
                ((e.unsuspend = null), s());
              }
            }, 6e4 + t);
            0 < e.imgBytes && Ps === 0 && (Ps = 62500 * QE());
            var u = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 && (e.stylesheets && bi(e, e.stylesheets), e.unsuspend))
                ) {
                  var s = e.unsuspend;
                  ((e.unsuspend = null), s());
                }
              },
              (e.imgBytes > Ps ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = n),
              function () {
                ((e.unsuspend = null), clearTimeout(a), clearTimeout(u));
              }
            );
          }
        : null
    );
  }
  function yi() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) bi(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        ((this.unsuspend = null), e());
      }
    }
  }
  var Si = null;
  function bi(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++, (Si = new Map()), t.forEach(vC, e), (Si = null), yi.call(e)));
  }
  function vC(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Si.get(e);
      if (n) var a = n.get(null);
      else {
        ((n = new Map()), Si.set(e, n));
        for (
          var u = e.querySelectorAll("link[data-precedence],style[data-precedence]"), s = 0;
          s < u.length;
          s++
        ) {
          var g = u[s];
          (g.nodeName === "LINK" || g.getAttribute("media") !== "not all") &&
            (n.set(g.dataset.precedence, g), (a = g));
        }
        a && n.set(null, a);
      }
      ((u = t.instance),
        (g = u.getAttribute("data-precedence")),
        (s = n.get(g) || a),
        s === a && n.set(null, u),
        n.set(g, u),
        this.count++,
        (a = yi.bind(this)),
        u.addEventListener("load", a),
        u.addEventListener("error", a),
        s
          ? s.parentNode.insertBefore(u, s.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(u, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var Po = {
    $$typeof: N,
    Provider: null,
    Consumer: null,
    _currentValue: $,
    _currentValue2: $,
    _threadCount: 0,
  };
  function mC(e, t, n, a, u, s, g, x, A) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = ju(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = ju(0)),
      (this.hiddenUpdates = ju(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = u),
      (this.onCaughtError = s),
      (this.onRecoverableError = g),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = A),
      (this.incompleteTransitions = new Map()));
  }
  function um(e, t, n, a, u, s, g, x, A, U, G, X) {
    return (
      (e = new mC(e, t, n, g, A, U, G, X, x)),
      (t = 1),
      s === !0 && (t |= 24),
      (s = wt(3, null, null, t)),
      (e.current = s),
      (s.stateNode = e),
      (t = yc()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (s.memoizedState = { element: a, isDehydrated: n, cache: t }),
      Ec(s),
      e
    );
  }
  function cm(e) {
    return e ? ((e = aa), e) : aa;
  }
  function sm(e, t, n, a, u, s) {
    ((u = cm(u)),
      a.context === null ? (a.context = u) : (a.pendingContext = u),
      (a = qn(t)),
      (a.payload = { element: n }),
      (s = s === void 0 ? null : s),
      s !== null && (a.callback = s),
      (n = Xn(e, a, t)),
      n !== null && (xt(n, e, t), go(n, e, t)));
  }
  function fm(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Vs(e, t) {
    (fm(e, t), (e = e.alternate) && fm(e, t));
  }
  function dm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Tl(e, 67108864);
      (t !== null && xt(t, e, 67108864), Vs(e, 67108864));
    }
  }
  function pm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Dt();
      t = Lu(t);
      var n = Tl(e, t);
      (n !== null && xt(n, e, t), Vs(e, t));
    }
  }
  var xi = !0;
  function gC(e, t, n, a) {
    var u = j.T;
    j.T = null;
    var s = I.p;
    try {
      ((I.p = 2), Gs(e, t, n, a));
    } finally {
      ((I.p = s), (j.T = u));
    }
  }
  function yC(e, t, n, a) {
    var u = j.T;
    j.T = null;
    var s = I.p;
    try {
      ((I.p = 8), Gs(e, t, n, a));
    } finally {
      ((I.p = s), (j.T = u));
    }
  }
  function Gs(e, t, n, a) {
    if (xi) {
      var u = Ys(a);
      if (u === null) (As(e, t, a, Ei, n), vm(e, a));
      else if (bC(u, e, t, n, a)) a.stopPropagation();
      else if ((vm(e, a), t & 4 && -1 < SC.indexOf(e))) {
        for (; u !== null; ) {
          var s = $l(u);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (((s = s.stateNode), s.current.memoizedState.isDehydrated)) {
                  var g = bl(s.pendingLanes);
                  if (g !== 0) {
                    var x = s;
                    for (x.pendingLanes |= 2, x.entangledLanes |= 2; g; ) {
                      var A = 1 << (31 - Rt(g));
                      ((x.entanglements[1] |= A), (g &= ~A));
                    }
                    (an(s), (Oe & 6) === 0 && ((ai = Et() + 500), zo(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((x = Tl(s, 2)), x !== null && xt(x, s, 2), ri(), Vs(s, 2));
            }
          if (((s = Ys(a)), s === null && As(e, t, a, Ei, n), s === u)) break;
          u = s;
        }
        u !== null && a.stopPropagation();
      } else As(e, t, a, null, n);
    }
  }
  function Ys(e) {
    return ((e = Xu(e)), qs(e));
  }
  var Ei = null;
  function qs(e) {
    if (((Ei = null), (e = Kl(e)), e !== null)) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (((e = d(t)), e !== null)) return e;
          e = null;
        } else if (n === 31) {
          if (((e = h(t)), e !== null)) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((Ei = e), null);
  }
  function hm(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (ax()) {
          case Ed:
            return 2;
          case Cd:
            return 8;
          case fr:
          case ox:
            return 32;
          case Rd:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Xs = !1,
    tl = null,
    nl = null,
    ll = null,
    Vo = new Map(),
    Go = new Map(),
    al = [],
    SC =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function vm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        tl = null;
        break;
      case "dragenter":
      case "dragleave":
        nl = null;
        break;
      case "mouseover":
      case "mouseout":
        ll = null;
        break;
      case "pointerover":
      case "pointerout":
        Vo.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Go.delete(t.pointerId);
    }
  }
  function Yo(e, t, n, a, u, s) {
    return e === null || e.nativeEvent !== s
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: a,
          nativeEvent: s,
          targetContainers: [u],
        }),
        t !== null && ((t = $l(t)), t !== null && dm(t)),
        e)
      : ((e.eventSystemFlags |= a),
        (t = e.targetContainers),
        u !== null && t.indexOf(u) === -1 && t.push(u),
        e);
  }
  function bC(e, t, n, a, u) {
    switch (t) {
      case "focusin":
        return ((tl = Yo(tl, e, t, n, a, u)), !0);
      case "dragenter":
        return ((nl = Yo(nl, e, t, n, a, u)), !0);
      case "mouseover":
        return ((ll = Yo(ll, e, t, n, a, u)), !0);
      case "pointerover":
        var s = u.pointerId;
        return (Vo.set(s, Yo(Vo.get(s) || null, e, t, n, a, u)), !0);
      case "gotpointercapture":
        return ((s = u.pointerId), Go.set(s, Yo(Go.get(s) || null, e, t, n, a, u)), !0);
    }
    return !1;
  }
  function mm(e) {
    var t = Kl(e.target);
    if (t !== null) {
      var n = f(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = d(n)), t !== null)) {
            ((e.blockedOn = t),
              Od(e.priority, function () {
                pm(n);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = h(n)), t !== null)) {
            ((e.blockedOn = t),
              Od(e.priority, function () {
                pm(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ci(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Ys(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var a = new n.constructor(n.type, n);
        ((qu = a), n.target.dispatchEvent(a), (qu = null));
      } else return ((t = $l(n)), t !== null && dm(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function gm(e, t, n) {
    Ci(e) && n.delete(t);
  }
  function xC() {
    ((Xs = !1),
      tl !== null && Ci(tl) && (tl = null),
      nl !== null && Ci(nl) && (nl = null),
      ll !== null && Ci(ll) && (ll = null),
      Vo.forEach(gm),
      Go.forEach(gm));
  }
  function Ri(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      Xs || ((Xs = !0), l.unstable_scheduleCallback(l.unstable_NormalPriority, xC)));
  }
  var Ti = null;
  function ym(e) {
    Ti !== e &&
      ((Ti = e),
      l.unstable_scheduleCallback(l.unstable_NormalPriority, function () {
        Ti === e && (Ti = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t],
            a = e[t + 1],
            u = e[t + 2];
          if (typeof a != "function") {
            if (qs(a || n) === null) continue;
            break;
          }
          var s = $l(n);
          s !== null &&
            (e.splice(t, 3),
            (t -= 3),
            Yc(s, { pending: !0, data: u, method: n.method, action: a }, a, u));
        }
      }));
  }
  function _a(e) {
    function t(A) {
      return Ri(A, e);
    }
    (tl !== null && Ri(tl, e),
      nl !== null && Ri(nl, e),
      ll !== null && Ri(ll, e),
      Vo.forEach(t),
      Go.forEach(t));
    for (var n = 0; n < al.length; n++) {
      var a = al[n];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < al.length && ((n = al[0]), n.blockedOn === null); )
      (mm(n), n.blockedOn === null && al.shift());
    if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
      for (a = 0; a < n.length; a += 3) {
        var u = n[a],
          s = n[a + 1],
          g = u[vt] || null;
        if (typeof s == "function") g || ym(n);
        else if (g) {
          var x = null;
          if (s && s.hasAttribute("formAction")) {
            if (((u = s), (g = s[vt] || null))) x = g.formAction;
            else if (qs(u) !== null) continue;
          } else x = g.action;
          (typeof x == "function" ? (n[a + 1] = x) : (n.splice(a, 3), (a -= 3)), ym(n));
        }
      }
  }
  function Sm() {
    function e(s) {
      s.canIntercept &&
        s.info === "react-transition" &&
        s.intercept({
          handler: function () {
            return new Promise(function (g) {
              return (u = g);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (u !== null && (u(), (u = null)), a || setTimeout(n, 20));
    }
    function n() {
      if (!a && !navigation.transition) {
        var s = navigation.currentEntry;
        s &&
          s.url != null &&
          navigation.navigate(s.url, {
            state: s.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var a = !1,
        u = null;
      return (
        navigation.addEventListener("navigate", e),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(n, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener("navigate", e),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            u !== null && (u(), (u = null)));
        }
      );
    }
  }
  function Is(e) {
    this._internalRoot = e;
  }
  ((wi.prototype.render = Is.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(i(409));
      var n = t.current,
        a = Dt();
      sm(n, a, e, t, null, null);
    }),
    (wi.prototype.unmount = Is.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (sm(e.current, 2, null, e, null, null), ri(), (t[Il] = null));
        }
      }));
  function wi(e) {
    this._internalRoot = e;
  }
  wi.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = Md();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < al.length && t !== 0 && t < al[n].priority; n++);
      (al.splice(n, 0, e), n === 0 && mm(e));
    }
  };
  var bm = o.version;
  if (bm !== "19.2.4") throw Error(i(527, bm, "19.2.4"));
  I.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function"
        ? Error(i(188))
        : ((e = Object.keys(e).join(",")), Error(i(268, e)));
    return ((e = m(t)), (e = e !== null ? S(e) : null), (e = e === null ? null : e.stateNode), e);
  };
  var EC = {
    bundleType: 0,
    version: "19.2.4",
    rendererPackageName: "react-dom",
    currentDispatcherRef: j,
    reconcilerVersion: "19.2.4",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ai = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ai.isDisabled && Ai.supportsFiber)
      try {
        ((ka = Ai.inject(EC)), (Ct = Ai));
      } catch {}
  }
  return (
    (Xo.createRoot = function (e, t) {
      if (!c(e)) throw Error(i(299));
      var n = !1,
        a = "",
        u = Ah,
        s = _h,
        g = Mh;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (a = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (u = t.onUncaughtError),
          t.onCaughtError !== void 0 && (s = t.onCaughtError),
          t.onRecoverableError !== void 0 && (g = t.onRecoverableError)),
        (t = um(e, 1, !1, null, null, n, a, null, u, s, g, Sm)),
        (e[Il] = t.current),
        ws(e),
        new Is(t)
      );
    }),
    (Xo.hydrateRoot = function (e, t, n) {
      if (!c(e)) throw Error(i(299));
      var a = !1,
        u = "",
        s = Ah,
        g = _h,
        x = Mh,
        A = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (a = !0),
          n.identifierPrefix !== void 0 && (u = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (s = n.onUncaughtError),
          n.onCaughtError !== void 0 && (g = n.onCaughtError),
          n.onRecoverableError !== void 0 && (x = n.onRecoverableError),
          n.formState !== void 0 && (A = n.formState)),
        (t = um(e, 1, !0, t, n ?? null, a, u, A, s, g, x, Sm)),
        (t.context = cm(null)),
        (n = t.current),
        (a = Dt()),
        (a = Lu(a)),
        (u = qn(a)),
        (u.callback = null),
        Xn(n, u, a),
        (n = a),
        (t.current.lanes = n),
        Ja(t, n),
        an(t),
        (e[Il] = t.current),
        ws(e),
        new wi(t)
      );
    }),
    (Xo.version = "19.2.4"),
    Xo
  );
}
var Om;
function NC() {
  if (Om) return Qs.exports;
  Om = 1;
  function l() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (o) {
        console.error(o);
      }
  }
  return (l(), (Qs.exports = DC()), Qs.exports);
}
var zC = NC();
const FO = jf(zC);
var er = gg();
const jC = jf(er);
function $o() {
  return (
    ($o = Object.assign
      ? Object.assign.bind()
      : function (l) {
          for (var o = 1; o < arguments.length; o++) {
            var r = arguments[o];
            for (var i in r) ({}).hasOwnProperty.call(r, i) && (l[i] = r[i]);
          }
          return l;
        }),
    $o.apply(null, arguments)
  );
}
var ul;
(function (l) {
  ((l.Pop = "POP"), (l.Push = "PUSH"), (l.Replace = "REPLACE"));
})(ul || (ul = {}));
const Dm = "popstate";
function LC(l) {
  l === void 0 && (l = {});
  function o(i, c) {
    let { pathname: f, search: d, hash: h } = i.location;
    return pf(
      "",
      { pathname: f, search: d, hash: h },
      (c.state && c.state.usr) || null,
      (c.state && c.state.key) || "default",
    );
  }
  function r(i, c) {
    return typeof c == "string" ? c : Hi(c);
  }
  return BC(o, r, null, l);
}
function Ke(l, o) {
  if (l === !1 || l === null || typeof l > "u") throw new Error(o);
}
function Lf(l, o) {
  if (!l) {
    typeof console < "u" && console.warn(o);
    try {
      throw new Error(o);
    } catch {}
  }
}
function UC() {
  return Math.random().toString(36).substr(2, 8);
}
function Nm(l, o) {
  return { usr: l.state, key: l.key, idx: o };
}
function pf(l, o, r, i) {
  return (
    r === void 0 && (r = null),
    $o(
      { pathname: typeof l == "string" ? l : l.pathname, search: "", hash: "" },
      typeof o == "string" ? Pa(o) : o,
      { state: r, key: (o && o.key) || i || UC() },
    )
  );
}
function Hi(l) {
  let { pathname: o = "/", search: r = "", hash: i = "" } = l;
  return (
    r && r !== "?" && (o += r.charAt(0) === "?" ? r : "?" + r),
    i && i !== "#" && (o += i.charAt(0) === "#" ? i : "#" + i),
    o
  );
}
function Pa(l) {
  let o = {};
  if (l) {
    let r = l.indexOf("#");
    r >= 0 && ((o.hash = l.substr(r)), (l = l.substr(0, r)));
    let i = l.indexOf("?");
    (i >= 0 && ((o.search = l.substr(i)), (l = l.substr(0, i))), l && (o.pathname = l));
  }
  return o;
}
function BC(l, o, r, i) {
  i === void 0 && (i = {});
  let { window: c = document.defaultView, v5Compat: f = !1 } = i,
    d = c.history,
    h = ul.Pop,
    v = null,
    m = S();
  m == null && ((m = 0), d.replaceState($o({}, d.state, { idx: m }), ""));
  function S() {
    return (d.state || { idx: null }).idx;
  }
  function y() {
    h = ul.Pop;
    let T = S(),
      _ = T == null ? null : T - m;
    ((m = T), v && v({ action: h, location: C.location, delta: _ }));
  }
  function b(T, _) {
    h = ul.Push;
    let D = pf(C.location, T, _);
    m = S() + 1;
    let N = Nm(D, m),
      B = C.createHref(D);
    try {
      d.pushState(N, "", B);
    } catch (K) {
      if (K instanceof DOMException && K.name === "DataCloneError") throw K;
      c.location.assign(B);
    }
    f && v && v({ action: h, location: C.location, delta: 1 });
  }
  function R(T, _) {
    h = ul.Replace;
    let D = pf(C.location, T, _);
    m = S();
    let N = Nm(D, m),
      B = C.createHref(D);
    (d.replaceState(N, "", B), f && v && v({ action: h, location: C.location, delta: 0 }));
  }
  function w(T) {
    let _ = c.location.origin !== "null" ? c.location.origin : c.location.href,
      D = typeof T == "string" ? T : Hi(T);
    return (
      (D = D.replace(/ $/, "%20")),
      Ke(_, "No window.location.(origin|href) available to create URL for href: " + D),
      new URL(D, _)
    );
  }
  let C = {
    get action() {
      return h;
    },
    get location() {
      return l(c, d);
    },
    listen(T) {
      if (v) throw new Error("A history only accepts one active listener");
      return (
        c.addEventListener(Dm, y),
        (v = T),
        () => {
          (c.removeEventListener(Dm, y), (v = null));
        }
      );
    },
    createHref(T) {
      return o(c, T);
    },
    createURL: w,
    encodeLocation(T) {
      let _ = w(T);
      return { pathname: _.pathname, search: _.search, hash: _.hash };
    },
    push: b,
    replace: R,
    go(T) {
      return d.go(T);
    },
  };
  return C;
}
var zm;
(function (l) {
  ((l.data = "data"), (l.deferred = "deferred"), (l.redirect = "redirect"), (l.error = "error"));
})(zm || (zm = {}));
function HC(l, o, r) {
  return (r === void 0 && (r = "/"), PC(l, o, r));
}
function PC(l, o, r, i) {
  let c = typeof o == "string" ? Pa(o) : o,
    f = Uf(c.pathname || "/", r);
  if (f == null) return null;
  let d = yg(l);
  VC(d);
  let h = null,
    v = JC(f);
  for (let m = 0; h == null && m < d.length; ++m) h = ZC(d[m], v);
  return h;
}
function yg(l, o, r, i) {
  (o === void 0 && (o = []), r === void 0 && (r = []), i === void 0 && (i = ""));
  let c = (f, d, h) => {
    let v = {
      relativePath: h === void 0 ? f.path || "" : h,
      caseSensitive: f.caseSensitive === !0,
      childrenIndex: d,
      route: f,
    };
    v.relativePath.startsWith("/") &&
      (Ke(
        v.relativePath.startsWith(i),
        'Absolute route path "' +
          v.relativePath +
          '" nested under path ' +
          ('"' + i + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes.",
      ),
      (v.relativePath = v.relativePath.slice(i.length)));
    let m = cl([i, v.relativePath]),
      S = r.concat(v);
    (f.children &&
      f.children.length > 0 &&
      (Ke(
        f.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + m + '".'),
      ),
      yg(f.children, o, S, m)),
      !(f.path == null && !f.index) && o.push({ path: m, score: $C(m, f.index), routesMeta: S }));
  };
  return (
    l.forEach((f, d) => {
      var h;
      if (f.path === "" || !((h = f.path) != null && h.includes("?"))) c(f, d);
      else for (let v of Sg(f.path)) c(f, d, v);
    }),
    o
  );
}
function Sg(l) {
  let o = l.split("/");
  if (o.length === 0) return [];
  let [r, ...i] = o,
    c = r.endsWith("?"),
    f = r.replace(/\?$/, "");
  if (i.length === 0) return c ? [f, ""] : [f];
  let d = Sg(i.join("/")),
    h = [];
  return (
    h.push(...d.map((v) => (v === "" ? f : [f, v].join("/")))),
    c && h.push(...d),
    h.map((v) => (l.startsWith("/") && v === "" ? "/" : v))
  );
}
function VC(l) {
  l.sort((o, r) =>
    o.score !== r.score
      ? r.score - o.score
      : QC(
          o.routesMeta.map((i) => i.childrenIndex),
          r.routesMeta.map((i) => i.childrenIndex),
        ),
  );
}
const GC = /^:[\w-]+$/,
  YC = 3,
  qC = 2,
  XC = 1,
  IC = 10,
  KC = -2,
  jm = (l) => l === "*";
function $C(l, o) {
  let r = l.split("/"),
    i = r.length;
  return (
    r.some(jm) && (i += KC),
    o && (i += qC),
    r.filter((c) => !jm(c)).reduce((c, f) => c + (GC.test(f) ? YC : f === "" ? XC : IC), i)
  );
}
function QC(l, o) {
  return l.length === o.length && l.slice(0, -1).every((i, c) => i === o[c])
    ? l[l.length - 1] - o[o.length - 1]
    : 0;
}
function ZC(l, o, r) {
  let { routesMeta: i } = l,
    c = {},
    f = "/",
    d = [];
  for (let h = 0; h < i.length; ++h) {
    let v = i[h],
      m = h === i.length - 1,
      S = f === "/" ? o : o.slice(f.length) || "/",
      y = kC({ path: v.relativePath, caseSensitive: v.caseSensitive, end: m }, S),
      b = v.route;
    if (!y) return null;
    (Object.assign(c, y.params),
      d.push({
        params: c,
        pathname: cl([f, y.pathname]),
        pathnameBase: lR(cl([f, y.pathnameBase])),
        route: b,
      }),
      y.pathnameBase !== "/" && (f = cl([f, y.pathnameBase])));
  }
  return d;
}
function kC(l, o) {
  typeof l == "string" && (l = { path: l, caseSensitive: !1, end: !0 });
  let [r, i] = FC(l.path, l.caseSensitive, l.end),
    c = o.match(r);
  if (!c) return null;
  let f = c[0],
    d = f.replace(/(.)\/+$/, "$1"),
    h = c.slice(1);
  return {
    params: i.reduce((m, S, y) => {
      let { paramName: b, isOptional: R } = S;
      if (b === "*") {
        let C = h[y] || "";
        d = f.slice(0, f.length - C.length).replace(/(.)\/+$/, "$1");
      }
      const w = h[y];
      return (R && !w ? (m[b] = void 0) : (m[b] = (w || "").replace(/%2F/g, "/")), m);
    }, {}),
    pathname: f,
    pathnameBase: d,
    pattern: l,
  };
}
function FC(l, o, r) {
  (o === void 0 && (o = !1),
    r === void 0 && (r = !0),
    Lf(
      l === "*" || !l.endsWith("*") || l.endsWith("/*"),
      'Route path "' +
        l +
        '" will be treated as if it were ' +
        ('"' + l.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + l.replace(/\*$/, "/*") + '".'),
    ));
  let i = [],
    c =
      "^" +
      l
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (d, h, v) => (
            i.push({ paramName: h, isOptional: v != null }),
            v ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        );
  return (
    l.endsWith("*")
      ? (i.push({ paramName: "*" }), (c += l === "*" || l === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : r
        ? (c += "\\/*$")
        : l !== "" && l !== "/" && (c += "(?:(?=\\/|$))"),
    [new RegExp(c, o ? void 0 : "i"), i]
  );
}
function JC(l) {
  try {
    return l
      .split("/")
      .map((o) => decodeURIComponent(o).replace(/\//g, "%2F"))
      .join("/");
  } catch (o) {
    return (
      Lf(
        !1,
        'The URL path "' +
          l +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + o + ")."),
      ),
      l
    );
  }
}
function Uf(l, o) {
  if (o === "/") return l;
  if (!l.toLowerCase().startsWith(o.toLowerCase())) return null;
  let r = o.endsWith("/") ? o.length - 1 : o.length,
    i = l.charAt(r);
  return i && i !== "/" ? null : l.slice(r) || "/";
}
const WC = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  eR = (l) => WC.test(l);
function tR(l, o) {
  o === void 0 && (o = "/");
  let { pathname: r, search: i = "", hash: c = "" } = typeof l == "string" ? Pa(l) : l,
    f;
  if (r)
    if (eR(r)) f = r;
    else {
      if (r.includes("//")) {
        let d = r;
        ((r = bg(r)),
          Lf(
            !1,
            "Pathnames cannot have embedded double slashes - normalizing " + (d + " -> " + r),
          ));
      }
      r.startsWith("/") ? (f = Lm(r.substring(1), "/")) : (f = Lm(r, o));
    }
  else f = o;
  return { pathname: f, search: aR(i), hash: oR(c) };
}
function Lm(l, o) {
  let r = o.replace(/\/+$/, "").split("/");
  return (
    l.split("/").forEach((c) => {
      c === ".." ? r.length > 1 && r.pop() : c !== "." && r.push(c);
    }),
    r.length > 1 ? r.join("/") : "/"
  );
}
function Js(l, o, r, i) {
  return (
    "Cannot include a '" +
    l +
    "' character in a manually specified " +
    ("`to." + o + "` field [" + JSON.stringify(i) + "].  Please separate it out to the ") +
    ("`to." + r + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function nR(l) {
  return l.filter((o, r) => r === 0 || (o.route.path && o.route.path.length > 0));
}
function Bf(l, o) {
  let r = nR(l);
  return o
    ? r.map((i, c) => (c === r.length - 1 ? i.pathname : i.pathnameBase))
    : r.map((i) => i.pathnameBase);
}
function Hf(l, o, r, i) {
  i === void 0 && (i = !1);
  let c;
  typeof l == "string"
    ? (c = Pa(l))
    : ((c = $o({}, l)),
      Ke(!c.pathname || !c.pathname.includes("?"), Js("?", "pathname", "search", c)),
      Ke(!c.pathname || !c.pathname.includes("#"), Js("#", "pathname", "hash", c)),
      Ke(!c.search || !c.search.includes("#"), Js("#", "search", "hash", c)));
  let f = l === "" || c.pathname === "",
    d = f ? "/" : c.pathname,
    h;
  if (d == null) h = r;
  else {
    let y = o.length - 1;
    if (!i && d.startsWith("..")) {
      let b = d.split("/");
      for (; b[0] === ".."; ) (b.shift(), (y -= 1));
      c.pathname = b.join("/");
    }
    h = y >= 0 ? o[y] : "/";
  }
  let v = tR(c, h),
    m = d && d !== "/" && d.endsWith("/"),
    S = (f || d === ".") && r.endsWith("/");
  return (!v.pathname.endsWith("/") && (m || S) && (v.pathname += "/"), v);
}
const bg = (l) => l.replace(/\/\/+/g, "/"),
  cl = (l) => bg(l.join("/")),
  lR = (l) => l.replace(/\/+$/, "").replace(/^\/*/, "/"),
  aR = (l) => (!l || l === "?" ? "" : l.startsWith("?") ? l : "?" + l),
  oR = (l) => (!l || l === "#" ? "" : l.startsWith("#") ? l : "#" + l);
function rR(l) {
  return (
    l != null &&
    typeof l.status == "number" &&
    typeof l.statusText == "string" &&
    typeof l.internal == "boolean" &&
    "data" in l
  );
}
const xg = ["post", "put", "patch", "delete"];
new Set(xg);
const iR = ["get", ...xg];
new Set(iR);
function Qo() {
  return (
    (Qo = Object.assign
      ? Object.assign.bind()
      : function (l) {
          for (var o = 1; o < arguments.length; o++) {
            var r = arguments[o];
            for (var i in r) ({}).hasOwnProperty.call(r, i) && (l[i] = r[i]);
          }
          return l;
        }),
    Qo.apply(null, arguments)
  );
}
const Pf = p.createContext(null),
  uR = p.createContext(null),
  pl = p.createContext(null),
  Ji = p.createContext(null),
  cn = p.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Eg = p.createContext(null);
function cR(l, o) {
  let { relative: r } = o === void 0 ? {} : o;
  Va() || Ke(!1);
  let { basename: i, navigator: c } = p.useContext(pl),
    { hash: f, pathname: d, search: h } = Rg(l, { relative: r }),
    v = d;
  return (
    i !== "/" && (v = d === "/" ? i : cl([i, d])),
    c.createHref({ pathname: v, search: h, hash: f })
  );
}
function Va() {
  return p.useContext(Ji) != null;
}
function Ga() {
  return (Va() || Ke(!1), p.useContext(Ji).location);
}
function Cg(l) {
  p.useContext(pl).static || p.useLayoutEffect(l);
}
function Vf() {
  let { isDataRoute: l } = p.useContext(cn);
  return l ? RR() : sR();
}
function sR() {
  Va() || Ke(!1);
  let l = p.useContext(Pf),
    { basename: o, future: r, navigator: i } = p.useContext(pl),
    { matches: c } = p.useContext(cn),
    { pathname: f } = Ga(),
    d = JSON.stringify(Bf(c, r.v7_relativeSplatPath)),
    h = p.useRef(!1);
  return (
    Cg(() => {
      h.current = !0;
    }),
    p.useCallback(
      function (m, S) {
        if ((S === void 0 && (S = {}), !h.current)) return;
        if (typeof m == "number") {
          i.go(m);
          return;
        }
        let y = Hf(m, JSON.parse(d), f, S.relative === "path");
        (l == null && o !== "/" && (y.pathname = y.pathname === "/" ? o : cl([o, y.pathname])),
          (S.replace ? i.replace : i.push)(y, S.state, S));
      },
      [o, i, d, f, l],
    )
  );
}
const fR = p.createContext(null);
function dR(l) {
  let o = p.useContext(cn).outlet;
  return o && p.createElement(fR.Provider, { value: l }, o);
}
function JO() {
  let { matches: l } = p.useContext(cn),
    o = l[l.length - 1];
  return o ? o.params : {};
}
function Rg(l, o) {
  let { relative: r } = o === void 0 ? {} : o,
    { future: i } = p.useContext(pl),
    { matches: c } = p.useContext(cn),
    { pathname: f } = Ga(),
    d = JSON.stringify(Bf(c, i.v7_relativeSplatPath));
  return p.useMemo(() => Hf(l, JSON.parse(d), f, r === "path"), [l, d, f, r]);
}
function pR(l, o) {
  return hR(l, o);
}
function hR(l, o, r, i) {
  Va() || Ke(!1);
  let { navigator: c } = p.useContext(pl),
    { matches: f } = p.useContext(cn),
    d = f[f.length - 1],
    h = d ? d.params : {};
  d && d.pathname;
  let v = d ? d.pathnameBase : "/";
  d && d.route;
  let m = Ga(),
    S;
  if (o) {
    var y;
    let T = typeof o == "string" ? Pa(o) : o;
    (v === "/" || ((y = T.pathname) != null && y.startsWith(v)) || Ke(!1), (S = T));
  } else S = m;
  let b = S.pathname || "/",
    R = b;
  if (v !== "/") {
    let T = v.replace(/^\//, "").split("/");
    R = "/" + b.replace(/^\//, "").split("/").slice(T.length).join("/");
  }
  let w = HC(l, { pathname: R }),
    C = SR(
      w &&
        w.map((T) =>
          Object.assign({}, T, {
            params: Object.assign({}, h, T.params),
            pathname: cl([
              v,
              c.encodeLocation ? c.encodeLocation(T.pathname).pathname : T.pathname,
            ]),
            pathnameBase:
              T.pathnameBase === "/"
                ? v
                : cl([
                    v,
                    c.encodeLocation ? c.encodeLocation(T.pathnameBase).pathname : T.pathnameBase,
                  ]),
          }),
        ),
      f,
      r,
      i,
    );
  return o && C
    ? p.createElement(
        Ji.Provider,
        {
          value: {
            location: Qo({ pathname: "/", search: "", hash: "", state: null, key: "default" }, S),
            navigationType: ul.Pop,
          },
        },
        C,
      )
    : C;
}
function vR() {
  let l = CR(),
    o = rR(l) ? l.status + " " + l.statusText : l instanceof Error ? l.message : JSON.stringify(l),
    r = l instanceof Error ? l.stack : null,
    c = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return p.createElement(
    p.Fragment,
    null,
    p.createElement("h2", null, "Unexpected Application Error!"),
    p.createElement("h3", { style: { fontStyle: "italic" } }, o),
    r ? p.createElement("pre", { style: c }, r) : null,
    null,
  );
}
const mR = p.createElement(vR, null);
class gR extends p.Component {
  constructor(o) {
    (super(o),
      (this.state = { location: o.location, revalidation: o.revalidation, error: o.error }));
  }
  static getDerivedStateFromError(o) {
    return { error: o };
  }
  static getDerivedStateFromProps(o, r) {
    return r.location !== o.location || (r.revalidation !== "idle" && o.revalidation === "idle")
      ? { error: o.error, location: o.location, revalidation: o.revalidation }
      : {
          error: o.error !== void 0 ? o.error : r.error,
          location: r.location,
          revalidation: o.revalidation || r.revalidation,
        };
  }
  componentDidCatch(o, r) {
    console.error("React Router caught the following error during render", o, r);
  }
  render() {
    return this.state.error !== void 0
      ? p.createElement(
          cn.Provider,
          { value: this.props.routeContext },
          p.createElement(Eg.Provider, { value: this.state.error, children: this.props.component }),
        )
      : this.props.children;
  }
}
function yR(l) {
  let { routeContext: o, match: r, children: i } = l,
    c = p.useContext(Pf);
  return (
    c &&
      c.static &&
      c.staticContext &&
      (r.route.errorElement || r.route.ErrorBoundary) &&
      (c.staticContext._deepestRenderedBoundaryId = r.route.id),
    p.createElement(cn.Provider, { value: o }, i)
  );
}
function SR(l, o, r, i) {
  var c;
  if (
    (o === void 0 && (o = []), r === void 0 && (r = null), i === void 0 && (i = null), l == null)
  ) {
    var f;
    if (!r) return null;
    if (r.errors) l = r.matches;
    else if (
      (f = i) != null &&
      f.v7_partialHydration &&
      o.length === 0 &&
      !r.initialized &&
      r.matches.length > 0
    )
      l = r.matches;
    else return null;
  }
  let d = l,
    h = (c = r) == null ? void 0 : c.errors;
  if (h != null) {
    let S = d.findIndex((y) => y.route.id && h?.[y.route.id] !== void 0);
    (S >= 0 || Ke(!1), (d = d.slice(0, Math.min(d.length, S + 1))));
  }
  let v = !1,
    m = -1;
  if (r && i && i.v7_partialHydration)
    for (let S = 0; S < d.length; S++) {
      let y = d[S];
      if (((y.route.HydrateFallback || y.route.hydrateFallbackElement) && (m = S), y.route.id)) {
        let { loaderData: b, errors: R } = r,
          w = y.route.loader && b[y.route.id] === void 0 && (!R || R[y.route.id] === void 0);
        if (y.route.lazy || w) {
          ((v = !0), m >= 0 ? (d = d.slice(0, m + 1)) : (d = [d[0]]));
          break;
        }
      }
    }
  return d.reduceRight((S, y, b) => {
    let R,
      w = !1,
      C = null,
      T = null;
    r &&
      ((R = h && y.route.id ? h[y.route.id] : void 0),
      (C = y.route.errorElement || mR),
      v &&
        (m < 0 && b === 0
          ? (TR("route-fallback"), (w = !0), (T = null))
          : m === b && ((w = !0), (T = y.route.hydrateFallbackElement || null))));
    let _ = o.concat(d.slice(0, b + 1)),
      D = () => {
        let N;
        return (
          R
            ? (N = C)
            : w
              ? (N = T)
              : y.route.Component
                ? (N = p.createElement(y.route.Component, null))
                : y.route.element
                  ? (N = y.route.element)
                  : (N = S),
          p.createElement(yR, {
            match: y,
            routeContext: { outlet: S, matches: _, isDataRoute: r != null },
            children: N,
          })
        );
      };
    return r && (y.route.ErrorBoundary || y.route.errorElement || b === 0)
      ? p.createElement(gR, {
          location: r.location,
          revalidation: r.revalidation,
          component: C,
          error: R,
          children: D(),
          routeContext: { outlet: null, matches: _, isDataRoute: !0 },
        })
      : D();
  }, null);
}
var Tg = (function (l) {
    return (
      (l.UseBlocker = "useBlocker"),
      (l.UseRevalidator = "useRevalidator"),
      (l.UseNavigateStable = "useNavigate"),
      l
    );
  })(Tg || {}),
  wg = (function (l) {
    return (
      (l.UseBlocker = "useBlocker"),
      (l.UseLoaderData = "useLoaderData"),
      (l.UseActionData = "useActionData"),
      (l.UseRouteError = "useRouteError"),
      (l.UseNavigation = "useNavigation"),
      (l.UseRouteLoaderData = "useRouteLoaderData"),
      (l.UseMatches = "useMatches"),
      (l.UseRevalidator = "useRevalidator"),
      (l.UseNavigateStable = "useNavigate"),
      (l.UseRouteId = "useRouteId"),
      l
    );
  })(wg || {});
function bR(l) {
  let o = p.useContext(Pf);
  return (o || Ke(!1), o);
}
function xR(l) {
  let o = p.useContext(uR);
  return (o || Ke(!1), o);
}
function ER(l) {
  let o = p.useContext(cn);
  return (o || Ke(!1), o);
}
function Ag(l) {
  let o = ER(),
    r = o.matches[o.matches.length - 1];
  return (r.route.id || Ke(!1), r.route.id);
}
function CR() {
  var l;
  let o = p.useContext(Eg),
    r = xR(),
    i = Ag();
  return o !== void 0 ? o : (l = r.errors) == null ? void 0 : l[i];
}
function RR() {
  let { router: l } = bR(Tg.UseNavigateStable),
    o = Ag(wg.UseNavigateStable),
    r = p.useRef(!1);
  return (
    Cg(() => {
      r.current = !0;
    }),
    p.useCallback(
      function (c, f) {
        (f === void 0 && (f = {}),
          r.current &&
            (typeof c == "number" ? l.navigate(c) : l.navigate(c, Qo({ fromRouteId: o }, f))));
      },
      [l, o],
    )
  );
}
const Um = {};
function TR(l, o, r) {
  Um[l] || (Um[l] = !0);
}
function wR(l, o) {
  (l?.v7_startTransition, l?.v7_relativeSplatPath);
}
function WO(l) {
  let { to: o, replace: r, state: i, relative: c } = l;
  Va() || Ke(!1);
  let { future: f, static: d } = p.useContext(pl),
    { matches: h } = p.useContext(cn),
    { pathname: v } = Ga(),
    m = Vf(),
    S = Hf(o, Bf(h, f.v7_relativeSplatPath), v, c === "path"),
    y = JSON.stringify(S);
  return (
    p.useEffect(() => m(JSON.parse(y), { replace: r, state: i, relative: c }), [m, y, c, r, i]),
    null
  );
}
function eD(l) {
  return dR(l.context);
}
function AR(l) {
  Ke(!1);
}
function _R(l) {
  let {
    basename: o = "/",
    children: r = null,
    location: i,
    navigationType: c = ul.Pop,
    navigator: f,
    static: d = !1,
    future: h,
  } = l;
  Va() && Ke(!1);
  let v = o.replace(/^\/*/, "/"),
    m = p.useMemo(
      () => ({ basename: v, navigator: f, static: d, future: Qo({ v7_relativeSplatPath: !1 }, h) }),
      [v, h, f, d],
    );
  typeof i == "string" && (i = Pa(i));
  let { pathname: S = "/", search: y = "", hash: b = "", state: R = null, key: w = "default" } = i,
    C = p.useMemo(() => {
      let T = Uf(S, v);
      return T == null
        ? null
        : { location: { pathname: T, search: y, hash: b, state: R, key: w }, navigationType: c };
    }, [v, S, y, b, R, w, c]);
  return C == null
    ? null
    : p.createElement(
        pl.Provider,
        { value: m },
        p.createElement(Ji.Provider, { children: r, value: C }),
      );
}
function tD(l) {
  let { children: o, location: r } = l;
  return pR(hf(o), r);
}
new Promise(() => {});
function hf(l, o) {
  o === void 0 && (o = []);
  let r = [];
  return (
    p.Children.forEach(l, (i, c) => {
      if (!p.isValidElement(i)) return;
      let f = [...o, c];
      if (i.type === p.Fragment) {
        r.push.apply(r, hf(i.props.children, f));
        return;
      }
      (i.type !== AR && Ke(!1), !i.props.index || !i.props.children || Ke(!1));
      let d = {
        id: i.props.id || f.join("-"),
        caseSensitive: i.props.caseSensitive,
        element: i.props.element,
        Component: i.props.Component,
        index: i.props.index,
        path: i.props.path,
        loader: i.props.loader,
        action: i.props.action,
        errorElement: i.props.errorElement,
        ErrorBoundary: i.props.ErrorBoundary,
        hasErrorBoundary: i.props.ErrorBoundary != null || i.props.errorElement != null,
        shouldRevalidate: i.props.shouldRevalidate,
        handle: i.props.handle,
        lazy: i.props.lazy,
      };
      (i.props.children && (d.children = hf(i.props.children, f)), r.push(d));
    }),
    r
  );
}
function vf() {
  return (
    (vf = Object.assign
      ? Object.assign.bind()
      : function (l) {
          for (var o = 1; o < arguments.length; o++) {
            var r = arguments[o];
            for (var i in r) ({}).hasOwnProperty.call(r, i) && (l[i] = r[i]);
          }
          return l;
        }),
    vf.apply(null, arguments)
  );
}
function MR(l, o) {
  if (l == null) return {};
  var r = {};
  for (var i in l)
    if ({}.hasOwnProperty.call(l, i)) {
      if (o.indexOf(i) !== -1) continue;
      r[i] = l[i];
    }
  return r;
}
function OR(l) {
  return !!(l.metaKey || l.altKey || l.ctrlKey || l.shiftKey);
}
function DR(l, o) {
  return l.button === 0 && (!o || o === "_self") && !OR(l);
}
function mf(l) {
  return (
    l === void 0 && (l = ""),
    new URLSearchParams(
      typeof l == "string" || Array.isArray(l) || l instanceof URLSearchParams
        ? l
        : Object.keys(l).reduce((o, r) => {
            let i = l[r];
            return o.concat(Array.isArray(i) ? i.map((c) => [r, c]) : [[r, i]]);
          }, []),
    )
  );
}
function NR(l, o) {
  let r = mf(l);
  return (
    o &&
      o.forEach((i, c) => {
        r.has(c) ||
          o.getAll(c).forEach((f) => {
            r.append(c, f);
          });
      }),
    r
  );
}
const zR = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "viewTransition",
  ],
  jR = "6";
try {
  window.__reactRouterVersion = jR;
} catch {}
const LR = "startTransition",
  Bm = Fi[LR];
function nD(l) {
  let { basename: o, children: r, future: i, window: c } = l,
    f = p.useRef();
  f.current == null && (f.current = LC({ window: c, v5Compat: !0 }));
  let d = f.current,
    [h, v] = p.useState({ action: d.action, location: d.location }),
    { v7_startTransition: m } = i || {},
    S = p.useCallback(
      (y) => {
        m && Bm ? Bm(() => v(y)) : v(y);
      },
      [v, m],
    );
  return (
    p.useLayoutEffect(() => d.listen(S), [d, S]),
    p.useEffect(() => wR(i), [i]),
    p.createElement(_R, {
      basename: o,
      children: r,
      location: h.location,
      navigationType: h.action,
      navigator: d,
      future: i,
    })
  );
}
const UR =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  BR = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  lD = p.forwardRef(function (o, r) {
    let {
        onClick: i,
        relative: c,
        reloadDocument: f,
        replace: d,
        state: h,
        target: v,
        to: m,
        preventScrollReset: S,
        viewTransition: y,
      } = o,
      b = MR(o, zR),
      { basename: R } = p.useContext(pl),
      w,
      C = !1;
    if (typeof m == "string" && BR.test(m) && ((w = m), UR))
      try {
        let N = new URL(window.location.href),
          B = m.startsWith("//") ? new URL(N.protocol + m) : new URL(m),
          K = Uf(B.pathname, R);
        B.origin === N.origin && K != null ? (m = K + B.search + B.hash) : (C = !0);
      } catch {}
    let T = cR(m, { relative: c }),
      _ = HR(m, {
        replace: d,
        state: h,
        target: v,
        preventScrollReset: S,
        relative: c,
        viewTransition: y,
      });
    function D(N) {
      (i && i(N), N.defaultPrevented || _(N));
    }
    return p.createElement(
      "a",
      vf({}, b, { href: w || T, onClick: C || f ? i : D, ref: r, target: v }),
    );
  });
var Hm;
(function (l) {
  ((l.UseScrollRestoration = "useScrollRestoration"),
    (l.UseSubmit = "useSubmit"),
    (l.UseSubmitFetcher = "useSubmitFetcher"),
    (l.UseFetcher = "useFetcher"),
    (l.useViewTransitionState = "useViewTransitionState"));
})(Hm || (Hm = {}));
var Pm;
(function (l) {
  ((l.UseFetcher = "useFetcher"),
    (l.UseFetchers = "useFetchers"),
    (l.UseScrollRestoration = "useScrollRestoration"));
})(Pm || (Pm = {}));
function HR(l, o) {
  let {
      target: r,
      replace: i,
      state: c,
      preventScrollReset: f,
      relative: d,
      viewTransition: h,
    } = o === void 0 ? {} : o,
    v = Vf(),
    m = Ga(),
    S = Rg(l, { relative: d });
  return p.useCallback(
    (y) => {
      if (DR(y, r)) {
        y.preventDefault();
        let b = i !== void 0 ? i : Hi(m) === Hi(S);
        v(l, { replace: b, state: c, preventScrollReset: f, relative: d, viewTransition: h });
      }
    },
    [m, v, S, i, c, r, l, f, d, h],
  );
}
function aD(l) {
  let o = p.useRef(mf(l)),
    r = p.useRef(!1),
    i = Ga(),
    c = p.useMemo(() => NR(i.search, r.current ? null : o.current), [i.search]),
    f = Vf(),
    d = p.useCallback(
      (h, v) => {
        const m = mf(typeof h == "function" ? h(c) : h);
        ((r.current = !0), f("?" + m, v));
      },
      [f, c],
    );
  return [c, d];
}
function Vm(l, o) {
  if (typeof l == "function") return l(o);
  l != null && (l.current = o);
}
function sn(...l) {
  return (o) => {
    let r = !1;
    const i = l.map((c) => {
      const f = Vm(c, o);
      return (!r && typeof f == "function" && (r = !0), f);
    });
    if (r)
      return () => {
        for (let c = 0; c < i.length; c++) {
          const f = i[c];
          typeof f == "function" ? f() : Vm(l[c], null);
        }
      };
  };
}
function de(...l) {
  return p.useCallback(sn(...l), l);
}
var PR = Symbol.for("react.lazy"),
  Pi = Fi[" use ".trim().toString()];
function VR(l) {
  return typeof l == "object" && l !== null && "then" in l;
}
function _g(l) {
  return (
    l != null &&
    typeof l == "object" &&
    "$$typeof" in l &&
    l.$$typeof === PR &&
    "_payload" in l &&
    VR(l._payload)
  );
}
function tr(l) {
  const o = GR(l),
    r = p.forwardRef((i, c) => {
      let { children: f, ...d } = i;
      _g(f) && typeof Pi == "function" && (f = Pi(f._payload));
      const h = p.Children.toArray(f),
        v = h.find(qR);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
var oD = tr("Slot");
function GR(l) {
  const o = p.forwardRef((r, i) => {
    let { children: c, ...f } = r;
    if ((_g(c) && typeof Pi == "function" && (c = Pi(c._payload)), p.isValidElement(c))) {
      const d = IR(c),
        h = XR(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var YR = Symbol("radix.slottable");
function qR(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === YR
  );
}
function XR(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function IR(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
var KR = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  $R = KR.reduce((l, o) => {
    const r = tr(`Primitive.${o}`),
      i = p.forwardRef((c, f) => {
        const { asChild: d, ...h } = c,
          v = d ? r : o;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          E.jsx(v, { ...h, ref: f })
        );
      });
    return ((i.displayName = `Primitive.${o}`), { ...l, [o]: i });
  }, {}),
  QR = "Separator",
  Gm = "horizontal",
  ZR = ["horizontal", "vertical"],
  Mg = p.forwardRef((l, o) => {
    const { decorative: r, orientation: i = Gm, ...c } = l,
      f = kR(i) ? i : Gm,
      h = r
        ? { role: "none" }
        : { "aria-orientation": f === "vertical" ? f : void 0, role: "separator" };
    return E.jsx($R.div, { "data-orientation": f, ...h, ...c, ref: o });
  });
Mg.displayName = QR;
function kR(l) {
  return ZR.includes(l);
}
var rD = Mg;
function Z(l, o, { checkForDefaultPrevented: r = !0 } = {}) {
  return function (c) {
    if ((l?.(c), r === !1 || !c.defaultPrevented)) return o?.(c);
  };
}
function FR(l, o) {
  const r = p.createContext(o),
    i = (f) => {
      const { children: d, ...h } = f,
        v = p.useMemo(() => h, Object.values(h));
      return E.jsx(r.Provider, { value: v, children: d });
    };
  i.displayName = l + "Provider";
  function c(f) {
    const d = p.useContext(r);
    if (d) return d;
    if (o !== void 0) return o;
    throw new Error(`\`${f}\` must be used within \`${l}\``);
  }
  return [i, c];
}
function ut(l, o = []) {
  let r = [];
  function i(f, d) {
    const h = p.createContext(d),
      v = r.length;
    r = [...r, d];
    const m = (y) => {
      const { scope: b, children: R, ...w } = y,
        C = b?.[l]?.[v] || h,
        T = p.useMemo(() => w, Object.values(w));
      return E.jsx(C.Provider, { value: T, children: R });
    };
    m.displayName = f + "Provider";
    function S(y, b) {
      const R = b?.[l]?.[v] || h,
        w = p.useContext(R);
      if (w) return w;
      if (d !== void 0) return d;
      throw new Error(`\`${y}\` must be used within \`${f}\``);
    }
    return [m, S];
  }
  const c = () => {
    const f = r.map((d) => p.createContext(d));
    return function (h) {
      const v = h?.[l] || f;
      return p.useMemo(() => ({ [`__scope${l}`]: { ...h, [l]: v } }), [h, v]);
    };
  };
  return ((c.scopeName = l), [i, JR(c, ...o)]);
}
function JR(...l) {
  const o = l[0];
  if (l.length === 1) return o;
  const r = () => {
    const i = l.map((c) => ({ useScope: c(), scopeName: c.scopeName }));
    return function (f) {
      const d = i.reduce((h, { useScope: v, scopeName: m }) => {
        const y = v(f)[`__scope${m}`];
        return { ...h, ...y };
      }, {});
      return p.useMemo(() => ({ [`__scope${o.scopeName}`]: d }), [d]);
    };
  };
  return ((r.scopeName = o.scopeName), r);
}
var $e = globalThis?.document ? p.useLayoutEffect : () => {},
  WR = Fi[" useId ".trim().toString()] || (() => {}),
  e1 = 0;
function zt(l) {
  const [o, r] = p.useState(WR());
  return (
    $e(() => {
      r((i) => i ?? String(e1++));
    }, [l]),
    l || (o ? `radix-${o}` : "")
  );
}
var t1 = Fi[" useInsertionEffect ".trim().toString()] || $e;
function Kt({ prop: l, defaultProp: o, onChange: r = () => {}, caller: i }) {
  const [c, f, d] = n1({ defaultProp: o, onChange: r }),
    h = l !== void 0,
    v = h ? l : c;
  {
    const S = p.useRef(l !== void 0);
    p.useEffect(() => {
      const y = S.current;
      (y !== h &&
        console.warn(
          `${i} is changing from ${y ? "controlled" : "uncontrolled"} to ${h ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (S.current = h));
    }, [h, i]);
  }
  const m = p.useCallback(
    (S) => {
      if (h) {
        const y = l1(S) ? S(l) : S;
        y !== l && d.current?.(y);
      } else f(S);
    },
    [h, l, f, d],
  );
  return [v, m];
}
function n1({ defaultProp: l, onChange: o }) {
  const [r, i] = p.useState(l),
    c = p.useRef(r),
    f = p.useRef(o);
  return (
    t1(() => {
      f.current = o;
    }, [o]),
    p.useEffect(() => {
      c.current !== r && (f.current?.(r), (c.current = r));
    }, [r, c]),
    [r, i, f]
  );
}
function l1(l) {
  return typeof l == "function";
}
function a1(l) {
  const o = o1(l),
    r = p.forwardRef((i, c) => {
      const { children: f, ...d } = i,
        h = p.Children.toArray(f),
        v = h.find(i1);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
function o1(l) {
  const o = p.forwardRef((r, i) => {
    const { children: c, ...f } = r;
    if (p.isValidElement(c)) {
      const d = c1(c),
        h = u1(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var r1 = Symbol("radix.slottable");
function i1(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === r1
  );
}
function u1(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function c1(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
var s1 = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  re = s1.reduce((l, o) => {
    const r = a1(`Primitive.${o}`),
      i = p.forwardRef((c, f) => {
        const { asChild: d, ...h } = c,
          v = d ? r : o;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          E.jsx(v, { ...h, ref: f })
        );
      });
    return ((i.displayName = `Primitive.${o}`), { ...l, [o]: i });
  }, {});
function Og(l, o) {
  l && er.flushSync(() => l.dispatchEvent(o));
}
function We(l) {
  const o = p.useRef(l);
  return (
    p.useEffect(() => {
      o.current = l;
    }),
    p.useMemo(
      () =>
        (...r) =>
          o.current?.(...r),
      [],
    )
  );
}
function f1(l, o = globalThis?.document) {
  const r = We(l);
  p.useEffect(() => {
    const i = (c) => {
      c.key === "Escape" && r(c);
    };
    return (
      o.addEventListener("keydown", i, { capture: !0 }),
      () => o.removeEventListener("keydown", i, { capture: !0 })
    );
  }, [r, o]);
}
var d1 = "DismissableLayer",
  gf = "dismissableLayer.update",
  p1 = "dismissableLayer.pointerDownOutside",
  h1 = "dismissableLayer.focusOutside",
  Ym,
  Dg = p.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  Ya = p.forwardRef((l, o) => {
    const {
        disableOutsidePointerEvents: r = !1,
        onEscapeKeyDown: i,
        onPointerDownOutside: c,
        onFocusOutside: f,
        onInteractOutside: d,
        onDismiss: h,
        ...v
      } = l,
      m = p.useContext(Dg),
      [S, y] = p.useState(null),
      b = S?.ownerDocument ?? globalThis?.document,
      [, R] = p.useState({}),
      w = de(o, (V) => y(V)),
      C = Array.from(m.layers),
      [T] = [...m.layersWithOutsidePointerEventsDisabled].slice(-1),
      _ = C.indexOf(T),
      D = S ? C.indexOf(S) : -1,
      N = m.layersWithOutsidePointerEventsDisabled.size > 0,
      B = D >= _,
      K = g1((V) => {
        const ee = V.target,
          te = [...m.branches].some((le) => le.contains(ee));
        !B || te || (c?.(V), d?.(V), V.defaultPrevented || h?.());
      }, b),
      F = y1((V) => {
        const ee = V.target;
        [...m.branches].some((le) => le.contains(ee)) ||
          (f?.(V), d?.(V), V.defaultPrevented || h?.());
      }, b);
    return (
      f1((V) => {
        D === m.layers.size - 1 && (i?.(V), !V.defaultPrevented && h && (V.preventDefault(), h()));
      }, b),
      p.useEffect(() => {
        if (S)
          return (
            r &&
              (m.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Ym = b.body.style.pointerEvents), (b.body.style.pointerEvents = "none")),
              m.layersWithOutsidePointerEventsDisabled.add(S)),
            m.layers.add(S),
            qm(),
            () => {
              r &&
                m.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (b.body.style.pointerEvents = Ym);
            }
          );
      }, [S, b, r, m]),
      p.useEffect(
        () => () => {
          S && (m.layers.delete(S), m.layersWithOutsidePointerEventsDisabled.delete(S), qm());
        },
        [S, m],
      ),
      p.useEffect(() => {
        const V = () => R({});
        return (document.addEventListener(gf, V), () => document.removeEventListener(gf, V));
      }, []),
      E.jsx(re.div, {
        ...v,
        ref: w,
        style: { pointerEvents: N ? (B ? "auto" : "none") : void 0, ...l.style },
        onFocusCapture: Z(l.onFocusCapture, F.onFocusCapture),
        onBlurCapture: Z(l.onBlurCapture, F.onBlurCapture),
        onPointerDownCapture: Z(l.onPointerDownCapture, K.onPointerDownCapture),
      })
    );
  });
Ya.displayName = d1;
var v1 = "DismissableLayerBranch",
  m1 = p.forwardRef((l, o) => {
    const r = p.useContext(Dg),
      i = p.useRef(null),
      c = de(o, i);
    return (
      p.useEffect(() => {
        const f = i.current;
        if (f)
          return (
            r.branches.add(f),
            () => {
              r.branches.delete(f);
            }
          );
      }, [r.branches]),
      E.jsx(re.div, { ...l, ref: c })
    );
  });
m1.displayName = v1;
function g1(l, o = globalThis?.document) {
  const r = We(l),
    i = p.useRef(!1),
    c = p.useRef(() => {});
  return (
    p.useEffect(() => {
      const f = (h) => {
          if (h.target && !i.current) {
            let v = function () {
              Ng(p1, r, m, { discrete: !0 });
            };
            const m = { originalEvent: h };
            h.pointerType === "touch"
              ? (o.removeEventListener("click", c.current),
                (c.current = v),
                o.addEventListener("click", c.current, { once: !0 }))
              : v();
          } else o.removeEventListener("click", c.current);
          i.current = !1;
        },
        d = window.setTimeout(() => {
          o.addEventListener("pointerdown", f);
        }, 0);
      return () => {
        (window.clearTimeout(d),
          o.removeEventListener("pointerdown", f),
          o.removeEventListener("click", c.current));
      };
    }, [o, r]),
    { onPointerDownCapture: () => (i.current = !0) }
  );
}
function y1(l, o = globalThis?.document) {
  const r = We(l),
    i = p.useRef(!1);
  return (
    p.useEffect(() => {
      const c = (f) => {
        f.target && !i.current && Ng(h1, r, { originalEvent: f }, { discrete: !1 });
      };
      return (o.addEventListener("focusin", c), () => o.removeEventListener("focusin", c));
    }, [o, r]),
    { onFocusCapture: () => (i.current = !0), onBlurCapture: () => (i.current = !1) }
  );
}
function qm() {
  const l = new CustomEvent(gf);
  document.dispatchEvent(l);
}
function Ng(l, o, r, { discrete: i }) {
  const c = r.originalEvent.target,
    f = new CustomEvent(l, { bubbles: !1, cancelable: !0, detail: r });
  (o && c.addEventListener(l, o, { once: !0 }), i ? Og(c, f) : c.dispatchEvent(f));
}
var Ws = "focusScope.autoFocusOnMount",
  ef = "focusScope.autoFocusOnUnmount",
  Xm = { bubbles: !1, cancelable: !0 },
  S1 = "FocusScope",
  nr = p.forwardRef((l, o) => {
    const { loop: r = !1, trapped: i = !1, onMountAutoFocus: c, onUnmountAutoFocus: f, ...d } = l,
      [h, v] = p.useState(null),
      m = We(c),
      S = We(f),
      y = p.useRef(null),
      b = de(o, (C) => v(C)),
      R = p.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    (p.useEffect(() => {
      if (i) {
        let C = function (N) {
            if (R.paused || !h) return;
            const B = N.target;
            h.contains(B) ? (y.current = B) : il(y.current, { select: !0 });
          },
          T = function (N) {
            if (R.paused || !h) return;
            const B = N.relatedTarget;
            B !== null && (h.contains(B) || il(y.current, { select: !0 }));
          },
          _ = function (N) {
            if (document.activeElement === document.body)
              for (const K of N) K.removedNodes.length > 0 && il(h);
          };
        (document.addEventListener("focusin", C), document.addEventListener("focusout", T));
        const D = new MutationObserver(_);
        return (
          h && D.observe(h, { childList: !0, subtree: !0 }),
          () => {
            (document.removeEventListener("focusin", C),
              document.removeEventListener("focusout", T),
              D.disconnect());
          }
        );
      }
    }, [i, h, R.paused]),
      p.useEffect(() => {
        if (h) {
          Km.add(R);
          const C = document.activeElement;
          if (!h.contains(C)) {
            const _ = new CustomEvent(Ws, Xm);
            (h.addEventListener(Ws, m),
              h.dispatchEvent(_),
              _.defaultPrevented ||
                (b1(T1(zg(h)), { select: !0 }), document.activeElement === C && il(h)));
          }
          return () => {
            (h.removeEventListener(Ws, m),
              setTimeout(() => {
                const _ = new CustomEvent(ef, Xm);
                (h.addEventListener(ef, S),
                  h.dispatchEvent(_),
                  _.defaultPrevented || il(C ?? document.body, { select: !0 }),
                  h.removeEventListener(ef, S),
                  Km.remove(R));
              }, 0));
          };
        }
      }, [h, m, S, R]));
    const w = p.useCallback(
      (C) => {
        if ((!r && !i) || R.paused) return;
        const T = C.key === "Tab" && !C.altKey && !C.ctrlKey && !C.metaKey,
          _ = document.activeElement;
        if (T && _) {
          const D = C.currentTarget,
            [N, B] = x1(D);
          N && B
            ? !C.shiftKey && _ === B
              ? (C.preventDefault(), r && il(N, { select: !0 }))
              : C.shiftKey && _ === N && (C.preventDefault(), r && il(B, { select: !0 }))
            : _ === D && C.preventDefault();
        }
      },
      [r, i, R.paused],
    );
    return E.jsx(re.div, { tabIndex: -1, ...d, ref: b, onKeyDown: w });
  });
nr.displayName = S1;
function b1(l, { select: o = !1 } = {}) {
  const r = document.activeElement;
  for (const i of l) if ((il(i, { select: o }), document.activeElement !== r)) return;
}
function x1(l) {
  const o = zg(l),
    r = Im(o, l),
    i = Im(o.reverse(), l);
  return [r, i];
}
function zg(l) {
  const o = [],
    r = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (i) => {
        const c = i.tagName === "INPUT" && i.type === "hidden";
        return i.disabled || i.hidden || c
          ? NodeFilter.FILTER_SKIP
          : i.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; r.nextNode(); ) o.push(r.currentNode);
  return o;
}
function Im(l, o) {
  for (const r of l) if (!E1(r, { upTo: o })) return r;
}
function E1(l, { upTo: o }) {
  if (getComputedStyle(l).visibility === "hidden") return !0;
  for (; l; ) {
    if (o !== void 0 && l === o) return !1;
    if (getComputedStyle(l).display === "none") return !0;
    l = l.parentElement;
  }
  return !1;
}
function C1(l) {
  return l instanceof HTMLInputElement && "select" in l;
}
function il(l, { select: o = !1 } = {}) {
  if (l && l.focus) {
    const r = document.activeElement;
    (l.focus({ preventScroll: !0 }), l !== r && C1(l) && o && l.select());
  }
}
var Km = R1();
function R1() {
  let l = [];
  return {
    add(o) {
      const r = l[0];
      (o !== r && r?.pause(), (l = $m(l, o)), l.unshift(o));
    },
    remove(o) {
      ((l = $m(l, o)), l[0]?.resume());
    },
  };
}
function $m(l, o) {
  const r = [...l],
    i = r.indexOf(o);
  return (i !== -1 && r.splice(i, 1), r);
}
function T1(l) {
  return l.filter((o) => o.tagName !== "A");
}
var w1 = "Portal",
  qa = p.forwardRef((l, o) => {
    const { container: r, ...i } = l,
      [c, f] = p.useState(!1);
    $e(() => f(!0), []);
    const d = r || (c && globalThis?.document?.body);
    return d ? jC.createPortal(E.jsx(re.div, { ...i, ref: o }), d) : null;
  });
qa.displayName = w1;
function A1(l, o) {
  return p.useReducer((r, i) => o[r][i] ?? r, l);
}
var et = (l) => {
  const { present: o, children: r } = l,
    i = _1(o),
    c = typeof r == "function" ? r({ present: i.isPresent }) : p.Children.only(r),
    f = de(i.ref, M1(c));
  return typeof r == "function" || i.isPresent ? p.cloneElement(c, { ref: f }) : null;
};
et.displayName = "Presence";
function _1(l) {
  const [o, r] = p.useState(),
    i = p.useRef(null),
    c = p.useRef(l),
    f = p.useRef("none"),
    d = l ? "mounted" : "unmounted",
    [h, v] = A1(d, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    p.useEffect(() => {
      const m = _i(i.current);
      f.current = h === "mounted" ? m : "none";
    }, [h]),
    $e(() => {
      const m = i.current,
        S = c.current;
      if (S !== l) {
        const b = f.current,
          R = _i(m);
        (l
          ? v("MOUNT")
          : R === "none" || m?.display === "none"
            ? v("UNMOUNT")
            : v(S && b !== R ? "ANIMATION_OUT" : "UNMOUNT"),
          (c.current = l));
      }
    }, [l, v]),
    $e(() => {
      if (o) {
        let m;
        const S = o.ownerDocument.defaultView ?? window,
          y = (R) => {
            const C = _i(i.current).includes(CSS.escape(R.animationName));
            if (R.target === o && C && (v("ANIMATION_END"), !c.current)) {
              const T = o.style.animationFillMode;
              ((o.style.animationFillMode = "forwards"),
                (m = S.setTimeout(() => {
                  o.style.animationFillMode === "forwards" && (o.style.animationFillMode = T);
                })));
            }
          },
          b = (R) => {
            R.target === o && (f.current = _i(i.current));
          };
        return (
          o.addEventListener("animationstart", b),
          o.addEventListener("animationcancel", y),
          o.addEventListener("animationend", y),
          () => {
            (S.clearTimeout(m),
              o.removeEventListener("animationstart", b),
              o.removeEventListener("animationcancel", y),
              o.removeEventListener("animationend", y));
          }
        );
      } else v("ANIMATION_END");
    }, [o, v]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(h),
      ref: p.useCallback((m) => {
        ((i.current = m ? getComputedStyle(m) : null), r(m));
      }, []),
    }
  );
}
function _i(l) {
  return l?.animationName || "none";
}
function M1(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
var tf = 0;
function Wi() {
  p.useEffect(() => {
    const l = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement("afterbegin", l[0] ?? Qm()),
      document.body.insertAdjacentElement("beforeend", l[1] ?? Qm()),
      tf++,
      () => {
        (tf === 1 &&
          document.querySelectorAll("[data-radix-focus-guard]").forEach((o) => o.remove()),
          tf--);
      }
    );
  }, []);
}
function Qm() {
  const l = document.createElement("span");
  return (
    l.setAttribute("data-radix-focus-guard", ""),
    (l.tabIndex = 0),
    (l.style.outline = "none"),
    (l.style.opacity = "0"),
    (l.style.position = "fixed"),
    (l.style.pointerEvents = "none"),
    l
  );
}
var on = function () {
  return (
    (on =
      Object.assign ||
      function (o) {
        for (var r, i = 1, c = arguments.length; i < c; i++) {
          r = arguments[i];
          for (var f in r) Object.prototype.hasOwnProperty.call(r, f) && (o[f] = r[f]);
        }
        return o;
      }),
    on.apply(this, arguments)
  );
};
function jg(l, o) {
  var r = {};
  for (var i in l) Object.prototype.hasOwnProperty.call(l, i) && o.indexOf(i) < 0 && (r[i] = l[i]);
  if (l != null && typeof Object.getOwnPropertySymbols == "function")
    for (var c = 0, i = Object.getOwnPropertySymbols(l); c < i.length; c++)
      o.indexOf(i[c]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(l, i[c]) &&
        (r[i[c]] = l[i[c]]);
  return r;
}
function O1(l, o, r) {
  if (r || arguments.length === 2)
    for (var i = 0, c = o.length, f; i < c; i++)
      (f || !(i in o)) && (f || (f = Array.prototype.slice.call(o, 0, i)), (f[i] = o[i]));
  return l.concat(f || Array.prototype.slice.call(o));
}
var Li = "right-scroll-bar-position",
  Ui = "width-before-scroll-bar",
  D1 = "with-scroll-bars-hidden",
  N1 = "--removed-body-scroll-bar-size";
function nf(l, o) {
  return (typeof l == "function" ? l(o) : l && (l.current = o), l);
}
function z1(l, o) {
  var r = p.useState(function () {
    return {
      value: l,
      callback: o,
      facade: {
        get current() {
          return r.value;
        },
        set current(i) {
          var c = r.value;
          c !== i && ((r.value = i), r.callback(i, c));
        },
      },
    };
  })[0];
  return ((r.callback = o), r.facade);
}
var j1 = typeof window < "u" ? p.useLayoutEffect : p.useEffect,
  Zm = new WeakMap();
function L1(l, o) {
  var r = z1(null, function (i) {
    return l.forEach(function (c) {
      return nf(c, i);
    });
  });
  return (
    j1(
      function () {
        var i = Zm.get(r);
        if (i) {
          var c = new Set(i),
            f = new Set(l),
            d = r.current;
          (c.forEach(function (h) {
            f.has(h) || nf(h, null);
          }),
            f.forEach(function (h) {
              c.has(h) || nf(h, d);
            }));
        }
        Zm.set(r, l);
      },
      [l],
    ),
    r
  );
}
function U1(l) {
  return l;
}
function B1(l, o) {
  o === void 0 && (o = U1);
  var r = [],
    i = !1,
    c = {
      read: function () {
        if (i)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
          );
        return r.length ? r[r.length - 1] : l;
      },
      useMedium: function (f) {
        var d = o(f, i);
        return (
          r.push(d),
          function () {
            r = r.filter(function (h) {
              return h !== d;
            });
          }
        );
      },
      assignSyncMedium: function (f) {
        for (i = !0; r.length; ) {
          var d = r;
          ((r = []), d.forEach(f));
        }
        r = {
          push: function (h) {
            return f(h);
          },
          filter: function () {
            return r;
          },
        };
      },
      assignMedium: function (f) {
        i = !0;
        var d = [];
        if (r.length) {
          var h = r;
          ((r = []), h.forEach(f), (d = r));
        }
        var v = function () {
            var S = d;
            ((d = []), S.forEach(f));
          },
          m = function () {
            return Promise.resolve().then(v);
          };
        (m(),
          (r = {
            push: function (S) {
              (d.push(S), m());
            },
            filter: function (S) {
              return ((d = d.filter(S)), r);
            },
          }));
      },
    };
  return c;
}
function H1(l) {
  l === void 0 && (l = {});
  var o = B1(null);
  return ((o.options = on({ async: !0, ssr: !1 }, l)), o);
}
var Lg = function (l) {
  var o = l.sideCar,
    r = jg(l, ["sideCar"]);
  if (!o) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var i = o.read();
  if (!i) throw new Error("Sidecar medium not found");
  return p.createElement(i, on({}, r));
};
Lg.isSideCarExport = !0;
function P1(l, o) {
  return (l.useMedium(o), Lg);
}
var Ug = H1(),
  lf = function () {},
  eu = p.forwardRef(function (l, o) {
    var r = p.useRef(null),
      i = p.useState({ onScrollCapture: lf, onWheelCapture: lf, onTouchMoveCapture: lf }),
      c = i[0],
      f = i[1],
      d = l.forwardProps,
      h = l.children,
      v = l.className,
      m = l.removeScrollBar,
      S = l.enabled,
      y = l.shards,
      b = l.sideCar,
      R = l.noRelative,
      w = l.noIsolation,
      C = l.inert,
      T = l.allowPinchZoom,
      _ = l.as,
      D = _ === void 0 ? "div" : _,
      N = l.gapMode,
      B = jg(l, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noRelative",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode",
      ]),
      K = b,
      F = L1([r, o]),
      V = on(on({}, B), c);
    return p.createElement(
      p.Fragment,
      null,
      S &&
        p.createElement(K, {
          sideCar: Ug,
          removeScrollBar: m,
          shards: y,
          noRelative: R,
          noIsolation: w,
          inert: C,
          setCallbacks: f,
          allowPinchZoom: !!T,
          lockRef: r,
          gapMode: N,
        }),
      d
        ? p.cloneElement(p.Children.only(h), on(on({}, V), { ref: F }))
        : p.createElement(D, on({}, V, { className: v, ref: F }), h),
    );
  });
eu.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
eu.classNames = { fullWidth: Ui, zeroRight: Li };
var V1 = function () {
  if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
function G1() {
  if (!document) return null;
  var l = document.createElement("style");
  l.type = "text/css";
  var o = V1();
  return (o && l.setAttribute("nonce", o), l);
}
function Y1(l, o) {
  l.styleSheet ? (l.styleSheet.cssText = o) : l.appendChild(document.createTextNode(o));
}
function q1(l) {
  var o = document.head || document.getElementsByTagName("head")[0];
  o.appendChild(l);
}
var X1 = function () {
    var l = 0,
      o = null;
    return {
      add: function (r) {
        (l == 0 && (o = G1()) && (Y1(o, r), q1(o)), l++);
      },
      remove: function () {
        (l--, !l && o && (o.parentNode && o.parentNode.removeChild(o), (o = null)));
      },
    };
  },
  I1 = function () {
    var l = X1();
    return function (o, r) {
      p.useEffect(
        function () {
          return (
            l.add(o),
            function () {
              l.remove();
            }
          );
        },
        [o && r],
      );
    };
  },
  Bg = function () {
    var l = I1(),
      o = function (r) {
        var i = r.styles,
          c = r.dynamic;
        return (l(i, c), null);
      };
    return o;
  },
  K1 = { left: 0, top: 0, right: 0, gap: 0 },
  af = function (l) {
    return parseInt(l || "", 10) || 0;
  },
  $1 = function (l) {
    var o = window.getComputedStyle(document.body),
      r = o[l === "padding" ? "paddingLeft" : "marginLeft"],
      i = o[l === "padding" ? "paddingTop" : "marginTop"],
      c = o[l === "padding" ? "paddingRight" : "marginRight"];
    return [af(r), af(i), af(c)];
  },
  Q1 = function (l) {
    if ((l === void 0 && (l = "margin"), typeof window > "u")) return K1;
    var o = $1(l),
      r = document.documentElement.clientWidth,
      i = window.innerWidth;
    return { left: o[0], top: o[1], right: o[2], gap: Math.max(0, i - r + o[2] - o[0]) };
  },
  Z1 = Bg(),
  Na = "data-scroll-locked",
  k1 = function (l, o, r, i) {
    var c = l.left,
      f = l.top,
      d = l.right,
      h = l.gap;
    return (
      r === void 0 && (r = "margin"),
      `
  .`
        .concat(
          D1,
          ` {
   overflow: hidden `,
        )
        .concat(
          i,
          `;
   padding-right: `,
        )
        .concat(h, "px ")
        .concat(
          i,
          `;
  }
  body[`,
        )
        .concat(
          Na,
          `] {
    overflow: hidden `,
        )
        .concat(
          i,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            o && "position: relative ".concat(i, ";"),
            r === "margin" &&
              `
    padding-left: `
                .concat(
                  c,
                  `px;
    padding-top: `,
                )
                .concat(
                  f,
                  `px;
    padding-right: `,
                )
                .concat(
                  d,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(h, "px ")
                .concat(
                  i,
                  `;
    `,
                ),
            r === "padding" && "padding-right: ".concat(h, "px ").concat(i, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`,
        )
        .concat(
          Li,
          ` {
    right: `,
        )
        .concat(h, "px ")
        .concat(
          i,
          `;
  }
  
  .`,
        )
        .concat(
          Ui,
          ` {
    margin-right: `,
        )
        .concat(h, "px ")
        .concat(
          i,
          `;
  }
  
  .`,
        )
        .concat(Li, " .")
        .concat(
          Li,
          ` {
    right: 0 `,
        )
        .concat(
          i,
          `;
  }
  
  .`,
        )
        .concat(Ui, " .")
        .concat(
          Ui,
          ` {
    margin-right: 0 `,
        )
        .concat(
          i,
          `;
  }
  
  body[`,
        )
        .concat(
          Na,
          `] {
    `,
        )
        .concat(N1, ": ")
        .concat(
          h,
          `px;
  }
`,
        )
    );
  },
  km = function () {
    var l = parseInt(document.body.getAttribute(Na) || "0", 10);
    return isFinite(l) ? l : 0;
  },
  F1 = function () {
    p.useEffect(function () {
      return (
        document.body.setAttribute(Na, (km() + 1).toString()),
        function () {
          var l = km() - 1;
          l <= 0 ? document.body.removeAttribute(Na) : document.body.setAttribute(Na, l.toString());
        }
      );
    }, []);
  },
  J1 = function (l) {
    var o = l.noRelative,
      r = l.noImportant,
      i = l.gapMode,
      c = i === void 0 ? "margin" : i;
    F1();
    var f = p.useMemo(
      function () {
        return Q1(c);
      },
      [c],
    );
    return p.createElement(Z1, { styles: k1(f, !o, c, r ? "" : "!important") });
  },
  yf = !1;
if (typeof window < "u")
  try {
    var Mi = Object.defineProperty({}, "passive", {
      get: function () {
        return ((yf = !0), !0);
      },
    });
    (window.addEventListener("test", Mi, Mi), window.removeEventListener("test", Mi, Mi));
  } catch {
    yf = !1;
  }
var Ma = yf ? { passive: !1 } : !1,
  W1 = function (l) {
    return l.tagName === "TEXTAREA";
  },
  Hg = function (l, o) {
    if (!(l instanceof Element)) return !1;
    var r = window.getComputedStyle(l);
    return r[o] !== "hidden" && !(r.overflowY === r.overflowX && !W1(l) && r[o] === "visible");
  },
  eT = function (l) {
    return Hg(l, "overflowY");
  },
  tT = function (l) {
    return Hg(l, "overflowX");
  },
  Fm = function (l, o) {
    var r = o.ownerDocument,
      i = o;
    do {
      typeof ShadowRoot < "u" && i instanceof ShadowRoot && (i = i.host);
      var c = Pg(l, i);
      if (c) {
        var f = Vg(l, i),
          d = f[1],
          h = f[2];
        if (d > h) return !0;
      }
      i = i.parentNode;
    } while (i && i !== r.body);
    return !1;
  },
  nT = function (l) {
    var o = l.scrollTop,
      r = l.scrollHeight,
      i = l.clientHeight;
    return [o, r, i];
  },
  lT = function (l) {
    var o = l.scrollLeft,
      r = l.scrollWidth,
      i = l.clientWidth;
    return [o, r, i];
  },
  Pg = function (l, o) {
    return l === "v" ? eT(o) : tT(o);
  },
  Vg = function (l, o) {
    return l === "v" ? nT(o) : lT(o);
  },
  aT = function (l, o) {
    return l === "h" && o === "rtl" ? -1 : 1;
  },
  oT = function (l, o, r, i, c) {
    var f = aT(l, window.getComputedStyle(o).direction),
      d = f * i,
      h = r.target,
      v = o.contains(h),
      m = !1,
      S = d > 0,
      y = 0,
      b = 0;
    do {
      if (!h) break;
      var R = Vg(l, h),
        w = R[0],
        C = R[1],
        T = R[2],
        _ = C - T - f * w;
      (w || _) && Pg(l, h) && ((y += _), (b += w));
      var D = h.parentNode;
      h = D && D.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? D.host : D;
    } while ((!v && h !== document.body) || (v && (o.contains(h) || o === h)));
    return (((S && Math.abs(y) < 1) || (!S && Math.abs(b) < 1)) && (m = !0), m);
  },
  Oi = function (l) {
    return "changedTouches" in l
      ? [l.changedTouches[0].clientX, l.changedTouches[0].clientY]
      : [0, 0];
  },
  Jm = function (l) {
    return [l.deltaX, l.deltaY];
  },
  Wm = function (l) {
    return l && "current" in l ? l.current : l;
  },
  rT = function (l, o) {
    return l[0] === o[0] && l[1] === o[1];
  },
  iT = function (l) {
    return `
  .block-interactivity-`
      .concat(
        l,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        l,
        ` {pointer-events: all;}
`,
      );
  },
  uT = 0,
  Oa = [];
function cT(l) {
  var o = p.useRef([]),
    r = p.useRef([0, 0]),
    i = p.useRef(),
    c = p.useState(uT++)[0],
    f = p.useState(Bg)[0],
    d = p.useRef(l);
  (p.useEffect(
    function () {
      d.current = l;
    },
    [l],
  ),
    p.useEffect(
      function () {
        if (l.inert) {
          document.body.classList.add("block-interactivity-".concat(c));
          var C = O1([l.lockRef.current], (l.shards || []).map(Wm), !0).filter(Boolean);
          return (
            C.forEach(function (T) {
              return T.classList.add("allow-interactivity-".concat(c));
            }),
            function () {
              (document.body.classList.remove("block-interactivity-".concat(c)),
                C.forEach(function (T) {
                  return T.classList.remove("allow-interactivity-".concat(c));
                }));
            }
          );
        }
      },
      [l.inert, l.lockRef.current, l.shards],
    ));
  var h = p.useCallback(function (C, T) {
      if (("touches" in C && C.touches.length === 2) || (C.type === "wheel" && C.ctrlKey))
        return !d.current.allowPinchZoom;
      var _ = Oi(C),
        D = r.current,
        N = "deltaX" in C ? C.deltaX : D[0] - _[0],
        B = "deltaY" in C ? C.deltaY : D[1] - _[1],
        K,
        F = C.target,
        V = Math.abs(N) > Math.abs(B) ? "h" : "v";
      if ("touches" in C && V === "h" && F.type === "range") return !1;
      var ee = window.getSelection(),
        te = ee && ee.anchorNode,
        le = te ? te === F || te.contains(F) : !1;
      if (le) return !1;
      var ne = Fm(V, F);
      if (!ne) return !0;
      if ((ne ? (K = V) : ((K = V === "v" ? "h" : "v"), (ne = Fm(V, F))), !ne)) return !1;
      if ((!i.current && "changedTouches" in C && (N || B) && (i.current = K), !K)) return !0;
      var ie = i.current || K;
      return oT(ie, T, C, ie === "h" ? N : B);
    }, []),
    v = p.useCallback(function (C) {
      var T = C;
      if (!(!Oa.length || Oa[Oa.length - 1] !== f)) {
        var _ = "deltaY" in T ? Jm(T) : Oi(T),
          D = o.current.filter(function (K) {
            return (
              K.name === T.type &&
              (K.target === T.target || T.target === K.shadowParent) &&
              rT(K.delta, _)
            );
          })[0];
        if (D && D.should) {
          T.cancelable && T.preventDefault();
          return;
        }
        if (!D) {
          var N = (d.current.shards || [])
              .map(Wm)
              .filter(Boolean)
              .filter(function (K) {
                return K.contains(T.target);
              }),
            B = N.length > 0 ? h(T, N[0]) : !d.current.noIsolation;
          B && T.cancelable && T.preventDefault();
        }
      }
    }, []),
    m = p.useCallback(function (C, T, _, D) {
      var N = { name: C, delta: T, target: _, should: D, shadowParent: sT(_) };
      (o.current.push(N),
        setTimeout(function () {
          o.current = o.current.filter(function (B) {
            return B !== N;
          });
        }, 1));
    }, []),
    S = p.useCallback(function (C) {
      ((r.current = Oi(C)), (i.current = void 0));
    }, []),
    y = p.useCallback(function (C) {
      m(C.type, Jm(C), C.target, h(C, l.lockRef.current));
    }, []),
    b = p.useCallback(function (C) {
      m(C.type, Oi(C), C.target, h(C, l.lockRef.current));
    }, []);
  p.useEffect(function () {
    return (
      Oa.push(f),
      l.setCallbacks({ onScrollCapture: y, onWheelCapture: y, onTouchMoveCapture: b }),
      document.addEventListener("wheel", v, Ma),
      document.addEventListener("touchmove", v, Ma),
      document.addEventListener("touchstart", S, Ma),
      function () {
        ((Oa = Oa.filter(function (C) {
          return C !== f;
        })),
          document.removeEventListener("wheel", v, Ma),
          document.removeEventListener("touchmove", v, Ma),
          document.removeEventListener("touchstart", S, Ma));
      }
    );
  }, []);
  var R = l.removeScrollBar,
    w = l.inert;
  return p.createElement(
    p.Fragment,
    null,
    w ? p.createElement(f, { styles: iT(c) }) : null,
    R ? p.createElement(J1, { noRelative: l.noRelative, gapMode: l.gapMode }) : null,
  );
}
function sT(l) {
  for (var o = null; l !== null; )
    (l instanceof ShadowRoot && ((o = l.host), (l = l.host)), (l = l.parentNode));
  return o;
}
const fT = P1(Ug, cT);
var lr = p.forwardRef(function (l, o) {
  return p.createElement(eu, on({}, l, { ref: o, sideCar: fT }));
});
lr.classNames = eu.classNames;
var dT = function (l) {
    if (typeof document > "u") return null;
    var o = Array.isArray(l) ? l[0] : l;
    return o.ownerDocument.body;
  },
  Da = new WeakMap(),
  Di = new WeakMap(),
  Ni = {},
  of = 0,
  Gg = function (l) {
    return l && (l.host || Gg(l.parentNode));
  },
  pT = function (l, o) {
    return o
      .map(function (r) {
        if (l.contains(r)) return r;
        var i = Gg(r);
        return i && l.contains(i)
          ? i
          : (console.error("aria-hidden", r, "in not contained inside", l, ". Doing nothing"),
            null);
      })
      .filter(function (r) {
        return !!r;
      });
  },
  hT = function (l, o, r, i) {
    var c = pT(o, Array.isArray(l) ? l : [l]);
    Ni[r] || (Ni[r] = new WeakMap());
    var f = Ni[r],
      d = [],
      h = new Set(),
      v = new Set(c),
      m = function (y) {
        !y || h.has(y) || (h.add(y), m(y.parentNode));
      };
    c.forEach(m);
    var S = function (y) {
      !y ||
        v.has(y) ||
        Array.prototype.forEach.call(y.children, function (b) {
          if (h.has(b)) S(b);
          else
            try {
              var R = b.getAttribute(i),
                w = R !== null && R !== "false",
                C = (Da.get(b) || 0) + 1,
                T = (f.get(b) || 0) + 1;
              (Da.set(b, C),
                f.set(b, T),
                d.push(b),
                C === 1 && w && Di.set(b, !0),
                T === 1 && b.setAttribute(r, "true"),
                w || b.setAttribute(i, "true"));
            } catch (_) {
              console.error("aria-hidden: cannot operate on ", b, _);
            }
        });
    };
    return (
      S(o),
      h.clear(),
      of++,
      function () {
        (d.forEach(function (y) {
          var b = Da.get(y) - 1,
            R = f.get(y) - 1;
          (Da.set(y, b),
            f.set(y, R),
            b || (Di.has(y) || y.removeAttribute(i), Di.delete(y)),
            R || y.removeAttribute(r));
        }),
          of--,
          of || ((Da = new WeakMap()), (Da = new WeakMap()), (Di = new WeakMap()), (Ni = {})));
      }
    );
  },
  tu = function (l, o, r) {
    r === void 0 && (r = "data-aria-hidden");
    var i = Array.from(Array.isArray(l) ? l : [l]),
      c = dT(l);
    return c
      ? (i.push.apply(i, Array.from(c.querySelectorAll("[aria-live], script"))),
        hT(i, c, r, "aria-hidden"))
      : function () {
          return null;
        };
  };
function vT(l) {
  const o = mT(l),
    r = p.forwardRef((i, c) => {
      const { children: f, ...d } = i,
        h = p.Children.toArray(f),
        v = h.find(yT);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
function mT(l) {
  const o = p.forwardRef((r, i) => {
    const { children: c, ...f } = r;
    if (p.isValidElement(c)) {
      const d = bT(c),
        h = ST(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var gT = Symbol("radix.slottable");
function yT(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === gT
  );
}
function ST(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function bT(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
var nu = "Dialog",
  [Yg, qg] = ut(nu),
  [xT, en] = Yg(nu),
  Xg = (l) => {
    const {
        __scopeDialog: o,
        children: r,
        open: i,
        defaultOpen: c,
        onOpenChange: f,
        modal: d = !0,
      } = l,
      h = p.useRef(null),
      v = p.useRef(null),
      [m, S] = Kt({ prop: i, defaultProp: c ?? !1, onChange: f, caller: nu });
    return E.jsx(xT, {
      scope: o,
      triggerRef: h,
      contentRef: v,
      contentId: zt(),
      titleId: zt(),
      descriptionId: zt(),
      open: m,
      onOpenChange: S,
      onOpenToggle: p.useCallback(() => S((y) => !y), [S]),
      modal: d,
      children: r,
    });
  };
Xg.displayName = nu;
var Ig = "DialogTrigger",
  Kg = p.forwardRef((l, o) => {
    const { __scopeDialog: r, ...i } = l,
      c = en(Ig, r),
      f = de(o, c.triggerRef);
    return E.jsx(re.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": c.open,
      "aria-controls": c.contentId,
      "data-state": qf(c.open),
      ...i,
      ref: f,
      onClick: Z(l.onClick, c.onOpenToggle),
    });
  });
Kg.displayName = Ig;
var Gf = "DialogPortal",
  [ET, $g] = Yg(Gf, { forceMount: void 0 }),
  Qg = (l) => {
    const { __scopeDialog: o, forceMount: r, children: i, container: c } = l,
      f = en(Gf, o);
    return E.jsx(ET, {
      scope: o,
      forceMount: r,
      children: p.Children.map(i, (d) =>
        E.jsx(et, {
          present: r || f.open,
          children: E.jsx(qa, { asChild: !0, container: c, children: d }),
        }),
      ),
    });
  };
Qg.displayName = Gf;
var Vi = "DialogOverlay",
  Zg = p.forwardRef((l, o) => {
    const r = $g(Vi, l.__scopeDialog),
      { forceMount: i = r.forceMount, ...c } = l,
      f = en(Vi, l.__scopeDialog);
    return f.modal
      ? E.jsx(et, { present: i || f.open, children: E.jsx(RT, { ...c, ref: o }) })
      : null;
  });
Zg.displayName = Vi;
var CT = vT("DialogOverlay.RemoveScroll"),
  RT = p.forwardRef((l, o) => {
    const { __scopeDialog: r, ...i } = l,
      c = en(Vi, r);
    return E.jsx(lr, {
      as: CT,
      allowPinchZoom: !0,
      shards: [c.contentRef],
      children: E.jsx(re.div, {
        "data-state": qf(c.open),
        ...i,
        ref: o,
        style: { pointerEvents: "auto", ...i.style },
      }),
    });
  }),
  Pl = "DialogContent",
  kg = p.forwardRef((l, o) => {
    const r = $g(Pl, l.__scopeDialog),
      { forceMount: i = r.forceMount, ...c } = l,
      f = en(Pl, l.__scopeDialog);
    return E.jsx(et, {
      present: i || f.open,
      children: f.modal ? E.jsx(TT, { ...c, ref: o }) : E.jsx(wT, { ...c, ref: o }),
    });
  });
kg.displayName = Pl;
var TT = p.forwardRef((l, o) => {
    const r = en(Pl, l.__scopeDialog),
      i = p.useRef(null),
      c = de(o, r.contentRef, i);
    return (
      p.useEffect(() => {
        const f = i.current;
        if (f) return tu(f);
      }, []),
      E.jsx(Fg, {
        ...l,
        ref: c,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Z(l.onCloseAutoFocus, (f) => {
          (f.preventDefault(), r.triggerRef.current?.focus());
        }),
        onPointerDownOutside: Z(l.onPointerDownOutside, (f) => {
          const d = f.detail.originalEvent,
            h = d.button === 0 && d.ctrlKey === !0;
          (d.button === 2 || h) && f.preventDefault();
        }),
        onFocusOutside: Z(l.onFocusOutside, (f) => f.preventDefault()),
      })
    );
  }),
  wT = p.forwardRef((l, o) => {
    const r = en(Pl, l.__scopeDialog),
      i = p.useRef(!1),
      c = p.useRef(!1);
    return E.jsx(Fg, {
      ...l,
      ref: o,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (f) => {
        (l.onCloseAutoFocus?.(f),
          f.defaultPrevented || (i.current || r.triggerRef.current?.focus(), f.preventDefault()),
          (i.current = !1),
          (c.current = !1));
      },
      onInteractOutside: (f) => {
        (l.onInteractOutside?.(f),
          f.defaultPrevented ||
            ((i.current = !0), f.detail.originalEvent.type === "pointerdown" && (c.current = !0)));
        const d = f.target;
        (r.triggerRef.current?.contains(d) && f.preventDefault(),
          f.detail.originalEvent.type === "focusin" && c.current && f.preventDefault());
      },
    });
  }),
  Fg = p.forwardRef((l, o) => {
    const { __scopeDialog: r, trapFocus: i, onOpenAutoFocus: c, onCloseAutoFocus: f, ...d } = l,
      h = en(Pl, r),
      v = p.useRef(null),
      m = de(o, v);
    return (
      Wi(),
      E.jsxs(E.Fragment, {
        children: [
          E.jsx(nr, {
            asChild: !0,
            loop: !0,
            trapped: i,
            onMountAutoFocus: c,
            onUnmountAutoFocus: f,
            children: E.jsx(Ya, {
              role: "dialog",
              id: h.contentId,
              "aria-describedby": h.descriptionId,
              "aria-labelledby": h.titleId,
              "data-state": qf(h.open),
              ...d,
              ref: m,
              onDismiss: () => h.onOpenChange(!1),
            }),
          }),
          E.jsxs(E.Fragment, {
            children: [
              E.jsx(_T, { titleId: h.titleId }),
              E.jsx(OT, { contentRef: v, descriptionId: h.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  Yf = "DialogTitle",
  Jg = p.forwardRef((l, o) => {
    const { __scopeDialog: r, ...i } = l,
      c = en(Yf, r);
    return E.jsx(re.h2, { id: c.titleId, ...i, ref: o });
  });
Jg.displayName = Yf;
var Wg = "DialogDescription",
  ey = p.forwardRef((l, o) => {
    const { __scopeDialog: r, ...i } = l,
      c = en(Wg, r);
    return E.jsx(re.p, { id: c.descriptionId, ...i, ref: o });
  });
ey.displayName = Wg;
var ty = "DialogClose",
  ny = p.forwardRef((l, o) => {
    const { __scopeDialog: r, ...i } = l,
      c = en(ty, r);
    return E.jsx(re.button, {
      type: "button",
      ...i,
      ref: o,
      onClick: Z(l.onClick, () => c.onOpenChange(!1)),
    });
  });
ny.displayName = ty;
function qf(l) {
  return l ? "open" : "closed";
}
var ly = "DialogTitleWarning",
  [AT, ay] = FR(ly, { contentName: Pl, titleName: Yf, docsSlug: "dialog" }),
  _T = ({ titleId: l }) => {
    const o = ay(ly),
      r = `\`${o.contentName}\` requires a \`${o.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${o.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${o.docsSlug}`;
    return (
      p.useEffect(() => {
        l && (document.getElementById(l) || console.error(r));
      }, [r, l]),
      null
    );
  },
  MT = "DialogDescriptionWarning",
  OT = ({ contentRef: l, descriptionId: o }) => {
    const i = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${ay(MT).contentName}}.`;
    return (
      p.useEffect(() => {
        const c = l.current?.getAttribute("aria-describedby");
        o && c && (document.getElementById(o) || console.warn(i));
      }, [i, l, o]),
      null
    );
  },
  DT = Xg,
  NT = Kg,
  zT = Qg,
  jT = Zg,
  LT = kg,
  UT = Jg,
  BT = ey,
  oy = ny;
const HT = ["top", "right", "bottom", "left"],
  fl = Math.min,
  Nt = Math.max,
  Gi = Math.round,
  zi = Math.floor,
  un = (l) => ({ x: l, y: l }),
  PT = { left: "right", right: "left", bottom: "top", top: "bottom" };
function Sf(l, o, r) {
  return Nt(l, fl(o, r));
}
function Dn(l, o) {
  return typeof l == "function" ? l(o) : l;
}
function Nn(l) {
  return l.split("-")[0];
}
function Xa(l) {
  return l.split("-")[1];
}
function Xf(l) {
  return l === "x" ? "y" : "x";
}
function If(l) {
  return l === "y" ? "height" : "width";
}
function rn(l) {
  const o = l[0];
  return o === "t" || o === "b" ? "y" : "x";
}
function Kf(l) {
  return Xf(rn(l));
}
function VT(l, o, r) {
  r === void 0 && (r = !1);
  const i = Xa(l),
    c = Kf(l),
    f = If(c);
  let d =
    c === "x" ? (i === (r ? "end" : "start") ? "right" : "left") : i === "start" ? "bottom" : "top";
  return (o.reference[f] > o.floating[f] && (d = Yi(d)), [d, Yi(d)]);
}
function GT(l) {
  const o = Yi(l);
  return [bf(l), o, bf(o)];
}
function bf(l) {
  return l.includes("start") ? l.replace("start", "end") : l.replace("end", "start");
}
const eg = ["left", "right"],
  tg = ["right", "left"],
  YT = ["top", "bottom"],
  qT = ["bottom", "top"];
function XT(l, o, r) {
  switch (l) {
    case "top":
    case "bottom":
      return r ? (o ? tg : eg) : o ? eg : tg;
    case "left":
    case "right":
      return o ? YT : qT;
    default:
      return [];
  }
}
function IT(l, o, r, i) {
  const c = Xa(l);
  let f = XT(Nn(l), r === "start", i);
  return (c && ((f = f.map((d) => d + "-" + c)), o && (f = f.concat(f.map(bf)))), f);
}
function Yi(l) {
  const o = Nn(l);
  return PT[o] + l.slice(o.length);
}
function KT(l) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...l };
}
function ry(l) {
  return typeof l != "number" ? KT(l) : { top: l, right: l, bottom: l, left: l };
}
function qi(l) {
  const { x: o, y: r, width: i, height: c } = l;
  return { width: i, height: c, top: r, left: o, right: o + i, bottom: r + c, x: o, y: r };
}
function ng(l, o, r) {
  let { reference: i, floating: c } = l;
  const f = rn(o),
    d = Kf(o),
    h = If(d),
    v = Nn(o),
    m = f === "y",
    S = i.x + i.width / 2 - c.width / 2,
    y = i.y + i.height / 2 - c.height / 2,
    b = i[h] / 2 - c[h] / 2;
  let R;
  switch (v) {
    case "top":
      R = { x: S, y: i.y - c.height };
      break;
    case "bottom":
      R = { x: S, y: i.y + i.height };
      break;
    case "right":
      R = { x: i.x + i.width, y };
      break;
    case "left":
      R = { x: i.x - c.width, y };
      break;
    default:
      R = { x: i.x, y: i.y };
  }
  switch (Xa(o)) {
    case "start":
      R[d] -= b * (r && m ? -1 : 1);
      break;
    case "end":
      R[d] += b * (r && m ? -1 : 1);
      break;
  }
  return R;
}
async function $T(l, o) {
  var r;
  o === void 0 && (o = {});
  const { x: i, y: c, platform: f, rects: d, elements: h, strategy: v } = l,
    {
      boundary: m = "clippingAncestors",
      rootBoundary: S = "viewport",
      elementContext: y = "floating",
      altBoundary: b = !1,
      padding: R = 0,
    } = Dn(o, l),
    w = ry(R),
    T = h[b ? (y === "floating" ? "reference" : "floating") : y],
    _ = qi(
      await f.getClippingRect({
        element:
          (r = await (f.isElement == null ? void 0 : f.isElement(T))) == null || r
            ? T
            : T.contextElement ||
              (await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(h.floating))),
        boundary: m,
        rootBoundary: S,
        strategy: v,
      }),
    ),
    D =
      y === "floating"
        ? { x: i, y: c, width: d.floating.width, height: d.floating.height }
        : d.reference,
    N = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(h.floating)),
    B = (await (f.isElement == null ? void 0 : f.isElement(N)))
      ? (await (f.getScale == null ? void 0 : f.getScale(N))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    K = qi(
      f.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: h,
            rect: D,
            offsetParent: N,
            strategy: v,
          })
        : D,
    );
  return {
    top: (_.top - K.top + w.top) / B.y,
    bottom: (K.bottom - _.bottom + w.bottom) / B.y,
    left: (_.left - K.left + w.left) / B.x,
    right: (K.right - _.right + w.right) / B.x,
  };
}
const QT = 50,
  ZT = async (l, o, r) => {
    const {
        placement: i = "bottom",
        strategy: c = "absolute",
        middleware: f = [],
        platform: d,
      } = r,
      h = d.detectOverflow ? d : { ...d, detectOverflow: $T },
      v = await (d.isRTL == null ? void 0 : d.isRTL(o));
    let m = await d.getElementRects({ reference: l, floating: o, strategy: c }),
      { x: S, y } = ng(m, i, v),
      b = i,
      R = 0;
    const w = {};
    for (let C = 0; C < f.length; C++) {
      const T = f[C];
      if (!T) continue;
      const { name: _, fn: D } = T,
        {
          x: N,
          y: B,
          data: K,
          reset: F,
        } = await D({
          x: S,
          y,
          initialPlacement: i,
          placement: b,
          strategy: c,
          middlewareData: w,
          rects: m,
          platform: h,
          elements: { reference: l, floating: o },
        });
      ((S = N ?? S),
        (y = B ?? y),
        (w[_] = { ...w[_], ...K }),
        F &&
          R < QT &&
          (R++,
          typeof F == "object" &&
            (F.placement && (b = F.placement),
            F.rects &&
              (m =
                F.rects === !0
                  ? await d.getElementRects({ reference: l, floating: o, strategy: c })
                  : F.rects),
            ({ x: S, y } = ng(m, b, v))),
          (C = -1)));
    }
    return { x: S, y, placement: b, strategy: c, middlewareData: w };
  },
  kT = (l) => ({
    name: "arrow",
    options: l,
    async fn(o) {
      const { x: r, y: i, placement: c, rects: f, platform: d, elements: h, middlewareData: v } = o,
        { element: m, padding: S = 0 } = Dn(l, o) || {};
      if (m == null) return {};
      const y = ry(S),
        b = { x: r, y: i },
        R = Kf(c),
        w = If(R),
        C = await d.getDimensions(m),
        T = R === "y",
        _ = T ? "top" : "left",
        D = T ? "bottom" : "right",
        N = T ? "clientHeight" : "clientWidth",
        B = f.reference[w] + f.reference[R] - b[R] - f.floating[w],
        K = b[R] - f.reference[R],
        F = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(m));
      let V = F ? F[N] : 0;
      (!V || !(await (d.isElement == null ? void 0 : d.isElement(F)))) &&
        (V = h.floating[N] || f.floating[w]);
      const ee = B / 2 - K / 2,
        te = V / 2 - C[w] / 2 - 1,
        le = fl(y[_], te),
        ne = fl(y[D], te),
        ie = le,
        ve = V - C[w] - ne,
        pe = V / 2 - C[w] / 2 + ee,
        ge = Sf(ie, pe, ve),
        j =
          !v.arrow &&
          Xa(c) != null &&
          pe !== ge &&
          f.reference[w] / 2 - (pe < ie ? le : ne) - C[w] / 2 < 0,
        I = j ? (pe < ie ? pe - ie : pe - ve) : 0;
      return {
        [R]: b[R] + I,
        data: { [R]: ge, centerOffset: pe - ge - I, ...(j && { alignmentOffset: I }) },
        reset: j,
      };
    },
  }),
  FT = function (l) {
    return (
      l === void 0 && (l = {}),
      {
        name: "flip",
        options: l,
        async fn(o) {
          var r, i;
          const {
              placement: c,
              middlewareData: f,
              rects: d,
              initialPlacement: h,
              platform: v,
              elements: m,
            } = o,
            {
              mainAxis: S = !0,
              crossAxis: y = !0,
              fallbackPlacements: b,
              fallbackStrategy: R = "bestFit",
              fallbackAxisSideDirection: w = "none",
              flipAlignment: C = !0,
              ...T
            } = Dn(l, o);
          if ((r = f.arrow) != null && r.alignmentOffset) return {};
          const _ = Nn(c),
            D = rn(h),
            N = Nn(h) === h,
            B = await (v.isRTL == null ? void 0 : v.isRTL(m.floating)),
            K = b || (N || !C ? [Yi(h)] : GT(h)),
            F = w !== "none";
          !b && F && K.push(...IT(h, C, w, B));
          const V = [h, ...K],
            ee = await v.detectOverflow(o, T),
            te = [];
          let le = ((i = f.flip) == null ? void 0 : i.overflows) || [];
          if ((S && te.push(ee[_]), y)) {
            const pe = VT(c, d, B);
            te.push(ee[pe[0]], ee[pe[1]]);
          }
          if (((le = [...le, { placement: c, overflows: te }]), !te.every((pe) => pe <= 0))) {
            var ne, ie;
            const pe = (((ne = f.flip) == null ? void 0 : ne.index) || 0) + 1,
              ge = V[pe];
            if (
              ge &&
              (!(y === "alignment" ? D !== rn(ge) : !1) ||
                le.every(($) => (rn($.placement) === D ? $.overflows[0] > 0 : !0)))
            )
              return { data: { index: pe, overflows: le }, reset: { placement: ge } };
            let j =
              (ie = le
                .filter((I) => I.overflows[0] <= 0)
                .sort((I, $) => I.overflows[1] - $.overflows[1])[0]) == null
                ? void 0
                : ie.placement;
            if (!j)
              switch (R) {
                case "bestFit": {
                  var ve;
                  const I =
                    (ve = le
                      .filter(($) => {
                        if (F) {
                          const Q = rn($.placement);
                          return Q === D || Q === "y";
                        }
                        return !0;
                      })
                      .map(($) => [
                        $.placement,
                        $.overflows.filter((Q) => Q > 0).reduce((Q, he) => Q + he, 0),
                      ])
                      .sort(($, Q) => $[1] - Q[1])[0]) == null
                      ? void 0
                      : ve[0];
                  I && (j = I);
                  break;
                }
                case "initialPlacement":
                  j = h;
                  break;
              }
            if (c !== j) return { reset: { placement: j } };
          }
          return {};
        },
      }
    );
  };
function lg(l, o) {
  return {
    top: l.top - o.height,
    right: l.right - o.width,
    bottom: l.bottom - o.height,
    left: l.left - o.width,
  };
}
function ag(l) {
  return HT.some((o) => l[o] >= 0);
}
const JT = function (l) {
    return (
      l === void 0 && (l = {}),
      {
        name: "hide",
        options: l,
        async fn(o) {
          const { rects: r, platform: i } = o,
            { strategy: c = "referenceHidden", ...f } = Dn(l, o);
          switch (c) {
            case "referenceHidden": {
              const d = await i.detectOverflow(o, { ...f, elementContext: "reference" }),
                h = lg(d, r.reference);
              return { data: { referenceHiddenOffsets: h, referenceHidden: ag(h) } };
            }
            case "escaped": {
              const d = await i.detectOverflow(o, { ...f, altBoundary: !0 }),
                h = lg(d, r.floating);
              return { data: { escapedOffsets: h, escaped: ag(h) } };
            }
            default:
              return {};
          }
        },
      }
    );
  },
  iy = new Set(["left", "top"]);
async function WT(l, o) {
  const { placement: r, platform: i, elements: c } = l,
    f = await (i.isRTL == null ? void 0 : i.isRTL(c.floating)),
    d = Nn(r),
    h = Xa(r),
    v = rn(r) === "y",
    m = iy.has(d) ? -1 : 1,
    S = f && v ? -1 : 1,
    y = Dn(o, l);
  let {
    mainAxis: b,
    crossAxis: R,
    alignmentAxis: w,
  } = typeof y == "number"
    ? { mainAxis: y, crossAxis: 0, alignmentAxis: null }
    : { mainAxis: y.mainAxis || 0, crossAxis: y.crossAxis || 0, alignmentAxis: y.alignmentAxis };
  return (
    h && typeof w == "number" && (R = h === "end" ? w * -1 : w),
    v ? { x: R * S, y: b * m } : { x: b * m, y: R * S }
  );
}
const ew = function (l) {
    return (
      l === void 0 && (l = 0),
      {
        name: "offset",
        options: l,
        async fn(o) {
          var r, i;
          const { x: c, y: f, placement: d, middlewareData: h } = o,
            v = await WT(o, l);
          return d === ((r = h.offset) == null ? void 0 : r.placement) &&
            (i = h.arrow) != null &&
            i.alignmentOffset
            ? {}
            : { x: c + v.x, y: f + v.y, data: { ...v, placement: d } };
        },
      }
    );
  },
  tw = function (l) {
    return (
      l === void 0 && (l = {}),
      {
        name: "shift",
        options: l,
        async fn(o) {
          const { x: r, y: i, placement: c, platform: f } = o,
            {
              mainAxis: d = !0,
              crossAxis: h = !1,
              limiter: v = {
                fn: (_) => {
                  let { x: D, y: N } = _;
                  return { x: D, y: N };
                },
              },
              ...m
            } = Dn(l, o),
            S = { x: r, y: i },
            y = await f.detectOverflow(o, m),
            b = rn(Nn(c)),
            R = Xf(b);
          let w = S[R],
            C = S[b];
          if (d) {
            const _ = R === "y" ? "top" : "left",
              D = R === "y" ? "bottom" : "right",
              N = w + y[_],
              B = w - y[D];
            w = Sf(N, w, B);
          }
          if (h) {
            const _ = b === "y" ? "top" : "left",
              D = b === "y" ? "bottom" : "right",
              N = C + y[_],
              B = C - y[D];
            C = Sf(N, C, B);
          }
          const T = v.fn({ ...o, [R]: w, [b]: C });
          return { ...T, data: { x: T.x - r, y: T.y - i, enabled: { [R]: d, [b]: h } } };
        },
      }
    );
  },
  nw = function (l) {
    return (
      l === void 0 && (l = {}),
      {
        options: l,
        fn(o) {
          const { x: r, y: i, placement: c, rects: f, middlewareData: d } = o,
            { offset: h = 0, mainAxis: v = !0, crossAxis: m = !0 } = Dn(l, o),
            S = { x: r, y: i },
            y = rn(c),
            b = Xf(y);
          let R = S[b],
            w = S[y];
          const C = Dn(h, o),
            T =
              typeof C == "number"
                ? { mainAxis: C, crossAxis: 0 }
                : { mainAxis: 0, crossAxis: 0, ...C };
          if (v) {
            const N = b === "y" ? "height" : "width",
              B = f.reference[b] - f.floating[N] + T.mainAxis,
              K = f.reference[b] + f.reference[N] - T.mainAxis;
            R < B ? (R = B) : R > K && (R = K);
          }
          if (m) {
            var _, D;
            const N = b === "y" ? "width" : "height",
              B = iy.has(Nn(c)),
              K =
                f.reference[y] -
                f.floating[N] +
                ((B && ((_ = d.offset) == null ? void 0 : _[y])) || 0) +
                (B ? 0 : T.crossAxis),
              F =
                f.reference[y] +
                f.reference[N] +
                (B ? 0 : ((D = d.offset) == null ? void 0 : D[y]) || 0) -
                (B ? T.crossAxis : 0);
            w < K ? (w = K) : w > F && (w = F);
          }
          return { [b]: R, [y]: w };
        },
      }
    );
  },
  lw = function (l) {
    return (
      l === void 0 && (l = {}),
      {
        name: "size",
        options: l,
        async fn(o) {
          var r, i;
          const { placement: c, rects: f, platform: d, elements: h } = o,
            { apply: v = () => {}, ...m } = Dn(l, o),
            S = await d.detectOverflow(o, m),
            y = Nn(c),
            b = Xa(c),
            R = rn(c) === "y",
            { width: w, height: C } = f.floating;
          let T, _;
          y === "top" || y === "bottom"
            ? ((T = y),
              (_ =
                b === ((await (d.isRTL == null ? void 0 : d.isRTL(h.floating))) ? "start" : "end")
                  ? "left"
                  : "right"))
            : ((_ = y), (T = b === "end" ? "top" : "bottom"));
          const D = C - S.top - S.bottom,
            N = w - S.left - S.right,
            B = fl(C - S[T], D),
            K = fl(w - S[_], N),
            F = !o.middlewareData.shift;
          let V = B,
            ee = K;
          if (
            ((r = o.middlewareData.shift) != null && r.enabled.x && (ee = N),
            (i = o.middlewareData.shift) != null && i.enabled.y && (V = D),
            F && !b)
          ) {
            const le = Nt(S.left, 0),
              ne = Nt(S.right, 0),
              ie = Nt(S.top, 0),
              ve = Nt(S.bottom, 0);
            R
              ? (ee = w - 2 * (le !== 0 || ne !== 0 ? le + ne : Nt(S.left, S.right)))
              : (V = C - 2 * (ie !== 0 || ve !== 0 ? ie + ve : Nt(S.top, S.bottom)));
          }
          await v({ ...o, availableWidth: ee, availableHeight: V });
          const te = await d.getDimensions(h.floating);
          return w !== te.width || C !== te.height ? { reset: { rects: !0 } } : {};
        },
      }
    );
  };
function lu() {
  return typeof window < "u";
}
function Ia(l) {
  return uy(l) ? (l.nodeName || "").toLowerCase() : "#document";
}
function jt(l) {
  var o;
  return (l == null || (o = l.ownerDocument) == null ? void 0 : o.defaultView) || window;
}
function fn(l) {
  var o;
  return (o = (uy(l) ? l.ownerDocument : l.document) || window.document) == null
    ? void 0
    : o.documentElement;
}
function uy(l) {
  return lu() ? l instanceof Node || l instanceof jt(l).Node : !1;
}
function Jt(l) {
  return lu() ? l instanceof Element || l instanceof jt(l).Element : !1;
}
function zn(l) {
  return lu() ? l instanceof HTMLElement || l instanceof jt(l).HTMLElement : !1;
}
function og(l) {
  return !lu() || typeof ShadowRoot > "u"
    ? !1
    : l instanceof ShadowRoot || l instanceof jt(l).ShadowRoot;
}
function ar(l) {
  const { overflow: o, overflowX: r, overflowY: i, display: c } = Wt(l);
  return /auto|scroll|overlay|hidden|clip/.test(o + i + r) && c !== "inline" && c !== "contents";
}
function aw(l) {
  return /^(table|td|th)$/.test(Ia(l));
}
function au(l) {
  try {
    if (l.matches(":popover-open")) return !0;
  } catch {}
  try {
    return l.matches(":modal");
  } catch {
    return !1;
  }
}
const ow = /transform|translate|scale|rotate|perspective|filter/,
  rw = /paint|layout|strict|content/,
  Hl = (l) => !!l && l !== "none";
let rf;
function $f(l) {
  const o = Jt(l) ? Wt(l) : l;
  return (
    Hl(o.transform) ||
    Hl(o.translate) ||
    Hl(o.scale) ||
    Hl(o.rotate) ||
    Hl(o.perspective) ||
    (!Qf() && (Hl(o.backdropFilter) || Hl(o.filter))) ||
    ow.test(o.willChange || "") ||
    rw.test(o.contain || "")
  );
}
function iw(l) {
  let o = dl(l);
  for (; zn(o) && !La(o); ) {
    if ($f(o)) return o;
    if (au(o)) return null;
    o = dl(o);
  }
  return null;
}
function Qf() {
  return (
    rf == null &&
      (rf = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")),
    rf
  );
}
function La(l) {
  return /^(html|body|#document)$/.test(Ia(l));
}
function Wt(l) {
  return jt(l).getComputedStyle(l);
}
function ou(l) {
  return Jt(l)
    ? { scrollLeft: l.scrollLeft, scrollTop: l.scrollTop }
    : { scrollLeft: l.scrollX, scrollTop: l.scrollY };
}
function dl(l) {
  if (Ia(l) === "html") return l;
  const o = l.assignedSlot || l.parentNode || (og(l) && l.host) || fn(l);
  return og(o) ? o.host : o;
}
function cy(l) {
  const o = dl(l);
  return La(o) ? (l.ownerDocument ? l.ownerDocument.body : l.body) : zn(o) && ar(o) ? o : cy(o);
}
function Zo(l, o, r) {
  var i;
  (o === void 0 && (o = []), r === void 0 && (r = !0));
  const c = cy(l),
    f = c === ((i = l.ownerDocument) == null ? void 0 : i.body),
    d = jt(c);
  if (f) {
    const h = xf(d);
    return o.concat(d, d.visualViewport || [], ar(c) ? c : [], h && r ? Zo(h) : []);
  } else return o.concat(c, Zo(c, [], r));
}
function xf(l) {
  return l.parent && Object.getPrototypeOf(l.parent) ? l.frameElement : null;
}
function sy(l) {
  const o = Wt(l);
  let r = parseFloat(o.width) || 0,
    i = parseFloat(o.height) || 0;
  const c = zn(l),
    f = c ? l.offsetWidth : r,
    d = c ? l.offsetHeight : i,
    h = Gi(r) !== f || Gi(i) !== d;
  return (h && ((r = f), (i = d)), { width: r, height: i, $: h });
}
function Zf(l) {
  return Jt(l) ? l : l.contextElement;
}
function za(l) {
  const o = Zf(l);
  if (!zn(o)) return un(1);
  const r = o.getBoundingClientRect(),
    { width: i, height: c, $: f } = sy(o);
  let d = (f ? Gi(r.width) : r.width) / i,
    h = (f ? Gi(r.height) : r.height) / c;
  return (
    (!d || !Number.isFinite(d)) && (d = 1),
    (!h || !Number.isFinite(h)) && (h = 1),
    { x: d, y: h }
  );
}
const uw = un(0);
function fy(l) {
  const o = jt(l);
  return !Qf() || !o.visualViewport
    ? uw
    : { x: o.visualViewport.offsetLeft, y: o.visualViewport.offsetTop };
}
function cw(l, o, r) {
  return (o === void 0 && (o = !1), !r || (o && r !== jt(l)) ? !1 : o);
}
function Vl(l, o, r, i) {
  (o === void 0 && (o = !1), r === void 0 && (r = !1));
  const c = l.getBoundingClientRect(),
    f = Zf(l);
  let d = un(1);
  o && (i ? Jt(i) && (d = za(i)) : (d = za(l)));
  const h = cw(f, r, i) ? fy(f) : un(0);
  let v = (c.left + h.x) / d.x,
    m = (c.top + h.y) / d.y,
    S = c.width / d.x,
    y = c.height / d.y;
  if (f) {
    const b = jt(f),
      R = i && Jt(i) ? jt(i) : i;
    let w = b,
      C = xf(w);
    for (; C && i && R !== w; ) {
      const T = za(C),
        _ = C.getBoundingClientRect(),
        D = Wt(C),
        N = _.left + (C.clientLeft + parseFloat(D.paddingLeft)) * T.x,
        B = _.top + (C.clientTop + parseFloat(D.paddingTop)) * T.y;
      ((v *= T.x),
        (m *= T.y),
        (S *= T.x),
        (y *= T.y),
        (v += N),
        (m += B),
        (w = jt(C)),
        (C = xf(w)));
    }
  }
  return qi({ width: S, height: y, x: v, y: m });
}
function ru(l, o) {
  const r = ou(l).scrollLeft;
  return o ? o.left + r : Vl(fn(l)).left + r;
}
function dy(l, o) {
  const r = l.getBoundingClientRect(),
    i = r.left + o.scrollLeft - ru(l, r),
    c = r.top + o.scrollTop;
  return { x: i, y: c };
}
function sw(l) {
  let { elements: o, rect: r, offsetParent: i, strategy: c } = l;
  const f = c === "fixed",
    d = fn(i),
    h = o ? au(o.floating) : !1;
  if (i === d || (h && f)) return r;
  let v = { scrollLeft: 0, scrollTop: 0 },
    m = un(1);
  const S = un(0),
    y = zn(i);
  if ((y || (!y && !f)) && ((Ia(i) !== "body" || ar(d)) && (v = ou(i)), y)) {
    const R = Vl(i);
    ((m = za(i)), (S.x = R.x + i.clientLeft), (S.y = R.y + i.clientTop));
  }
  const b = d && !y && !f ? dy(d, v) : un(0);
  return {
    width: r.width * m.x,
    height: r.height * m.y,
    x: r.x * m.x - v.scrollLeft * m.x + S.x + b.x,
    y: r.y * m.y - v.scrollTop * m.y + S.y + b.y,
  };
}
function fw(l) {
  return Array.from(l.getClientRects());
}
function dw(l) {
  const o = fn(l),
    r = ou(l),
    i = l.ownerDocument.body,
    c = Nt(o.scrollWidth, o.clientWidth, i.scrollWidth, i.clientWidth),
    f = Nt(o.scrollHeight, o.clientHeight, i.scrollHeight, i.clientHeight);
  let d = -r.scrollLeft + ru(l);
  const h = -r.scrollTop;
  return (
    Wt(i).direction === "rtl" && (d += Nt(o.clientWidth, i.clientWidth) - c),
    { width: c, height: f, x: d, y: h }
  );
}
const rg = 25;
function pw(l, o) {
  const r = jt(l),
    i = fn(l),
    c = r.visualViewport;
  let f = i.clientWidth,
    d = i.clientHeight,
    h = 0,
    v = 0;
  if (c) {
    ((f = c.width), (d = c.height));
    const S = Qf();
    (!S || (S && o === "fixed")) && ((h = c.offsetLeft), (v = c.offsetTop));
  }
  const m = ru(i);
  if (m <= 0) {
    const S = i.ownerDocument,
      y = S.body,
      b = getComputedStyle(y),
      R =
        (S.compatMode === "CSS1Compat" && parseFloat(b.marginLeft) + parseFloat(b.marginRight)) ||
        0,
      w = Math.abs(i.clientWidth - y.clientWidth - R);
    w <= rg && (f -= w);
  } else m <= rg && (f += m);
  return { width: f, height: d, x: h, y: v };
}
function hw(l, o) {
  const r = Vl(l, !0, o === "fixed"),
    i = r.top + l.clientTop,
    c = r.left + l.clientLeft,
    f = zn(l) ? za(l) : un(1),
    d = l.clientWidth * f.x,
    h = l.clientHeight * f.y,
    v = c * f.x,
    m = i * f.y;
  return { width: d, height: h, x: v, y: m };
}
function ig(l, o, r) {
  let i;
  if (o === "viewport") i = pw(l, r);
  else if (o === "document") i = dw(fn(l));
  else if (Jt(o)) i = hw(o, r);
  else {
    const c = fy(l);
    i = { x: o.x - c.x, y: o.y - c.y, width: o.width, height: o.height };
  }
  return qi(i);
}
function py(l, o) {
  const r = dl(l);
  return r === o || !Jt(r) || La(r) ? !1 : Wt(r).position === "fixed" || py(r, o);
}
function vw(l, o) {
  const r = o.get(l);
  if (r) return r;
  let i = Zo(l, [], !1).filter((h) => Jt(h) && Ia(h) !== "body"),
    c = null;
  const f = Wt(l).position === "fixed";
  let d = f ? dl(l) : l;
  for (; Jt(d) && !La(d); ) {
    const h = Wt(d),
      v = $f(d);
    (!v && h.position === "fixed" && (c = null),
      (
        f
          ? !v && !c
          : (!v &&
              h.position === "static" &&
              !!c &&
              (c.position === "absolute" || c.position === "fixed")) ||
            (ar(d) && !v && py(l, d))
      )
        ? (i = i.filter((S) => S !== d))
        : (c = h),
      (d = dl(d)));
  }
  return (o.set(l, i), i);
}
function mw(l) {
  let { element: o, boundary: r, rootBoundary: i, strategy: c } = l;
  const d = [...(r === "clippingAncestors" ? (au(o) ? [] : vw(o, this._c)) : [].concat(r)), i],
    h = ig(o, d[0], c);
  let v = h.top,
    m = h.right,
    S = h.bottom,
    y = h.left;
  for (let b = 1; b < d.length; b++) {
    const R = ig(o, d[b], c);
    ((v = Nt(R.top, v)), (m = fl(R.right, m)), (S = fl(R.bottom, S)), (y = Nt(R.left, y)));
  }
  return { width: m - y, height: S - v, x: y, y: v };
}
function gw(l) {
  const { width: o, height: r } = sy(l);
  return { width: o, height: r };
}
function yw(l, o, r) {
  const i = zn(o),
    c = fn(o),
    f = r === "fixed",
    d = Vl(l, !0, f, o);
  let h = { scrollLeft: 0, scrollTop: 0 };
  const v = un(0);
  function m() {
    v.x = ru(c);
  }
  if (i || (!i && !f))
    if (((Ia(o) !== "body" || ar(c)) && (h = ou(o)), i)) {
      const R = Vl(o, !0, f, o);
      ((v.x = R.x + o.clientLeft), (v.y = R.y + o.clientTop));
    } else c && m();
  f && !i && c && m();
  const S = c && !i && !f ? dy(c, h) : un(0),
    y = d.left + h.scrollLeft - v.x - S.x,
    b = d.top + h.scrollTop - v.y - S.y;
  return { x: y, y: b, width: d.width, height: d.height };
}
function uf(l) {
  return Wt(l).position === "static";
}
function ug(l, o) {
  if (!zn(l) || Wt(l).position === "fixed") return null;
  if (o) return o(l);
  let r = l.offsetParent;
  return (fn(l) === r && (r = r.ownerDocument.body), r);
}
function hy(l, o) {
  const r = jt(l);
  if (au(l)) return r;
  if (!zn(l)) {
    let c = dl(l);
    for (; c && !La(c); ) {
      if (Jt(c) && !uf(c)) return c;
      c = dl(c);
    }
    return r;
  }
  let i = ug(l, o);
  for (; i && aw(i) && uf(i); ) i = ug(i, o);
  return i && La(i) && uf(i) && !$f(i) ? r : i || iw(l) || r;
}
const Sw = async function (l) {
  const o = this.getOffsetParent || hy,
    r = this.getDimensions,
    i = await r(l.floating);
  return {
    reference: yw(l.reference, await o(l.floating), l.strategy),
    floating: { x: 0, y: 0, width: i.width, height: i.height },
  };
};
function bw(l) {
  return Wt(l).direction === "rtl";
}
const xw = {
  convertOffsetParentRelativeRectToViewportRelativeRect: sw,
  getDocumentElement: fn,
  getClippingRect: mw,
  getOffsetParent: hy,
  getElementRects: Sw,
  getClientRects: fw,
  getDimensions: gw,
  getScale: za,
  isElement: Jt,
  isRTL: bw,
};
function vy(l, o) {
  return l.x === o.x && l.y === o.y && l.width === o.width && l.height === o.height;
}
function Ew(l, o) {
  let r = null,
    i;
  const c = fn(l);
  function f() {
    var h;
    (clearTimeout(i), (h = r) == null || h.disconnect(), (r = null));
  }
  function d(h, v) {
    (h === void 0 && (h = !1), v === void 0 && (v = 1), f());
    const m = l.getBoundingClientRect(),
      { left: S, top: y, width: b, height: R } = m;
    if ((h || o(), !b || !R)) return;
    const w = zi(y),
      C = zi(c.clientWidth - (S + b)),
      T = zi(c.clientHeight - (y + R)),
      _ = zi(S),
      N = {
        rootMargin: -w + "px " + -C + "px " + -T + "px " + -_ + "px",
        threshold: Nt(0, fl(1, v)) || 1,
      };
    let B = !0;
    function K(F) {
      const V = F[0].intersectionRatio;
      if (V !== v) {
        if (!B) return d();
        V
          ? d(!1, V)
          : (i = setTimeout(() => {
              d(!1, 1e-7);
            }, 1e3));
      }
      (V === 1 && !vy(m, l.getBoundingClientRect()) && d(), (B = !1));
    }
    try {
      r = new IntersectionObserver(K, { ...N, root: c.ownerDocument });
    } catch {
      r = new IntersectionObserver(K, N);
    }
    r.observe(l);
  }
  return (d(!0), f);
}
function Cw(l, o, r, i) {
  i === void 0 && (i = {});
  const {
      ancestorScroll: c = !0,
      ancestorResize: f = !0,
      elementResize: d = typeof ResizeObserver == "function",
      layoutShift: h = typeof IntersectionObserver == "function",
      animationFrame: v = !1,
    } = i,
    m = Zf(l),
    S = c || f ? [...(m ? Zo(m) : []), ...(o ? Zo(o) : [])] : [];
  S.forEach((_) => {
    (c && _.addEventListener("scroll", r, { passive: !0 }), f && _.addEventListener("resize", r));
  });
  const y = m && h ? Ew(m, r) : null;
  let b = -1,
    R = null;
  d &&
    ((R = new ResizeObserver((_) => {
      let [D] = _;
      (D &&
        D.target === m &&
        R &&
        o &&
        (R.unobserve(o),
        cancelAnimationFrame(b),
        (b = requestAnimationFrame(() => {
          var N;
          (N = R) == null || N.observe(o);
        }))),
        r());
    })),
    m && !v && R.observe(m),
    o && R.observe(o));
  let w,
    C = v ? Vl(l) : null;
  v && T();
  function T() {
    const _ = Vl(l);
    (C && !vy(C, _) && r(), (C = _), (w = requestAnimationFrame(T)));
  }
  return (
    r(),
    () => {
      var _;
      (S.forEach((D) => {
        (c && D.removeEventListener("scroll", r), f && D.removeEventListener("resize", r));
      }),
        y?.(),
        (_ = R) == null || _.disconnect(),
        (R = null),
        v && cancelAnimationFrame(w));
    }
  );
}
const Rw = ew,
  Tw = tw,
  ww = FT,
  Aw = lw,
  _w = JT,
  cg = kT,
  Mw = nw,
  Ow = (l, o, r) => {
    const i = new Map(),
      c = { platform: xw, ...r },
      f = { ...c.platform, _c: i };
    return ZT(l, o, { ...c, platform: f });
  };
var Dw = typeof document < "u",
  Nw = function () {},
  Bi = Dw ? p.useLayoutEffect : Nw;
function Xi(l, o) {
  if (l === o) return !0;
  if (typeof l != typeof o) return !1;
  if (typeof l == "function" && l.toString() === o.toString()) return !0;
  let r, i, c;
  if (l && o && typeof l == "object") {
    if (Array.isArray(l)) {
      if (((r = l.length), r !== o.length)) return !1;
      for (i = r; i-- !== 0; ) if (!Xi(l[i], o[i])) return !1;
      return !0;
    }
    if (((c = Object.keys(l)), (r = c.length), r !== Object.keys(o).length)) return !1;
    for (i = r; i-- !== 0; ) if (!{}.hasOwnProperty.call(o, c[i])) return !1;
    for (i = r; i-- !== 0; ) {
      const f = c[i];
      if (!(f === "_owner" && l.$$typeof) && !Xi(l[f], o[f])) return !1;
    }
    return !0;
  }
  return l !== l && o !== o;
}
function my(l) {
  return typeof window > "u" ? 1 : (l.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function sg(l, o) {
  const r = my(l);
  return Math.round(o * r) / r;
}
function cf(l) {
  const o = p.useRef(l);
  return (
    Bi(() => {
      o.current = l;
    }),
    o
  );
}
function zw(l) {
  l === void 0 && (l = {});
  const {
      placement: o = "bottom",
      strategy: r = "absolute",
      middleware: i = [],
      platform: c,
      elements: { reference: f, floating: d } = {},
      transform: h = !0,
      whileElementsMounted: v,
      open: m,
    } = l,
    [S, y] = p.useState({
      x: 0,
      y: 0,
      strategy: r,
      placement: o,
      middlewareData: {},
      isPositioned: !1,
    }),
    [b, R] = p.useState(i);
  Xi(b, i) || R(i);
  const [w, C] = p.useState(null),
    [T, _] = p.useState(null),
    D = p.useCallback(($) => {
      $ !== F.current && ((F.current = $), C($));
    }, []),
    N = p.useCallback(($) => {
      $ !== V.current && ((V.current = $), _($));
    }, []),
    B = f || w,
    K = d || T,
    F = p.useRef(null),
    V = p.useRef(null),
    ee = p.useRef(S),
    te = v != null,
    le = cf(v),
    ne = cf(c),
    ie = cf(m),
    ve = p.useCallback(() => {
      if (!F.current || !V.current) return;
      const $ = { placement: o, strategy: r, middleware: b };
      (ne.current && ($.platform = ne.current),
        Ow(F.current, V.current, $).then((Q) => {
          const he = { ...Q, isPositioned: ie.current !== !1 };
          pe.current &&
            !Xi(ee.current, he) &&
            ((ee.current = he),
            er.flushSync(() => {
              y(he);
            }));
        }));
    }, [b, o, r, ne, ie]);
  Bi(() => {
    m === !1 &&
      ee.current.isPositioned &&
      ((ee.current.isPositioned = !1), y(($) => ({ ...$, isPositioned: !1 })));
  }, [m]);
  const pe = p.useRef(!1);
  (Bi(
    () => (
      (pe.current = !0),
      () => {
        pe.current = !1;
      }
    ),
    [],
  ),
    Bi(() => {
      if ((B && (F.current = B), K && (V.current = K), B && K)) {
        if (le.current) return le.current(B, K, ve);
        ve();
      }
    }, [B, K, ve, le, te]));
  const ge = p.useMemo(
      () => ({ reference: F, floating: V, setReference: D, setFloating: N }),
      [D, N],
    ),
    j = p.useMemo(() => ({ reference: B, floating: K }), [B, K]),
    I = p.useMemo(() => {
      const $ = { position: r, left: 0, top: 0 };
      if (!j.floating) return $;
      const Q = sg(j.floating, S.x),
        he = sg(j.floating, S.y);
      return h
        ? {
            ...$,
            transform: "translate(" + Q + "px, " + he + "px)",
            ...(my(j.floating) >= 1.5 && { willChange: "transform" }),
          }
        : { position: r, left: Q, top: he };
    }, [r, h, j.floating, S.x, S.y]);
  return p.useMemo(
    () => ({ ...S, update: ve, refs: ge, elements: j, floatingStyles: I }),
    [S, ve, ge, j, I],
  );
}
const jw = (l) => {
    function o(r) {
      return {}.hasOwnProperty.call(r, "current");
    }
    return {
      name: "arrow",
      options: l,
      fn(r) {
        const { element: i, padding: c } = typeof l == "function" ? l(r) : l;
        return i && o(i)
          ? i.current != null
            ? cg({ element: i.current, padding: c }).fn(r)
            : {}
          : i
            ? cg({ element: i, padding: c }).fn(r)
            : {};
      },
    };
  },
  Lw = (l, o) => {
    const r = Rw(l);
    return { name: r.name, fn: r.fn, options: [l, o] };
  },
  Uw = (l, o) => {
    const r = Tw(l);
    return { name: r.name, fn: r.fn, options: [l, o] };
  },
  Bw = (l, o) => ({ fn: Mw(l).fn, options: [l, o] }),
  Hw = (l, o) => {
    const r = ww(l);
    return { name: r.name, fn: r.fn, options: [l, o] };
  },
  Pw = (l, o) => {
    const r = Aw(l);
    return { name: r.name, fn: r.fn, options: [l, o] };
  },
  Vw = (l, o) => {
    const r = _w(l);
    return { name: r.name, fn: r.fn, options: [l, o] };
  },
  Gw = (l, o) => {
    const r = jw(l);
    return { name: r.name, fn: r.fn, options: [l, o] };
  };
var Yw = "Arrow",
  gy = p.forwardRef((l, o) => {
    const { children: r, width: i = 10, height: c = 5, ...f } = l;
    return E.jsx(re.svg, {
      ...f,
      ref: o,
      width: i,
      height: c,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: l.asChild ? r : E.jsx("polygon", { points: "0,0 30,0 15,10" }),
    });
  });
gy.displayName = Yw;
var qw = gy;
function iu(l) {
  const [o, r] = p.useState(void 0);
  return (
    $e(() => {
      if (l) {
        r({ width: l.offsetWidth, height: l.offsetHeight });
        const i = new ResizeObserver((c) => {
          if (!Array.isArray(c) || !c.length) return;
          const f = c[0];
          let d, h;
          if ("borderBoxSize" in f) {
            const v = f.borderBoxSize,
              m = Array.isArray(v) ? v[0] : v;
            ((d = m.inlineSize), (h = m.blockSize));
          } else ((d = l.offsetWidth), (h = l.offsetHeight));
          r({ width: d, height: h });
        });
        return (i.observe(l, { box: "border-box" }), () => i.unobserve(l));
      } else r(void 0);
    }, [l]),
    o
  );
}
var kf = "Popper",
  [yy, hl] = ut(kf),
  [Xw, Sy] = yy(kf),
  by = (l) => {
    const { __scopePopper: o, children: r } = l,
      [i, c] = p.useState(null);
    return E.jsx(Xw, { scope: o, anchor: i, onAnchorChange: c, children: r });
  };
by.displayName = kf;
var xy = "PopperAnchor",
  Ey = p.forwardRef((l, o) => {
    const { __scopePopper: r, virtualRef: i, ...c } = l,
      f = Sy(xy, r),
      d = p.useRef(null),
      h = de(o, d),
      v = p.useRef(null);
    return (
      p.useEffect(() => {
        const m = v.current;
        ((v.current = i?.current || d.current), m !== v.current && f.onAnchorChange(v.current));
      }),
      i ? null : E.jsx(re.div, { ...c, ref: h })
    );
  });
Ey.displayName = xy;
var Ff = "PopperContent",
  [Iw, Kw] = yy(Ff),
  Cy = p.forwardRef((l, o) => {
    const {
        __scopePopper: r,
        side: i = "bottom",
        sideOffset: c = 0,
        align: f = "center",
        alignOffset: d = 0,
        arrowPadding: h = 0,
        avoidCollisions: v = !0,
        collisionBoundary: m = [],
        collisionPadding: S = 0,
        sticky: y = "partial",
        hideWhenDetached: b = !1,
        updatePositionStrategy: R = "optimized",
        onPlaced: w,
        ...C
      } = l,
      T = Sy(Ff, r),
      [_, D] = p.useState(null),
      N = de(o, (k) => D(k)),
      [B, K] = p.useState(null),
      F = iu(B),
      V = F?.width ?? 0,
      ee = F?.height ?? 0,
      te = i + (f !== "center" ? "-" + f : ""),
      le = typeof S == "number" ? S : { top: 0, right: 0, bottom: 0, left: 0, ...S },
      ne = Array.isArray(m) ? m : [m],
      ie = ne.length > 0,
      ve = { padding: le, boundary: ne.filter(Qw), altBoundary: ie },
      {
        refs: pe,
        floatingStyles: ge,
        placement: j,
        isPositioned: I,
        middlewareData: $,
      } = zw({
        strategy: "fixed",
        placement: te,
        whileElementsMounted: (...k) => Cw(...k, { animationFrame: R === "always" }),
        elements: { reference: T.anchor },
        middleware: [
          Lw({ mainAxis: c + ee, alignmentAxis: d }),
          v && Uw({ mainAxis: !0, crossAxis: !1, limiter: y === "partial" ? Bw() : void 0, ...ve }),
          v && Hw({ ...ve }),
          Pw({
            ...ve,
            apply: ({ elements: k, rects: Se, availableWidth: xe, availableHeight: Me }) => {
              const { width: De, height: Ve } = Se.reference,
                st = k.floating.style;
              (st.setProperty("--radix-popper-available-width", `${xe}px`),
                st.setProperty("--radix-popper-available-height", `${Me}px`),
                st.setProperty("--radix-popper-anchor-width", `${De}px`),
                st.setProperty("--radix-popper-anchor-height", `${Ve}px`));
            },
          }),
          B && Gw({ element: B, padding: h }),
          Zw({ arrowWidth: V, arrowHeight: ee }),
          b && Vw({ strategy: "referenceHidden", ...ve }),
        ],
      }),
      [Q, he] = wy(j),
      M = We(w);
    $e(() => {
      I && M?.();
    }, [I, M]);
    const Y = $.arrow?.x,
      J = $.arrow?.y,
      W = $.arrow?.centerOffset !== 0,
      [ce, se] = p.useState();
    return (
      $e(() => {
        _ && se(window.getComputedStyle(_).zIndex);
      }, [_]),
      E.jsx("div", {
        ref: pe.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...ge,
          transform: I ? ge.transform : "translate(0, -200%)",
          minWidth: "max-content",
          zIndex: ce,
          "--radix-popper-transform-origin": [$.transformOrigin?.x, $.transformOrigin?.y].join(" "),
          ...($.hide?.referenceHidden && { visibility: "hidden", pointerEvents: "none" }),
        },
        dir: l.dir,
        children: E.jsx(Iw, {
          scope: r,
          placedSide: Q,
          onArrowChange: K,
          arrowX: Y,
          arrowY: J,
          shouldHideArrow: W,
          children: E.jsx(re.div, {
            "data-side": Q,
            "data-align": he,
            ...C,
            ref: N,
            style: { ...C.style, animation: I ? void 0 : "none" },
          }),
        }),
      })
    );
  });
Cy.displayName = Ff;
var Ry = "PopperArrow",
  $w = { top: "bottom", right: "left", bottom: "top", left: "right" },
  Ty = p.forwardRef(function (o, r) {
    const { __scopePopper: i, ...c } = o,
      f = Kw(Ry, i),
      d = $w[f.placedSide];
    return E.jsx("span", {
      ref: f.onArrowChange,
      style: {
        position: "absolute",
        left: f.arrowX,
        top: f.arrowY,
        [d]: 0,
        transformOrigin: { top: "", right: "0 0", bottom: "center 0", left: "100% 0" }[
          f.placedSide
        ],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: "rotate(180deg)",
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[f.placedSide],
        visibility: f.shouldHideArrow ? "hidden" : void 0,
      },
      children: E.jsx(qw, { ...c, ref: r, style: { ...c.style, display: "block" } }),
    });
  });
Ty.displayName = Ry;
function Qw(l) {
  return l !== null;
}
var Zw = (l) => ({
  name: "transformOrigin",
  options: l,
  fn(o) {
    const { placement: r, rects: i, middlewareData: c } = o,
      d = c.arrow?.centerOffset !== 0,
      h = d ? 0 : l.arrowWidth,
      v = d ? 0 : l.arrowHeight,
      [m, S] = wy(r),
      y = { start: "0%", center: "50%", end: "100%" }[S],
      b = (c.arrow?.x ?? 0) + h / 2,
      R = (c.arrow?.y ?? 0) + v / 2;
    let w = "",
      C = "";
    return (
      m === "bottom"
        ? ((w = d ? y : `${b}px`), (C = `${-v}px`))
        : m === "top"
          ? ((w = d ? y : `${b}px`), (C = `${i.floating.height + v}px`))
          : m === "right"
            ? ((w = `${-v}px`), (C = d ? y : `${R}px`))
            : m === "left" && ((w = `${i.floating.width + v}px`), (C = d ? y : `${R}px`)),
      { data: { x: w, y: C } }
    );
  },
});
function wy(l) {
  const [o, r = "center"] = l.split("-");
  return [o, r];
}
var uu = by,
  or = Ey,
  cu = Cy,
  su = Ty,
  kw = Symbol("radix.slottable");
function Fw(l) {
  const o = ({ children: r }) => E.jsx(E.Fragment, { children: r });
  return ((o.displayName = `${l}.Slottable`), (o.__radixId = kw), o);
}
var Ay = Object.freeze({
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal",
  }),
  Jw = "VisuallyHidden",
  _y = p.forwardRef((l, o) => E.jsx(re.span, { ...l, ref: o, style: { ...Ay, ...l.style } }));
_y.displayName = Jw;
var Ww = _y,
  [fu] = ut("Tooltip", [hl]),
  du = hl(),
  My = "TooltipProvider",
  eA = 700,
  Ef = "tooltip.open",
  [tA, Jf] = fu(My),
  Oy = (l) => {
    const {
        __scopeTooltip: o,
        delayDuration: r = eA,
        skipDelayDuration: i = 300,
        disableHoverableContent: c = !1,
        children: f,
      } = l,
      d = p.useRef(!0),
      h = p.useRef(!1),
      v = p.useRef(0);
    return (
      p.useEffect(() => {
        const m = v.current;
        return () => window.clearTimeout(m);
      }, []),
      E.jsx(tA, {
        scope: o,
        isOpenDelayedRef: d,
        delayDuration: r,
        onOpen: p.useCallback(() => {
          (window.clearTimeout(v.current), (d.current = !1));
        }, []),
        onClose: p.useCallback(() => {
          (window.clearTimeout(v.current),
            (v.current = window.setTimeout(() => (d.current = !0), i)));
        }, [i]),
        isPointerInTransitRef: h,
        onPointerInTransitChange: p.useCallback((m) => {
          h.current = m;
        }, []),
        disableHoverableContent: c,
        children: f,
      })
    );
  };
Oy.displayName = My;
var ko = "Tooltip",
  [nA, rr] = fu(ko),
  Dy = (l) => {
    const {
        __scopeTooltip: o,
        children: r,
        open: i,
        defaultOpen: c,
        onOpenChange: f,
        disableHoverableContent: d,
        delayDuration: h,
      } = l,
      v = Jf(ko, l.__scopeTooltip),
      m = du(o),
      [S, y] = p.useState(null),
      b = zt(),
      R = p.useRef(0),
      w = d ?? v.disableHoverableContent,
      C = h ?? v.delayDuration,
      T = p.useRef(!1),
      [_, D] = Kt({
        prop: i,
        defaultProp: c ?? !1,
        onChange: (V) => {
          (V ? (v.onOpen(), document.dispatchEvent(new CustomEvent(Ef))) : v.onClose(), f?.(V));
        },
        caller: ko,
      }),
      N = p.useMemo(() => (_ ? (T.current ? "delayed-open" : "instant-open") : "closed"), [_]),
      B = p.useCallback(() => {
        (window.clearTimeout(R.current), (R.current = 0), (T.current = !1), D(!0));
      }, [D]),
      K = p.useCallback(() => {
        (window.clearTimeout(R.current), (R.current = 0), D(!1));
      }, [D]),
      F = p.useCallback(() => {
        (window.clearTimeout(R.current),
          (R.current = window.setTimeout(() => {
            ((T.current = !0), D(!0), (R.current = 0));
          }, C)));
      }, [C, D]);
    return (
      p.useEffect(
        () => () => {
          R.current && (window.clearTimeout(R.current), (R.current = 0));
        },
        [],
      ),
      E.jsx(uu, {
        ...m,
        children: E.jsx(nA, {
          scope: o,
          contentId: b,
          open: _,
          stateAttribute: N,
          trigger: S,
          onTriggerChange: y,
          onTriggerEnter: p.useCallback(() => {
            v.isOpenDelayedRef.current ? F() : B();
          }, [v.isOpenDelayedRef, F, B]),
          onTriggerLeave: p.useCallback(() => {
            w ? K() : (window.clearTimeout(R.current), (R.current = 0));
          }, [K, w]),
          onOpen: B,
          onClose: K,
          disableHoverableContent: w,
          children: r,
        }),
      })
    );
  };
Dy.displayName = ko;
var Cf = "TooltipTrigger",
  Ny = p.forwardRef((l, o) => {
    const { __scopeTooltip: r, ...i } = l,
      c = rr(Cf, r),
      f = Jf(Cf, r),
      d = du(r),
      h = p.useRef(null),
      v = de(o, h, c.onTriggerChange),
      m = p.useRef(!1),
      S = p.useRef(!1),
      y = p.useCallback(() => (m.current = !1), []);
    return (
      p.useEffect(() => () => document.removeEventListener("pointerup", y), [y]),
      E.jsx(or, {
        asChild: !0,
        ...d,
        children: E.jsx(re.button, {
          "aria-describedby": c.open ? c.contentId : void 0,
          "data-state": c.stateAttribute,
          ...i,
          ref: v,
          onPointerMove: Z(l.onPointerMove, (b) => {
            b.pointerType !== "touch" &&
              !S.current &&
              !f.isPointerInTransitRef.current &&
              (c.onTriggerEnter(), (S.current = !0));
          }),
          onPointerLeave: Z(l.onPointerLeave, () => {
            (c.onTriggerLeave(), (S.current = !1));
          }),
          onPointerDown: Z(l.onPointerDown, () => {
            (c.open && c.onClose(),
              (m.current = !0),
              document.addEventListener("pointerup", y, { once: !0 }));
          }),
          onFocus: Z(l.onFocus, () => {
            m.current || c.onOpen();
          }),
          onBlur: Z(l.onBlur, c.onClose),
          onClick: Z(l.onClick, c.onClose),
        }),
      })
    );
  });
Ny.displayName = Cf;
var Wf = "TooltipPortal",
  [lA, aA] = fu(Wf, { forceMount: void 0 }),
  zy = (l) => {
    const { __scopeTooltip: o, forceMount: r, children: i, container: c } = l,
      f = rr(Wf, o);
    return E.jsx(lA, {
      scope: o,
      forceMount: r,
      children: E.jsx(et, {
        present: r || f.open,
        children: E.jsx(qa, { asChild: !0, container: c, children: i }),
      }),
    });
  };
zy.displayName = Wf;
var Ua = "TooltipContent",
  jy = p.forwardRef((l, o) => {
    const r = aA(Ua, l.__scopeTooltip),
      { forceMount: i = r.forceMount, side: c = "top", ...f } = l,
      d = rr(Ua, l.__scopeTooltip);
    return E.jsx(et, {
      present: i || d.open,
      children: d.disableHoverableContent
        ? E.jsx(Ly, { side: c, ...f, ref: o })
        : E.jsx(oA, { side: c, ...f, ref: o }),
    });
  }),
  oA = p.forwardRef((l, o) => {
    const r = rr(Ua, l.__scopeTooltip),
      i = Jf(Ua, l.__scopeTooltip),
      c = p.useRef(null),
      f = de(o, c),
      [d, h] = p.useState(null),
      { trigger: v, onClose: m } = r,
      S = c.current,
      { onPointerInTransitChange: y } = i,
      b = p.useCallback(() => {
        (h(null), y(!1));
      }, [y]),
      R = p.useCallback(
        (w, C) => {
          const T = w.currentTarget,
            _ = { x: w.clientX, y: w.clientY },
            D = sA(_, T.getBoundingClientRect()),
            N = fA(_, D),
            B = dA(C.getBoundingClientRect()),
            K = hA([...N, ...B]);
          (h(K), y(!0));
        },
        [y],
      );
    return (
      p.useEffect(() => () => b(), [b]),
      p.useEffect(() => {
        if (v && S) {
          const w = (T) => R(T, S),
            C = (T) => R(T, v);
          return (
            v.addEventListener("pointerleave", w),
            S.addEventListener("pointerleave", C),
            () => {
              (v.removeEventListener("pointerleave", w), S.removeEventListener("pointerleave", C));
            }
          );
        }
      }, [v, S, R, b]),
      p.useEffect(() => {
        if (d) {
          const w = (C) => {
            const T = C.target,
              _ = { x: C.clientX, y: C.clientY },
              D = v?.contains(T) || S?.contains(T),
              N = !pA(_, d);
            D ? b() : N && (b(), m());
          };
          return (
            document.addEventListener("pointermove", w),
            () => document.removeEventListener("pointermove", w)
          );
        }
      }, [v, S, d, m, b]),
      E.jsx(Ly, { ...l, ref: f })
    );
  }),
  [rA, iA] = fu(ko, { isInside: !1 }),
  uA = Fw("TooltipContent"),
  Ly = p.forwardRef((l, o) => {
    const {
        __scopeTooltip: r,
        children: i,
        "aria-label": c,
        onEscapeKeyDown: f,
        onPointerDownOutside: d,
        ...h
      } = l,
      v = rr(Ua, r),
      m = du(r),
      { onClose: S } = v;
    return (
      p.useEffect(
        () => (document.addEventListener(Ef, S), () => document.removeEventListener(Ef, S)),
        [S],
      ),
      p.useEffect(() => {
        if (v.trigger) {
          const y = (b) => {
            b.target?.contains(v.trigger) && S();
          };
          return (
            window.addEventListener("scroll", y, { capture: !0 }),
            () => window.removeEventListener("scroll", y, { capture: !0 })
          );
        }
      }, [v.trigger, S]),
      E.jsx(Ya, {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: f,
        onPointerDownOutside: d,
        onFocusOutside: (y) => y.preventDefault(),
        onDismiss: S,
        children: E.jsxs(cu, {
          "data-state": v.stateAttribute,
          ...m,
          ...h,
          ref: o,
          style: {
            ...h.style,
            "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
            "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
            "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)",
          },
          children: [
            E.jsx(uA, { children: i }),
            E.jsx(rA, {
              scope: r,
              isInside: !0,
              children: E.jsx(Ww, { id: v.contentId, role: "tooltip", children: c || i }),
            }),
          ],
        }),
      })
    );
  });
jy.displayName = Ua;
var Uy = "TooltipArrow",
  cA = p.forwardRef((l, o) => {
    const { __scopeTooltip: r, ...i } = l,
      c = du(r);
    return iA(Uy, r).isInside ? null : E.jsx(su, { ...c, ...i, ref: o });
  });
cA.displayName = Uy;
function sA(l, o) {
  const r = Math.abs(o.top - l.y),
    i = Math.abs(o.bottom - l.y),
    c = Math.abs(o.right - l.x),
    f = Math.abs(o.left - l.x);
  switch (Math.min(r, i, c, f)) {
    case f:
      return "left";
    case c:
      return "right";
    case r:
      return "top";
    case i:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function fA(l, o, r = 5) {
  const i = [];
  switch (o) {
    case "top":
      i.push({ x: l.x - r, y: l.y + r }, { x: l.x + r, y: l.y + r });
      break;
    case "bottom":
      i.push({ x: l.x - r, y: l.y - r }, { x: l.x + r, y: l.y - r });
      break;
    case "left":
      i.push({ x: l.x + r, y: l.y - r }, { x: l.x + r, y: l.y + r });
      break;
    case "right":
      i.push({ x: l.x - r, y: l.y - r }, { x: l.x - r, y: l.y + r });
      break;
  }
  return i;
}
function dA(l) {
  const { top: o, right: r, bottom: i, left: c } = l;
  return [
    { x: c, y: o },
    { x: r, y: o },
    { x: r, y: i },
    { x: c, y: i },
  ];
}
function pA(l, o) {
  const { x: r, y: i } = l;
  let c = !1;
  for (let f = 0, d = o.length - 1; f < o.length; d = f++) {
    const h = o[f],
      v = o[d],
      m = h.x,
      S = h.y,
      y = v.x,
      b = v.y;
    S > i != b > i && r < ((y - m) * (i - S)) / (b - S) + m && (c = !c);
  }
  return c;
}
function hA(l) {
  const o = l.slice();
  return (
    o.sort((r, i) => (r.x < i.x ? -1 : r.x > i.x ? 1 : r.y < i.y ? -1 : r.y > i.y ? 1 : 0)),
    vA(o)
  );
}
function vA(l) {
  if (l.length <= 1) return l.slice();
  const o = [];
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    for (; o.length >= 2; ) {
      const f = o[o.length - 1],
        d = o[o.length - 2];
      if ((f.x - d.x) * (c.y - d.y) >= (f.y - d.y) * (c.x - d.x)) o.pop();
      else break;
    }
    o.push(c);
  }
  o.pop();
  const r = [];
  for (let i = l.length - 1; i >= 0; i--) {
    const c = l[i];
    for (; r.length >= 2; ) {
      const f = r[r.length - 1],
        d = r[r.length - 2];
      if ((f.x - d.x) * (c.y - d.y) >= (f.y - d.y) * (c.x - d.x)) r.pop();
      else break;
    }
    r.push(c);
  }
  return (
    r.pop(),
    o.length === 1 && r.length === 1 && o[0].x === r[0].x && o[0].y === r[0].y ? o : o.concat(r)
  );
}
var iD = Oy,
  uD = Dy,
  cD = Ny,
  sD = zy,
  fD = jy;
function mA(l, o = []) {
  let r = [];
  function i(f, d) {
    const h = p.createContext(d);
    h.displayName = f + "Context";
    const v = r.length;
    r = [...r, d];
    const m = (y) => {
      const { scope: b, children: R, ...w } = y,
        C = b?.[l]?.[v] || h,
        T = p.useMemo(() => w, Object.values(w));
      return E.jsx(C.Provider, { value: T, children: R });
    };
    m.displayName = f + "Provider";
    function S(y, b) {
      const R = b?.[l]?.[v] || h,
        w = p.useContext(R);
      if (w) return w;
      if (d !== void 0) return d;
      throw new Error(`\`${y}\` must be used within \`${f}\``);
    }
    return [m, S];
  }
  const c = () => {
    const f = r.map((d) => p.createContext(d));
    return function (h) {
      const v = h?.[l] || f;
      return p.useMemo(() => ({ [`__scope${l}`]: { ...h, [l]: v } }), [h, v]);
    };
  };
  return ((c.scopeName = l), [i, gA(c, ...o)]);
}
function gA(...l) {
  const o = l[0];
  if (l.length === 1) return o;
  const r = () => {
    const i = l.map((c) => ({ useScope: c(), scopeName: c.scopeName }));
    return function (f) {
      const d = i.reduce((h, { useScope: v, scopeName: m }) => {
        const y = v(f)[`__scope${m}`];
        return { ...h, ...y };
      }, {});
      return p.useMemo(() => ({ [`__scope${o.scopeName}`]: d }), [d]);
    };
  };
  return ((r.scopeName = o.scopeName), r);
}
var yA = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  ed = yA.reduce((l, o) => {
    const r = tr(`Primitive.${o}`),
      i = p.forwardRef((c, f) => {
        const { asChild: d, ...h } = c,
          v = d ? r : o;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          E.jsx(v, { ...h, ref: f })
        );
      });
    return ((i.displayName = `Primitive.${o}`), { ...l, [o]: i });
  }, {}),
  sf = { exports: {} },
  ff = {};
var fg;
function SA() {
  if (fg) return ff;
  fg = 1;
  var l = ki();
  function o(y, b) {
    return (y === b && (y !== 0 || 1 / y === 1 / b)) || (y !== y && b !== b);
  }
  var r = typeof Object.is == "function" ? Object.is : o,
    i = l.useState,
    c = l.useEffect,
    f = l.useLayoutEffect,
    d = l.useDebugValue;
  function h(y, b) {
    var R = b(),
      w = i({ inst: { value: R, getSnapshot: b } }),
      C = w[0].inst,
      T = w[1];
    return (
      f(
        function () {
          ((C.value = R), (C.getSnapshot = b), v(C) && T({ inst: C }));
        },
        [y, R, b],
      ),
      c(
        function () {
          return (
            v(C) && T({ inst: C }),
            y(function () {
              v(C) && T({ inst: C });
            })
          );
        },
        [y],
      ),
      d(R),
      R
    );
  }
  function v(y) {
    var b = y.getSnapshot;
    y = y.value;
    try {
      var R = b();
      return !r(y, R);
    } catch {
      return !0;
    }
  }
  function m(y, b) {
    return b();
  }
  var S =
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
      ? m
      : h;
  return (
    (ff.useSyncExternalStore = l.useSyncExternalStore !== void 0 ? l.useSyncExternalStore : S),
    ff
  );
}
var dg;
function bA() {
  return (dg || ((dg = 1), (sf.exports = SA())), sf.exports);
}
var xA = bA();
function EA() {
  return xA.useSyncExternalStore(
    CA,
    () => !0,
    () => !1,
  );
}
function CA() {
  return () => {};
}
var td = "Avatar",
  [RA] = mA(td),
  [TA, By] = RA(td),
  Hy = p.forwardRef((l, o) => {
    const { __scopeAvatar: r, ...i } = l,
      [c, f] = p.useState("idle");
    return E.jsx(TA, {
      scope: r,
      imageLoadingStatus: c,
      onImageLoadingStatusChange: f,
      children: E.jsx(ed.span, { ...i, ref: o }),
    });
  });
Hy.displayName = td;
var Py = "AvatarImage",
  Vy = p.forwardRef((l, o) => {
    const { __scopeAvatar: r, src: i, onLoadingStatusChange: c = () => {}, ...f } = l,
      d = By(Py, r),
      h = wA(i, f),
      v = We((m) => {
        (c(m), d.onImageLoadingStatusChange(m));
      });
    return (
      $e(() => {
        h !== "idle" && v(h);
      }, [h, v]),
      h === "loaded" ? E.jsx(ed.img, { ...f, ref: o, src: i }) : null
    );
  });
Vy.displayName = Py;
var Gy = "AvatarFallback",
  Yy = p.forwardRef((l, o) => {
    const { __scopeAvatar: r, delayMs: i, ...c } = l,
      f = By(Gy, r),
      [d, h] = p.useState(i === void 0);
    return (
      p.useEffect(() => {
        if (i !== void 0) {
          const v = window.setTimeout(() => h(!0), i);
          return () => window.clearTimeout(v);
        }
      }, [i]),
      d && f.imageLoadingStatus !== "loaded" ? E.jsx(ed.span, { ...c, ref: o }) : null
    );
  });
Yy.displayName = Gy;
function pg(l, o) {
  return l
    ? o
      ? (l.src !== o && (l.src = o), l.complete && l.naturalWidth > 0 ? "loaded" : "loading")
      : "error"
    : "idle";
}
function wA(l, { referrerPolicy: o, crossOrigin: r }) {
  const i = EA(),
    c = p.useRef(null),
    f = i ? (c.current || (c.current = new window.Image()), c.current) : null,
    [d, h] = p.useState(() => pg(f, l));
  return (
    $e(() => {
      h(pg(f, l));
    }, [f, l]),
    $e(() => {
      const v = (y) => () => {
        h(y);
      };
      if (!f) return;
      const m = v("loaded"),
        S = v("error");
      return (
        f.addEventListener("load", m),
        f.addEventListener("error", S),
        o && (f.referrerPolicy = o),
        typeof r == "string" && (f.crossOrigin = r),
        () => {
          (f.removeEventListener("load", m), f.removeEventListener("error", S));
        }
      );
    }, [f, r, o]),
    d
  );
}
var dD = Hy,
  pD = Vy,
  hD = Yy;
function hg(l) {
  const o = AA(l),
    r = p.forwardRef((i, c) => {
      const { children: f, ...d } = i,
        h = p.Children.toArray(f),
        v = h.find(MA);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
function AA(l) {
  const o = p.forwardRef((r, i) => {
    const { children: c, ...f } = r;
    if (p.isValidElement(c)) {
      const d = DA(c),
        h = OA(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var _A = Symbol("radix.slottable");
function MA(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === _A
  );
}
function OA(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function DA(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
function pu(l) {
  const o = l + "CollectionProvider",
    [r, i] = ut(o),
    [c, f] = r(o, { collectionRef: { current: null }, itemMap: new Map() }),
    d = (C) => {
      const { scope: T, children: _ } = C,
        D = rl.useRef(null),
        N = rl.useRef(new Map()).current;
      return E.jsx(c, { scope: T, itemMap: N, collectionRef: D, children: _ });
    };
  d.displayName = o;
  const h = l + "CollectionSlot",
    v = hg(h),
    m = rl.forwardRef((C, T) => {
      const { scope: _, children: D } = C,
        N = f(h, _),
        B = de(T, N.collectionRef);
      return E.jsx(v, { ref: B, children: D });
    });
  m.displayName = h;
  const S = l + "CollectionItemSlot",
    y = "data-radix-collection-item",
    b = hg(S),
    R = rl.forwardRef((C, T) => {
      const { scope: _, children: D, ...N } = C,
        B = rl.useRef(null),
        K = de(T, B),
        F = f(S, _);
      return (
        rl.useEffect(
          () => (
            F.itemMap.set(B, { ref: B, ...N }),
            () => {
              F.itemMap.delete(B);
            }
          ),
        ),
        E.jsx(b, { [y]: "", ref: K, children: D })
      );
    });
  R.displayName = S;
  function w(C) {
    const T = f(l + "CollectionConsumer", C);
    return rl.useCallback(() => {
      const D = T.collectionRef.current;
      if (!D) return [];
      const N = Array.from(D.querySelectorAll(`[${y}]`));
      return Array.from(T.itemMap.values()).sort(
        (F, V) => N.indexOf(F.ref.current) - N.indexOf(V.ref.current),
      );
    }, [T.collectionRef, T.itemMap]);
  }
  return [{ Provider: d, Slot: m, ItemSlot: R }, w, i];
}
var NA = p.createContext(void 0);
function Ka(l) {
  const o = p.useContext(NA);
  return l || o || "ltr";
}
var df = "rovingFocusGroup.onEntryFocus",
  zA = { bubbles: !1, cancelable: !0 },
  ir = "RovingFocusGroup",
  [Rf, qy, jA] = pu(ir),
  [LA, hu] = ut(ir, [jA]),
  [UA, BA] = LA(ir),
  Xy = p.forwardRef((l, o) =>
    E.jsx(Rf.Provider, {
      scope: l.__scopeRovingFocusGroup,
      children: E.jsx(Rf.Slot, {
        scope: l.__scopeRovingFocusGroup,
        children: E.jsx(HA, { ...l, ref: o }),
      }),
    }),
  );
Xy.displayName = ir;
var HA = p.forwardRef((l, o) => {
    const {
        __scopeRovingFocusGroup: r,
        orientation: i,
        loop: c = !1,
        dir: f,
        currentTabStopId: d,
        defaultCurrentTabStopId: h,
        onCurrentTabStopIdChange: v,
        onEntryFocus: m,
        preventScrollOnEntryFocus: S = !1,
        ...y
      } = l,
      b = p.useRef(null),
      R = de(o, b),
      w = Ka(f),
      [C, T] = Kt({ prop: d, defaultProp: h ?? null, onChange: v, caller: ir }),
      [_, D] = p.useState(!1),
      N = We(m),
      B = qy(r),
      K = p.useRef(!1),
      [F, V] = p.useState(0);
    return (
      p.useEffect(() => {
        const ee = b.current;
        if (ee) return (ee.addEventListener(df, N), () => ee.removeEventListener(df, N));
      }, [N]),
      E.jsx(UA, {
        scope: r,
        orientation: i,
        dir: w,
        loop: c,
        currentTabStopId: C,
        onItemFocus: p.useCallback((ee) => T(ee), [T]),
        onItemShiftTab: p.useCallback(() => D(!0), []),
        onFocusableItemAdd: p.useCallback(() => V((ee) => ee + 1), []),
        onFocusableItemRemove: p.useCallback(() => V((ee) => ee - 1), []),
        children: E.jsx(re.div, {
          tabIndex: _ || F === 0 ? -1 : 0,
          "data-orientation": i,
          ...y,
          ref: R,
          style: { outline: "none", ...l.style },
          onMouseDown: Z(l.onMouseDown, () => {
            K.current = !0;
          }),
          onFocus: Z(l.onFocus, (ee) => {
            const te = !K.current;
            if (ee.target === ee.currentTarget && te && !_) {
              const le = new CustomEvent(df, zA);
              if ((ee.currentTarget.dispatchEvent(le), !le.defaultPrevented)) {
                const ne = B().filter((j) => j.focusable),
                  ie = ne.find((j) => j.active),
                  ve = ne.find((j) => j.id === C),
                  ge = [ie, ve, ...ne].filter(Boolean).map((j) => j.ref.current);
                $y(ge, S);
              }
            }
            K.current = !1;
          }),
          onBlur: Z(l.onBlur, () => D(!1)),
        }),
      })
    );
  }),
  Iy = "RovingFocusGroupItem",
  Ky = p.forwardRef((l, o) => {
    const {
        __scopeRovingFocusGroup: r,
        focusable: i = !0,
        active: c = !1,
        tabStopId: f,
        children: d,
        ...h
      } = l,
      v = zt(),
      m = f || v,
      S = BA(Iy, r),
      y = S.currentTabStopId === m,
      b = qy(r),
      { onFocusableItemAdd: R, onFocusableItemRemove: w, currentTabStopId: C } = S;
    return (
      p.useEffect(() => {
        if (i) return (R(), () => w());
      }, [i, R, w]),
      E.jsx(Rf.ItemSlot, {
        scope: r,
        id: m,
        focusable: i,
        active: c,
        children: E.jsx(re.span, {
          tabIndex: y ? 0 : -1,
          "data-orientation": S.orientation,
          ...h,
          ref: o,
          onMouseDown: Z(l.onMouseDown, (T) => {
            i ? S.onItemFocus(m) : T.preventDefault();
          }),
          onFocus: Z(l.onFocus, () => S.onItemFocus(m)),
          onKeyDown: Z(l.onKeyDown, (T) => {
            if (T.key === "Tab" && T.shiftKey) {
              S.onItemShiftTab();
              return;
            }
            if (T.target !== T.currentTarget) return;
            const _ = GA(T, S.orientation, S.dir);
            if (_ !== void 0) {
              if (T.metaKey || T.ctrlKey || T.altKey || T.shiftKey) return;
              T.preventDefault();
              let N = b()
                .filter((B) => B.focusable)
                .map((B) => B.ref.current);
              if (_ === "last") N.reverse();
              else if (_ === "prev" || _ === "next") {
                _ === "prev" && N.reverse();
                const B = N.indexOf(T.currentTarget);
                N = S.loop ? YA(N, B + 1) : N.slice(B + 1);
              }
              setTimeout(() => $y(N));
            }
          }),
          children: typeof d == "function" ? d({ isCurrentTabStop: y, hasTabStop: C != null }) : d,
        }),
      })
    );
  });
Ky.displayName = Iy;
var PA = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function VA(l, o) {
  return o !== "rtl" ? l : l === "ArrowLeft" ? "ArrowRight" : l === "ArrowRight" ? "ArrowLeft" : l;
}
function GA(l, o, r) {
  const i = VA(l.key, r);
  if (
    !(o === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) &&
    !(o === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i))
  )
    return PA[i];
}
function $y(l, o = !1) {
  const r = document.activeElement;
  for (const i of l)
    if (i === r || (i.focus({ preventScroll: o }), document.activeElement !== r)) return;
}
function YA(l, o) {
  return l.map((r, i) => l[(o + i) % l.length]);
}
var Qy = Xy,
  Zy = Ky;
function qA(l) {
  const o = XA(l),
    r = p.forwardRef((i, c) => {
      const { children: f, ...d } = i,
        h = p.Children.toArray(f),
        v = h.find(KA);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
function XA(l) {
  const o = p.forwardRef((r, i) => {
    const { children: c, ...f } = r;
    if (p.isValidElement(c)) {
      const d = QA(c),
        h = $A(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var IA = Symbol("radix.slottable");
function KA(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === IA
  );
}
function $A(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function QA(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
var Tf = ["Enter", " "],
  ZA = ["ArrowDown", "PageUp", "Home"],
  ky = ["ArrowUp", "PageDown", "End"],
  kA = [...ZA, ...ky],
  FA = { ltr: [...Tf, "ArrowRight"], rtl: [...Tf, "ArrowLeft"] },
  JA = { ltr: ["ArrowLeft"], rtl: ["ArrowRight"] },
  ur = "Menu",
  [Fo, WA, e_] = pu(ur),
  [ql, vu] = ut(ur, [e_, hl, hu]),
  mu = hl(),
  Fy = hu(),
  [t_, Xl] = ql(ur),
  [n_, cr] = ql(ur),
  Jy = (l) => {
    const { __scopeMenu: o, open: r = !1, children: i, dir: c, onOpenChange: f, modal: d = !0 } = l,
      h = mu(o),
      [v, m] = p.useState(null),
      S = p.useRef(!1),
      y = We(f),
      b = Ka(c);
    return (
      p.useEffect(() => {
        const R = () => {
            ((S.current = !0),
              document.addEventListener("pointerdown", w, { capture: !0, once: !0 }),
              document.addEventListener("pointermove", w, { capture: !0, once: !0 }));
          },
          w = () => (S.current = !1);
        return (
          document.addEventListener("keydown", R, { capture: !0 }),
          () => {
            (document.removeEventListener("keydown", R, { capture: !0 }),
              document.removeEventListener("pointerdown", w, { capture: !0 }),
              document.removeEventListener("pointermove", w, { capture: !0 }));
          }
        );
      }, []),
      E.jsx(uu, {
        ...h,
        children: E.jsx(t_, {
          scope: o,
          open: r,
          onOpenChange: y,
          content: v,
          onContentChange: m,
          children: E.jsx(n_, {
            scope: o,
            onClose: p.useCallback(() => y(!1), [y]),
            isUsingKeyboardRef: S,
            dir: b,
            modal: d,
            children: i,
          }),
        }),
      })
    );
  };
Jy.displayName = ur;
var l_ = "MenuAnchor",
  nd = p.forwardRef((l, o) => {
    const { __scopeMenu: r, ...i } = l,
      c = mu(r);
    return E.jsx(or, { ...c, ...i, ref: o });
  });
nd.displayName = l_;
var ld = "MenuPortal",
  [a_, Wy] = ql(ld, { forceMount: void 0 }),
  eS = (l) => {
    const { __scopeMenu: o, forceMount: r, children: i, container: c } = l,
      f = Xl(ld, o);
    return E.jsx(a_, {
      scope: o,
      forceMount: r,
      children: E.jsx(et, {
        present: r || f.open,
        children: E.jsx(qa, { asChild: !0, container: c, children: i }),
      }),
    });
  };
eS.displayName = ld;
var It = "MenuContent",
  [o_, ad] = ql(It),
  tS = p.forwardRef((l, o) => {
    const r = Wy(It, l.__scopeMenu),
      { forceMount: i = r.forceMount, ...c } = l,
      f = Xl(It, l.__scopeMenu),
      d = cr(It, l.__scopeMenu);
    return E.jsx(Fo.Provider, {
      scope: l.__scopeMenu,
      children: E.jsx(et, {
        present: i || f.open,
        children: E.jsx(Fo.Slot, {
          scope: l.__scopeMenu,
          children: d.modal ? E.jsx(r_, { ...c, ref: o }) : E.jsx(i_, { ...c, ref: o }),
        }),
      }),
    });
  }),
  r_ = p.forwardRef((l, o) => {
    const r = Xl(It, l.__scopeMenu),
      i = p.useRef(null),
      c = de(o, i);
    return (
      p.useEffect(() => {
        const f = i.current;
        if (f) return tu(f);
      }, []),
      E.jsx(od, {
        ...l,
        ref: c,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        disableOutsideScroll: !0,
        onFocusOutside: Z(l.onFocusOutside, (f) => f.preventDefault(), {
          checkForDefaultPrevented: !1,
        }),
        onDismiss: () => r.onOpenChange(!1),
      })
    );
  }),
  i_ = p.forwardRef((l, o) => {
    const r = Xl(It, l.__scopeMenu);
    return E.jsx(od, {
      ...l,
      ref: o,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => r.onOpenChange(!1),
    });
  }),
  u_ = qA("MenuContent.ScrollLock"),
  od = p.forwardRef((l, o) => {
    const {
        __scopeMenu: r,
        loop: i = !1,
        trapFocus: c,
        onOpenAutoFocus: f,
        onCloseAutoFocus: d,
        disableOutsidePointerEvents: h,
        onEntryFocus: v,
        onEscapeKeyDown: m,
        onPointerDownOutside: S,
        onFocusOutside: y,
        onInteractOutside: b,
        onDismiss: R,
        disableOutsideScroll: w,
        ...C
      } = l,
      T = Xl(It, r),
      _ = cr(It, r),
      D = mu(r),
      N = Fy(r),
      B = WA(r),
      [K, F] = p.useState(null),
      V = p.useRef(null),
      ee = de(o, V, T.onContentChange),
      te = p.useRef(0),
      le = p.useRef(""),
      ne = p.useRef(0),
      ie = p.useRef(null),
      ve = p.useRef("right"),
      pe = p.useRef(0),
      ge = w ? lr : p.Fragment,
      j = w ? { as: u_, allowPinchZoom: !0 } : void 0,
      I = (Q) => {
        const he = le.current + Q,
          M = B().filter((k) => !k.disabled),
          Y = document.activeElement,
          J = M.find((k) => k.ref.current === Y)?.textValue,
          W = M.map((k) => k.textValue),
          ce = b_(W, he, J),
          se = M.find((k) => k.textValue === ce)?.ref.current;
        ((function k(Se) {
          ((le.current = Se),
            window.clearTimeout(te.current),
            Se !== "" && (te.current = window.setTimeout(() => k(""), 1e3)));
        })(he),
          se && setTimeout(() => se.focus()));
      };
    (p.useEffect(() => () => window.clearTimeout(te.current), []), Wi());
    const $ = p.useCallback((Q) => ve.current === ie.current?.side && E_(Q, ie.current?.area), []);
    return E.jsx(o_, {
      scope: r,
      searchRef: le,
      onItemEnter: p.useCallback(
        (Q) => {
          $(Q) && Q.preventDefault();
        },
        [$],
      ),
      onItemLeave: p.useCallback(
        (Q) => {
          $(Q) || (V.current?.focus(), F(null));
        },
        [$],
      ),
      onTriggerLeave: p.useCallback(
        (Q) => {
          $(Q) && Q.preventDefault();
        },
        [$],
      ),
      pointerGraceTimerRef: ne,
      onPointerGraceIntentChange: p.useCallback((Q) => {
        ie.current = Q;
      }, []),
      children: E.jsx(ge, {
        ...j,
        children: E.jsx(nr, {
          asChild: !0,
          trapped: c,
          onMountAutoFocus: Z(f, (Q) => {
            (Q.preventDefault(), V.current?.focus({ preventScroll: !0 }));
          }),
          onUnmountAutoFocus: d,
          children: E.jsx(Ya, {
            asChild: !0,
            disableOutsidePointerEvents: h,
            onEscapeKeyDown: m,
            onPointerDownOutside: S,
            onFocusOutside: y,
            onInteractOutside: b,
            onDismiss: R,
            children: E.jsx(Qy, {
              asChild: !0,
              ...N,
              dir: _.dir,
              orientation: "vertical",
              loop: i,
              currentTabStopId: K,
              onCurrentTabStopIdChange: F,
              onEntryFocus: Z(v, (Q) => {
                _.isUsingKeyboardRef.current || Q.preventDefault();
              }),
              preventScrollOnEntryFocus: !0,
              children: E.jsx(cu, {
                role: "menu",
                "aria-orientation": "vertical",
                "data-state": gS(T.open),
                "data-radix-menu-content": "",
                dir: _.dir,
                ...D,
                ...C,
                ref: ee,
                style: { outline: "none", ...C.style },
                onKeyDown: Z(C.onKeyDown, (Q) => {
                  const M = Q.target.closest("[data-radix-menu-content]") === Q.currentTarget,
                    Y = Q.ctrlKey || Q.altKey || Q.metaKey,
                    J = Q.key.length === 1;
                  M && (Q.key === "Tab" && Q.preventDefault(), !Y && J && I(Q.key));
                  const W = V.current;
                  if (Q.target !== W || !kA.includes(Q.key)) return;
                  Q.preventDefault();
                  const se = B()
                    .filter((k) => !k.disabled)
                    .map((k) => k.ref.current);
                  (ky.includes(Q.key) && se.reverse(), y_(se));
                }),
                onBlur: Z(l.onBlur, (Q) => {
                  Q.currentTarget.contains(Q.target) ||
                    (window.clearTimeout(te.current), (le.current = ""));
                }),
                onPointerMove: Z(
                  l.onPointerMove,
                  Jo((Q) => {
                    const he = Q.target,
                      M = pe.current !== Q.clientX;
                    if (Q.currentTarget.contains(he) && M) {
                      const Y = Q.clientX > pe.current ? "right" : "left";
                      ((ve.current = Y), (pe.current = Q.clientX));
                    }
                  }),
                ),
              }),
            }),
          }),
        }),
      }),
    });
  });
tS.displayName = It;
var c_ = "MenuGroup",
  rd = p.forwardRef((l, o) => {
    const { __scopeMenu: r, ...i } = l;
    return E.jsx(re.div, { role: "group", ...i, ref: o });
  });
rd.displayName = c_;
var s_ = "MenuLabel",
  nS = p.forwardRef((l, o) => {
    const { __scopeMenu: r, ...i } = l;
    return E.jsx(re.div, { ...i, ref: o });
  });
nS.displayName = s_;
var Ii = "MenuItem",
  vg = "menu.itemSelect",
  gu = p.forwardRef((l, o) => {
    const { disabled: r = !1, onSelect: i, ...c } = l,
      f = p.useRef(null),
      d = cr(Ii, l.__scopeMenu),
      h = ad(Ii, l.__scopeMenu),
      v = de(o, f),
      m = p.useRef(!1),
      S = () => {
        const y = f.current;
        if (!r && y) {
          const b = new CustomEvent(vg, { bubbles: !0, cancelable: !0 });
          (y.addEventListener(vg, (R) => i?.(R), { once: !0 }),
            Og(y, b),
            b.defaultPrevented ? (m.current = !1) : d.onClose());
        }
      };
    return E.jsx(lS, {
      ...c,
      ref: v,
      disabled: r,
      onClick: Z(l.onClick, S),
      onPointerDown: (y) => {
        (l.onPointerDown?.(y), (m.current = !0));
      },
      onPointerUp: Z(l.onPointerUp, (y) => {
        m.current || y.currentTarget?.click();
      }),
      onKeyDown: Z(l.onKeyDown, (y) => {
        const b = h.searchRef.current !== "";
        r ||
          (b && y.key === " ") ||
          (Tf.includes(y.key) && (y.currentTarget.click(), y.preventDefault()));
      }),
    });
  });
gu.displayName = Ii;
var lS = p.forwardRef((l, o) => {
    const { __scopeMenu: r, disabled: i = !1, textValue: c, ...f } = l,
      d = ad(Ii, r),
      h = Fy(r),
      v = p.useRef(null),
      m = de(o, v),
      [S, y] = p.useState(!1),
      [b, R] = p.useState("");
    return (
      p.useEffect(() => {
        const w = v.current;
        w && R((w.textContent ?? "").trim());
      }, [f.children]),
      E.jsx(Fo.ItemSlot, {
        scope: r,
        disabled: i,
        textValue: c ?? b,
        children: E.jsx(Zy, {
          asChild: !0,
          ...h,
          focusable: !i,
          children: E.jsx(re.div, {
            role: "menuitem",
            "data-highlighted": S ? "" : void 0,
            "aria-disabled": i || void 0,
            "data-disabled": i ? "" : void 0,
            ...f,
            ref: m,
            onPointerMove: Z(
              l.onPointerMove,
              Jo((w) => {
                i
                  ? d.onItemLeave(w)
                  : (d.onItemEnter(w),
                    w.defaultPrevented || w.currentTarget.focus({ preventScroll: !0 }));
              }),
            ),
            onPointerLeave: Z(
              l.onPointerLeave,
              Jo((w) => d.onItemLeave(w)),
            ),
            onFocus: Z(l.onFocus, () => y(!0)),
            onBlur: Z(l.onBlur, () => y(!1)),
          }),
        }),
      })
    );
  }),
  f_ = "MenuCheckboxItem",
  aS = p.forwardRef((l, o) => {
    const { checked: r = !1, onCheckedChange: i, ...c } = l;
    return E.jsx(cS, {
      scope: l.__scopeMenu,
      checked: r,
      children: E.jsx(gu, {
        role: "menuitemcheckbox",
        "aria-checked": Ki(r) ? "mixed" : r,
        ...c,
        ref: o,
        "data-state": ud(r),
        onSelect: Z(c.onSelect, () => i?.(Ki(r) ? !0 : !r), { checkForDefaultPrevented: !1 }),
      }),
    });
  });
aS.displayName = f_;
var oS = "MenuRadioGroup",
  [d_, p_] = ql(oS, { value: void 0, onValueChange: () => {} }),
  rS = p.forwardRef((l, o) => {
    const { value: r, onValueChange: i, ...c } = l,
      f = We(i);
    return E.jsx(d_, {
      scope: l.__scopeMenu,
      value: r,
      onValueChange: f,
      children: E.jsx(rd, { ...c, ref: o }),
    });
  });
rS.displayName = oS;
var iS = "MenuRadioItem",
  uS = p.forwardRef((l, o) => {
    const { value: r, ...i } = l,
      c = p_(iS, l.__scopeMenu),
      f = r === c.value;
    return E.jsx(cS, {
      scope: l.__scopeMenu,
      checked: f,
      children: E.jsx(gu, {
        role: "menuitemradio",
        "aria-checked": f,
        ...i,
        ref: o,
        "data-state": ud(f),
        onSelect: Z(i.onSelect, () => c.onValueChange?.(r), { checkForDefaultPrevented: !1 }),
      }),
    });
  });
uS.displayName = iS;
var id = "MenuItemIndicator",
  [cS, h_] = ql(id, { checked: !1 }),
  sS = p.forwardRef((l, o) => {
    const { __scopeMenu: r, forceMount: i, ...c } = l,
      f = h_(id, r);
    return E.jsx(et, {
      present: i || Ki(f.checked) || f.checked === !0,
      children: E.jsx(re.span, { ...c, ref: o, "data-state": ud(f.checked) }),
    });
  });
sS.displayName = id;
var v_ = "MenuSeparator",
  fS = p.forwardRef((l, o) => {
    const { __scopeMenu: r, ...i } = l;
    return E.jsx(re.div, { role: "separator", "aria-orientation": "horizontal", ...i, ref: o });
  });
fS.displayName = v_;
var m_ = "MenuArrow",
  dS = p.forwardRef((l, o) => {
    const { __scopeMenu: r, ...i } = l,
      c = mu(r);
    return E.jsx(su, { ...c, ...i, ref: o });
  });
dS.displayName = m_;
var g_ = "MenuSub",
  [vD, pS] = ql(g_),
  Io = "MenuSubTrigger",
  hS = p.forwardRef((l, o) => {
    const r = Xl(Io, l.__scopeMenu),
      i = cr(Io, l.__scopeMenu),
      c = pS(Io, l.__scopeMenu),
      f = ad(Io, l.__scopeMenu),
      d = p.useRef(null),
      { pointerGraceTimerRef: h, onPointerGraceIntentChange: v } = f,
      m = { __scopeMenu: l.__scopeMenu },
      S = p.useCallback(() => {
        (d.current && window.clearTimeout(d.current), (d.current = null));
      }, []);
    return (
      p.useEffect(() => S, [S]),
      p.useEffect(() => {
        const y = h.current;
        return () => {
          (window.clearTimeout(y), v(null));
        };
      }, [h, v]),
      E.jsx(nd, {
        asChild: !0,
        ...m,
        children: E.jsx(lS, {
          id: c.triggerId,
          "aria-haspopup": "menu",
          "aria-expanded": r.open,
          "aria-controls": c.contentId,
          "data-state": gS(r.open),
          ...l,
          ref: sn(o, c.onTriggerChange),
          onClick: (y) => {
            (l.onClick?.(y),
              !(l.disabled || y.defaultPrevented) &&
                (y.currentTarget.focus(), r.open || r.onOpenChange(!0)));
          },
          onPointerMove: Z(
            l.onPointerMove,
            Jo((y) => {
              (f.onItemEnter(y),
                !y.defaultPrevented &&
                  !l.disabled &&
                  !r.open &&
                  !d.current &&
                  (f.onPointerGraceIntentChange(null),
                  (d.current = window.setTimeout(() => {
                    (r.onOpenChange(!0), S());
                  }, 100))));
            }),
          ),
          onPointerLeave: Z(
            l.onPointerLeave,
            Jo((y) => {
              S();
              const b = r.content?.getBoundingClientRect();
              if (b) {
                const R = r.content?.dataset.side,
                  w = R === "right",
                  C = w ? -5 : 5,
                  T = b[w ? "left" : "right"],
                  _ = b[w ? "right" : "left"];
                (f.onPointerGraceIntentChange({
                  area: [
                    { x: y.clientX + C, y: y.clientY },
                    { x: T, y: b.top },
                    { x: _, y: b.top },
                    { x: _, y: b.bottom },
                    { x: T, y: b.bottom },
                  ],
                  side: R,
                }),
                  window.clearTimeout(h.current),
                  (h.current = window.setTimeout(() => f.onPointerGraceIntentChange(null), 300)));
              } else {
                if ((f.onTriggerLeave(y), y.defaultPrevented)) return;
                f.onPointerGraceIntentChange(null);
              }
            }),
          ),
          onKeyDown: Z(l.onKeyDown, (y) => {
            const b = f.searchRef.current !== "";
            l.disabled ||
              (b && y.key === " ") ||
              (FA[i.dir].includes(y.key) &&
                (r.onOpenChange(!0), r.content?.focus(), y.preventDefault()));
          }),
        }),
      })
    );
  });
hS.displayName = Io;
var vS = "MenuSubContent",
  mS = p.forwardRef((l, o) => {
    const r = Wy(It, l.__scopeMenu),
      { forceMount: i = r.forceMount, ...c } = l,
      f = Xl(It, l.__scopeMenu),
      d = cr(It, l.__scopeMenu),
      h = pS(vS, l.__scopeMenu),
      v = p.useRef(null),
      m = de(o, v);
    return E.jsx(Fo.Provider, {
      scope: l.__scopeMenu,
      children: E.jsx(et, {
        present: i || f.open,
        children: E.jsx(Fo.Slot, {
          scope: l.__scopeMenu,
          children: E.jsx(od, {
            id: h.contentId,
            "aria-labelledby": h.triggerId,
            ...c,
            ref: m,
            align: "start",
            side: d.dir === "rtl" ? "left" : "right",
            disableOutsidePointerEvents: !1,
            disableOutsideScroll: !1,
            trapFocus: !1,
            onOpenAutoFocus: (S) => {
              (d.isUsingKeyboardRef.current && v.current?.focus(), S.preventDefault());
            },
            onCloseAutoFocus: (S) => S.preventDefault(),
            onFocusOutside: Z(l.onFocusOutside, (S) => {
              S.target !== h.trigger && f.onOpenChange(!1);
            }),
            onEscapeKeyDown: Z(l.onEscapeKeyDown, (S) => {
              (d.onClose(), S.preventDefault());
            }),
            onKeyDown: Z(l.onKeyDown, (S) => {
              const y = S.currentTarget.contains(S.target),
                b = JA[d.dir].includes(S.key);
              y && b && (f.onOpenChange(!1), h.trigger?.focus(), S.preventDefault());
            }),
          }),
        }),
      }),
    });
  });
mS.displayName = vS;
function gS(l) {
  return l ? "open" : "closed";
}
function Ki(l) {
  return l === "indeterminate";
}
function ud(l) {
  return Ki(l) ? "indeterminate" : l ? "checked" : "unchecked";
}
function y_(l) {
  const o = document.activeElement;
  for (const r of l) if (r === o || (r.focus(), document.activeElement !== o)) return;
}
function S_(l, o) {
  return l.map((r, i) => l[(o + i) % l.length]);
}
function b_(l, o, r) {
  const c = o.length > 1 && Array.from(o).every((m) => m === o[0]) ? o[0] : o,
    f = r ? l.indexOf(r) : -1;
  let d = S_(l, Math.max(f, 0));
  c.length === 1 && (d = d.filter((m) => m !== r));
  const v = d.find((m) => m.toLowerCase().startsWith(c.toLowerCase()));
  return v !== r ? v : void 0;
}
function x_(l, o) {
  const { x: r, y: i } = l;
  let c = !1;
  for (let f = 0, d = o.length - 1; f < o.length; d = f++) {
    const h = o[f],
      v = o[d],
      m = h.x,
      S = h.y,
      y = v.x,
      b = v.y;
    S > i != b > i && r < ((y - m) * (i - S)) / (b - S) + m && (c = !c);
  }
  return c;
}
function E_(l, o) {
  if (!o) return !1;
  const r = { x: l.clientX, y: l.clientY };
  return x_(r, o);
}
function Jo(l) {
  return (o) => (o.pointerType === "mouse" ? l(o) : void 0);
}
var yS = Jy,
  SS = nd,
  bS = eS,
  xS = tS,
  ES = rd,
  CS = nS,
  RS = gu,
  TS = aS,
  wS = rS,
  AS = uS,
  _S = sS,
  MS = fS,
  OS = dS,
  DS = hS,
  NS = mS,
  yu = "DropdownMenu",
  [C_] = ut(yu, [vu]),
  pt = vu(),
  [R_, zS] = C_(yu),
  jS = (l) => {
    const {
        __scopeDropdownMenu: o,
        children: r,
        dir: i,
        open: c,
        defaultOpen: f,
        onOpenChange: d,
        modal: h = !0,
      } = l,
      v = pt(o),
      m = p.useRef(null),
      [S, y] = Kt({ prop: c, defaultProp: f ?? !1, onChange: d, caller: yu });
    return E.jsx(R_, {
      scope: o,
      triggerId: zt(),
      triggerRef: m,
      contentId: zt(),
      open: S,
      onOpenChange: y,
      onOpenToggle: p.useCallback(() => y((b) => !b), [y]),
      modal: h,
      children: E.jsx(yS, { ...v, open: S, onOpenChange: y, dir: i, modal: h, children: r }),
    });
  };
jS.displayName = yu;
var LS = "DropdownMenuTrigger",
  US = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, disabled: i = !1, ...c } = l,
      f = zS(LS, r),
      d = pt(r);
    return E.jsx(SS, {
      asChild: !0,
      ...d,
      children: E.jsx(re.button, {
        type: "button",
        id: f.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": f.open,
        "aria-controls": f.open ? f.contentId : void 0,
        "data-state": f.open ? "open" : "closed",
        "data-disabled": i ? "" : void 0,
        disabled: i,
        ...c,
        ref: sn(o, f.triggerRef),
        onPointerDown: Z(l.onPointerDown, (h) => {
          !i &&
            h.button === 0 &&
            h.ctrlKey === !1 &&
            (f.onOpenToggle(), f.open || h.preventDefault());
        }),
        onKeyDown: Z(l.onKeyDown, (h) => {
          i ||
            (["Enter", " "].includes(h.key) && f.onOpenToggle(),
            h.key === "ArrowDown" && f.onOpenChange(!0),
            ["Enter", " ", "ArrowDown"].includes(h.key) && h.preventDefault());
        }),
      }),
    });
  });
US.displayName = LS;
var T_ = "DropdownMenuPortal",
  BS = (l) => {
    const { __scopeDropdownMenu: o, ...r } = l,
      i = pt(o);
    return E.jsx(bS, { ...i, ...r });
  };
BS.displayName = T_;
var HS = "DropdownMenuContent",
  PS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = zS(HS, r),
      f = pt(r),
      d = p.useRef(!1);
    return E.jsx(xS, {
      id: c.contentId,
      "aria-labelledby": c.triggerId,
      ...f,
      ...i,
      ref: o,
      onCloseAutoFocus: Z(l.onCloseAutoFocus, (h) => {
        (d.current || c.triggerRef.current?.focus(), (d.current = !1), h.preventDefault());
      }),
      onInteractOutside: Z(l.onInteractOutside, (h) => {
        const v = h.detail.originalEvent,
          m = v.button === 0 && v.ctrlKey === !0,
          S = v.button === 2 || m;
        (!c.modal || S) && (d.current = !0);
      }),
      style: {
        ...l.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
PS.displayName = HS;
var w_ = "DropdownMenuGroup",
  A_ = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(ES, { ...c, ...i, ref: o });
  });
A_.displayName = w_;
var __ = "DropdownMenuLabel",
  VS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(CS, { ...c, ...i, ref: o });
  });
VS.displayName = __;
var M_ = "DropdownMenuItem",
  GS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(RS, { ...c, ...i, ref: o });
  });
GS.displayName = M_;
var O_ = "DropdownMenuCheckboxItem",
  YS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(TS, { ...c, ...i, ref: o });
  });
YS.displayName = O_;
var D_ = "DropdownMenuRadioGroup",
  N_ = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(wS, { ...c, ...i, ref: o });
  });
N_.displayName = D_;
var z_ = "DropdownMenuRadioItem",
  qS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(AS, { ...c, ...i, ref: o });
  });
qS.displayName = z_;
var j_ = "DropdownMenuItemIndicator",
  XS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(_S, { ...c, ...i, ref: o });
  });
XS.displayName = j_;
var L_ = "DropdownMenuSeparator",
  IS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(MS, { ...c, ...i, ref: o });
  });
IS.displayName = L_;
var U_ = "DropdownMenuArrow",
  B_ = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(OS, { ...c, ...i, ref: o });
  });
B_.displayName = U_;
var H_ = "DropdownMenuSubTrigger",
  KS = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(DS, { ...c, ...i, ref: o });
  });
KS.displayName = H_;
var P_ = "DropdownMenuSubContent",
  $S = p.forwardRef((l, o) => {
    const { __scopeDropdownMenu: r, ...i } = l,
      c = pt(r);
    return E.jsx(NS, {
      ...c,
      ...i,
      ref: o,
      style: {
        ...l.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
$S.displayName = P_;
var mD = jS,
  gD = US,
  yD = BS,
  SD = PS,
  bD = VS,
  xD = GS,
  ED = YS,
  CD = qS,
  RD = XS,
  TD = IS,
  wD = KS,
  AD = $S;
function Wo(l, [o, r]) {
  return Math.min(r, Math.max(o, l));
}
function V_(l) {
  const o = G_(l),
    r = p.forwardRef((i, c) => {
      const { children: f, ...d } = i,
        h = p.Children.toArray(f),
        v = h.find(q_);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
function G_(l) {
  const o = p.forwardRef((r, i) => {
    const { children: c, ...f } = r;
    if (p.isValidElement(c)) {
      const d = I_(c),
        h = X_(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var Y_ = Symbol("radix.slottable");
function q_(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === Y_
  );
}
function X_(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function I_(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
function Su(l) {
  const o = p.useRef({ value: l, previous: l });
  return p.useMemo(
    () => (
      o.current.value !== l && ((o.current.previous = o.current.value), (o.current.value = l)),
      o.current.previous
    ),
    [l],
  );
}
var K_ = [" ", "Enter", "ArrowUp", "ArrowDown"],
  $_ = [" ", "Enter"],
  Gl = "Select",
  [bu, xu, Q_] = pu(Gl),
  [$a] = ut(Gl, [Q_, hl]),
  Eu = hl(),
  [Z_, vl] = $a(Gl),
  [k_, F_] = $a(Gl),
  QS = (l) => {
    const {
        __scopeSelect: o,
        children: r,
        open: i,
        defaultOpen: c,
        onOpenChange: f,
        value: d,
        defaultValue: h,
        onValueChange: v,
        dir: m,
        name: S,
        autoComplete: y,
        disabled: b,
        required: R,
        form: w,
      } = l,
      C = Eu(o),
      [T, _] = p.useState(null),
      [D, N] = p.useState(null),
      [B, K] = p.useState(!1),
      F = Ka(m),
      [V, ee] = Kt({ prop: i, defaultProp: c ?? !1, onChange: f, caller: Gl }),
      [te, le] = Kt({ prop: d, defaultProp: h, onChange: v, caller: Gl }),
      ne = p.useRef(null),
      ie = T ? w || !!T.closest("form") : !0,
      [ve, pe] = p.useState(new Set()),
      ge = Array.from(ve)
        .map((j) => j.props.value)
        .join(";");
    return E.jsx(uu, {
      ...C,
      children: E.jsxs(Z_, {
        required: R,
        scope: o,
        trigger: T,
        onTriggerChange: _,
        valueNode: D,
        onValueNodeChange: N,
        valueNodeHasChildren: B,
        onValueNodeHasChildrenChange: K,
        contentId: zt(),
        value: te,
        onValueChange: le,
        open: V,
        onOpenChange: ee,
        dir: F,
        triggerPointerDownPosRef: ne,
        disabled: b,
        children: [
          E.jsx(bu.Provider, {
            scope: o,
            children: E.jsx(k_, {
              scope: l.__scopeSelect,
              onNativeOptionAdd: p.useCallback((j) => {
                pe((I) => new Set(I).add(j));
              }, []),
              onNativeOptionRemove: p.useCallback((j) => {
                pe((I) => {
                  const $ = new Set(I);
                  return ($.delete(j), $);
                });
              }, []),
              children: r,
            }),
          }),
          ie
            ? E.jsxs(
                y0,
                {
                  "aria-hidden": !0,
                  required: R,
                  tabIndex: -1,
                  name: S,
                  autoComplete: y,
                  value: te,
                  onChange: (j) => le(j.target.value),
                  disabled: b,
                  form: w,
                  children: [te === void 0 ? E.jsx("option", { value: "" }) : null, Array.from(ve)],
                },
                ge,
              )
            : null,
        ],
      }),
    });
  };
QS.displayName = Gl;
var ZS = "SelectTrigger",
  kS = p.forwardRef((l, o) => {
    const { __scopeSelect: r, disabled: i = !1, ...c } = l,
      f = Eu(r),
      d = vl(ZS, r),
      h = d.disabled || i,
      v = de(o, d.onTriggerChange),
      m = xu(r),
      S = p.useRef("touch"),
      [y, b, R] = b0((C) => {
        const T = m().filter((N) => !N.disabled),
          _ = T.find((N) => N.value === d.value),
          D = x0(T, C, _);
        D !== void 0 && d.onValueChange(D.value);
      }),
      w = (C) => {
        (h || (d.onOpenChange(!0), R()),
          C &&
            (d.triggerPointerDownPosRef.current = {
              x: Math.round(C.pageX),
              y: Math.round(C.pageY),
            }));
      };
    return E.jsx(or, {
      asChild: !0,
      ...f,
      children: E.jsx(re.button, {
        type: "button",
        role: "combobox",
        "aria-controls": d.contentId,
        "aria-expanded": d.open,
        "aria-required": d.required,
        "aria-autocomplete": "none",
        dir: d.dir,
        "data-state": d.open ? "open" : "closed",
        disabled: h,
        "data-disabled": h ? "" : void 0,
        "data-placeholder": S0(d.value) ? "" : void 0,
        ...c,
        ref: v,
        onClick: Z(c.onClick, (C) => {
          (C.currentTarget.focus(), S.current !== "mouse" && w(C));
        }),
        onPointerDown: Z(c.onPointerDown, (C) => {
          S.current = C.pointerType;
          const T = C.target;
          (T.hasPointerCapture(C.pointerId) && T.releasePointerCapture(C.pointerId),
            C.button === 0 &&
              C.ctrlKey === !1 &&
              C.pointerType === "mouse" &&
              (w(C), C.preventDefault()));
        }),
        onKeyDown: Z(c.onKeyDown, (C) => {
          const T = y.current !== "";
          (!(C.ctrlKey || C.altKey || C.metaKey) && C.key.length === 1 && b(C.key),
            !(T && C.key === " ") && K_.includes(C.key) && (w(), C.preventDefault()));
        }),
      }),
    });
  });
kS.displayName = ZS;
var FS = "SelectValue",
  JS = p.forwardRef((l, o) => {
    const { __scopeSelect: r, className: i, style: c, children: f, placeholder: d = "", ...h } = l,
      v = vl(FS, r),
      { onValueNodeHasChildrenChange: m } = v,
      S = f !== void 0,
      y = de(o, v.onValueNodeChange);
    return (
      $e(() => {
        m(S);
      }, [m, S]),
      E.jsx(re.span, {
        ...h,
        ref: y,
        style: { pointerEvents: "none" },
        children: S0(v.value) ? E.jsx(E.Fragment, { children: d }) : f,
      })
    );
  });
JS.displayName = FS;
var J_ = "SelectIcon",
  WS = p.forwardRef((l, o) => {
    const { __scopeSelect: r, children: i, ...c } = l;
    return E.jsx(re.span, { "aria-hidden": !0, ...c, ref: o, children: i || "▼" });
  });
WS.displayName = J_;
var W_ = "SelectPortal",
  e0 = (l) => E.jsx(qa, { asChild: !0, ...l });
e0.displayName = W_;
var Yl = "SelectContent",
  t0 = p.forwardRef((l, o) => {
    const r = vl(Yl, l.__scopeSelect),
      [i, c] = p.useState();
    if (
      ($e(() => {
        c(new DocumentFragment());
      }, []),
      !r.open)
    ) {
      const f = i;
      return f
        ? er.createPortal(
            E.jsx(n0, {
              scope: l.__scopeSelect,
              children: E.jsx(bu.Slot, {
                scope: l.__scopeSelect,
                children: E.jsx("div", { children: l.children }),
              }),
            }),
            f,
          )
        : null;
    }
    return E.jsx(l0, { ...l, ref: o });
  });
t0.displayName = Yl;
var Ft = 10,
  [n0, ml] = $a(Yl),
  eM = "SelectContentImpl",
  tM = V_("SelectContent.RemoveScroll"),
  l0 = p.forwardRef((l, o) => {
    const {
        __scopeSelect: r,
        position: i = "item-aligned",
        onCloseAutoFocus: c,
        onEscapeKeyDown: f,
        onPointerDownOutside: d,
        side: h,
        sideOffset: v,
        align: m,
        alignOffset: S,
        arrowPadding: y,
        collisionBoundary: b,
        collisionPadding: R,
        sticky: w,
        hideWhenDetached: C,
        avoidCollisions: T,
        ..._
      } = l,
      D = vl(Yl, r),
      [N, B] = p.useState(null),
      [K, F] = p.useState(null),
      V = de(o, (k) => B(k)),
      [ee, te] = p.useState(null),
      [le, ne] = p.useState(null),
      ie = xu(r),
      [ve, pe] = p.useState(!1),
      ge = p.useRef(!1);
    (p.useEffect(() => {
      if (N) return tu(N);
    }, [N]),
      Wi());
    const j = p.useCallback(
        (k) => {
          const [Se, ...xe] = ie().map((Ve) => Ve.ref.current),
            [Me] = xe.slice(-1),
            De = document.activeElement;
          for (const Ve of k)
            if (
              Ve === De ||
              (Ve?.scrollIntoView({ block: "nearest" }),
              Ve === Se && K && (K.scrollTop = 0),
              Ve === Me && K && (K.scrollTop = K.scrollHeight),
              Ve?.focus(),
              document.activeElement !== De)
            )
              return;
        },
        [ie, K],
      ),
      I = p.useCallback(() => j([ee, N]), [j, ee, N]);
    p.useEffect(() => {
      ve && I();
    }, [ve, I]);
    const { onOpenChange: $, triggerPointerDownPosRef: Q } = D;
    (p.useEffect(() => {
      if (N) {
        let k = { x: 0, y: 0 };
        const Se = (Me) => {
            k = {
              x: Math.abs(Math.round(Me.pageX) - (Q.current?.x ?? 0)),
              y: Math.abs(Math.round(Me.pageY) - (Q.current?.y ?? 0)),
            };
          },
          xe = (Me) => {
            (k.x <= 10 && k.y <= 10 ? Me.preventDefault() : N.contains(Me.target) || $(!1),
              document.removeEventListener("pointermove", Se),
              (Q.current = null));
          };
        return (
          Q.current !== null &&
            (document.addEventListener("pointermove", Se),
            document.addEventListener("pointerup", xe, { capture: !0, once: !0 })),
          () => {
            (document.removeEventListener("pointermove", Se),
              document.removeEventListener("pointerup", xe, { capture: !0 }));
          }
        );
      }
    }, [N, $, Q]),
      p.useEffect(() => {
        const k = () => $(!1);
        return (
          window.addEventListener("blur", k),
          window.addEventListener("resize", k),
          () => {
            (window.removeEventListener("blur", k), window.removeEventListener("resize", k));
          }
        );
      }, [$]));
    const [he, M] = b0((k) => {
        const Se = ie().filter((De) => !De.disabled),
          xe = Se.find((De) => De.ref.current === document.activeElement),
          Me = x0(Se, k, xe);
        Me && setTimeout(() => Me.ref.current.focus());
      }),
      Y = p.useCallback(
        (k, Se, xe) => {
          const Me = !ge.current && !xe;
          ((D.value !== void 0 && D.value === Se) || Me) && (te(k), Me && (ge.current = !0));
        },
        [D.value],
      ),
      J = p.useCallback(() => N?.focus(), [N]),
      W = p.useCallback(
        (k, Se, xe) => {
          const Me = !ge.current && !xe;
          ((D.value !== void 0 && D.value === Se) || Me) && ne(k);
        },
        [D.value],
      ),
      ce = i === "popper" ? wf : a0,
      se =
        ce === wf
          ? {
              side: h,
              sideOffset: v,
              align: m,
              alignOffset: S,
              arrowPadding: y,
              collisionBoundary: b,
              collisionPadding: R,
              sticky: w,
              hideWhenDetached: C,
              avoidCollisions: T,
            }
          : {};
    return E.jsx(n0, {
      scope: r,
      content: N,
      viewport: K,
      onViewportChange: F,
      itemRefCallback: Y,
      selectedItem: ee,
      onItemLeave: J,
      itemTextRefCallback: W,
      focusSelectedItem: I,
      selectedItemText: le,
      position: i,
      isPositioned: ve,
      searchRef: he,
      children: E.jsx(lr, {
        as: tM,
        allowPinchZoom: !0,
        children: E.jsx(nr, {
          asChild: !0,
          trapped: D.open,
          onMountAutoFocus: (k) => {
            k.preventDefault();
          },
          onUnmountAutoFocus: Z(c, (k) => {
            (D.trigger?.focus({ preventScroll: !0 }), k.preventDefault());
          }),
          children: E.jsx(Ya, {
            asChild: !0,
            disableOutsidePointerEvents: !0,
            onEscapeKeyDown: f,
            onPointerDownOutside: d,
            onFocusOutside: (k) => k.preventDefault(),
            onDismiss: () => D.onOpenChange(!1),
            children: E.jsx(ce, {
              role: "listbox",
              id: D.contentId,
              "data-state": D.open ? "open" : "closed",
              dir: D.dir,
              onContextMenu: (k) => k.preventDefault(),
              ..._,
              ...se,
              onPlaced: () => pe(!0),
              ref: V,
              style: { display: "flex", flexDirection: "column", outline: "none", ..._.style },
              onKeyDown: Z(_.onKeyDown, (k) => {
                const Se = k.ctrlKey || k.altKey || k.metaKey;
                if (
                  (k.key === "Tab" && k.preventDefault(),
                  !Se && k.key.length === 1 && M(k.key),
                  ["ArrowUp", "ArrowDown", "Home", "End"].includes(k.key))
                ) {
                  let Me = ie()
                    .filter((De) => !De.disabled)
                    .map((De) => De.ref.current);
                  if (
                    (["ArrowUp", "End"].includes(k.key) && (Me = Me.slice().reverse()),
                    ["ArrowUp", "ArrowDown"].includes(k.key))
                  ) {
                    const De = k.target,
                      Ve = Me.indexOf(De);
                    Me = Me.slice(Ve + 1);
                  }
                  (setTimeout(() => j(Me)), k.preventDefault());
                }
              }),
            }),
          }),
        }),
      }),
    });
  });
l0.displayName = eM;
var nM = "SelectItemAlignedPosition",
  a0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, onPlaced: i, ...c } = l,
      f = vl(Yl, r),
      d = ml(Yl, r),
      [h, v] = p.useState(null),
      [m, S] = p.useState(null),
      y = de(o, (V) => S(V)),
      b = xu(r),
      R = p.useRef(!1),
      w = p.useRef(!0),
      { viewport: C, selectedItem: T, selectedItemText: _, focusSelectedItem: D } = d,
      N = p.useCallback(() => {
        if (f.trigger && f.valueNode && h && m && C && T && _) {
          const V = f.trigger.getBoundingClientRect(),
            ee = m.getBoundingClientRect(),
            te = f.valueNode.getBoundingClientRect(),
            le = _.getBoundingClientRect();
          if (f.dir !== "rtl") {
            const De = le.left - ee.left,
              Ve = te.left - De,
              st = V.left - Ve,
              ft = V.width + st,
              yl = Math.max(ft, ee.width),
              Sl = window.innerWidth - Ft,
              Za = Wo(Ve, [Ft, Math.max(Ft, Sl - yl)]);
            ((h.style.minWidth = ft + "px"), (h.style.left = Za + "px"));
          } else {
            const De = ee.right - le.right,
              Ve = window.innerWidth - te.right - De,
              st = window.innerWidth - V.right - Ve,
              ft = V.width + st,
              yl = Math.max(ft, ee.width),
              Sl = window.innerWidth - Ft,
              Za = Wo(Ve, [Ft, Math.max(Ft, Sl - yl)]);
            ((h.style.minWidth = ft + "px"), (h.style.right = Za + "px"));
          }
          const ne = b(),
            ie = window.innerHeight - Ft * 2,
            ve = C.scrollHeight,
            pe = window.getComputedStyle(m),
            ge = parseInt(pe.borderTopWidth, 10),
            j = parseInt(pe.paddingTop, 10),
            I = parseInt(pe.borderBottomWidth, 10),
            $ = parseInt(pe.paddingBottom, 10),
            Q = ge + j + ve + $ + I,
            he = Math.min(T.offsetHeight * 5, Q),
            M = window.getComputedStyle(C),
            Y = parseInt(M.paddingTop, 10),
            J = parseInt(M.paddingBottom, 10),
            W = V.top + V.height / 2 - Ft,
            ce = ie - W,
            se = T.offsetHeight / 2,
            k = T.offsetTop + se,
            Se = ge + j + k,
            xe = Q - Se;
          if (Se <= W) {
            const De = ne.length > 0 && T === ne[ne.length - 1].ref.current;
            h.style.bottom = "0px";
            const Ve = m.clientHeight - C.offsetTop - C.offsetHeight,
              st = Math.max(ce, se + (De ? J : 0) + Ve + I),
              ft = Se + st;
            h.style.height = ft + "px";
          } else {
            const De = ne.length > 0 && T === ne[0].ref.current;
            h.style.top = "0px";
            const st = Math.max(W, ge + C.offsetTop + (De ? Y : 0) + se) + xe;
            ((h.style.height = st + "px"), (C.scrollTop = Se - W + C.offsetTop));
          }
          ((h.style.margin = `${Ft}px 0`),
            (h.style.minHeight = he + "px"),
            (h.style.maxHeight = ie + "px"),
            i?.(),
            requestAnimationFrame(() => (R.current = !0)));
        }
      }, [b, f.trigger, f.valueNode, h, m, C, T, _, f.dir, i]);
    $e(() => N(), [N]);
    const [B, K] = p.useState();
    $e(() => {
      m && K(window.getComputedStyle(m).zIndex);
    }, [m]);
    const F = p.useCallback(
      (V) => {
        V && w.current === !0 && (N(), D?.(), (w.current = !1));
      },
      [N, D],
    );
    return E.jsx(aM, {
      scope: r,
      contentWrapper: h,
      shouldExpandOnScrollRef: R,
      onScrollButtonChange: F,
      children: E.jsx("div", {
        ref: v,
        style: { display: "flex", flexDirection: "column", position: "fixed", zIndex: B },
        children: E.jsx(re.div, {
          ...c,
          ref: y,
          style: { boxSizing: "border-box", maxHeight: "100%", ...c.style },
        }),
      }),
    });
  });
a0.displayName = nM;
var lM = "SelectPopperPosition",
  wf = p.forwardRef((l, o) => {
    const { __scopeSelect: r, align: i = "start", collisionPadding: c = Ft, ...f } = l,
      d = Eu(r);
    return E.jsx(cu, {
      ...d,
      ...f,
      ref: o,
      align: i,
      collisionPadding: c,
      style: {
        boxSizing: "border-box",
        ...f.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
wf.displayName = lM;
var [aM, cd] = $a(Yl, {}),
  Af = "SelectViewport",
  o0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, nonce: i, ...c } = l,
      f = ml(Af, r),
      d = cd(Af, r),
      h = de(o, f.onViewportChange),
      v = p.useRef(0);
    return E.jsxs(E.Fragment, {
      children: [
        E.jsx("style", {
          dangerouslySetInnerHTML: {
            __html:
              "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}",
          },
          nonce: i,
        }),
        E.jsx(bu.Slot, {
          scope: r,
          children: E.jsx(re.div, {
            "data-radix-select-viewport": "",
            role: "presentation",
            ...c,
            ref: h,
            style: { position: "relative", flex: 1, overflow: "hidden auto", ...c.style },
            onScroll: Z(c.onScroll, (m) => {
              const S = m.currentTarget,
                { contentWrapper: y, shouldExpandOnScrollRef: b } = d;
              if (b?.current && y) {
                const R = Math.abs(v.current - S.scrollTop);
                if (R > 0) {
                  const w = window.innerHeight - Ft * 2,
                    C = parseFloat(y.style.minHeight),
                    T = parseFloat(y.style.height),
                    _ = Math.max(C, T);
                  if (_ < w) {
                    const D = _ + R,
                      N = Math.min(w, D),
                      B = D - N;
                    ((y.style.height = N + "px"),
                      y.style.bottom === "0px" &&
                        ((S.scrollTop = B > 0 ? B : 0), (y.style.justifyContent = "flex-end")));
                  }
                }
              }
              v.current = S.scrollTop;
            }),
          }),
        }),
      ],
    });
  });
o0.displayName = Af;
var r0 = "SelectGroup",
  [oM, rM] = $a(r0),
  iM = p.forwardRef((l, o) => {
    const { __scopeSelect: r, ...i } = l,
      c = zt();
    return E.jsx(oM, {
      scope: r,
      id: c,
      children: E.jsx(re.div, { role: "group", "aria-labelledby": c, ...i, ref: o }),
    });
  });
iM.displayName = r0;
var i0 = "SelectLabel",
  u0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, ...i } = l,
      c = rM(i0, r);
    return E.jsx(re.div, { id: c.id, ...i, ref: o });
  });
u0.displayName = i0;
var $i = "SelectItem",
  [uM, c0] = $a($i),
  s0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, value: i, disabled: c = !1, textValue: f, ...d } = l,
      h = vl($i, r),
      v = ml($i, r),
      m = h.value === i,
      [S, y] = p.useState(f ?? ""),
      [b, R] = p.useState(!1),
      w = de(o, (D) => v.itemRefCallback?.(D, i, c)),
      C = zt(),
      T = p.useRef("touch"),
      _ = () => {
        c || (h.onValueChange(i), h.onOpenChange(!1));
      };
    if (i === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.",
      );
    return E.jsx(uM, {
      scope: r,
      value: i,
      disabled: c,
      textId: C,
      isSelected: m,
      onItemTextChange: p.useCallback((D) => {
        y((N) => N || (D?.textContent ?? "").trim());
      }, []),
      children: E.jsx(bu.ItemSlot, {
        scope: r,
        value: i,
        disabled: c,
        textValue: S,
        children: E.jsx(re.div, {
          role: "option",
          "aria-labelledby": C,
          "data-highlighted": b ? "" : void 0,
          "aria-selected": m && b,
          "data-state": m ? "checked" : "unchecked",
          "aria-disabled": c || void 0,
          "data-disabled": c ? "" : void 0,
          tabIndex: c ? void 0 : -1,
          ...d,
          ref: w,
          onFocus: Z(d.onFocus, () => R(!0)),
          onBlur: Z(d.onBlur, () => R(!1)),
          onClick: Z(d.onClick, () => {
            T.current !== "mouse" && _();
          }),
          onPointerUp: Z(d.onPointerUp, () => {
            T.current === "mouse" && _();
          }),
          onPointerDown: Z(d.onPointerDown, (D) => {
            T.current = D.pointerType;
          }),
          onPointerMove: Z(d.onPointerMove, (D) => {
            ((T.current = D.pointerType),
              c
                ? v.onItemLeave?.()
                : T.current === "mouse" && D.currentTarget.focus({ preventScroll: !0 }));
          }),
          onPointerLeave: Z(d.onPointerLeave, (D) => {
            D.currentTarget === document.activeElement && v.onItemLeave?.();
          }),
          onKeyDown: Z(d.onKeyDown, (D) => {
            (v.searchRef?.current !== "" && D.key === " ") ||
              ($_.includes(D.key) && _(), D.key === " " && D.preventDefault());
          }),
        }),
      }),
    });
  });
s0.displayName = $i;
var Ko = "SelectItemText",
  f0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, className: i, style: c, ...f } = l,
      d = vl(Ko, r),
      h = ml(Ko, r),
      v = c0(Ko, r),
      m = F_(Ko, r),
      [S, y] = p.useState(null),
      b = de(
        o,
        (_) => y(_),
        v.onItemTextChange,
        (_) => h.itemTextRefCallback?.(_, v.value, v.disabled),
      ),
      R = S?.textContent,
      w = p.useMemo(
        () => E.jsx("option", { value: v.value, disabled: v.disabled, children: R }, v.value),
        [v.disabled, v.value, R],
      ),
      { onNativeOptionAdd: C, onNativeOptionRemove: T } = m;
    return (
      $e(() => (C(w), () => T(w)), [C, T, w]),
      E.jsxs(E.Fragment, {
        children: [
          E.jsx(re.span, { id: v.textId, ...f, ref: b }),
          v.isSelected && d.valueNode && !d.valueNodeHasChildren
            ? er.createPortal(f.children, d.valueNode)
            : null,
        ],
      })
    );
  });
f0.displayName = Ko;
var d0 = "SelectItemIndicator",
  p0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, ...i } = l;
    return c0(d0, r).isSelected ? E.jsx(re.span, { "aria-hidden": !0, ...i, ref: o }) : null;
  });
p0.displayName = d0;
var _f = "SelectScrollUpButton",
  h0 = p.forwardRef((l, o) => {
    const r = ml(_f, l.__scopeSelect),
      i = cd(_f, l.__scopeSelect),
      [c, f] = p.useState(!1),
      d = de(o, i.onScrollButtonChange);
    return (
      $e(() => {
        if (r.viewport && r.isPositioned) {
          let h = function () {
            const m = v.scrollTop > 0;
            f(m);
          };
          const v = r.viewport;
          return (h(), v.addEventListener("scroll", h), () => v.removeEventListener("scroll", h));
        }
      }, [r.viewport, r.isPositioned]),
      c
        ? E.jsx(m0, {
            ...l,
            ref: d,
            onAutoScroll: () => {
              const { viewport: h, selectedItem: v } = r;
              h && v && (h.scrollTop = h.scrollTop - v.offsetHeight);
            },
          })
        : null
    );
  });
h0.displayName = _f;
var Mf = "SelectScrollDownButton",
  v0 = p.forwardRef((l, o) => {
    const r = ml(Mf, l.__scopeSelect),
      i = cd(Mf, l.__scopeSelect),
      [c, f] = p.useState(!1),
      d = de(o, i.onScrollButtonChange);
    return (
      $e(() => {
        if (r.viewport && r.isPositioned) {
          let h = function () {
            const m = v.scrollHeight - v.clientHeight,
              S = Math.ceil(v.scrollTop) < m;
            f(S);
          };
          const v = r.viewport;
          return (h(), v.addEventListener("scroll", h), () => v.removeEventListener("scroll", h));
        }
      }, [r.viewport, r.isPositioned]),
      c
        ? E.jsx(m0, {
            ...l,
            ref: d,
            onAutoScroll: () => {
              const { viewport: h, selectedItem: v } = r;
              h && v && (h.scrollTop = h.scrollTop + v.offsetHeight);
            },
          })
        : null
    );
  });
v0.displayName = Mf;
var m0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, onAutoScroll: i, ...c } = l,
      f = ml("SelectScrollButton", r),
      d = p.useRef(null),
      h = xu(r),
      v = p.useCallback(() => {
        d.current !== null && (window.clearInterval(d.current), (d.current = null));
      }, []);
    return (
      p.useEffect(() => () => v(), [v]),
      $e(() => {
        h()
          .find((S) => S.ref.current === document.activeElement)
          ?.ref.current?.scrollIntoView({ block: "nearest" });
      }, [h]),
      E.jsx(re.div, {
        "aria-hidden": !0,
        ...c,
        ref: o,
        style: { flexShrink: 0, ...c.style },
        onPointerDown: Z(c.onPointerDown, () => {
          d.current === null && (d.current = window.setInterval(i, 50));
        }),
        onPointerMove: Z(c.onPointerMove, () => {
          (f.onItemLeave?.(), d.current === null && (d.current = window.setInterval(i, 50)));
        }),
        onPointerLeave: Z(c.onPointerLeave, () => {
          v();
        }),
      })
    );
  }),
  cM = "SelectSeparator",
  g0 = p.forwardRef((l, o) => {
    const { __scopeSelect: r, ...i } = l;
    return E.jsx(re.div, { "aria-hidden": !0, ...i, ref: o });
  });
g0.displayName = cM;
var Of = "SelectArrow",
  sM = p.forwardRef((l, o) => {
    const { __scopeSelect: r, ...i } = l,
      c = Eu(r),
      f = vl(Of, r),
      d = ml(Of, r);
    return f.open && d.position === "popper" ? E.jsx(su, { ...c, ...i, ref: o }) : null;
  });
sM.displayName = Of;
var fM = "SelectBubbleInput",
  y0 = p.forwardRef(({ __scopeSelect: l, value: o, ...r }, i) => {
    const c = p.useRef(null),
      f = de(i, c),
      d = Su(o);
    return (
      p.useEffect(() => {
        const h = c.current;
        if (!h) return;
        const v = window.HTMLSelectElement.prototype,
          S = Object.getOwnPropertyDescriptor(v, "value").set;
        if (d !== o && S) {
          const y = new Event("change", { bubbles: !0 });
          (S.call(h, o), h.dispatchEvent(y));
        }
      }, [d, o]),
      E.jsx(re.select, { ...r, style: { ...Ay, ...r.style }, ref: f, defaultValue: o })
    );
  });
y0.displayName = fM;
function S0(l) {
  return l === "" || l === void 0;
}
function b0(l) {
  const o = We(l),
    r = p.useRef(""),
    i = p.useRef(0),
    c = p.useCallback(
      (d) => {
        const h = r.current + d;
        (o(h),
          (function v(m) {
            ((r.current = m),
              window.clearTimeout(i.current),
              m !== "" && (i.current = window.setTimeout(() => v(""), 1e3)));
          })(h));
      },
      [o],
    ),
    f = p.useCallback(() => {
      ((r.current = ""), window.clearTimeout(i.current));
    }, []);
  return (p.useEffect(() => () => window.clearTimeout(i.current), []), [r, c, f]);
}
function x0(l, o, r) {
  const c = o.length > 1 && Array.from(o).every((m) => m === o[0]) ? o[0] : o,
    f = r ? l.indexOf(r) : -1;
  let d = dM(l, Math.max(f, 0));
  c.length === 1 && (d = d.filter((m) => m !== r));
  const v = d.find((m) => m.textValue.toLowerCase().startsWith(c.toLowerCase()));
  return v !== r ? v : void 0;
}
function dM(l, o) {
  return l.map((r, i) => l[(o + i) % l.length]);
}
var _D = QS,
  MD = kS,
  OD = JS,
  DD = WS,
  ND = e0,
  zD = t0,
  jD = o0,
  LD = u0,
  UD = s0,
  BD = f0,
  HD = p0,
  PD = h0,
  VD = v0,
  GD = g0,
  pM = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  YD = pM.reduce((l, o) => {
    const r = tr(`Primitive.${o}`),
      i = p.forwardRef((c, f) => {
        const { asChild: d, ...h } = c,
          v = d ? r : o;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          E.jsx(v, { ...h, ref: f })
        );
      });
    return ((i.displayName = `Primitive.${o}`), { ...l, [o]: i });
  }, {}),
  hM = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  vM = hM.reduce((l, o) => {
    const r = tr(`Primitive.${o}`),
      i = p.forwardRef((c, f) => {
        const { asChild: d, ...h } = c,
          v = d ? r : o;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          E.jsx(v, { ...h, ref: f })
        );
      });
    return ((i.displayName = `Primitive.${o}`), { ...l, [o]: i });
  }, {}),
  mM = "Label",
  E0 = p.forwardRef((l, o) =>
    E.jsx(vM.label, {
      ...l,
      ref: o,
      onMouseDown: (r) => {
        r.target.closest("button, input, select, textarea") ||
          (l.onMouseDown?.(r), !r.defaultPrevented && r.detail > 1 && r.preventDefault());
      },
    }),
  );
E0.displayName = mM;
var qD = E0;
function gM(l) {
  const o = yM(l),
    r = p.forwardRef((i, c) => {
      const { children: f, ...d } = i,
        h = p.Children.toArray(f),
        v = h.find(bM);
      if (v) {
        const m = v.props.children,
          S = h.map((y) =>
            y === v
              ? p.Children.count(m) > 1
                ? p.Children.only(null)
                : p.isValidElement(m)
                  ? m.props.children
                  : null
              : y,
          );
        return E.jsx(o, {
          ...d,
          ref: c,
          children: p.isValidElement(m) ? p.cloneElement(m, void 0, S) : null,
        });
      }
      return E.jsx(o, { ...d, ref: c, children: f });
    });
  return ((r.displayName = `${l}.Slot`), r);
}
function yM(l) {
  const o = p.forwardRef((r, i) => {
    const { children: c, ...f } = r;
    if (p.isValidElement(c)) {
      const d = EM(c),
        h = xM(f, c.props);
      return (c.type !== p.Fragment && (h.ref = i ? sn(i, d) : d), p.cloneElement(c, h));
    }
    return p.Children.count(c) > 1 ? p.Children.only(null) : null;
  });
  return ((o.displayName = `${l}.SlotClone`), o);
}
var SM = Symbol("radix.slottable");
function bM(l) {
  return (
    p.isValidElement(l) &&
    typeof l.type == "function" &&
    "__radixId" in l.type &&
    l.type.__radixId === SM
  );
}
function xM(l, o) {
  const r = { ...o };
  for (const i in o) {
    const c = l[i],
      f = o[i];
    /^on[A-Z]/.test(i)
      ? c && f
        ? (r[i] = (...h) => {
            const v = f(...h);
            return (c(...h), v);
          })
        : c && (r[i] = c)
      : i === "style"
        ? (r[i] = { ...c, ...f })
        : i === "className" && (r[i] = [c, f].filter(Boolean).join(" "));
  }
  return { ...l, ...r };
}
function EM(l) {
  let o = Object.getOwnPropertyDescriptor(l.props, "ref")?.get,
    r = o && "isReactWarning" in o && o.isReactWarning;
  return r
    ? l.ref
    : ((o = Object.getOwnPropertyDescriptor(l, "ref")?.get),
      (r = o && "isReactWarning" in o && o.isReactWarning),
      r ? l.props.ref : l.props.ref || l.ref);
}
var Cu = "Popover",
  [C0] = ut(Cu, [hl]),
  sr = hl(),
  [CM, gl] = C0(Cu),
  R0 = (l) => {
    const {
        __scopePopover: o,
        children: r,
        open: i,
        defaultOpen: c,
        onOpenChange: f,
        modal: d = !1,
      } = l,
      h = sr(o),
      v = p.useRef(null),
      [m, S] = p.useState(!1),
      [y, b] = Kt({ prop: i, defaultProp: c ?? !1, onChange: f, caller: Cu });
    return E.jsx(uu, {
      ...h,
      children: E.jsx(CM, {
        scope: o,
        contentId: zt(),
        triggerRef: v,
        open: y,
        onOpenChange: b,
        onOpenToggle: p.useCallback(() => b((R) => !R), [b]),
        hasCustomAnchor: m,
        onCustomAnchorAdd: p.useCallback(() => S(!0), []),
        onCustomAnchorRemove: p.useCallback(() => S(!1), []),
        modal: d,
        children: r,
      }),
    });
  };
R0.displayName = Cu;
var T0 = "PopoverAnchor",
  w0 = p.forwardRef((l, o) => {
    const { __scopePopover: r, ...i } = l,
      c = gl(T0, r),
      f = sr(r),
      { onCustomAnchorAdd: d, onCustomAnchorRemove: h } = c;
    return (p.useEffect(() => (d(), () => h()), [d, h]), E.jsx(or, { ...f, ...i, ref: o }));
  });
w0.displayName = T0;
var A0 = "PopoverTrigger",
  _0 = p.forwardRef((l, o) => {
    const { __scopePopover: r, ...i } = l,
      c = gl(A0, r),
      f = sr(r),
      d = de(o, c.triggerRef),
      h = E.jsx(re.button, {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": c.open,
        "aria-controls": c.contentId,
        "data-state": z0(c.open),
        ...i,
        ref: d,
        onClick: Z(l.onClick, c.onOpenToggle),
      });
    return c.hasCustomAnchor ? h : E.jsx(or, { asChild: !0, ...f, children: h });
  });
_0.displayName = A0;
var sd = "PopoverPortal",
  [RM, TM] = C0(sd, { forceMount: void 0 }),
  M0 = (l) => {
    const { __scopePopover: o, forceMount: r, children: i, container: c } = l,
      f = gl(sd, o);
    return E.jsx(RM, {
      scope: o,
      forceMount: r,
      children: E.jsx(et, {
        present: r || f.open,
        children: E.jsx(qa, { asChild: !0, container: c, children: i }),
      }),
    });
  };
M0.displayName = sd;
var Ba = "PopoverContent",
  O0 = p.forwardRef((l, o) => {
    const r = TM(Ba, l.__scopePopover),
      { forceMount: i = r.forceMount, ...c } = l,
      f = gl(Ba, l.__scopePopover);
    return E.jsx(et, {
      present: i || f.open,
      children: f.modal ? E.jsx(AM, { ...c, ref: o }) : E.jsx(_M, { ...c, ref: o }),
    });
  });
O0.displayName = Ba;
var wM = gM("PopoverContent.RemoveScroll"),
  AM = p.forwardRef((l, o) => {
    const r = gl(Ba, l.__scopePopover),
      i = p.useRef(null),
      c = de(o, i),
      f = p.useRef(!1);
    return (
      p.useEffect(() => {
        const d = i.current;
        if (d) return tu(d);
      }, []),
      E.jsx(lr, {
        as: wM,
        allowPinchZoom: !0,
        children: E.jsx(D0, {
          ...l,
          ref: c,
          trapFocus: r.open,
          disableOutsidePointerEvents: !0,
          onCloseAutoFocus: Z(l.onCloseAutoFocus, (d) => {
            (d.preventDefault(), f.current || r.triggerRef.current?.focus());
          }),
          onPointerDownOutside: Z(
            l.onPointerDownOutside,
            (d) => {
              const h = d.detail.originalEvent,
                v = h.button === 0 && h.ctrlKey === !0,
                m = h.button === 2 || v;
              f.current = m;
            },
            { checkForDefaultPrevented: !1 },
          ),
          onFocusOutside: Z(l.onFocusOutside, (d) => d.preventDefault(), {
            checkForDefaultPrevented: !1,
          }),
        }),
      })
    );
  }),
  _M = p.forwardRef((l, o) => {
    const r = gl(Ba, l.__scopePopover),
      i = p.useRef(!1),
      c = p.useRef(!1);
    return E.jsx(D0, {
      ...l,
      ref: o,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (f) => {
        (l.onCloseAutoFocus?.(f),
          f.defaultPrevented || (i.current || r.triggerRef.current?.focus(), f.preventDefault()),
          (i.current = !1),
          (c.current = !1));
      },
      onInteractOutside: (f) => {
        (l.onInteractOutside?.(f),
          f.defaultPrevented ||
            ((i.current = !0), f.detail.originalEvent.type === "pointerdown" && (c.current = !0)));
        const d = f.target;
        (r.triggerRef.current?.contains(d) && f.preventDefault(),
          f.detail.originalEvent.type === "focusin" && c.current && f.preventDefault());
      },
    });
  }),
  D0 = p.forwardRef((l, o) => {
    const {
        __scopePopover: r,
        trapFocus: i,
        onOpenAutoFocus: c,
        onCloseAutoFocus: f,
        disableOutsidePointerEvents: d,
        onEscapeKeyDown: h,
        onPointerDownOutside: v,
        onFocusOutside: m,
        onInteractOutside: S,
        ...y
      } = l,
      b = gl(Ba, r),
      R = sr(r);
    return (
      Wi(),
      E.jsx(nr, {
        asChild: !0,
        loop: !0,
        trapped: i,
        onMountAutoFocus: c,
        onUnmountAutoFocus: f,
        children: E.jsx(Ya, {
          asChild: !0,
          disableOutsidePointerEvents: d,
          onInteractOutside: S,
          onEscapeKeyDown: h,
          onPointerDownOutside: v,
          onFocusOutside: m,
          onDismiss: () => b.onOpenChange(!1),
          children: E.jsx(cu, {
            "data-state": z0(b.open),
            role: "dialog",
            id: b.contentId,
            ...R,
            ...y,
            ref: o,
            style: {
              ...y.style,
              "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
              "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
              "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)",
            },
          }),
        }),
      })
    );
  }),
  N0 = "PopoverClose",
  MM = p.forwardRef((l, o) => {
    const { __scopePopover: r, ...i } = l,
      c = gl(N0, r);
    return E.jsx(re.button, {
      type: "button",
      ...i,
      ref: o,
      onClick: Z(l.onClick, () => c.onOpenChange(!1)),
    });
  });
MM.displayName = N0;
var OM = "PopoverArrow",
  DM = p.forwardRef((l, o) => {
    const { __scopePopover: r, ...i } = l,
      c = sr(r);
    return E.jsx(su, { ...c, ...i, ref: o });
  });
DM.displayName = OM;
function z0(l) {
  return l ? "open" : "closed";
}
var XD = R0,
  ID = w0,
  KD = _0,
  $D = M0,
  QD = O0;
function NM(l, o) {
  return p.useReducer((r, i) => o[r][i] ?? r, l);
}
var fd = "ScrollArea",
  [j0] = ut(fd),
  [zM, $t] = j0(fd),
  L0 = p.forwardRef((l, o) => {
    const { __scopeScrollArea: r, type: i = "hover", dir: c, scrollHideDelay: f = 600, ...d } = l,
      [h, v] = p.useState(null),
      [m, S] = p.useState(null),
      [y, b] = p.useState(null),
      [R, w] = p.useState(null),
      [C, T] = p.useState(null),
      [_, D] = p.useState(0),
      [N, B] = p.useState(0),
      [K, F] = p.useState(!1),
      [V, ee] = p.useState(!1),
      te = de(o, (ne) => v(ne)),
      le = Ka(c);
    return E.jsx(zM, {
      scope: r,
      type: i,
      dir: le,
      scrollHideDelay: f,
      scrollArea: h,
      viewport: m,
      onViewportChange: S,
      content: y,
      onContentChange: b,
      scrollbarX: R,
      onScrollbarXChange: w,
      scrollbarXEnabled: K,
      onScrollbarXEnabledChange: F,
      scrollbarY: C,
      onScrollbarYChange: T,
      scrollbarYEnabled: V,
      onScrollbarYEnabledChange: ee,
      onCornerWidthChange: D,
      onCornerHeightChange: B,
      children: E.jsx(re.div, {
        dir: le,
        ...d,
        ref: te,
        style: {
          position: "relative",
          "--radix-scroll-area-corner-width": _ + "px",
          "--radix-scroll-area-corner-height": N + "px",
          ...l.style,
        },
      }),
    });
  });
L0.displayName = fd;
var U0 = "ScrollAreaViewport",
  B0 = p.forwardRef((l, o) => {
    const { __scopeScrollArea: r, children: i, nonce: c, ...f } = l,
      d = $t(U0, r),
      h = p.useRef(null),
      v = de(o, h, d.onViewportChange);
    return E.jsxs(E.Fragment, {
      children: [
        E.jsx("style", {
          dangerouslySetInnerHTML: {
            __html:
              "[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}",
          },
          nonce: c,
        }),
        E.jsx(re.div, {
          "data-radix-scroll-area-viewport": "",
          ...f,
          ref: v,
          style: {
            overflowX: d.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: d.scrollbarYEnabled ? "scroll" : "hidden",
            ...l.style,
          },
          children: E.jsx("div", {
            ref: d.onContentChange,
            style: { minWidth: "100%", display: "table" },
            children: i,
          }),
        }),
      ],
    });
  });
B0.displayName = U0;
var dn = "ScrollAreaScrollbar",
  jM = p.forwardRef((l, o) => {
    const { forceMount: r, ...i } = l,
      c = $t(dn, l.__scopeScrollArea),
      { onScrollbarXEnabledChange: f, onScrollbarYEnabledChange: d } = c,
      h = l.orientation === "horizontal";
    return (
      p.useEffect(
        () => (
          h ? f(!0) : d(!0),
          () => {
            h ? f(!1) : d(!1);
          }
        ),
        [h, f, d],
      ),
      c.type === "hover"
        ? E.jsx(LM, { ...i, ref: o, forceMount: r })
        : c.type === "scroll"
          ? E.jsx(UM, { ...i, ref: o, forceMount: r })
          : c.type === "auto"
            ? E.jsx(H0, { ...i, ref: o, forceMount: r })
            : c.type === "always"
              ? E.jsx(dd, { ...i, ref: o })
              : null
    );
  });
jM.displayName = dn;
var LM = p.forwardRef((l, o) => {
    const { forceMount: r, ...i } = l,
      c = $t(dn, l.__scopeScrollArea),
      [f, d] = p.useState(!1);
    return (
      p.useEffect(() => {
        const h = c.scrollArea;
        let v = 0;
        if (h) {
          const m = () => {
              (window.clearTimeout(v), d(!0));
            },
            S = () => {
              v = window.setTimeout(() => d(!1), c.scrollHideDelay);
            };
          return (
            h.addEventListener("pointerenter", m),
            h.addEventListener("pointerleave", S),
            () => {
              (window.clearTimeout(v),
                h.removeEventListener("pointerenter", m),
                h.removeEventListener("pointerleave", S));
            }
          );
        }
      }, [c.scrollArea, c.scrollHideDelay]),
      E.jsx(et, {
        present: r || f,
        children: E.jsx(H0, { "data-state": f ? "visible" : "hidden", ...i, ref: o }),
      })
    );
  }),
  UM = p.forwardRef((l, o) => {
    const { forceMount: r, ...i } = l,
      c = $t(dn, l.__scopeScrollArea),
      f = l.orientation === "horizontal",
      d = Tu(() => v("SCROLL_END"), 100),
      [h, v] = NM("hidden", {
        hidden: { SCROLL: "scrolling" },
        scrolling: { SCROLL_END: "idle", POINTER_ENTER: "interacting" },
        interacting: { SCROLL: "interacting", POINTER_LEAVE: "idle" },
        idle: { HIDE: "hidden", SCROLL: "scrolling", POINTER_ENTER: "interacting" },
      });
    return (
      p.useEffect(() => {
        if (h === "idle") {
          const m = window.setTimeout(() => v("HIDE"), c.scrollHideDelay);
          return () => window.clearTimeout(m);
        }
      }, [h, c.scrollHideDelay, v]),
      p.useEffect(() => {
        const m = c.viewport,
          S = f ? "scrollLeft" : "scrollTop";
        if (m) {
          let y = m[S];
          const b = () => {
            const R = m[S];
            (y !== R && (v("SCROLL"), d()), (y = R));
          };
          return (m.addEventListener("scroll", b), () => m.removeEventListener("scroll", b));
        }
      }, [c.viewport, f, v, d]),
      E.jsx(et, {
        present: r || h !== "hidden",
        children: E.jsx(dd, {
          "data-state": h === "hidden" ? "hidden" : "visible",
          ...i,
          ref: o,
          onPointerEnter: Z(l.onPointerEnter, () => v("POINTER_ENTER")),
          onPointerLeave: Z(l.onPointerLeave, () => v("POINTER_LEAVE")),
        }),
      })
    );
  }),
  H0 = p.forwardRef((l, o) => {
    const r = $t(dn, l.__scopeScrollArea),
      { forceMount: i, ...c } = l,
      [f, d] = p.useState(!1),
      h = l.orientation === "horizontal",
      v = Tu(() => {
        if (r.viewport) {
          const m = r.viewport.offsetWidth < r.viewport.scrollWidth,
            S = r.viewport.offsetHeight < r.viewport.scrollHeight;
          d(h ? m : S);
        }
      }, 10);
    return (
      Ha(r.viewport, v),
      Ha(r.content, v),
      E.jsx(et, {
        present: i || f,
        children: E.jsx(dd, { "data-state": f ? "visible" : "hidden", ...c, ref: o }),
      })
    );
  }),
  dd = p.forwardRef((l, o) => {
    const { orientation: r = "vertical", ...i } = l,
      c = $t(dn, l.__scopeScrollArea),
      f = p.useRef(null),
      d = p.useRef(0),
      [h, v] = p.useState({
        content: 0,
        viewport: 0,
        scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
      }),
      m = Y0(h.viewport, h.content),
      S = {
        ...i,
        sizes: h,
        onSizesChange: v,
        hasThumb: m > 0 && m < 1,
        onThumbChange: (b) => (f.current = b),
        onThumbPointerUp: () => (d.current = 0),
        onThumbPointerDown: (b) => (d.current = b),
      };
    function y(b, R) {
      return qM(b, d.current, h, R);
    }
    return r === "horizontal"
      ? E.jsx(BM, {
          ...S,
          ref: o,
          onThumbPositionChange: () => {
            if (c.viewport && f.current) {
              const b = c.viewport.scrollLeft,
                R = mg(b, h, c.dir);
              f.current.style.transform = `translate3d(${R}px, 0, 0)`;
            }
          },
          onWheelScroll: (b) => {
            c.viewport && (c.viewport.scrollLeft = b);
          },
          onDragScroll: (b) => {
            c.viewport && (c.viewport.scrollLeft = y(b, c.dir));
          },
        })
      : r === "vertical"
        ? E.jsx(HM, {
            ...S,
            ref: o,
            onThumbPositionChange: () => {
              if (c.viewport && f.current) {
                const b = c.viewport.scrollTop,
                  R = mg(b, h);
                f.current.style.transform = `translate3d(0, ${R}px, 0)`;
              }
            },
            onWheelScroll: (b) => {
              c.viewport && (c.viewport.scrollTop = b);
            },
            onDragScroll: (b) => {
              c.viewport && (c.viewport.scrollTop = y(b));
            },
          })
        : null;
  }),
  BM = p.forwardRef((l, o) => {
    const { sizes: r, onSizesChange: i, ...c } = l,
      f = $t(dn, l.__scopeScrollArea),
      [d, h] = p.useState(),
      v = p.useRef(null),
      m = de(o, v, f.onScrollbarXChange);
    return (
      p.useEffect(() => {
        v.current && h(getComputedStyle(v.current));
      }, [v]),
      E.jsx(V0, {
        "data-orientation": "horizontal",
        ...c,
        ref: m,
        sizes: r,
        style: {
          bottom: 0,
          left: f.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
          right: f.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
          "--radix-scroll-area-thumb-width": Ru(r) + "px",
          ...l.style,
        },
        onThumbPointerDown: (S) => l.onThumbPointerDown(S.x),
        onDragScroll: (S) => l.onDragScroll(S.x),
        onWheelScroll: (S, y) => {
          if (f.viewport) {
            const b = f.viewport.scrollLeft + S.deltaX;
            (l.onWheelScroll(b), X0(b, y) && S.preventDefault());
          }
        },
        onResize: () => {
          v.current &&
            f.viewport &&
            d &&
            i({
              content: f.viewport.scrollWidth,
              viewport: f.viewport.offsetWidth,
              scrollbar: {
                size: v.current.clientWidth,
                paddingStart: Zi(d.paddingLeft),
                paddingEnd: Zi(d.paddingRight),
              },
            });
        },
      })
    );
  }),
  HM = p.forwardRef((l, o) => {
    const { sizes: r, onSizesChange: i, ...c } = l,
      f = $t(dn, l.__scopeScrollArea),
      [d, h] = p.useState(),
      v = p.useRef(null),
      m = de(o, v, f.onScrollbarYChange);
    return (
      p.useEffect(() => {
        v.current && h(getComputedStyle(v.current));
      }, [v]),
      E.jsx(V0, {
        "data-orientation": "vertical",
        ...c,
        ref: m,
        sizes: r,
        style: {
          top: 0,
          right: f.dir === "ltr" ? 0 : void 0,
          left: f.dir === "rtl" ? 0 : void 0,
          bottom: "var(--radix-scroll-area-corner-height)",
          "--radix-scroll-area-thumb-height": Ru(r) + "px",
          ...l.style,
        },
        onThumbPointerDown: (S) => l.onThumbPointerDown(S.y),
        onDragScroll: (S) => l.onDragScroll(S.y),
        onWheelScroll: (S, y) => {
          if (f.viewport) {
            const b = f.viewport.scrollTop + S.deltaY;
            (l.onWheelScroll(b), X0(b, y) && S.preventDefault());
          }
        },
        onResize: () => {
          v.current &&
            f.viewport &&
            d &&
            i({
              content: f.viewport.scrollHeight,
              viewport: f.viewport.offsetHeight,
              scrollbar: {
                size: v.current.clientHeight,
                paddingStart: Zi(d.paddingTop),
                paddingEnd: Zi(d.paddingBottom),
              },
            });
        },
      })
    );
  }),
  [PM, P0] = j0(dn),
  V0 = p.forwardRef((l, o) => {
    const {
        __scopeScrollArea: r,
        sizes: i,
        hasThumb: c,
        onThumbChange: f,
        onThumbPointerUp: d,
        onThumbPointerDown: h,
        onThumbPositionChange: v,
        onDragScroll: m,
        onWheelScroll: S,
        onResize: y,
        ...b
      } = l,
      R = $t(dn, r),
      [w, C] = p.useState(null),
      T = de(o, (te) => C(te)),
      _ = p.useRef(null),
      D = p.useRef(""),
      N = R.viewport,
      B = i.content - i.viewport,
      K = We(S),
      F = We(v),
      V = Tu(y, 10);
    function ee(te) {
      if (_.current) {
        const le = te.clientX - _.current.left,
          ne = te.clientY - _.current.top;
        m({ x: le, y: ne });
      }
    }
    return (
      p.useEffect(() => {
        const te = (le) => {
          const ne = le.target;
          w?.contains(ne) && K(le, B);
        };
        return (
          document.addEventListener("wheel", te, { passive: !1 }),
          () => document.removeEventListener("wheel", te, { passive: !1 })
        );
      }, [N, w, B, K]),
      p.useEffect(F, [i, F]),
      Ha(w, V),
      Ha(R.content, V),
      E.jsx(PM, {
        scope: r,
        scrollbar: w,
        hasThumb: c,
        onThumbChange: We(f),
        onThumbPointerUp: We(d),
        onThumbPositionChange: F,
        onThumbPointerDown: We(h),
        children: E.jsx(re.div, {
          ...b,
          ref: T,
          style: { position: "absolute", ...b.style },
          onPointerDown: Z(l.onPointerDown, (te) => {
            te.button === 0 &&
              (te.target.setPointerCapture(te.pointerId),
              (_.current = w.getBoundingClientRect()),
              (D.current = document.body.style.webkitUserSelect),
              (document.body.style.webkitUserSelect = "none"),
              R.viewport && (R.viewport.style.scrollBehavior = "auto"),
              ee(te));
          }),
          onPointerMove: Z(l.onPointerMove, ee),
          onPointerUp: Z(l.onPointerUp, (te) => {
            const le = te.target;
            (le.hasPointerCapture(te.pointerId) && le.releasePointerCapture(te.pointerId),
              (document.body.style.webkitUserSelect = D.current),
              R.viewport && (R.viewport.style.scrollBehavior = ""),
              (_.current = null));
          }),
        }),
      })
    );
  }),
  Qi = "ScrollAreaThumb",
  VM = p.forwardRef((l, o) => {
    const { forceMount: r, ...i } = l,
      c = P0(Qi, l.__scopeScrollArea);
    return E.jsx(et, { present: r || c.hasThumb, children: E.jsx(GM, { ref: o, ...i }) });
  }),
  GM = p.forwardRef((l, o) => {
    const { __scopeScrollArea: r, style: i, ...c } = l,
      f = $t(Qi, r),
      d = P0(Qi, r),
      { onThumbPositionChange: h } = d,
      v = de(o, (y) => d.onThumbChange(y)),
      m = p.useRef(void 0),
      S = Tu(() => {
        m.current && (m.current(), (m.current = void 0));
      }, 100);
    return (
      p.useEffect(() => {
        const y = f.viewport;
        if (y) {
          const b = () => {
            if ((S(), !m.current)) {
              const R = XM(y, h);
              ((m.current = R), h());
            }
          };
          return (h(), y.addEventListener("scroll", b), () => y.removeEventListener("scroll", b));
        }
      }, [f.viewport, S, h]),
      E.jsx(re.div, {
        "data-state": d.hasThumb ? "visible" : "hidden",
        ...c,
        ref: v,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...i,
        },
        onPointerDownCapture: Z(l.onPointerDownCapture, (y) => {
          const R = y.target.getBoundingClientRect(),
            w = y.clientX - R.left,
            C = y.clientY - R.top;
          d.onThumbPointerDown({ x: w, y: C });
        }),
        onPointerUp: Z(l.onPointerUp, d.onThumbPointerUp),
      })
    );
  });
VM.displayName = Qi;
var pd = "ScrollAreaCorner",
  G0 = p.forwardRef((l, o) => {
    const r = $t(pd, l.__scopeScrollArea),
      i = !!(r.scrollbarX && r.scrollbarY);
    return r.type !== "scroll" && i ? E.jsx(YM, { ...l, ref: o }) : null;
  });
G0.displayName = pd;
var YM = p.forwardRef((l, o) => {
  const { __scopeScrollArea: r, ...i } = l,
    c = $t(pd, r),
    [f, d] = p.useState(0),
    [h, v] = p.useState(0),
    m = !!(f && h);
  return (
    Ha(c.scrollbarX, () => {
      const S = c.scrollbarX?.offsetHeight || 0;
      (c.onCornerHeightChange(S), v(S));
    }),
    Ha(c.scrollbarY, () => {
      const S = c.scrollbarY?.offsetWidth || 0;
      (c.onCornerWidthChange(S), d(S));
    }),
    m
      ? E.jsx(re.div, {
          ...i,
          ref: o,
          style: {
            width: f,
            height: h,
            position: "absolute",
            right: c.dir === "ltr" ? 0 : void 0,
            left: c.dir === "rtl" ? 0 : void 0,
            bottom: 0,
            ...l.style,
          },
        })
      : null
  );
});
function Zi(l) {
  return l ? parseInt(l, 10) : 0;
}
function Y0(l, o) {
  const r = l / o;
  return isNaN(r) ? 0 : r;
}
function Ru(l) {
  const o = Y0(l.viewport, l.content),
    r = l.scrollbar.paddingStart + l.scrollbar.paddingEnd,
    i = (l.scrollbar.size - r) * o;
  return Math.max(i, 18);
}
function qM(l, o, r, i = "ltr") {
  const c = Ru(r),
    f = c / 2,
    d = o || f,
    h = c - d,
    v = r.scrollbar.paddingStart + d,
    m = r.scrollbar.size - r.scrollbar.paddingEnd - h,
    S = r.content - r.viewport,
    y = i === "ltr" ? [0, S] : [S * -1, 0];
  return q0([v, m], y)(l);
}
function mg(l, o, r = "ltr") {
  const i = Ru(o),
    c = o.scrollbar.paddingStart + o.scrollbar.paddingEnd,
    f = o.scrollbar.size - c,
    d = o.content - o.viewport,
    h = f - i,
    v = r === "ltr" ? [0, d] : [d * -1, 0],
    m = Wo(l, v);
  return q0([0, d], [0, h])(m);
}
function q0(l, o) {
  return (r) => {
    if (l[0] === l[1] || o[0] === o[1]) return o[0];
    const i = (o[1] - o[0]) / (l[1] - l[0]);
    return o[0] + i * (r - l[0]);
  };
}
function X0(l, o) {
  return l > 0 && l < o;
}
var XM = (l, o = () => {}) => {
  let r = { left: l.scrollLeft, top: l.scrollTop },
    i = 0;
  return (
    (function c() {
      const f = { left: l.scrollLeft, top: l.scrollTop },
        d = r.left !== f.left,
        h = r.top !== f.top;
      ((d || h) && o(), (r = f), (i = window.requestAnimationFrame(c)));
    })(),
    () => window.cancelAnimationFrame(i)
  );
};
function Tu(l, o) {
  const r = We(l),
    i = p.useRef(0);
  return (
    p.useEffect(() => () => window.clearTimeout(i.current), []),
    p.useCallback(() => {
      (window.clearTimeout(i.current), (i.current = window.setTimeout(r, o)));
    }, [r, o])
  );
}
function Ha(l, o) {
  const r = We(o);
  $e(() => {
    let i = 0;
    if (l) {
      const c = new ResizeObserver(() => {
        (cancelAnimationFrame(i), (i = window.requestAnimationFrame(r)));
      });
      return (
        c.observe(l),
        () => {
          (window.cancelAnimationFrame(i), c.unobserve(l));
        }
      );
    }
  }, [l, r]);
}
var ZD = L0,
  kD = B0,
  FD = G0,
  wu = "Collapsible",
  [IM] = ut(wu),
  [KM, hd] = IM(wu),
  I0 = p.forwardRef((l, o) => {
    const {
        __scopeCollapsible: r,
        open: i,
        defaultOpen: c,
        disabled: f,
        onOpenChange: d,
        ...h
      } = l,
      [v, m] = Kt({ prop: i, defaultProp: c ?? !1, onChange: d, caller: wu });
    return E.jsx(KM, {
      scope: r,
      disabled: f,
      contentId: zt(),
      open: v,
      onOpenToggle: p.useCallback(() => m((S) => !S), [m]),
      children: E.jsx(re.div, {
        "data-state": md(v),
        "data-disabled": f ? "" : void 0,
        ...h,
        ref: o,
      }),
    });
  });
I0.displayName = wu;
var K0 = "CollapsibleTrigger",
  $M = p.forwardRef((l, o) => {
    const { __scopeCollapsible: r, ...i } = l,
      c = hd(K0, r);
    return E.jsx(re.button, {
      type: "button",
      "aria-controls": c.contentId,
      "aria-expanded": c.open || !1,
      "data-state": md(c.open),
      "data-disabled": c.disabled ? "" : void 0,
      disabled: c.disabled,
      ...i,
      ref: o,
      onClick: Z(l.onClick, c.onOpenToggle),
    });
  });
$M.displayName = K0;
var vd = "CollapsibleContent",
  QM = p.forwardRef((l, o) => {
    const { forceMount: r, ...i } = l,
      c = hd(vd, l.__scopeCollapsible);
    return E.jsx(et, {
      present: r || c.open,
      children: ({ present: f }) => E.jsx(ZM, { ...i, ref: o, present: f }),
    });
  });
QM.displayName = vd;
var ZM = p.forwardRef((l, o) => {
  const { __scopeCollapsible: r, present: i, children: c, ...f } = l,
    d = hd(vd, r),
    [h, v] = p.useState(i),
    m = p.useRef(null),
    S = de(o, m),
    y = p.useRef(0),
    b = y.current,
    R = p.useRef(0),
    w = R.current,
    C = d.open || h,
    T = p.useRef(C),
    _ = p.useRef(void 0);
  return (
    p.useEffect(() => {
      const D = requestAnimationFrame(() => (T.current = !1));
      return () => cancelAnimationFrame(D);
    }, []),
    $e(() => {
      const D = m.current;
      if (D) {
        ((_.current = _.current || {
          transitionDuration: D.style.transitionDuration,
          animationName: D.style.animationName,
        }),
          (D.style.transitionDuration = "0s"),
          (D.style.animationName = "none"));
        const N = D.getBoundingClientRect();
        ((y.current = N.height),
          (R.current = N.width),
          T.current ||
            ((D.style.transitionDuration = _.current.transitionDuration),
            (D.style.animationName = _.current.animationName)),
          v(i));
      }
    }, [d.open, i]),
    E.jsx(re.div, {
      "data-state": md(d.open),
      "data-disabled": d.disabled ? "" : void 0,
      id: d.contentId,
      hidden: !C,
      ...f,
      ref: S,
      style: {
        "--radix-collapsible-content-height": b ? `${b}px` : void 0,
        "--radix-collapsible-content-width": w ? `${w}px` : void 0,
        ...l.style,
      },
      children: C && c,
    })
  );
});
function md(l) {
  return l ? "open" : "closed";
}
var JD = I0,
  kM = Symbol("radix.slottable");
function FM(l) {
  const o = ({ children: r }) => E.jsx(E.Fragment, { children: r });
  return ((o.displayName = `${l}.Slottable`), (o.__radixId = kM), o);
}
var $0 = "AlertDialog",
  [JM] = ut($0, [qg]),
  jn = qg(),
  Q0 = (l) => {
    const { __scopeAlertDialog: o, ...r } = l,
      i = jn(o);
    return E.jsx(DT, { ...i, ...r, modal: !0 });
  };
Q0.displayName = $0;
var WM = "AlertDialogTrigger",
  Z0 = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, ...i } = l,
      c = jn(r);
    return E.jsx(NT, { ...c, ...i, ref: o });
  });
Z0.displayName = WM;
var eO = "AlertDialogPortal",
  k0 = (l) => {
    const { __scopeAlertDialog: o, ...r } = l,
      i = jn(o);
    return E.jsx(zT, { ...i, ...r });
  };
k0.displayName = eO;
var tO = "AlertDialogOverlay",
  F0 = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, ...i } = l,
      c = jn(r);
    return E.jsx(jT, { ...c, ...i, ref: o });
  });
F0.displayName = tO;
var ja = "AlertDialogContent",
  [nO, lO] = JM(ja),
  aO = FM("AlertDialogContent"),
  J0 = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, children: i, ...c } = l,
      f = jn(r),
      d = p.useRef(null),
      h = de(o, d),
      v = p.useRef(null);
    return E.jsx(AT, {
      contentName: ja,
      titleName: W0,
      docsSlug: "alert-dialog",
      children: E.jsx(nO, {
        scope: r,
        cancelRef: v,
        children: E.jsxs(LT, {
          role: "alertdialog",
          ...f,
          ...c,
          ref: h,
          onOpenAutoFocus: Z(c.onOpenAutoFocus, (m) => {
            (m.preventDefault(), v.current?.focus({ preventScroll: !0 }));
          }),
          onPointerDownOutside: (m) => m.preventDefault(),
          onInteractOutside: (m) => m.preventDefault(),
          children: [E.jsx(aO, { children: i }), E.jsx(rO, { contentRef: d })],
        }),
      }),
    });
  });
J0.displayName = ja;
var W0 = "AlertDialogTitle",
  eb = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, ...i } = l,
      c = jn(r);
    return E.jsx(UT, { ...c, ...i, ref: o });
  });
eb.displayName = W0;
var tb = "AlertDialogDescription",
  nb = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, ...i } = l,
      c = jn(r);
    return E.jsx(BT, { ...c, ...i, ref: o });
  });
nb.displayName = tb;
var oO = "AlertDialogAction",
  lb = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, ...i } = l,
      c = jn(r);
    return E.jsx(oy, { ...c, ...i, ref: o });
  });
lb.displayName = oO;
var ab = "AlertDialogCancel",
  ob = p.forwardRef((l, o) => {
    const { __scopeAlertDialog: r, ...i } = l,
      { cancelRef: c } = lO(ab, r),
      f = jn(r),
      d = de(o, c);
    return E.jsx(oy, { ...f, ...i, ref: d });
  });
ob.displayName = ab;
var rO = ({ contentRef: l }) => {
    const o = `\`${ja}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${ja}\` by passing a \`${tb}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${ja}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
    return (
      p.useEffect(() => {
        document.getElementById(l.current?.getAttribute("aria-describedby")) || console.warn(o);
      }, [o, l]),
      null
    );
  },
  WD = Q0,
  eN = Z0,
  tN = k0,
  nN = F0,
  lN = J0,
  aN = lb,
  oN = ob,
  rN = eb,
  iN = nb,
  Au = "Switch",
  [iO] = ut(Au),
  [uO, cO] = iO(Au),
  rb = p.forwardRef((l, o) => {
    const {
        __scopeSwitch: r,
        name: i,
        checked: c,
        defaultChecked: f,
        required: d,
        disabled: h,
        value: v = "on",
        onCheckedChange: m,
        form: S,
        ...y
      } = l,
      [b, R] = p.useState(null),
      w = de(o, (N) => R(N)),
      C = p.useRef(!1),
      T = b ? S || !!b.closest("form") : !0,
      [_, D] = Kt({ prop: c, defaultProp: f ?? !1, onChange: m, caller: Au });
    return E.jsxs(uO, {
      scope: r,
      checked: _,
      disabled: h,
      children: [
        E.jsx(re.button, {
          type: "button",
          role: "switch",
          "aria-checked": _,
          "aria-required": d,
          "data-state": sb(_),
          "data-disabled": h ? "" : void 0,
          disabled: h,
          value: v,
          ...y,
          ref: w,
          onClick: Z(l.onClick, (N) => {
            (D((B) => !B),
              T && ((C.current = N.isPropagationStopped()), C.current || N.stopPropagation()));
          }),
        }),
        T &&
          E.jsx(cb, {
            control: b,
            bubbles: !C.current,
            name: i,
            value: v,
            checked: _,
            required: d,
            disabled: h,
            form: S,
            style: { transform: "translateX(-100%)" },
          }),
      ],
    });
  });
rb.displayName = Au;
var ib = "SwitchThumb",
  ub = p.forwardRef((l, o) => {
    const { __scopeSwitch: r, ...i } = l,
      c = cO(ib, r);
    return E.jsx(re.span, {
      "data-state": sb(c.checked),
      "data-disabled": c.disabled ? "" : void 0,
      ...i,
      ref: o,
    });
  });
ub.displayName = ib;
var sO = "SwitchBubbleInput",
  cb = p.forwardRef(({ __scopeSwitch: l, control: o, checked: r, bubbles: i = !0, ...c }, f) => {
    const d = p.useRef(null),
      h = de(d, f),
      v = Su(r),
      m = iu(o);
    return (
      p.useEffect(() => {
        const S = d.current;
        if (!S) return;
        const y = window.HTMLInputElement.prototype,
          R = Object.getOwnPropertyDescriptor(y, "checked").set;
        if (v !== r && R) {
          const w = new Event("click", { bubbles: i });
          (R.call(S, r), S.dispatchEvent(w));
        }
      }, [v, r, i]),
      E.jsx("input", {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: r,
        ...c,
        tabIndex: -1,
        ref: h,
        style: {
          ...c.style,
          ...m,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
        },
      })
    );
  });
cb.displayName = sO;
function sb(l) {
  return l ? "checked" : "unchecked";
}
var uN = rb,
  cN = ub,
  fb = ["PageUp", "PageDown"],
  db = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  pb = {
    "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
    "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
    "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
    "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"],
  },
  Qa = "Slider",
  [Df, fO, dO] = pu(Qa),
  [hb] = ut(Qa, [dO]),
  [pO, _u] = hb(Qa),
  vb = p.forwardRef((l, o) => {
    const {
        name: r,
        min: i = 0,
        max: c = 100,
        step: f = 1,
        orientation: d = "horizontal",
        disabled: h = !1,
        minStepsBetweenThumbs: v = 0,
        defaultValue: m = [i],
        value: S,
        onValueChange: y = () => {},
        onValueCommit: b = () => {},
        inverted: R = !1,
        form: w,
        ...C
      } = l,
      T = p.useRef(new Set()),
      _ = p.useRef(0),
      N = d === "horizontal" ? hO : vO,
      [B = [], K] = Kt({
        prop: S,
        defaultProp: m,
        onChange: (ne) => {
          ([...T.current][_.current]?.focus(), y(ne));
        },
      }),
      F = p.useRef(B);
    function V(ne) {
      const ie = bO(B, ne);
      le(ne, ie);
    }
    function ee(ne) {
      le(ne, _.current);
    }
    function te() {
      const ne = F.current[_.current];
      B[_.current] !== ne && b(B);
    }
    function le(ne, ie, { commit: ve } = { commit: !1 }) {
      const pe = RO(f),
        ge = TO(Math.round((ne - i) / f) * f + i, pe),
        j = Wo(ge, [i, c]);
      K((I = []) => {
        const $ = yO(I, j, ie);
        if (CO($, v * f)) {
          _.current = $.indexOf(j);
          const Q = String($) !== String(I);
          return (Q && ve && b($), Q ? $ : I);
        } else return I;
      });
    }
    return E.jsx(pO, {
      scope: l.__scopeSlider,
      name: r,
      disabled: h,
      min: i,
      max: c,
      valueIndexToChangeRef: _,
      thumbs: T.current,
      values: B,
      orientation: d,
      form: w,
      children: E.jsx(Df.Provider, {
        scope: l.__scopeSlider,
        children: E.jsx(Df.Slot, {
          scope: l.__scopeSlider,
          children: E.jsx(N, {
            "aria-disabled": h,
            "data-disabled": h ? "" : void 0,
            ...C,
            ref: o,
            onPointerDown: Z(C.onPointerDown, () => {
              h || (F.current = B);
            }),
            min: i,
            max: c,
            inverted: R,
            onSlideStart: h ? void 0 : V,
            onSlideMove: h ? void 0 : ee,
            onSlideEnd: h ? void 0 : te,
            onHomeKeyDown: () => !h && le(i, 0, { commit: !0 }),
            onEndKeyDown: () => !h && le(c, B.length - 1, { commit: !0 }),
            onStepKeyDown: ({ event: ne, direction: ie }) => {
              if (!h) {
                const ge = fb.includes(ne.key) || (ne.shiftKey && db.includes(ne.key)) ? 10 : 1,
                  j = _.current,
                  I = B[j],
                  $ = f * ge * ie;
                le(I + $, j, { commit: !0 });
              }
            },
          }),
        }),
      }),
    });
  });
vb.displayName = Qa;
var [mb, gb] = hb(Qa, { startEdge: "left", endEdge: "right", size: "width", direction: 1 }),
  hO = p.forwardRef((l, o) => {
    const {
        min: r,
        max: i,
        dir: c,
        inverted: f,
        onSlideStart: d,
        onSlideMove: h,
        onSlideEnd: v,
        onStepKeyDown: m,
        ...S
      } = l,
      [y, b] = p.useState(null),
      R = de(o, (N) => b(N)),
      w = p.useRef(void 0),
      C = Ka(c),
      T = C === "ltr",
      _ = (T && !f) || (!T && f);
    function D(N) {
      const B = w.current || y.getBoundingClientRect(),
        K = [0, B.width],
        V = gd(K, _ ? [r, i] : [i, r]);
      return ((w.current = B), V(N - B.left));
    }
    return E.jsx(mb, {
      scope: l.__scopeSlider,
      startEdge: _ ? "left" : "right",
      endEdge: _ ? "right" : "left",
      direction: _ ? 1 : -1,
      size: "width",
      children: E.jsx(yb, {
        dir: C,
        "data-orientation": "horizontal",
        ...S,
        ref: R,
        style: { ...S.style, "--radix-slider-thumb-transform": "translateX(-50%)" },
        onSlideStart: (N) => {
          const B = D(N.clientX);
          d?.(B);
        },
        onSlideMove: (N) => {
          const B = D(N.clientX);
          h?.(B);
        },
        onSlideEnd: () => {
          ((w.current = void 0), v?.());
        },
        onStepKeyDown: (N) => {
          const K = pb[_ ? "from-left" : "from-right"].includes(N.key);
          m?.({ event: N, direction: K ? -1 : 1 });
        },
      }),
    });
  }),
  vO = p.forwardRef((l, o) => {
    const {
        min: r,
        max: i,
        inverted: c,
        onSlideStart: f,
        onSlideMove: d,
        onSlideEnd: h,
        onStepKeyDown: v,
        ...m
      } = l,
      S = p.useRef(null),
      y = de(o, S),
      b = p.useRef(void 0),
      R = !c;
    function w(C) {
      const T = b.current || S.current.getBoundingClientRect(),
        _ = [0, T.height],
        N = gd(_, R ? [i, r] : [r, i]);
      return ((b.current = T), N(C - T.top));
    }
    return E.jsx(mb, {
      scope: l.__scopeSlider,
      startEdge: R ? "bottom" : "top",
      endEdge: R ? "top" : "bottom",
      size: "height",
      direction: R ? 1 : -1,
      children: E.jsx(yb, {
        "data-orientation": "vertical",
        ...m,
        ref: y,
        style: { ...m.style, "--radix-slider-thumb-transform": "translateY(50%)" },
        onSlideStart: (C) => {
          const T = w(C.clientY);
          f?.(T);
        },
        onSlideMove: (C) => {
          const T = w(C.clientY);
          d?.(T);
        },
        onSlideEnd: () => {
          ((b.current = void 0), h?.());
        },
        onStepKeyDown: (C) => {
          const _ = pb[R ? "from-bottom" : "from-top"].includes(C.key);
          v?.({ event: C, direction: _ ? -1 : 1 });
        },
      }),
    });
  }),
  yb = p.forwardRef((l, o) => {
    const {
        __scopeSlider: r,
        onSlideStart: i,
        onSlideMove: c,
        onSlideEnd: f,
        onHomeKeyDown: d,
        onEndKeyDown: h,
        onStepKeyDown: v,
        ...m
      } = l,
      S = _u(Qa, r);
    return E.jsx(re.span, {
      ...m,
      ref: o,
      onKeyDown: Z(l.onKeyDown, (y) => {
        y.key === "Home"
          ? (d(y), y.preventDefault())
          : y.key === "End"
            ? (h(y), y.preventDefault())
            : fb.concat(db).includes(y.key) && (v(y), y.preventDefault());
      }),
      onPointerDown: Z(l.onPointerDown, (y) => {
        const b = y.target;
        (b.setPointerCapture(y.pointerId), y.preventDefault(), S.thumbs.has(b) ? b.focus() : i(y));
      }),
      onPointerMove: Z(l.onPointerMove, (y) => {
        y.target.hasPointerCapture(y.pointerId) && c(y);
      }),
      onPointerUp: Z(l.onPointerUp, (y) => {
        const b = y.target;
        b.hasPointerCapture(y.pointerId) && (b.releasePointerCapture(y.pointerId), f(y));
      }),
    });
  }),
  Sb = "SliderTrack",
  bb = p.forwardRef((l, o) => {
    const { __scopeSlider: r, ...i } = l,
      c = _u(Sb, r);
    return E.jsx(re.span, {
      "data-disabled": c.disabled ? "" : void 0,
      "data-orientation": c.orientation,
      ...i,
      ref: o,
    });
  });
bb.displayName = Sb;
var Nf = "SliderRange",
  xb = p.forwardRef((l, o) => {
    const { __scopeSlider: r, ...i } = l,
      c = _u(Nf, r),
      f = gb(Nf, r),
      d = p.useRef(null),
      h = de(o, d),
      v = c.values.length,
      m = c.values.map((b) => Rb(b, c.min, c.max)),
      S = v > 1 ? Math.min(...m) : 0,
      y = 100 - Math.max(...m);
    return E.jsx(re.span, {
      "data-orientation": c.orientation,
      "data-disabled": c.disabled ? "" : void 0,
      ...i,
      ref: h,
      style: { ...l.style, [f.startEdge]: S + "%", [f.endEdge]: y + "%" },
    });
  });
xb.displayName = Nf;
var zf = "SliderThumb",
  Eb = p.forwardRef((l, o) => {
    const r = fO(l.__scopeSlider),
      [i, c] = p.useState(null),
      f = de(o, (h) => c(h)),
      d = p.useMemo(() => (i ? r().findIndex((h) => h.ref.current === i) : -1), [r, i]);
    return E.jsx(mO, { ...l, ref: f, index: d });
  }),
  mO = p.forwardRef((l, o) => {
    const { __scopeSlider: r, index: i, name: c, ...f } = l,
      d = _u(zf, r),
      h = gb(zf, r),
      [v, m] = p.useState(null),
      S = de(o, (D) => m(D)),
      y = v ? d.form || !!v.closest("form") : !0,
      b = iu(v),
      R = d.values[i],
      w = R === void 0 ? 0 : Rb(R, d.min, d.max),
      C = SO(i, d.values.length),
      T = b?.[h.size],
      _ = T ? xO(T, w, h.direction) : 0;
    return (
      p.useEffect(() => {
        if (v)
          return (
            d.thumbs.add(v),
            () => {
              d.thumbs.delete(v);
            }
          );
      }, [v, d.thumbs]),
      E.jsxs("span", {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [h.startEdge]: `calc(${w}% + ${_}px)`,
        },
        children: [
          E.jsx(Df.ItemSlot, {
            scope: l.__scopeSlider,
            children: E.jsx(re.span, {
              role: "slider",
              "aria-label": l["aria-label"] || C,
              "aria-valuemin": d.min,
              "aria-valuenow": R,
              "aria-valuemax": d.max,
              "aria-orientation": d.orientation,
              "data-orientation": d.orientation,
              "data-disabled": d.disabled ? "" : void 0,
              tabIndex: d.disabled ? void 0 : 0,
              ...f,
              ref: S,
              style: R === void 0 ? { display: "none" } : l.style,
              onFocus: Z(l.onFocus, () => {
                d.valueIndexToChangeRef.current = i;
              }),
            }),
          }),
          y &&
            E.jsx(
              Cb,
              {
                name: c ?? (d.name ? d.name + (d.values.length > 1 ? "[]" : "") : void 0),
                form: d.form,
                value: R,
              },
              i,
            ),
        ],
      })
    );
  });
Eb.displayName = zf;
var gO = "RadioBubbleInput",
  Cb = p.forwardRef(({ __scopeSlider: l, value: o, ...r }, i) => {
    const c = p.useRef(null),
      f = de(c, i),
      d = Su(o);
    return (
      p.useEffect(() => {
        const h = c.current;
        if (!h) return;
        const v = window.HTMLInputElement.prototype,
          S = Object.getOwnPropertyDescriptor(v, "value").set;
        if (d !== o && S) {
          const y = new Event("input", { bubbles: !0 });
          (S.call(h, o), h.dispatchEvent(y));
        }
      }, [d, o]),
      E.jsx(re.input, { style: { display: "none" }, ...r, ref: f, defaultValue: o })
    );
  });
Cb.displayName = gO;
function yO(l = [], o, r) {
  const i = [...l];
  return ((i[r] = o), i.sort((c, f) => c - f));
}
function Rb(l, o, r) {
  const f = (100 / (r - o)) * (l - o);
  return Wo(f, [0, 100]);
}
function SO(l, o) {
  return o > 2 ? `Value ${l + 1} of ${o}` : o === 2 ? ["Minimum", "Maximum"][l] : void 0;
}
function bO(l, o) {
  if (l.length === 1) return 0;
  const r = l.map((c) => Math.abs(c - o)),
    i = Math.min(...r);
  return r.indexOf(i);
}
function xO(l, o, r) {
  const i = l / 2,
    f = gd([0, 50], [0, i]);
  return (i - f(o) * r) * r;
}
function EO(l) {
  return l.slice(0, -1).map((o, r) => l[r + 1] - o);
}
function CO(l, o) {
  if (o > 0) {
    const r = EO(l);
    return Math.min(...r) >= o;
  }
  return !0;
}
function gd(l, o) {
  return (r) => {
    if (l[0] === l[1] || o[0] === o[1]) return o[0];
    const i = (o[1] - o[0]) / (l[1] - l[0]);
    return o[0] + i * (r - l[0]);
  };
}
function RO(l) {
  return (String(l).split(".")[1] || "").length;
}
function TO(l, o) {
  const r = Math.pow(10, o);
  return Math.round(l * r) / r;
}
var sN = vb,
  fN = bb,
  dN = xb,
  pN = Eb,
  Mu = "Checkbox",
  [wO] = ut(Mu),
  [AO, yd] = wO(Mu);
function _O(l) {
  const {
      __scopeCheckbox: o,
      checked: r,
      children: i,
      defaultChecked: c,
      disabled: f,
      form: d,
      name: h,
      onCheckedChange: v,
      required: m,
      value: S = "on",
      internal_do_not_use_render: y,
    } = l,
    [b, R] = Kt({ prop: r, defaultProp: c ?? !1, onChange: v, caller: Mu }),
    [w, C] = p.useState(null),
    [T, _] = p.useState(null),
    D = p.useRef(!1),
    N = w ? !!d || !!w.closest("form") : !0,
    B = {
      checked: b,
      disabled: f,
      setChecked: R,
      control: w,
      setControl: C,
      name: h,
      form: d,
      value: S,
      hasConsumerStoppedPropagationRef: D,
      required: m,
      defaultChecked: sl(c) ? !1 : c,
      isFormControl: N,
      bubbleInput: T,
      setBubbleInput: _,
    };
  return E.jsx(AO, { scope: o, ...B, children: DO(y) ? y(B) : i });
}
var Tb = "CheckboxTrigger",
  wb = p.forwardRef(({ __scopeCheckbox: l, onKeyDown: o, onClick: r, ...i }, c) => {
    const {
        control: f,
        value: d,
        disabled: h,
        checked: v,
        required: m,
        setControl: S,
        setChecked: y,
        hasConsumerStoppedPropagationRef: b,
        isFormControl: R,
        bubbleInput: w,
      } = yd(Tb, l),
      C = de(c, S),
      T = p.useRef(v);
    return (
      p.useEffect(() => {
        const _ = f?.form;
        if (_) {
          const D = () => y(T.current);
          return (_.addEventListener("reset", D), () => _.removeEventListener("reset", D));
        }
      }, [f, y]),
      E.jsx(re.button, {
        type: "button",
        role: "checkbox",
        "aria-checked": sl(v) ? "mixed" : v,
        "aria-required": m,
        "data-state": Ob(v),
        "data-disabled": h ? "" : void 0,
        disabled: h,
        value: d,
        ...i,
        ref: C,
        onKeyDown: Z(o, (_) => {
          _.key === "Enter" && _.preventDefault();
        }),
        onClick: Z(r, (_) => {
          (y((D) => (sl(D) ? !0 : !D)),
            w && R && ((b.current = _.isPropagationStopped()), b.current || _.stopPropagation()));
        }),
      })
    );
  });
wb.displayName = Tb;
var MO = p.forwardRef((l, o) => {
  const {
    __scopeCheckbox: r,
    name: i,
    checked: c,
    defaultChecked: f,
    required: d,
    disabled: h,
    value: v,
    onCheckedChange: m,
    form: S,
    ...y
  } = l;
  return E.jsx(_O, {
    __scopeCheckbox: r,
    checked: c,
    defaultChecked: f,
    disabled: h,
    required: d,
    onCheckedChange: m,
    name: i,
    form: S,
    value: v,
    internal_do_not_use_render: ({ isFormControl: b }) =>
      E.jsxs(E.Fragment, {
        children: [
          E.jsx(wb, { ...y, ref: o, __scopeCheckbox: r }),
          b && E.jsx(Mb, { __scopeCheckbox: r }),
        ],
      }),
  });
});
MO.displayName = Mu;
var Ab = "CheckboxIndicator",
  OO = p.forwardRef((l, o) => {
    const { __scopeCheckbox: r, forceMount: i, ...c } = l,
      f = yd(Ab, r);
    return E.jsx(et, {
      present: i || sl(f.checked) || f.checked === !0,
      children: E.jsx(re.span, {
        "data-state": Ob(f.checked),
        "data-disabled": f.disabled ? "" : void 0,
        ...c,
        ref: o,
        style: { pointerEvents: "none", ...l.style },
      }),
    });
  });
OO.displayName = Ab;
var _b = "CheckboxBubbleInput",
  Mb = p.forwardRef(({ __scopeCheckbox: l, ...o }, r) => {
    const {
        control: i,
        hasConsumerStoppedPropagationRef: c,
        checked: f,
        defaultChecked: d,
        required: h,
        disabled: v,
        name: m,
        value: S,
        form: y,
        bubbleInput: b,
        setBubbleInput: R,
      } = yd(_b, l),
      w = de(r, R),
      C = Su(f),
      T = iu(i);
    p.useEffect(() => {
      const D = b;
      if (!D) return;
      const N = window.HTMLInputElement.prototype,
        K = Object.getOwnPropertyDescriptor(N, "checked").set,
        F = !c.current;
      if (C !== f && K) {
        const V = new Event("click", { bubbles: F });
        ((D.indeterminate = sl(f)), K.call(D, sl(f) ? !1 : f), D.dispatchEvent(V));
      }
    }, [b, C, f, c]);
    const _ = p.useRef(sl(f) ? !1 : f);
    return E.jsx(re.input, {
      type: "checkbox",
      "aria-hidden": !0,
      defaultChecked: d ?? _.current,
      required: h,
      disabled: v,
      name: m,
      value: S,
      form: y,
      ...o,
      tabIndex: -1,
      ref: w,
      style: {
        ...o.style,
        ...T,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
        transform: "translateX(-100%)",
      },
    });
  });
Mb.displayName = _b;
function DO(l) {
  return typeof l == "function";
}
function sl(l) {
  return l === "indeterminate";
}
function Ob(l) {
  return sl(l) ? "indeterminate" : l ? "checked" : "unchecked";
}
var Ou = "Tabs",
  [NO] = ut(Ou, [hu]),
  Db = hu(),
  [zO, Sd] = NO(Ou),
  Nb = p.forwardRef((l, o) => {
    const {
        __scopeTabs: r,
        value: i,
        onValueChange: c,
        defaultValue: f,
        orientation: d = "horizontal",
        dir: h,
        activationMode: v = "automatic",
        ...m
      } = l,
      S = Ka(h),
      [y, b] = Kt({ prop: i, onChange: c, defaultProp: f ?? "", caller: Ou });
    return E.jsx(zO, {
      scope: r,
      baseId: zt(),
      value: y,
      onValueChange: b,
      orientation: d,
      dir: S,
      activationMode: v,
      children: E.jsx(re.div, { dir: S, "data-orientation": d, ...m, ref: o }),
    });
  });
Nb.displayName = Ou;
var zb = "TabsList",
  jb = p.forwardRef((l, o) => {
    const { __scopeTabs: r, loop: i = !0, ...c } = l,
      f = Sd(zb, r),
      d = Db(r);
    return E.jsx(Qy, {
      asChild: !0,
      ...d,
      orientation: f.orientation,
      dir: f.dir,
      loop: i,
      children: E.jsx(re.div, { role: "tablist", "aria-orientation": f.orientation, ...c, ref: o }),
    });
  });
jb.displayName = zb;
var Lb = "TabsTrigger",
  Ub = p.forwardRef((l, o) => {
    const { __scopeTabs: r, value: i, disabled: c = !1, ...f } = l,
      d = Sd(Lb, r),
      h = Db(r),
      v = Pb(d.baseId, i),
      m = Vb(d.baseId, i),
      S = i === d.value;
    return E.jsx(Zy, {
      asChild: !0,
      ...h,
      focusable: !c,
      active: S,
      children: E.jsx(re.button, {
        type: "button",
        role: "tab",
        "aria-selected": S,
        "aria-controls": m,
        "data-state": S ? "active" : "inactive",
        "data-disabled": c ? "" : void 0,
        disabled: c,
        id: v,
        ...f,
        ref: o,
        onMouseDown: Z(l.onMouseDown, (y) => {
          !c && y.button === 0 && y.ctrlKey === !1 ? d.onValueChange(i) : y.preventDefault();
        }),
        onKeyDown: Z(l.onKeyDown, (y) => {
          [" ", "Enter"].includes(y.key) && d.onValueChange(i);
        }),
        onFocus: Z(l.onFocus, () => {
          const y = d.activationMode !== "manual";
          !S && !c && y && d.onValueChange(i);
        }),
      }),
    });
  });
Ub.displayName = Lb;
var Bb = "TabsContent",
  Hb = p.forwardRef((l, o) => {
    const { __scopeTabs: r, value: i, forceMount: c, children: f, ...d } = l,
      h = Sd(Bb, r),
      v = Pb(h.baseId, i),
      m = Vb(h.baseId, i),
      S = i === h.value,
      y = p.useRef(S);
    return (
      p.useEffect(() => {
        const b = requestAnimationFrame(() => (y.current = !1));
        return () => cancelAnimationFrame(b);
      }, []),
      E.jsx(et, {
        present: c || S,
        children: ({ present: b }) =>
          E.jsx(re.div, {
            "data-state": S ? "active" : "inactive",
            "data-orientation": h.orientation,
            role: "tabpanel",
            "aria-labelledby": v,
            hidden: !b,
            id: m,
            tabIndex: 0,
            ...d,
            ref: o,
            style: { ...l.style, animationDuration: y.current ? "0s" : void 0 },
            children: b && f,
          }),
      })
    );
  });
Hb.displayName = Bb;
function Pb(l, o) {
  return `${l}-trigger-${o}`;
}
function Vb(l, o) {
  return `${l}-content-${o}`;
}
var hN = Nb,
  vN = jb,
  mN = Ub,
  gN = Hb,
  bd = "ContextMenu",
  [jO] = ut(bd, [vu]),
  ht = vu(),
  [LO, Gb] = jO(bd),
  Yb = (l) => {
    const { __scopeContextMenu: o, children: r, onOpenChange: i, dir: c, modal: f = !0 } = l,
      [d, h] = p.useState(!1),
      v = ht(o),
      m = We(i),
      S = p.useCallback(
        (y) => {
          (h(y), m(y));
        },
        [m],
      );
    return E.jsx(LO, {
      scope: o,
      open: d,
      onOpenChange: S,
      modal: f,
      children: E.jsx(yS, { ...v, dir: c, open: d, onOpenChange: S, modal: f, children: r }),
    });
  };
Yb.displayName = bd;
var qb = "ContextMenuTrigger",
  Xb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, disabled: i = !1, ...c } = l,
      f = Gb(qb, r),
      d = ht(r),
      h = p.useRef({ x: 0, y: 0 }),
      v = p.useRef({
        getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...h.current }),
      }),
      m = p.useRef(0),
      S = p.useCallback(() => window.clearTimeout(m.current), []),
      y = (b) => {
        ((h.current = { x: b.clientX, y: b.clientY }), f.onOpenChange(!0));
      };
    return (
      p.useEffect(() => S, [S]),
      p.useEffect(() => {
        i && S();
      }, [i, S]),
      E.jsxs(E.Fragment, {
        children: [
          E.jsx(SS, { ...d, virtualRef: v }),
          E.jsx(re.span, {
            "data-state": f.open ? "open" : "closed",
            "data-disabled": i ? "" : void 0,
            ...c,
            ref: o,
            style: { WebkitTouchCallout: "none", ...l.style },
            onContextMenu: i
              ? l.onContextMenu
              : Z(l.onContextMenu, (b) => {
                  (S(), y(b), b.preventDefault());
                }),
            onPointerDown: i
              ? l.onPointerDown
              : Z(
                  l.onPointerDown,
                  ji((b) => {
                    (S(), (m.current = window.setTimeout(() => y(b), 700)));
                  }),
                ),
            onPointerMove: i ? l.onPointerMove : Z(l.onPointerMove, ji(S)),
            onPointerCancel: i ? l.onPointerCancel : Z(l.onPointerCancel, ji(S)),
            onPointerUp: i ? l.onPointerUp : Z(l.onPointerUp, ji(S)),
          }),
        ],
      })
    );
  });
Xb.displayName = qb;
var UO = "ContextMenuPortal",
  Ib = (l) => {
    const { __scopeContextMenu: o, ...r } = l,
      i = ht(o);
    return E.jsx(bS, { ...i, ...r });
  };
Ib.displayName = UO;
var Kb = "ContextMenuContent",
  $b = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = Gb(Kb, r),
      f = ht(r),
      d = p.useRef(!1);
    return E.jsx(xS, {
      ...f,
      ...i,
      ref: o,
      side: "right",
      sideOffset: 2,
      align: "start",
      onCloseAutoFocus: (h) => {
        (l.onCloseAutoFocus?.(h),
          !h.defaultPrevented && d.current && h.preventDefault(),
          (d.current = !1));
      },
      onInteractOutside: (h) => {
        (l.onInteractOutside?.(h), !h.defaultPrevented && !c.modal && (d.current = !0));
      },
      style: {
        ...l.style,
        "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
$b.displayName = Kb;
var BO = "ContextMenuGroup",
  HO = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(ES, { ...c, ...i, ref: o });
  });
HO.displayName = BO;
var PO = "ContextMenuLabel",
  Qb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(CS, { ...c, ...i, ref: o });
  });
Qb.displayName = PO;
var VO = "ContextMenuItem",
  Zb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(RS, { ...c, ...i, ref: o });
  });
Zb.displayName = VO;
var GO = "ContextMenuCheckboxItem",
  kb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(TS, { ...c, ...i, ref: o });
  });
kb.displayName = GO;
var YO = "ContextMenuRadioGroup",
  qO = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(wS, { ...c, ...i, ref: o });
  });
qO.displayName = YO;
var XO = "ContextMenuRadioItem",
  Fb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(AS, { ...c, ...i, ref: o });
  });
Fb.displayName = XO;
var IO = "ContextMenuItemIndicator",
  Jb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(_S, { ...c, ...i, ref: o });
  });
Jb.displayName = IO;
var KO = "ContextMenuSeparator",
  Wb = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(MS, { ...c, ...i, ref: o });
  });
Wb.displayName = KO;
var $O = "ContextMenuArrow",
  QO = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(OS, { ...c, ...i, ref: o });
  });
QO.displayName = $O;
var ZO = "ContextMenuSubTrigger",
  ex = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(DS, { ...c, ...i, ref: o });
  });
ex.displayName = ZO;
var kO = "ContextMenuSubContent",
  tx = p.forwardRef((l, o) => {
    const { __scopeContextMenu: r, ...i } = l,
      c = ht(r);
    return E.jsx(NS, {
      ...c,
      ...i,
      ref: o,
      style: {
        ...l.style,
        "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
tx.displayName = kO;
function ji(l) {
  return (o) => (o.pointerType !== "mouse" ? l(o) : void 0);
}
var yN = Yb,
  SN = Xb,
  bN = Ib,
  xN = $b,
  EN = Qb,
  CN = Zb,
  RN = kb,
  TN = Fb,
  wN = Jb,
  AN = Wb,
  _N = ex,
  MN = tx;
export {
  FD as $,
  VD as A,
  LD as B,
  LT as C,
  BT as D,
  GD as E,
  hD as F,
  zt as G,
  YD as H,
  pD as I,
  sn as J,
  rl as K,
  bD as L,
  jC as M,
  qD as N,
  jT as O,
  zT as P,
  XD as Q,
  DT as R,
  oD as S,
  UT as T,
  KD as U,
  OD as V,
  ID as W,
  $D as X,
  QD as Y,
  ZD as Z,
  kD as _,
  oy as a,
  jM as a0,
  VM as a1,
  jf as a2,
  JD as a3,
  $M as a4,
  QM as a5,
  WD as a6,
  eN as a7,
  tN as a8,
  lN as a9,
  sD as aA,
  fD as aB,
  rD as aC,
  Ga as aD,
  eD as aE,
  WO as aF,
  nD as aG,
  tD as aH,
  AR as aI,
  FO as aJ,
  er as aK,
  yN as aL,
  SN as aM,
  bN as aN,
  xN as aO,
  EN as aP,
  AN as aQ,
  CN as aR,
  _N as aS,
  MN as aT,
  RN as aU,
  wN as aV,
  TN as aW,
  rN as aa,
  iN as ab,
  oN as ac,
  aN as ad,
  nN as ae,
  Vf as af,
  aD as ag,
  lD as ah,
  uN as ai,
  cN as aj,
  sN as ak,
  fN as al,
  dN as am,
  pN as an,
  MO as ao,
  OO as ap,
  hN as aq,
  vN as ar,
  mN as as,
  gN as at,
  ki as au,
  bA as av,
  JO as aw,
  iD as ax,
  uD as ay,
  cD as az,
  NT as b,
  dD as c,
  mD as d,
  gD as e,
  yD as f,
  SD as g,
  xD as h,
  TD as i,
  E as j,
  wD as k,
  AD as l,
  ED as m,
  RD as n,
  CD as o,
  _D as p,
  MD as q,
  p as r,
  DD as s,
  ND as t,
  zD as u,
  jD as v,
  UD as w,
  HD as x,
  BD as y,
  PD as z,
};

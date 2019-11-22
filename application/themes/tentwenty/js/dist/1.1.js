webpackJsonp([1, 6], {
    84: function (t, e, i) {
        (function (t) {
            "use strict";

            function o(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }

            function n(t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }

            function a(t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
            }

            function r(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var s = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var o = e[i];
                            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o)
                        }
                    }
                    return function (e, i, o) {
                        return i && t(e.prototype, i), o && t(e, o), e
                    }
                }(),
                h = function t(e, i, o) {
                    null === e && (e = Function.prototype);
                    var n = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === n) {
                        var a = Object.getPrototypeOf(e);
                        return null === a ? void 0 : t(a, i, o)
                    }
                    if ("value" in n) return n.value;
                    var r = n.get;
                    return void 0 !== r ? r.call(o) : void 0
                },
                l = i(18),
                c = o(l),
                u = i(15),
                f = o(u),
                d = i(13),
                v = i(58);
            i(66), i(75), i(69);
            var p = function e(i) {
                r(this, e), this.el = i, this.el.header = t("#siteHeader"), this.el.logo = this.el.header.find(".logo"), this.el.hamMenu = this.el.header.find(".hamburger button"), new m({
                    preload: !0,
                    noscrollbar: !CCM_EDIT_MODE,
                    native: CCM_EDIT_MODE,
                    direction: CCM_EDIT_MODE ? "vertical" : "horizontal",
                    ease: .06,
                    section: this.el[0],
                    divs: this.el.find(".pages-container .page"),
                    logo: this.el.logo,
                    hamMenu: this.el.hamMenu,
                    animateChildren: this.el.find(".animate-children")
                }).init()
            };
            e.default = p;
            var m = function (e) {
                function i(e) {
                    r(this, i);
                    var o = n(this, (i.__proto__ || Object.getPrototypeOf(i)).call(this, e));
                    return f.default.remove(e.section, "no-js"), o.createExtraBound(), o.resizing = !1, o.cache = null, o.animateCache = null, o.native = e.native, o.dom.divs = Array.prototype.slice.call(e.divs, 0), o.dom.logo = e.logo, o.dom.hamMenu = e.hamMenu, o.dom.navigation = t(e.section).next(), o.dom.animate = Array.prototype.slice.call(e.animateChildren, 0), o.dom.workWithUs = e.divs.filter(".page__work-with-us"), o.dom.paragraphs = t(e.divs).find(".page--slogan"), window.smoothScrollInstances.push(o), o
                }
                return a(i, e), s(i, [{
                    key: "createExtraBound",
                    value: function () {
                        var t = this;
                        ["getCache", "inViewport", "on", "off", "animate"].forEach(function (e) {
                            return t[e] = t[e].bind(t)
                        })
                    }
                }, {
                    key: "on",
                    value: function () {
                        var e = this;
                        h(i.prototype.__proto__ || Object.getPrototypeOf(i.prototype), "on", this).call(this), this.dom.navigation.on("click", "button", function (i) {
                            var o = window.outerWidth / 3,
                                n = t(i.currentTarget);
                            n.hasClass("navigation--left") ? e.scrollTo(e.vars.current - o) : e.scrollTo(e.vars.current + o)
                        }), this.dom.workWithUs.on("mouseenter", this.hoverWorkAnimationEnter).on("mouseleave", this.hoverWorkAnimationLeave)
                    }
                }, {
                    key: "hoverWorkAnimationEnter",
                    value: function (e) {
                        var i = t(this);
                        v.TweenMax.staggerTo(i.find("p"), .6, {
                            y: -100,
                            ease: v.Expo.easeInOut
                        }, .03)
                    }
                }, {
                    key: "hoverWorkAnimationLeave",
                    value: function (e) {
                        var i = t(this);
                        v.TweenMax.staggerTo(i.find("p").get().reverse(), .6, {
                            y: 0,
                            ease: v.Expo.easeInOut
                        }, .03)
                    }
                }, {
                    key: "resize",
                    value: function () {
                        this.resizing = !0, this.getCache(), h(i.prototype.__proto__ || Object.getPrototypeOf(i.prototype), "resize", this).call(this), this.resizing = !1
                    }
                }, {
                    key: "getCache",
                    value: function () {
                        var t = this,
                            e = window.innerWidth;
                        this.cache = [], this.animateCache = [];
                        var i = this.vars.width / 3,
                            o = 0;
                        this.dom.divs.forEach(function (n, a) {
                            if (n.style.display = "inline-block", n.style.transform = "none", f.default.has(n, "page-60")) {
                                var r = e > 1124 ? 2 : e > 640 ? 3 : 6;
                                o += i * r, n.style.width = i * r + "px"
                            } else if (f.default.has(n, "page-20")) {
                                var r = e > 1124 ? .7 : e > 640 ? 1 : 2;
                                o += i * r, n.style.width = i * r + "px"
                            } else {
                                var r = e > 1124 ? 1 : e > 640 ? 1.5 : 3;
                                o += i * r, n.style.width = i * r + "px"
                            }
                            var s = t.vars.target,
                                h = n.getBoundingClientRect(),
                                l = {
                                    el: n,
                                    state: !0,
                                    left: h.left + s,
                                    right: h.right + s,
                                    center: i / 2,
                                    isBlack: f.default.has(n, "black-block")
                                };
                            t.cache.push(l)
                        }), this.dom.animate.forEach(function (e, o) {
                            e.style.display = "block";
                            var n = t.vars.target,
                                a = e.getBoundingClientRect(),
                                r = {
                                    el: e,
                                    state: !0,
                                    left: a.left + n,
                                    right: a.right + n,
                                    center: i / 2
                                };
                            t.animateCache.push(r)
                        }), this.dom.section.style.width = this.vars.width + "px", this.vars.bounding = o - this.vars.width
                    }
                }, {
                    key: "run",
                    value: function () {
                        this.dom.divs.forEach(this.inViewport), this.vars.current > 30 ? this.dom.navigation.find(".navigation--left").addClass("active") : this.dom.navigation.find(".navigation--left").removeClass("active"), this.vars.current >= this.vars.bounding - 50 ? this.dom.navigation.find(".navigation--right").removeClass("active") : this.dom.navigation.find(".navigation--right").addClass("active"), this.dom.animate.forEach(this.animate), this.native ? this.dom.section.style[this.prefix] = "translate3d(" + this.vars.current * -1 + "px,0,0)" : this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1), h(i.prototype.__proto__ || Object.getPrototypeOf(i.prototype), "run", this).call(this)
                    }
                }, {
                    key: "calc",
                    value: function (t) {
                        if (!this.animating) {
                            var e = t.deltaY || t.deltaX;
                            this.vars.target += e * -.5, this.clampTarget()
                        }
                    }
                }, {
                    key: "inViewport",
                    value: function (t, e) {
                        if (this.cache && !this.resizing) {
                            var i = this.cache[e],
                                o = this.vars.current,
                                n = Math.round(i.left - o),
                                a = Math.round(i.right - o),
                                r = a > 0 && n < this.vars.width;
                            r && (n + t.offsetWidth - this.dom.hamMenu.offset().left >= 0 && this.dom.hamMenu.offset().left + this.dom.hamMenu.width() - n >= 0 && (i.isBlack ? this.dom.hamMenu.addClass("change-color") : this.dom.hamMenu.removeClass("change-color")), n + t.offsetWidth - this.dom.logo.offset().left >= 0 && this.dom.logo.offset().left + this.dom.logo.width() - n >= 0 && (i.isBlack ? this.dom.logo.addClass("change-color") : this.dom.logo.removeClass("change-color")))
                        }
                    }
                }, {
                    key: "animate",
                    value: function (t, e) {
                        if (this.animateCache && !this.resizing) {
                            var i = this.animateCache[e],
                                o = this.vars.current,
                                n = Math.round(i.left - o),
                                a = Math.round(i.right - o),
                                r = a > 0 && n < this.vars.width;
                            r && ((0, d.animateChildren)(t), this.animateCache.splice(e, 1), this.dom.animate.splice(e, 1))
                        }
                    }
                }, {
                    key: "off",
                    value: function (t) {
                        function e() {
                            return t.apply(this, arguments)
                        }
                        return e.toString = function () {
                            return t.toString()
                        }, e
                    }(function () {
                        h(i.prototype.__proto__ || Object.getPrototypeOf(i.prototype), "off", this).call(this), this.dom.navigation.off("click"), this.dom.workWithUs, off("mouseenter", this.hoverWorkAnimationEnter).off("mouseleave", this.hoverWorkAnimationLeave)
                    })
                }]), i
            }(c.default)
        }).call(e, i(14))
    }
});
//# sourceMappingURL=1.1.js.map
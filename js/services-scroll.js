/*jshint esversion: 6 */

import Smooth from 'smooth-scrolling';
import classes from 'dom-classes';

import {animateChildren} from '../helpers';
import {TweenMax, Power4, Expo} from "gsap";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
require('slick-carousel/slick/slick.js');

export default class ServicesScroll {

    constructor(el) {
        this.el = el;
        this.el.header = $('#siteHeader');
        this.el.logo = this.el.header.find('.logo');
        this.el.hamMenu = this.el.header.find('.hamburger button');

        new SmoothScroll({
            preload: true,
            noscrollbar: !CCM_EDIT_MODE,
            native: CCM_EDIT_MODE,
            direction: CCM_EDIT_MODE ? 'vertical' : 'horizontal',
            ease: 0.06,
            section: this.el[0],
            divs: this.el.find('.pages-container .page'),
            logo: this.el.logo,
            hamMenu: this.el.hamMenu,
            animateChildren: this.el.find('.animate-children')
        }).init();
    }
}

class SmoothScroll extends Smooth {
    constructor(opt) {
        super(opt);
        
        classes.remove(opt.section, 'no-js');

        this.createExtraBound();
        
        this.resizing = false;
        this.cache = null;
        this.animateCache = null;
        this.native = opt.native;

        this.dom.divs = Array.prototype.slice.call(opt.divs, 0);
        this.dom.logo = opt.logo;
        this.dom.hamMenu = opt.hamMenu;
        this.dom.navigation = $(opt.section).next();
        this.dom.animate = Array.prototype.slice.call(opt.animateChildren, 0);
        this.dom.workWithUs = opt.divs.filter('.page__work-with-us');
        this.dom.paragraphs = $(opt.divs).find('.page--slogan');
        
        // this.pageSlider = $(this.dom.divs).find('.page--slider');

        // this.pageSlider.data('images').split(',').forEach( (url) => {
        //     $(`<div class="page--slider--slide" style="background-image: url(${url})"></div>`).appendTo(this.pageSlider);
        // });
        // this.pageSlider.slick({
        //     arrows: false,
        //     // infinite: true,
        //     fade: true,
        //     speed: 500,
        //     autoplay: true,
        //     autoplaySpeed: 2500
        // });
        window.smoothScrollInstances.push(this);
    }
    
    createExtraBound() {
        ['getCache', 'inViewport', 'on', 'off', 'animate']
        .forEach((fn) => this[fn] = this[fn].bind(this));
    }

    on() {
        super.on();
        
        this.dom.navigation.on('click', 'button', (e) => { //functionality for arrow buttons
            const scrollAmount = window.outerWidth / 3;
            const el = $(e.currentTarget);
            if(el.hasClass('navigation--left')) {
                this.scrollTo(this.vars.current - scrollAmount);
            } else {
                this.scrollTo(this.vars.current + scrollAmount);
            }
        });


        this.dom.workWithUs
            .on('mouseenter', this.hoverWorkAnimationEnter)
            .on('mouseleave', this.hoverWorkAnimationLeave);
    }

    hoverWorkAnimationEnter(e) {
        const el = $(this);
        
        TweenMax.staggerTo(
            el.find('p'),
            0.6,
            {y: -100, ease: Expo.easeInOut},
            0.03
        );
        
    }
    
    hoverWorkAnimationLeave(e) {
        const el = $(this);
        TweenMax.staggerTo(
            el.find('p').get().reverse(),
            0.6,
            {y: 0, ease: Expo.easeInOut},
            0.03
        );  
    }
    
    resize() {

        this.resizing = true;

        this.getCache();
        super.resize();
        
        this.resizing = false;
    }

    getCache() {
        var screenWidth = window.innerWidth;        

        this.cache = [];
        this.animateCache = [];

        const unit = (this.vars.width / 3);
        
        let boundingTotal = 0;

        this.dom.divs.forEach((el, index) => {

            el.style.display = 'inline-block';
            el.style.transform = 'none';

            if(classes.has(el, 'page-60')) {
                var extra = (screenWidth > 1124) ? 2 : (screenWidth > 640) ? 3 : 6;
                
                boundingTotal += unit * extra;
                el.style.width = `${unit * extra}px`;
            }
            else if(classes.has(el, 'page-20')) {
                var extra = (screenWidth > 1124) ? 0.7 : (screenWidth > 640) ? 1 : 2;
                
                boundingTotal += unit * extra;
                el.style.width = `${unit * extra}px`;
            }
            else {
                var extra = (screenWidth > 1124) ? 1 : (screenWidth > 640) ? 1.5 : 3;
                
                boundingTotal += unit * extra;
                el.style.width = `${unit * extra}px`;                
            }
            
            const scrollX = this.vars.target;
            const bounding = el.getBoundingClientRect();
            const bounds = {
                el: el,
                state: true,
                left: bounding.left + scrollX,
                right: bounding.right + scrollX,
                center: unit / 2,
                isBlack: classes.has(el, 'black-block')
            };

            this.cache.push(bounds);
        });

        this.dom.animate.forEach((el, index) => {
            el.style.display = 'block';

            const scrollX = this.vars.target;
            const bounding = el.getBoundingClientRect();
            const bounds = {
                el: el,
                state: true,
                left: bounding.left + scrollX,
                right: bounding.right + scrollX,
                center: unit / 2
            }

            this.animateCache.push(bounds);
        });
        
        this.dom.section.style.width = `${this.vars.width}px`;
        this.vars.bounding = boundingTotal - this.vars.width;
    }
    
    run() {

        this.dom.divs.forEach(this.inViewport);

        (this.vars.current > 30) ? this.dom.navigation.find('.navigation--left').addClass('active') : this.dom.navigation.find('.navigation--left').removeClass('active');

        (this.vars.current >= this.vars.bounding - 50) ? this.dom.navigation.find('.navigation--right').removeClass('active'): this.dom.navigation.find('.navigation--right').addClass('active');

        // (this.vars.current > this.dom.divs[0].offsetWidth) ? this.dom.logo.removeClass('change-color') : this.dom.logo.addClass('change-color');

        this.dom.animate.forEach(this.animate);
        
        if(this.native) {
            this.dom.section.style[this.prefix] = `translate3d(${this.vars.current * -1}px,0,0)`;
        } else {
            this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1);
        }
        
        super.run();
    }

    calc(e) {
        if(this.animating) return;

        const delta = e.deltaY || e.deltaX;
        
        this.vars.target += delta * -0.5;
        this.clampTarget();
    }
    
    inViewport(el, index) {
        
        if(!this.cache || this.resizing) return;
        
        const cache = this.cache[index];
        const current = this.vars.current;
        const left = Math.round(cache.left - current);
        const right = Math.round(cache.right - current);
        const inview = right > 0 && left < this.vars.width;
                
        if(inview) {
            if( (left + el.offsetWidth) - this.dom.hamMenu.offset().left >= 0  && ( this.dom.hamMenu.offset().left + this.dom.hamMenu.width() )  - left >=0 ) {
                if(cache.isBlack) {
                    this.dom.hamMenu.addClass('change-color');
                }
                else {
                    this.dom.hamMenu.removeClass('change-color');                    
                }
            }


            if( (left + el.offsetWidth) - this.dom.logo.offset().left >= 0  && ( this.dom.logo.offset().left + this.dom.logo.width() ) - left >=0 ) {
                if(cache.isBlack) {
                    this.dom.logo.addClass('change-color');
                }
                else {
                    this.dom.logo.removeClass('change-color');
                }
            }
        }
    }
    
    animate(el, index) {
        if(!this.animateCache || this.resizing) return;
        
        const cache = this.animateCache[index];

        const current = this.vars.current;
        const left = Math.round(cache.left - current);
        const right = Math.round(cache.right - current);
        
        const inview = right > 0 && left < this.vars.width;

        if(inview) {         
            animateChildren(el);
            this.animateCache.splice(index, 1);
            this.dom.animate.splice(index, 1);
        }
    }

    off() {
        super.off();
        this.dom.navigation.off('click');

        this.dom.workWithUs
            off('mouseenter', this.hoverWorkAnimationEnter)
            .off('mouseleave', this.hoverWorkAnimationLeave);
        
        // this.pageSlider.slick('unslick');
    }
}


// WEBPACK FOOTER //
// ./app/components/scrolling/services-scroll.js
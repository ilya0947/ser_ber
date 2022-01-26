class Slider {
    constructor(selector) {
        this.wrap = document.querySelectorAll(selector);
    }
    init ({size, dot, autoplay, replay} = {}) {

        for (let i = 0; i < this.wrap.length; i++) {
            const slides = [...this.wrap[i].children[0].children];
            const inner = document.createElement('div');
            const wrap = this.wrap[i].children[0];
            const firstSlide = slides[0].cloneNode(true);
            const wigthParent = Math.floor(+window.getComputedStyle(this.wrap[i].parentNode.parentNode).width .replace(/px/, ''));
            const lastSlide = slides[slides.length - 1].cloneNode(true);
            let dots,
                cor = 0,
                eventActive = true,
                posX1,
                posX2;
            const ol = document.createElement('ol');
            const next = document.createElement('a');
            const prev = document.createElement('a');
    
            if (!replay) {
                wrap.appendChild(firstSlide);
                wrap.insertBefore(lastSlide, slides[0]);
                cor = 2;
            }
            
            const img = this.wrap[i].querySelectorAll(`img`);
    
                img.forEach((it, i) => {
                    if (size) {
                        it.style.width =  window.getComputedStyle(wrap.parentNode).width;
                        it.style.height =  window.getComputedStyle(wrap.parentNode).height;
                        if (size.cover) it.style.objectFit = 'cover';
                    } else {
                        it.style.maxWidth =  window.getComputedStyle(wrap.parentNode).width;
                        it.style.maxHeight =  window.getComputedStyle(wrap.parentNode).height;
                        if (i !== 0 && i !== img.length - 1) {
                            it.style.margin = '0 7.5px';
                        } else {
                            if (i === 0) {
                                it.style.marginRight = '7.5px';
                            } else if (i === img.length - 1) {
                                it.style.marginLeft = '7.5px';
                            }
                        }
                    }
                });
    
            
            ol.classList.add('slider-indicators');
            inner.classList.add('slider-inner', 'trans');
            next.classList.add('slider-next');
            prev.classList.add('slider-prev');
            next.innerHTML = '<span class="slider-next-icon">&gt;</span>';
            prev.innerHTML = '<span class="slider-prev-icon">&lt;</span>';
    
            this.wrap[i].appendChild(inner);
            inner.appendChild(wrap);
            this.wrap[i].insertBefore(ol, inner);
            this.wrap[i].appendChild(prev);
            this.wrap[i].appendChild(next);
            
            if (!replay) {
                for (let j = 0; j < slides.length; j++) {
                    let li = document.createElement('li');
                    li.setAttribute('data-slide-to', j + 1);
                    if (!dot) ol.appendChild(li);
                }
            } else {
                for (let j = 0; j < slides.length; j++) {
                    let li = document.createElement('li');
                    li.setAttribute('data-slide-to', j);
                    if (!dot) ol.appendChild(li);
                }
            }
    
           if ( !dot) ol.querySelector('li').classList.add('active');
    
           if ( !dot) dots = this.wrap[i].querySelectorAll('.slider-indicators li');
    
            function nextSlide(e) {
                    if (e.target.classList.contains('slider-next') || e.target.classList.contains('slider-next-icon') || posX1 > posX2) {
                        if (slideIndex == slides.length - 1 + cor) {
                            offset = 0;
                            slideIndex = 0;
                        } else {
                            offset += (Math.floor(+window.getComputedStyle(img[slideIndex]).width.replace(/px/, ''))+15);
                            slideIndex++;
                        }
                    } else {
                        if (slideIndex == 0) {
                            offset = 0;
                            img.forEach(it => {if (it !== img[img.length - 1]) offset +=  Math.floor(+window.getComputedStyle (it).width.replace(/px/, ''));});
            
                            slideIndex = slides.length - 1 + cor;
                        } else {
                            offset -= (Math.floor(+window.getComputedStyle(img[slideIndex-1]).width.replace(/px/, ''))+15);
                            slideIndex--;
                        }
                    }
        
                    innerSize(img[slideIndex]);
                    activeDots();
            }
    
            function activeDots() {
                if (!dot) dots.forEach(dot => dot.classList.remove('active'));
                if (!replay) {
                    if (slideIndex == slides.length + 1) {
                        if (!dot) dots[0].classList.add('active');
                    } else if (slideIndex == 0) {
                        if (!dot) dots[slides.length - 1].classList.add('active');
                    } else {
                        if (!dot) dots[slideIndex - 1].classList.add('active');
                    }
                } else {
                    if (!dot) dots[slideIndex].classList.add('active');
                }
            }

            let corrector = 3,
            ledge = 70,
            getInnerSize = Math.floor(+window.getComputedStyle(inner).width.replace(/px/, ''));

            wigthParent < 500 ? corrector = 1 : corrector = 3;

            
    
            function innerSize(img) {
                wigthParent > 500 && +(window.getComputedStyle(img).width.replace(/px/, '')) * 3 + ledge > getInnerSize ? corrector = 2 : corrector = corrector;
                // console.log(+(window.getComputedStyle(img).width.replace(/px/, '')) * 3 + ledge, getInnerSize);
                wrap.style.transform = `translateX(-${offset}px)`;
                inner.style.width = +(window.getComputedStyle(img).width.replace(/px/, '')) * corrector + ledge + 'px';
                inner.style.height = window.getComputedStyle(img).height;
            }
    
            
    
            function goToSlide(go) {
                offset = 0;
                for (let i =0; i < img.length; i++) {
                    if (go != i) {
                        offset +=  +window.getComputedStyle(img[i]).width.replace(/px/, '');
                    } else {
                        break;
                    }
                }
            }

            function handler(e) {
                e.preventDefault();

                posX1 = posX2;
               
                if (eventActive) nextSlide(e);
                eventActive = false;
            }

            function unHandler(e){
                if(e.target === next || e.target === prev || e.target.classList.contains('slider-next-icon') || e.target.classList.contains('slider-prev-icon')) {
                    e.stopPropagation();
                    e.target.classList.add('op');
                } 
            }
        
            wrap.addEventListener('transitionend', () => {
               if (!replay) {
                    if (slideIndex == 0 || slideIndex == img.length - 1) {
                        wrap.classList.remove('trans');
                        inner.classList.remove('trans');
                        if (slideIndex == 0) {
                            slideIndex = img.length - 2;
                            goToSlide(slideIndex);
                            innerSize(img[slideIndex]);
                        } else {
                            slideIndex = 1;
                            offset = (Math.floor(+window.getComputedStyle(img[slideIndex - 1]).width .replace(/px/, '')));
                            innerSize(img[slideIndex]);
                        }
                        wrap.classList.add('trans');
                        inner.classList.add('trans');
                    }
               }
                if (replay && !autoplay) {
                    if (slideIndex == 0) prev.addEventListener("click",unHandler,true);
                    if (slideIndex == slides.length - (corrector+1)) {
                        next.removeEventListener('click', unHandler, true);
                        next.addEventListener('click', handler);
                        next.classList.remove('op');
                    }
                    if (slideIndex == slides.length - corrector) next.addEventListener("click",unHandler,true);
                    if (slideIndex == 1) {
                        prev.removeEventListener('click', unHandler, true);
                        prev.addEventListener('click', handler);
                        prev.classList.remove('op');
                    }
                }
                eventActive = true;
            });

            wrap.addEventListener('touchstart', (e) => {
                posX1 = e.touches[0].clientX;
            });

            wrap.addEventListener('touchmove', (e) => {
                posX2 = e.touches[0].clientX;
            });

            wrap.addEventListener('touchend', (e) => {
                if (slideIndex !== 0 && posX1 < posX2) {
                    nextSlide(e);
                } else if (slideIndex !== slides.length - corrector && posX1 > posX2) {
                    nextSlide(e);
                }
            });
            
            let offset,
                slideIndex;
                !replay ? slideIndex = 1 : slideIndex = 0;
                !replay ? offset = (Math.floor(+window.getComputedStyle(img[slideIndex - 1]).width .replace(/px/, ''))) : offset = 0;
    
            next.addEventListener('click', handler);
    
            prev.addEventListener('click', handler);
    
            if (autoplay) {
                setInterval(()  => {
                    next.click();
                }, autoplay.time);
            }

            if (replay) {
                if (slideIndex == 0) prev.addEventListener("click",unHandler,true);
            }
    
            innerSize(img[slideIndex]);
            
            wrap.classList.add('slider-slides', 'trans');

            let posBtn = (Math.floor(+window.getComputedStyle(inner).marginLeft .replace(/px/, ''))) - 15;
            prev.style.right = `calc(100% - ${posBtn}px)`;
            next.style.left = `calc(100% - ${posBtn}px)`;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    new Slider('#carousel').init({
        dot: true,
        replay: true
    });
});
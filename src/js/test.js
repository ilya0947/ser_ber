window.addEventListener('DOMContentLoaded', () => {
    'use strict';


    (function() {

        const widthScreen = window.screen.width;
        
        
        function slider(slid, nex = null, pre = null) {
            
            
            
            let activeClick = true;
            let x = 0;
            const next = document.querySelector(nex);
            const prev = document.querySelector(pre);
            const time = 2000;
            const scale = 2;
            const slideCont = document.querySelector(slid);
            const slides = slideCont.children;
            const lastSlide = slides.length - 1;
            const getImg = index => slides[index].querySelector('img');

            for (let i = 0; i < lastSlide + 1; i++) {
                if (i < 3) {
                    slides[i].style.display = '';
                } else {
                    slides[i].style.display = 'none';
                }
            };

            const nextX = slides[2].getBoundingClientRect().left;
            const prevX = slides[1].getBoundingClientRect().left;
            x = nextX - prevX;
            const classesStyle = document.createElement('style');
            classesStyle.setAttribute('data-styles', '');
            classesStyle.innerHTML = `
                .active {
                    transform: scale(1.${scale});
                }
                .active_next_scale {
                    transition: ${time}ms all;
                    transform: translateX(-${x}px) scale(1.${scale});
                    z-index: 30 !important;
                }
                .active_next {
                    transition: ${time}ms all;
                    transform: translateX(-${x}px) scale(1);
                }
                .active_prev_scale {
                    transition: ${time}ms all;
                    transform: translateX(${x}px) scale(1.${scale});
                    z-index: 30 !important;
                }
                .active_prev {
                    transition: ${time}ms all;
                    transform: translateX(${x}px) scale(1);
                    z-index: 30 !important;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: scale(.5);
                    }
                    to  {
                        opacity: 1;
                        transform: scale(1);
                    }                    
                }
                .slideIn {
                    animation: slideIn ${time}ms ease;
                }
                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to  {
                        opacity: 0;
                        transform: scale(.5);
                    }
                }
                .slideOut {
                    animation: slideOut ${time}ms linear;
                }
                
            `;
            if (document.head.querySelector('[data-styles]')) {
                document.head.querySelector('[data-styles]').remove();
            }
            document.head.appendChild(classesStyle);

            function showSlide() {
                for (let i = 0; i < lastSlide + 1; i++) {
                    if (i < 3) {
                        slides[i].style.display = '';
                    } else {
                        slides[i].style.display = 'none';
                    }
                    getImg(i).removeAttribute('class');
                };
                getImg(1).classList.add('active');
                activeClick = true;
            }

            showSlide();         

            function createImgClone(arrSlides, last) {
                const indexClone = last ? lastSlide : 3;
                const indexSlide = last ? 0 : 2;
                const clone = arrSlides[indexClone].querySelector('img').cloneNode();
                clone.classList.remove('slideOut');
                clone.classList.add('slideIn');
                clone.style.position = 'absolute';
                slides[indexSlide].appendChild(clone);
                clone.onanimationend = () => {
                    clone.remove();
                }
            }

            function toggleSlideClass(index, clazz, remove) {
                if (remove) {
                    getImg(index).classList.remove(clazz);
                } else {
                    getImg(index).classList.add(clazz);
                }
            }

            next.addEventListener('click', (e) => {
                e.preventDefault();
                if (activeClick) {
                    activeClick = false;
                    toggleSlideClass(0, 'slideOut');
                    createImgClone(slides);
                    
                    toggleSlideClass(2, 'active_next_scale');
                    toggleSlideClass(1, 'active_next');
                    getImg(0).onanimationend = () => {
                        toggleSlideClass(0, 'slideOut', true);
                        slideCont.appendChild(slides[0]);
                        getImg(0).onanimationend = false;
                        showSlide();
                    }
                };
            });

            prev.addEventListener('click', (e) => {
                e.preventDefault();
                if (activeClick) {
                    activeClick = false;
                    toggleSlideClass(2, 'slideOut');
                    createImgClone(slides, true);
                    
                    toggleSlideClass(0, 'active_prev_scale');
                    toggleSlideClass(1, 'active_prev');
                    getImg(2).onanimationend = () => {
                        toggleSlideClass(2, 'slideOut', true);
                        slideCont.insertBefore(slides[lastSlide], slides[0]);
                        getImg(2).onanimationend = false;
                        showSlide();
                    };
                }
            });
        }
        
        slider('[data-slides]', '[data-next]', '[data-prev]');
        
        window.addEventListener('resize', () => {
            slider('[data-slides]', '[data-next]', '[data-prev]')    
        });
        

            function playVideo(sel) {
                const videoWrapp = document.querySelector(sel);
                const close = videoWrapp.querySelector('[data-close]');
                const video = videoWrapp.querySelector('video');
                

                videoWrapp.addEventListener('click', () => {

                    if (!videoWrapp.classList.contains('flyVideoIn')) {
                        videoWrapp.classList.add('flyVideoIn');
                        video.setAttribute('controls', '');
                    }
                    
                    videoWrapp.onanimationend = () => {
                        close.style.display = 'block';
                        videoWrapp.style.cssText = `
                        top: 1%;
                        width: ${widthScreen < 620 ? '70vw' : '200%'};
                        left: ${widthScreen < 620 ? '-10vw' : '-50%'};
                        z-index: 20 !important;`
                        video.play();
                        videoWrapp.onanimationend = false;
                    };
                });
                
                close.addEventListener('click', (e) => {
                    e.stopPropagation();
                    videoWrapp.classList.remove('flyVideoIn');
                    videoWrapp.classList.add('flyVideoOut');
                    
                    videoWrapp.onanimationend = () => {
                        videoWrapp.removeAttribute('style');
                        video.removeAttribute('controls');
                        video.load();
                        videoWrapp.classList.remove('flyVideoOut');
                        close.style.display = '';
                        videoWrapp.onanimationend = false;
                    };
                });
            }

            playVideo('[data-video]');

            function playMobileVideo(sel) {
                const mobileVideo = document.querySelector(sel);

                mobileVideo.addEventListener('click', () => {
                    mobileVideo.setAttribute('controls', '');
                    // mobileVideo.play();
                });
            }

            playMobileVideo('[data-mobile_video]');

    })()
});
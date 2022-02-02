window.addEventListener('DOMContentLoaded', () => {
    'use strict';


    (function() {

        const widthScreen = window.screen.width;


        function slider(slid, nex = null, pre = null) {

            const slideCont = document.querySelector(slid);
            const next = document.querySelector(nex);
            const prev = document.querySelector(pre);
            const slides = slideCont.children;
            const lastSlide = slides.length - 1;
            const time = 500;
            const scale = 3;
            let x = 0;
            let activeClone = true;

            function showSlide() {
                for (let i = 0; i < lastSlide + 1; i++) {
                    if (i < 3) {
                        slides[i].style.display = '';
                    } else {
                        slides[i].style.display = 'none';
                    }
                    slides[i].querySelector('img').style.transform = 'scale(1)';
                    setTimeout(() => {},time);
                    slides[i].ontransitionend = () => {
                        slides[i].querySelector('img').removeAttribute('style');
                        slides[i].ontransitionend = false;
                    }
                };
                const prevX = slides[0].querySelector('img').getBoundingClientRect().left;
                const nextX = slides[1].querySelector('img').getBoundingClientRect().left;
                x = (nextX - prevX);
                slides[1].querySelector('img').style.transform = `translateX(-${scale}%) scale(1.${scale})`;
            }
            showSlide();

            function calcX(slide, skale, prev) {
                const vector = prev ? -x : x;
                const sc = skale ? `1.${scale}` : 1;
                const active = slide.style.cssText = `
                transition: 0.5s all;
                transform: translateX(${vector}px) scale(${sc});
                z-index: 30`;
                // alert()
                return active;
            }

            function createImgClone(arrSlides, last) {
                if (activeClone) {
                    activeClone = false;
                    const indexClone = last ? lastSlide : 3;
                    const indexSlide = last ? 0 : 2;
                    const clone = arrSlides[indexClone].querySelector('img').cloneNode();
                    clone.classList.remove('slideOut');
                    clone.classList.add('slideIn');
                    clone.style.position = 'absolute';
                    slides[indexSlide].appendChild(clone);
                    clone.onanimationend = () => {
                        activeClone = true;
                        clone.remove();
                    }
                }
            }

            next.addEventListener('click', (e) => {
                e.preventDefault();
                // alert(scale);
                
                slides[0].querySelector('img').classList.add ('slideOut');
                createImgClone(slides);
                
                calcX(slides[2].querySelector('img'), true, true);
                calcX(slides[1].querySelector('img'), false, true);
                    
                slides[0].querySelector('img').onanimationend = () => {
                    slides[0].querySelector('img').classList.remove('slideOut');
                    slideCont.appendChild(slides[0]);
                    slides[0].querySelector('img').onanimationend = false;
                    showSlide();
                };
            });

            prev.addEventListener('click', (e) => {
                e.preventDefault();
    
                slides[2].querySelector('img').classList.add ('slideOut');
                createImgClone(slides, true);
                    
                calcX(slides[0].querySelector('img'), true);
                calcX(slides[1].querySelector('img'));
                    
                slides[2].querySelector('img').onanimationend = () => {
                    slides[2].querySelector('img').classList.remove('slideOut');
                    slideCont.insertBefore(slides[lastSlide], slides[0]);
                    slides[2].querySelector('img').onanimationend = false;
                    showSlide();
                };
            });
        }
        
        slider('[data-slides]', '[data-next]', '[data-prev]');
        
        window.addEventListener('resize', () => {
            slider('[data-slides]', '[data-next]', '[data-prev]');
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
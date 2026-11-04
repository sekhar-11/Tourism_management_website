const swiper = new Swiper('.slider-wrapper', {
    
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    slidesperGroup: 1,
    slidesperview: 'auto',
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    breakpoints: {
        0: {
            slidesperview: 1,
            slidesperGroup: 1,
        },
        620: {
            slidesperview: 2,
            slidesperGroup: 1,
        },
        1024: {
            slidesperview: 1,
            slidesperGroup: 1,
        }
    }
    
  });
  
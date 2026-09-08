document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pagination = document.querySelector('.slider-pagination');

    let index = 0;

   
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        if (i === 0) dot.classList.add('active'); 
        
        dot.addEventListener('click', () => changeSlide(i));
        pagination.appendChild(dot);
    });

    const dots = document.querySelectorAll('.pagination-dot');

   
    function changeSlide(newIndex) {
        index = newIndex;
        
        
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }


    nextBtn.addEventListener('click', () => {
      
        const nextIndex = (index === slides.length - 1) ? 0 : index + 1;
        changeSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {

        const prevIndex = (index === 0) ? slides.length - 1 : index - 1;
        changeSlide(prevIndex);
    });
});
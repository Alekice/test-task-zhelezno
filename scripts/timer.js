// Jquery

$(document).ready(function () {
    const newYear2023 = new Date(2023, 0, 1).getTime();
    let now = new Date().getTime();
    let difference = newYear2023 - now;
    const days = $('.days');
    const hours = $('.hours');
    const minutes = $('.minutes');
    const seconds = $('.seconds');

    days.text(Math.floor(difference / (1000 * 60 * 60 * 24)));
    hours.text( Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
    minutes.text(Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)));
    seconds.text(Math.floor(difference % (1000 * 60) / 1000));

    const timer = setInterval(() => {
        now = new Date().getTime();
        difference = newYear2023 - now;
        days.text(Math.floor(difference / (1000 * 60 * 60 * 24)));
        hours.text( Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
        minutes.text(Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)));
        seconds.text(Math.floor(difference % (1000 * 60) / 1000));

        if (difference < 0) {
            clearInterval(timer);
        }
    }, 1000);
});

// Vanilla JavaScript

// window.onload = () => {
//     const newYear2023 = new Date(2023, 0, 1).getTime();
//     let now = new Date().getTime();
//     let difference = newYear2023 - now;
//     const days = document.querySelector('.days');
//     const hours = document.querySelector('.hours');
//     const minutes = document.querySelector('.minutes');
//     const seconds = document.querySelector('.seconds');

//     days.textContent = Math.floor(difference / (1000 * 60 * 60 * 24));
//     hours.textContent = Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
//     minutes.textContent = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
//     seconds.textContent = Math.floor(difference % (1000 * 60) / 1000);

//     const timer = setInterval(() => {
//         now = new Date().getTime();
//         difference = newYear2023 - now;
//         days.textContent = Math.floor(difference / (1000 * 60 * 60 * 24));
//         hours.textContent = Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
//         minutes.textContent = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
//         seconds.textContent = Math.floor(difference % (1000 * 60) / 1000);

//         if (difference < 0) {
//             clearInterval(timer);
//         }
//     }, 1000);
// };
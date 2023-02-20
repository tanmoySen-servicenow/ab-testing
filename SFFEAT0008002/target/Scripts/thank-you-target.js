!(function () {
const mainView = document.querySelector('.inner-view.uf-contact-experience');

// change text for Thank you message body
if(mainView && mainView.querySelector('.login-description')){
    mainView.querySelector('.login-description').innerText = "Thank you. We're routing your request to our team of experts who will be in touch shortly.";
}
})()
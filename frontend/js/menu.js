'use strict';

const toggle = document.querySelector('.main-nav__toggle');
const menu = document.querySelector('.main-nav__list');

toggle.addEventListener('click', function (event) {
  event.preventDefault();

  if (toggle.classList.contains('main-nav__toggle--closed')) {
    toggle.classList.remove('main-nav__toggle--closed');
    toggle.classList.add('main-nav__toggle--opened');
  } else {
    toggle.classList.remove('main-nav__toggle--opened');
    toggle.classList.add('main-nav__toggle--closed');
  }

  menu.classList.toggle('main-nav__list--closed');
});


// MENU
const menuButton = document.querySelector('header nav:nth-of-type(2) button');
const menu = document.querySelector('header nav:nth-of-type(2) ul');

menuButton.addEventListener('click', () => {
    menu.classList.toggle('show');
});


const filterButton = document.querySelector('.filterBar>button');
const themeFilters = document.querySelector('.themeFilters');

filterButton.addEventListener('click', () => {
    console.log('click');
    themeFilters.classList.toggle('show');
});
// MENU
const menuButton = document.querySelector('header nav:nth-of-type(2) button');
const menu = document.querySelector('header nav:nth-of-type(2) ul');

menuButton.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// FILTER
const filterButton = document.querySelector('.filterBar>button');
const themeFilters = document.querySelector('.themeFilters');

if (filterButton) {
    filterButton.addEventListener('click', () => {
        console.log('click');
        themeFilters.classList.toggle('show');
    });
}

// SHOW IMAGE PREVIEW IN FORM
document.addEventListener('DOMContentLoaded', () => {
    const imageLinkInput = document.getElementById('image-link');
    const imagePreview = document.getElementById('image-preview');

    if (imageLinkInput) {
        imageLinkInput.addEventListener('input', () => {
            imagePreview.innerHTML = `<img src="${imageLinkInput.value}" alt="Preview van gekozen afbeelding">`;
        });
    }
});

// DIALOG
const dialogBtn = document.querySelector('#dialog-btn');
const dialog = document.querySelector('#dialog');
const dialogCloseBtn = document.querySelector('#dialog-close');

dialogBtn.addEventListener('click', () => {
    dialog.showModal();
});

dialogCloseBtn.addEventListener('click', () => {
    dialog.close();
});

// FORM VALIDATION
const wishForm = document.querySelector('#wish-form');
const wishTitle = document.querySelector('.wish-form form input#title');
const wishDescription = document.querySelector('.wish-form form textarea#description');
const wishError = document.querySelector('.wish-form form span.error');

let titleErrorShown = false;
let descriptionErrorShown = false;

wishForm.setAttribute('novalidate', true); // Wanneer javascript aan staat word de standaard HTML validatie uitgezet

wishForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (wishTitle.value === '' && wishDescription.value === '') {
        wishTitle.focus();
        if (!titleErrorShown) {
            wishTitle.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een titel voor je wens toe.</span>');
            titleErrorShown = true;
        }
        if (!descriptionErrorShown) {
            wishDescription.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een uitleg over je wens toe.</span>');
            descriptionErrorShown = true;
        }
    } else if (wishTitle.value === '') {
        if (descriptionErrorShown) {
            wishDescription.nextElementSibling.remove();
            descriptionErrorShown = false;
        }
        console.log('Please enter a title');
        wishTitle.focus();
        if (!titleErrorShown) {
            wishTitle.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een titel voor je wens toe.</span>');
            titleErrorShown = true;
        }
    } else if (wishDescription.value === '') {
        if (titleErrorShown) {
            wishTitle.nextElementSibling.remove();
            titleErrorShown = false;
        }
        console.log('Please enter a description');
        wishDescription.focus();
        if (!descriptionErrorShown) {
            wishDescription.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een uitleg over je wens toe.</span>');
            descriptionErrorShown = true;
        }
    } else {
        console.log('Formulier word verstuurd');
        console.log(wishTitle.value);
        console.log(wishDescription.value);
        wishForm.submit();
    }
});

// MENU
const menuButton = document.querySelector('header nav:nth-of-type(2) button');
const menu = document.querySelector('header nav:nth-of-type(2) ul');

menuButton.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// MASONRY
const masonryButton = document.querySelector('.masonryBtn>input');
const gridButton = document.querySelector('.gridBtn>input');
let masonryInstance = null;
const grid = document.querySelector('.grid');

grid.classList.add('masonry');

masonryButton.addEventListener('click', () => {
    grid.classList.add('masonry');
    grid.classList.remove('block');
});

gridButton.addEventListener('click', () => {
    grid.classList.remove('masonry');
    grid.classList.add('block');
});


function initializeMasonry() {
    masonryInstance = new Masonry(grid, {
        itemSelector: '.wishcard',
        fitWidth: true,
        gutter: 20,
    });
    console.log('masonry initialized')
}


if (!CSS.supports('grid-template-columns', 'masonry')) {

    console.log('no css masonry support')

    if (masonryButton.checked) {
            initializeMasonry();
        console.log('masonry checked')
    }


    masonryButton.addEventListener('click', () => {
        console.log('click')
        if (!masonryInstance) {
                initializeMasonry();
        }
    });

    gridButton.addEventListener('click', () => {
        if (masonryInstance) {
            masonryInstance.destroy();
            masonryInstance = null;
        }
    });

}


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
    console.log('Formulier testen');
    e.preventDefault();

    const wishTitleValue = wishTitle.value.trim();
    const wishDescriptionValue = wishDescription.value.trim();

    if (wishTitleValue.length <= 2 && wishDescriptionValue.length <= 2 || wishTitleValue.length === 0 && wishDescriptionValue.length === 0 || wishTitleValue.length <= 2 && wishDescriptionValue.length === 0 || wishTitleValue.length === 0 && wishDescriptionValue.length <= 2) {
        wishTitle.focus();
        if (!titleErrorShown) {
            wishTitle.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een titel voor je wens toe van minimaal 3 karakters.</span>');
            titleErrorShown = true;
        }
        if (!descriptionErrorShown) {
            wishDescription.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een uitleg over je wens toe van minimaal 3 karakters.</span>');
            descriptionErrorShown = true;
        }
    } else if (wishTitleValue.length <= 2 || wishTitleValue.length === 0) {
        if (descriptionErrorShown) {
            wishDescription.nextElementSibling.remove();
            descriptionErrorShown = false;
        }
        console.log('Please enter a title');
        wishTitle.focus();
        if (!titleErrorShown) {
            wishTitle.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een titel voor je wens toe van minimaal 3 karakters.</span>');
            titleErrorShown = true;
        }
    } else if (wishDescriptionValue.length <= 2 || wishDescriptionValue.length === 0) {
        if (titleErrorShown) {
            wishTitle.nextElementSibling.remove();
            titleErrorShown = false;
        }
        console.log('Please enter a description');
        wishDescription.focus();
        if (!descriptionErrorShown) {
            wishDescription.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een uitleg over je wens toe van minimaal 3 karakters.</span>');
            descriptionErrorShown = true;
        }
    } else {
        console.log('Formulier wordt verstuurd');
        console.log(wishTitleValue);
        console.log(wishDescriptionValue);
        wishForm.submit();
    }
});


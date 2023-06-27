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

if (grid) {
    grid.classList.add('masonry');
}

if (masonryButton) {
    masonryButton.addEventListener('click', () => {
        grid.classList.add('masonry');
        grid.classList.remove('block');
    });
}

if (gridButton) {
    gridButton.addEventListener('click', () => {
        grid.classList.remove('masonry');
        grid.classList.add('block');
    });
}

function initializeMasonry() {
    masonryInstance = new Masonry(grid, {
        itemSelector: '.wishcard',
        fitWidth: true,
        gutter: 20,
    });
}

if (grid) {
    if (!CSS.supports('grid-template-columns', 'masonry')) {

        if (masonryButton.checked) {
            initializeMasonry();
        }


        masonryButton.addEventListener('click', () => {
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
}

// FILTER
const filterButton = document.querySelector('.filterBar>button');
const themeFilters = document.querySelector('.themeFilters');

if (filterButton) {
    filterButton.addEventListener('click', () => {
        themeFilters.classList.toggle('show');
    });
}

// ADD AMBASSADOR
const ambassadorButton = document.querySelector('.wish section article button:first-of-type');
const ambassador = document.querySelector('.wish aside section:first-of-type ul li:first-of-type');

if (ambassadorButton) {
    ambassadorButton.addEventListener('click', () => {
        ambassador.setAttribute('class', 'show');
    });
}

// ADD HELPER
const helperButton = document.querySelector('.wish section article button:nth-of-type(2)');
const helper = document.querySelector('.wish aside section:nth-of-type(2) ul li:first-of-type');

if (helperButton) {
    helperButton.addEventListener('click', () => {
        helper.setAttribute('class', 'show');
    });
}

// ADD SHAREER
const shareButton = document.querySelector('.wish section article button:nth-of-type(3)');
const shareer = document.querySelector('.wish aside section:nth-of-type(3) ul li:first-of-type');
const hideShareer = document.querySelector('.wish aside section:nth-of-type(3) ul li:last-of-type');

if (shareButton) {
    shareButton.addEventListener('click', () => {
        shareer.setAttribute('class', 'show');
        hideShareer.setAttribute('class', 'hidden');
    });
}

// ADD REACTION
const reactionButton = document.querySelector('.wish section:nth-of-type(2) form + button');
const reaction = document.querySelector('.wish section:nth-of-type(2) ul li:first-of-type');

if (reactionButton) {
    reactionButton.addEventListener('click', () => {
        reaction.setAttribute('class', 'show');
    });
}

// FORM VALIDATION
const wishForm = document.querySelector('#wish-form');
const wishTitle = document.querySelector('.wish-form form input#title');
const wishDescription = document.querySelector('.wish-form form textarea#description');
const wishImageLink = document.querySelector('.wish-form form input#image-link');

let titleErrorShown = false;
let descriptionErrorShown = false;
let imageLinkErrorShown = false;
let themeErrorShown = false;

if (wishForm) {
    wishForm.setAttribute('novalidate', true);

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const themeContainer = document.querySelector('.themes-container');
        const themeCheckboxes = document.getElementsByName('theme');
        const wishTitleValue = wishTitle.value.trim();
        const wishDescriptionValue = wishDescription.value.trim();
        const wishImageLinkValue = wishImageLink.value.trim();
        let checked = false;

        themeCheckboxes.forEach(function (theme) {
            if (theme.checked) {
                checked = true;
            }
        });

        // Reset error messages
        removeErrorMessage(wishTitle);
        removeErrorMessage(wishDescription);
        removeErrorMessage(wishImageLink);
        removeErrorMessage(themeContainer);

        if (wishTitleValue.length < 10) {
            displayError('Voeg een titel voor je wens toe, van minimaal 10 karakters.', wishTitle);
        }

        if (wishDescriptionValue.length < 10) {
            displayError('Voeg een uitleg over je wens toe, van minimaal 10 karakters.', wishDescription);
        }

        if (wishImageLinkValue.length === 0) {
            displayError('Voeg een link naar een afbeelding toe.', wishImageLink);
        } else if (!validateLink(wishImageLinkValue)) {
            displayError('De opgegeven link naar een afbeelding is ongeldig.', wishImageLink);
        }

        if (!checked) {
            displayError("Kies een of meerdere thema's die passen bij je wens.", themeContainer);
        }

        if (wishTitleValue.length >= 10 && wishDescriptionValue.length >= 10 && checked && validateLink(wishImageLinkValue)) {
            wishForm.submit();
        }
    });

    function displayError(errorMessage, inputElement) {
        if (!inputElement.classList.contains('error')) {
            inputElement.insertAdjacentHTML('afterend', `<span class="error">${errorMessage}</span>`);
            inputElement.classList.add('error');
            document.querySelector('input:invalid, textarea:invalid, .error input').focus();
        }
    }

    function removeErrorMessage(inputElement) {
        if (inputElement.classList.contains('error')) {
            const errorElement = inputElement.nextElementSibling;
            errorElement.parentNode.removeChild(errorElement);
            inputElement.classList.remove('error');
        }
    }

    function validateLink(link) {
        try {
            const url = new URL(link);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

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

    // SHOW IMAGE PREVIEW IN FORM
    const imageLinkInput = document.getElementById('image-link');
    const imagePreview = document.getElementById('image-preview');

    if (imageLinkInput) {
        imageLinkInput.addEventListener('input', () => {
            const imageLink = imageLinkInput.value.trim();

            if (validateLink(imageLink)) {
                imagePreview.innerHTML = `<img src="${imageLink}" alt="Preview van gekozen afbeelding">`;
            } else {
                imagePreview.innerHTML = '';
            }
        });
    }
}
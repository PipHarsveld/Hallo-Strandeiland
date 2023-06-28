// MENU
const menuButton = document.querySelector('header nav:nth-of-type(2) button');
const menu = document.querySelector('header nav:nth-of-type(2) ul');

menuButton.addEventListener('click', () => { //When menu button is clicked
    menu.classList.toggle('show'); // Toggle show class on menu
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

if (ambassadorButton) { // If ambassador button exists
    ambassadorButton.addEventListener('click', () => { // When ambassador button is clicked
        ambassador.setAttribute('class', 'show'); // Add show class to ambassador
    });
}

// ADD HELPER
const helperButton = document.querySelector('.wish section article button:nth-of-type(2)');
const helper = document.querySelector('.wish aside section:nth-of-type(2) ul li:first-of-type');

if (helperButton) { // If helper button exists
    helperButton.addEventListener('click', () => { // When helper button is clicked
        helper.setAttribute('class', 'show'); // Add show class to helper
    });
}

// ADD SHAREER
const shareButton = document.querySelector('.wish section article button:nth-of-type(3)');
const shareer = document.querySelector('.wish aside section:nth-of-type(3) ul li:first-of-type');
const hideShareer = document.querySelector('.wish aside section:nth-of-type(3) ul li:last-of-type');

if (shareButton) { // If share button exists
    shareButton.addEventListener('click', () => { // When share button is clicked
        shareer.setAttribute('class', 'show'); // Add show class to shareer
        hideShareer.setAttribute('class', 'hidden'); // Hide last shareer in list
    });
}

// ADD REACTION
const reactionButton = document.querySelector('.wish section:nth-of-type(2) form + button');
const reaction = document.querySelector('.wish section:nth-of-type(2) ul li:first-of-type');

if (reactionButton) { // If reaction button exists
    reactionButton.addEventListener('click', () => { // When reaction button is clicked
        reaction.setAttribute('class', 'show'); // Add show class to reaction
    });
}

// FORM VALIDATION
const wishForm = document.querySelector('#wish-form');
const wishTitle = document.querySelector('.wish-form form input#title');
const wishDescription = document.querySelector('.wish-form form textarea#description');
const wishImageLink = document.querySelector('.wish-form form input#image-link');

// Set errors shown to false so they can be shown when form is submitted and not before that
let titleErrorShown = false;
let descriptionErrorShown = false;
let imageLinkErrorShown = false;
let themeErrorShown = false;

if (wishForm) { // If form exists
    wishForm.setAttribute('novalidate', true); // Disable default HTML5 validation

    wishForm.addEventListener('submit', (e) => { // When form is submitted
        e.preventDefault(); // Prevent form from submitting

        const themeContainer = document.querySelector('.themes-container');
        const themeCheckboxes = document.getElementsByName('theme');
        const wishTitleValue = wishTitle.value.trim(); // Trim removes whitespace from beginning and end of string
        const wishDescriptionValue = wishDescription.value.trim();
        const wishImageLinkValue = wishImageLink.value.trim();
        let checked = false; // Set checked to false by default

        themeCheckboxes.forEach(function (theme) { // Loop through all theme checkboxes
            if (theme.checked) { // If a theme checkbox is checked
                checked = true; // Set checked to true
            }
        });

        // Reset error messages
        removeErrorMessage(wishTitle);
        removeErrorMessage(wishDescription);
        removeErrorMessage(wishImageLink);
        removeErrorMessage(themeContainer);

        if (wishTitleValue.length < 10) { // If title is less than 10 characters
            displayError('Voeg een titel voor je wens toe, van minimaal 10 karakters.', wishTitle); // Display error message
        }

        if (wishDescriptionValue.length < 10) { // If description is less than 10 characters
            displayError('Voeg een uitleg over je wens toe, van minimaal 10 karakters.', wishDescription); // Display error message
        }

        if (wishImageLinkValue.length === 0) { // If image link is empty
            displayError('Voeg een link naar een afbeelding toe.', wishImageLink); // Display error message
        } else if (!validateLink(wishImageLinkValue)) { // If image link is not valid
            displayError('De opgegeven link naar een afbeelding is ongeldig.', wishImageLink); // Display error message
        }

        if (!checked) { // If no theme checkbox is checked
            displayError("Kies een of meerdere thema's die passen bij je wens.", themeContainer); // Display error message
        }

        if (wishTitleValue.length >= 10 && wishDescriptionValue.length >= 10 && checked && validateLink(wishImageLinkValue)) { // If all fields are valid
            wishForm.submit(); // Submit form
        }
    });

    function displayError(errorMessage, inputElement) { // Function to display error message
        if (!inputElement.classList.contains('error')) { // If input element doesn't have error class
            inputElement.insertAdjacentHTML('afterend', `<span class="error">${errorMessage}</span>`); // Insert error message after input element
            inputElement.classList.add('error'); // Add error class to input element
            document.querySelector('input:invalid, textarea:invalid, .error input').focus(); // Put focus on first invalid input element
        }
    }

    function removeErrorMessage(inputElement) { // Function to remove error message
        if (inputElement.classList.contains('error')) { // If input element has error class
            const errorElement = inputElement.nextElementSibling; // Get error element
            errorElement.parentNode.removeChild(errorElement); // Remove error element
            inputElement.classList.remove('error'); // Remove error class from input element
        }
    }

    function validateLink(link) { // Function to validate link
        try {
            const url = new URL(link); // Create new URL object
            return url.protocol === 'http:' || url.protocol === 'https:'; // Return true if protocol is http or https
        } catch (error) {
            return false; // Return false if error
        }
    }

    // DIALOG
    const dialogBtn = document.querySelector('#dialog-btn');
    const dialog = document.querySelector('#dialog');
    const dialogCloseBtn = document.querySelector('#dialog-close');

    dialogBtn.addEventListener('click', () => { // When dialog button is clicked
        dialog.showModal(); // Show dialog
    });

    dialogCloseBtn.addEventListener('click', () => { // When dialog close button is clicked
        dialog.close(); // Close dialog
    });

    // SHOW IMAGE PREVIEW IN FORM
    const imageLinkInput = document.getElementById('image-link');
    const imagePreview = document.getElementById('image-preview');

    if (imageLinkInput) { // If image link input exists
        imageLinkInput.addEventListener('input', () => { // When image link input changes
            const imageLink = imageLinkInput.value.trim(); // Trim removes whitespace from beginning and end of string

            if (validateLink(imageLink)) { // If image link is valid
                imagePreview.innerHTML = `<img src="${imageLink}" alt="Preview van gekozen afbeelding">`; // Set image preview
            } else {
                imagePreview.innerHTML = ''; // Remove image preview
            }
        });
    }
}
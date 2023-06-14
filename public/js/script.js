console.log('Hello from script.js');
const wishForm = document.querySelector('.wish-form form');
const wishTitle = document.querySelector('.wish-form form input#title');
const wishDescription = document.querySelector('.wish-form form textarea#description');
const wishError = document.querySelector('.wish-form form span.error');

let titleErrorShown = false;
let descriptionErrorShown = false;

wishForm.setAttribute('novalidate', true);

document.addEventListener('DOMContentLoaded', () => {
    const imageLinkInput = document.getElementById('imageLink');
    const imagePreview = document.getElementById('imagePreview');

    imageLinkInput.addEventListener('input', () => {
        imagePreview.innerHTML = `<img src="${imageLinkInput.value}" alt="">`;
    });
});

// wishForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     console.log('Hello from wishForm');

//     if (wishTitle.value === '' && wishDescription.value === '') {
//         wishTitle.focus();
//         if (!titleErrorShown) {
//             wishTitle.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een titel voor je wens toe.</span>');
//             titleErrorShown = true;
//         }
//         if (!descriptionErrorShown) {
//             wishDescription.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een uitleg over je wens toe.</span>');
//             descriptionErrorShown = true;
//         }
//     } else if (wishTitle.value === '') {
//         if (descriptionErrorShown) {
//             wishDescription.nextElementSibling.remove();
//             descriptionErrorShown = false;
//         }
//         console.log('Please enter a title');
//         wishTitle.focus();
//         if (!titleErrorShown) {
//             wishTitle.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een titel voor je wens toe.</span>');
//             titleErrorShown = true;
//         }
//     } else if (wishDescription.value === '') {
//         if (titleErrorShown) {
//             wishTitle.nextElementSibling.remove();
//             titleErrorShown = false;
//         }
//         console.log('Please enter a description');
//         wishDescription.focus();
//         if (!descriptionErrorShown) {
//             wishDescription.insertAdjacentHTML('afterend', '<span class="error">Voeg alsjeblieft een uitleg over je wens toe.</span>');
//             descriptionErrorShown = true;
//         }
//     } else {
//         console.log('Formulier word verstuurd');
//         console.log(wishTitle.value);
//         console.log(wishDescription.value);
//     }
// });

wishForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('/wens-toevoegen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: wishTitle.value,
            description: wishDescription.value,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                // Verwijder eerst bestaande foutmeldingen
                const errorElements = document.querySelectorAll('.wish-form form span.error');
                errorElements.forEach(element => element.remove());

                // Voeg nieuwe foutmeldingen toe aan de juiste inputvelden
                data.errors.forEach(errorMessage => {
                    if (errorMessage.includes('titel')) {
                        wishTitle.insertAdjacentHTML('afterend', `<span class="error">${errorMessage}</span>`);
                    } else if (errorMessage.includes('uitleg')) {
                        wishDescription.insertAdjacentHTML('afterend', `<span class="error">${errorMessage}</span>`);
                    }
                });
            } else if (data.success) {
                // Formulier succesvol verstuurd
                // Toon bijvoorbeeld een succesbericht
                const successMessage = document.createElement('p');
                successMessage.textContent = data.message;
                successMessage.classList.add('success-message');
                wishForm.appendChild(successMessage);
            }
        })
        .catch(error => {
            console.error('Fout bij het verzenden van het formulier:', error);
        });
});

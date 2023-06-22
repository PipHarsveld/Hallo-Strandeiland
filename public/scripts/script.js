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

// MASONRY
const masonryButton = document.querySelector('.masonryBtn>input');
const gridButton = document.querySelector('.gridBtn>input');
let masonryInstance = null;
const grid = document.querySelector('.grid');

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
        setTimeout(() => {
            initializeMasonry();
        }, 1);
        console.log('masonry checked')
    }


    masonryButton.addEventListener('click', () => {
        console.log('click')
        if (!masonryInstance) {
            setTimeout(() => {
                initializeMasonry();
            }, 1);
        }
    });

    gridButton.addEventListener('click', () => {
        if (masonryInstance) {
            masonryInstance.destroy();
            masonryInstance = null;
        }
    });

}


grid.classList.add('masonry');

masonryButton.addEventListener('click', () => {
    grid.classList.add('masonry');
    grid.classList.remove('block');
});

gridButton.addEventListener('click', () => {
    grid.classList.remove('masonry');
    grid.classList.add('block');
});



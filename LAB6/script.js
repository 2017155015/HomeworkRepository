fetch('product.json')
    .then( response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then( json => initialize(json) )
    .catch( err => console.error(`Fetch problem: ${err.message}`) );

function initialize(products) {
    const category = document.querySelector('#category');
    const searchTerm = document.querySelector('#searchTerm');
    const searchBtn = document.querySelector('#searchBtn');
    const main = document.querySelector('main');

    let lastCategory = category.value;
    let lastSearch = '';

    let categoryGroup;
    let finalGroup;

    finalGroup = products;
    updateDisplay();

    categoryGroup = [];
    finalGroup = [];

    searchBtn.addEventListener('click', selectCategory);

    function selectCategory(e) {
        e.preventDefault();

        categoryGroup = [];
        finalGroup = [];

        if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
            return;
        } else {
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();
        
            if (category.value === 'All') {
                categoryGroup = products;
                selectProducts();
            } else {
                const lowerCaseType = category.value.toLowerCase();
                categoryGroup = products.filter( product => product.type === lowerCaseType );
                selectProducts();
            }
        }
    }

    function selectProducts() {
        if (searchTerm.value.trim() === '') {
            finalGroup = categoryGroup;
        } else {
            const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            finalGroup = categoryGroup.filter( product => product.name.includes(lowerCaseSearchTerm));
        }
        
        updateDisplay();
    }

    function updateDisplay() {
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
        if (finalGroup.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'No results to display!';
            main.appendChild(para);
        } else {
            for (const product of finalGroup) {
                fetchBlob(product);
            }
        }
    }

    function fetchBlob(product) {
        const url = `images/${product.image}`;
        fetch(url)
        .then( response => {
            if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
            }
            return response.blob();
        })
        .then( blob => showProduct(blob, product) )
        .catch( err => console.error(`Fetch problem: ${err.message}`) );
    }

    function showProduct(blob, product) {
        const section = document.createElement('section');
        const img = document.createElement('img');
        const container = document.createElement('div');
        const info = document.createElement('p');
        const price = document.createElement('p');

        container.setAttribute('class', 'clickable');
        container.id = i;
        container.style.opacity = "0";
        container.onclick = function(){
            var x = document.getElementById(this.id);
            if(x.style.opacity === "0"){
                x.style.opacity = "1";
            } else if(x.style.opacity === "1"){
                x.style.opacity = "0";
            } else {
                x.style.opacity = "0";
            }
        }

        info.textContent = product.name;
        price.textContent = product.price + '₩';

        image.src = objectURL;
        image.alt = product.name;

        main.appendChild(section);
        section.appendChild(container);
        container.appendChild(info);
        container.appendChild(price)
        section.appendChild(img);
    }
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if(clientHeight + scrollTop >= scrollHeight - 3) {
        load();
    }
});

let counter = 4;

function load() {
    const main = document.querySelector('main');

    var start = counter;
    var end = start + 4;
    counter = end;

    fetch(myRequest).then(response => response.json()).then(function(json) {
        let products = json;
        for(start; start < end; start++) {
            const section = document.createElement('section');
            const img = document.createElement('img');
            const container = document.createElement('div');
            const info = document.createElement('p');
            const price = document.createElement('p');

            let url = './images/' + products[start].img;
    
            section.setAttribute('class', 'onClickTextOverImage');

            container.setAttribute('class', 'clickable');
            container.id = start;
            container.style.opacity = "0";
            container.onclick = function(){
                var x = document.getElementById(this.id);
                if(x.style.opacity === "0"){
                    x.style.opacity = "1";
                } else if(x.style.opacity === "1"){
                    x.style.opacity = "0";
                } else {
                    x.style.opacity = "0";
                }
            }

            info.textContent = products[start].name;
            price.textContent = products[start].price + '₩';
            
            img.src = url;
            img.alt = products[start].name;
    
            main.appendChild(section);
            section.appendChild(container);
            container.appendChild(info);
            container.appendChild(price);
            section.appendChild(img);
        }
    })
        .catch(console.error);
};
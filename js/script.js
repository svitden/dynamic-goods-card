
/*
Создайте массив, содержащий ссылки на файлы json, напр:
var files = ['products.json', 'categories.json', 'users.json'];

В каждом json-файле находятся соответствующие массивы объектов: товары и категории

Объект товара, например:
{
	id: 1,
	title: 'Ball',
	description: 'Volleyball for kids',
	price: 100,
	category_id: 1
}

Объект категории, например:
{
	id: 1,
	title: 'Sport'
}

Напишите код, которые все url из этого массива загружает (с помощью fetch) и рисует на странице карточки товаров с полной информацией о них. Вместо id - соответствующие значения. Например, category_id 1 == ‘Sport’.

Стилизация с помощью стилей Bootstrap

*/

// массив, содержащий ссылки на файлы json
var files = ['products.json', 'categories.json', 'users.json'];
var idNumber = 2;

// получение формата JSON
function processJSON (response) {
    return response.json();
}

function ajax(url) {
    return fetch(url).then(response => response.json()); // возвращает результат обработки,тоже промис
}

var arrData = [];

for (let i = 0; i < files.length; i++) {
    arrData[i] = new Promise((resolve, reject) => {
        ajax(`./data/${files[i]}`)
            .then(response => {
                resolve(response);
            })
            .catch(error => reject(error));            
    });
}


Promise.all(arrData).then(results => {
    //console.log('results', results);

    // деструктуризация
    let [products, categories, users] = results;
    

    let product = products.filter((item) => {
        return item.id === idNumber;
    });

    let productCategory = categories.filter((item) => {
        return item.id === product[0].id;
    }).map(item => item.title);

    productCategory = productCategory.length > 0 ? productCategory[0] : productCategory;
    product = product.length > 0 ? product[0] : product;

    //console.log(productCategory);
    //console.log('product', product);
    
    let $pageHeader = $('.page-header');
    let $descriptionCol = $('.col-md-8');
    let $imageCol = $('.col-md-4');

    $('<h1>')
        .text(product.title)
        .appendTo($pageHeader);

    if (!product.url) {
        $('<img>')
            .attr('src', './img/download.jpg')
            .attr('height', '400')
            .appendTo($imageCol);
    } else {
        $('<img>')
            .attr('src', product.url)
            .attr('height', '400')
            .appendTo($imageCol);
    }    

    $('<h3>')
        .text(product.description)
        .appendTo($descriptionCol);

    $('<h4>')
        .text(product.price)
        .css({
            'color': 'red'
        })
        .append(' UAH')
        .appendTo($descriptionCol);

    $('<h5>')
        .text(productCategory)
        .appendTo($pageHeader);

});

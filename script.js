import data from './data.js'

// variables
const itemsContainer = document.querySelector('#items')
const itemList = document.getElementById('item-list')
const cartQty = document.getElementById('cart-qty')
const cartTotal = document.getElementById('cart-total')
const cart = [] 

// loops through data.js and generates each image and desciption
for (let i = 0; i < data.length; i += 1) {
	// create new div element and give it the class name 'item'
	const newDiv = document.createElement('div')
	newDiv.className = 'item'
	const img = document.createElement('img')

    // sets the src attribute of the image to that of data.js's image
    // defines the pixel parameters and appends the newDiv with the child image just created
	img.src = data[i].image
	img.width = 300
	img.height = 300
	newDiv.appendChild(img)

	// puts the new div inside a container called "items", gives it a description
	itemsContainer.appendChild(newDiv)


	// adds a description and price to the div. div now contains image, description, and price
	const desc = document.createElement('P')
	desc.innerText = data[i].desc
	newDiv.appendChild(desc)

	const price = document.createElement('P')
	price.innerText = data[i].price
	newDiv.appendChild(price)

	// create a button and gives it the id of the name of the item, but displays 'Add to Cart' for the UI
	const button = document.createElement('button')
	button.id = data[i].name

	// creates a custom attribute called data-price. that will hold price for each element in the button
    // reads as: dataset = data- and price adds onto data-. dataset literally *sets the data attribute to whatever follows it*
    // the button attribute now looks like this ->     <button id="[name]" data-price="[price]">Add to Cart</button>
	button.dataset.price = data[i].price
	button.innerHTML = 'Add to Cart'
	newDiv.appendChild(button)
}

// selects all buttonsConvert a NodeList of all button elements into an array
// document.querySelectorAll('button') returns a NodeList containing all button elements on the page.
// Since NodeLists are not true arrays and lack many array methods (like forEach, map, filter), 
// we use Array.from() to convert this NodeList into an actual array, which will give us access to full array functionality.
const all_items_button = Array.from(document.querySelectorAll('button')) 

// Loop through each button element in the array using the forEach method
// The forEach method takes a callback function as an argument and runs that function once for each element in the array.
// In this case, the callback function is an arrow function (element => {...}) where 'element' represents each individual button element.
// By adding an event listener inside the callback, we ensure that a specific function will run whenever a button is clicked.
all_items_button.forEach(element => element.addEventListener('click', () => {
    addItem(element.getAttribute('id'), element.getAttribute('data-price'))
    showItems()
    }))


// handle change events on update input
itemList.onchange = function(event) {
    if (event.target && event.target.classList.contains('update')) {
        const name = event.target.dataset.name
        const qty = parseInt(event.target.value) // parseInt takes in a string and returns a number (interger)
        updateCart(name, qty)
    }
}

// handle clicks on list
itemList.onclick = function(event) {
    // console.log("clicked list!!")
    // console.log(event.target)

    if (event.target && event.target.classList.contains('remove')) {
        const name = event.target.dataset.name // data-name="????"
        removeItem(name)
    } else if (event.target && event.target.classList.contains('add-one')) {
        const name = event.target.dataset.name
        addItem(name)
    } else if (event.target && event.target.classList.contains('remove-one')) {
        const name = event.target.dataset.name
        removeItem(name, 1)
    }
}

// adds items to cart
function addItem(name, price) {
    for (let i = 0; i < cart.length; i += 1) {
        if (cart[i].name === name) {
            cart[i].qty += 1
            showItems()
            return
        }
    }
    const item = {name, price, qty: 1}
    cart.push(item)
}

// shows items in cart
function showItems() {
    // console.log(`You have ${getQty()} items in your cart`) // could also make a 'const qty = getQty()' line and put qty in the string
    cartQty.innerHTML = (`You have ${getQty()} items in your cart`)

    let itemStr = ''
    for (let i = 0; i < cart.length; i += 1) {
        // const name = cart[i].name 
        // const price = cart[i].price
        // const qty = cart[i].qty
        // the code above is the longer way of writing the code below
        const {name, price, qty} = cart[i]

        itemStr += `<li> 
        ${name} $${price} x ${qty} = $${qty * price} 
        <button class="remove" data-name="${name}">Remove</button> 
        <button class="add-one" data-name="${name}"> + </button> 
        <button class="remove-one" data-name="${name}"> - </button> 
        <input class="update" type="number" min="0" data-name="${name}" placeholder="Quantity">
        </li>`
    }
    itemList.innerHTML = itemStr

    // console.log(`Your total in cart is: $${getTotal()}`)
    cartTotal.innerHTML = (`Your total in cart is: $${getTotal()}`)
}

// ---------------------------------------------------
// gets quantity of total cart items
function getQty () {
    let qty = 0
    for (let i = 0; i < cart.length; i += 1) {
        qty += cart[i].qty
    }
    return qty
}

// gets total price of cart items
function getTotal () {
    let total = 0
    for (let i = 0; i < cart.length; i += 1) {
        total += cart[i].price * cart[i].qty
    }
    return total.toFixed(2) // toFixed() rounds the decimals to whatever is in its parameter. 
                            // in this case, nearest 2 decimal places
}

// removes items from cart
function removeItem(name, qty = 0) {
    for (let i = 0; i < cart.length; i += 1) {
        if (cart[i].name === name) {
            if (qty > 0) {
                cart[i].qty -= qty
            }
            if (cart[i].qty < 1 || qty === 0) {
                cart.splice(i, 1)
            }
            showItems()
            return
        }
    }
}

// updates cart
function updateCart(name, qty) {
    for (let i = 0; i < cart.length; i += 1) {
        if (cart[i].name === name) {
            if (qty < 1) {
                removeItem(name)
                return
            }
            cart[i].qty = qty
            showItems()
            return
        }
    }
}

showItems()


const products = {
    Fruits:[
        {name: "apple", price: 30},
        {name: "banana", price: 40},
        {name: "Pine Apple", price: 50},
        {name: "Orange", price: 60},

    ],
    Vagies:[
        { name:"Aloo", price:15},
        { name:"Vendi", price:15},
        { name:"tomato", price:15},
        { name:"peyanj", price:15}

    ],
    Drinks:[
        { name:"Coca Cola", price:60},
        { name:"Sprite", price:40},
        { name:"Limka", price:30},
        { name:"Thumps-Up", price:45}

    ],

    Bakery:[
        { name:"Bread", price:15},
        { name:"Pao", price:15},
        { name:"Cake", price:15},
        { name:"Bisket", price:15}

    ]
}

let cart =[];
const productList = document.getElementById("product-list")
const cartItems = document.getElementById("cart-items")
const totalPrice = document.getElementById("total-price")

// let currentcategory ="Fruits"
function showcategory(category){
    currentcategory = category
    productList.innerHTML =""
    const items = products[category]
    items.forEach((item, index) => {
        const card = document.createElement("div")
        card.className = "product"
        card.innerHTML = ` <h3>${item.name}</h3>
        <button onClick ="addtocart('${category}', ${index})"> Add to Cart </button>`
        productList.appendChild(card)
        
    });
}

function removeFromCart(itemname){
    const found = cart.find(p=>p.name === itemname)
    if(found){
        found.quatity--
    
    if (found.quatity <= 0){
        cart = cart.filter(p => p.name !==itemname)
    
        }
    updateCart()
    }
}



function addtocart(category, index){
    const item = products[category][index]
    const found = cart.find(p=>p.name === item.name)
    if(found){
        found.quatity++
    }
    else {
        cart.push({...item, quatity:1})

    }
    updateCart();
}
function updateCart(){
    cartItems.innerHTML=""
    let total = 0
    cart.forEach(item=>{
        total += item.price * item.quatity
        const li = document.createElement("li")
        li.innerHTML = `
        ${item.name}  x${item.quatity} = ${item.price * item.quatity}
        <button onClick="addToCartFromcart('${item.name}')"> add </button>
        <button onClick ="removeFromCart('${item.name}')"> remove</button>`
        cartItems.appendChild(li)

    })
    totalPrice.textContent = total
    showcategory(currentcategory)
}

function addToCartFromcart(itemname){

    for(const cat in products){
        const item = products[cat].find(p=> p.name === itemname)
        if(item){
            addtocart(cat, products[cat].indexOf(item))
            return
        }
    }
}
showcategory("Fruits")
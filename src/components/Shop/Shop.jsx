import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([])
    const cart = useLoaderData()
    const [itemsPerpage,setItemsPerpage] = useState(10)
    const [currentPage, setCurrentpage] = useState(0)
    const [count, setCount] = useState(0)
    // const { count} = useLoaderData();
    const storedCart = getShoppingCart();
    const storedCartIds = Object.keys(storedCart)
    useEffect(() =>{
        fetch('http://localhost:5000/productcount')
        .then(res=>res.json())
        .then(data => setCount(data.count))
    },[])


    console.log({count})
    const totalPage = Math.ceil(count /  itemsPerpage )
    // console.log(totalPage)
    const pages = [...Array(totalPage).keys()]
    

    /**
     * DONE 1 : get the total number of product.
     * DONE 2 : number of items perpage dynamic
     * todo 3 ; get the current page
     * */ 

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerpage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage,itemsPerpage]);

    // useEffect(() => {
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsPerPage = e =>{
        console.log(e.target.value)
        const val = parseInt(e.target.value)
        setItemsPerpage(val)
        setCurrentpage(0)
    }


    const handlePrevPage = () =>{
        if(currentPage > 0){
            setCurrentpage(currentPage - 1)
        }
    }
    const handleNextpage = () =>{
        if(currentPage < totalPage - 1){

            setCurrentpage(currentPage + 1)
        }
    }
    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>current page : {currentPage}</p>
                <button onClick={handlePrevPage}>prev</button>
                {
                    pages.map(page => <button
                    className={currentPage === page ? 'selected' : ''}
                    onClick={() => setCurrentpage(page)}
                         key={page}
                         >{page}</button>)
                }
                <button onClick={handleNextpage}>Next</button>
                <select name={itemsPerpage} onChange={handleItemsPerPage} id="">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;
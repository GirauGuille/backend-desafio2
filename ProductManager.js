const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    //funcion agregar productos con id incrementado
    async addProduct(product) {
        const products = await this.getProducts();
        const lastProduct = products[products.length - 1];
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        const newProduct = { ...product, id: newId };
        products.push(newProduct);
        //funcion guardar en archivo JSON
        await this.#saveProducts(products);
        return newProduct;
    }

    async getProducts() {
        try {
            //lee archivo JSON
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (err) {
            if (err.code === 'ENOENT') {
                //lee archivo y devuelve todos los productos en arreglo
                await this.#saveProducts([]);
                return [];
            }
            throw err;
        }
    }

    //funcion leer archivo y buscar id especifico
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (!product) {
            return null;
        }
        return product;
    }

    //funcion para actualizar un objeto con id
    async updateProduct(id, update) {
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
            return null;
        }
        const updatedProduct = { ...products[index], ...update, id };
        products.splice(index, 1, updatedProduct);
        await this.#saveProducts(products);
        return updatedProduct;
    }

    //funcion para eliminar objeto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
            return null;
        }
        products.splice(index, 1);
        await this.#saveProducts(products);
        return id;
    }

    async #saveProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
}

//Path: productos.json e instancia el objeto
const productManager = new ProductManager('./productos.json');





//Funcion de prueba
async function prueba() {

    //Agregar un producto
    const product1 = {
        title: 'Mouse',
        description: 'MOUSE LOGITECH G502 WIRELESS GAMING LIGHTSPEED 910-005566',
        price: 32000,
        thumbnail: 'https://www.fullh4rd.com.ar/img/productos/Pics_Prod/mouse-logitech-g502-wireless-gaming-lightspeed-910005566-0.jpg',
        code: 'p1',
        stock: 5,
    };
    const product2 = {
        title: 'Teclado',
        description: 'Teclado Philips Spk6224',
        price: 2800,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_813667-MLA52295993316_112022-O.webp',
        code: 'p2',
        stock: 10,
    };

    await productManager.addProduct(product1);
    await productManager.addProduct(product2);

    // Consultar todos los productos
    console.log('Todos los productos:\n', await productManager.getProducts());

    // Consultar un producto por id
    const productById = await productManager.getProductById(1);
    if (!productById) {
        console.log('No existe un producto con ese id');
    } else {
        console.log('Producto por id:\n', productById);
    }

    //Actualizar un producto
    const updatedProduct = {
        title: 'Producto actualizado',
        description: 'Descripción actualizada del producto',
        price: 15000,
    };
    const productUpdated = await productManager.updateProduct(1, updatedProduct);
    if (!productUpdated) {
        console.log('No existe un producto con ese id');
    } else {
        console.log('Producto actualizado:\n', productUpdated);
    }

    // Eliminar un producto
    const deletedProductId = await productManager.deleteProduct(2);
    if (!deletedProductId) {
        console.log('No existe un producto con ese id');
    } else {
        console.log('ID Producto eliminado:', deletedProductId);
    }


    // Consultar todos los productos después de eliminar uno
    console.log('Productos restantes:\n', await productManager.getProducts());
}

//Ejecuto la funcion
prueba();


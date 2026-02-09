document.addEventListener('DOMContentLoaded', function () {
    console.log('Products page loaded');

    if (typeof api === 'undefined') {
        console.error('API not loaded');
        showError('API module is loading...');

        setTimeout(() => {
            if (typeof api === 'undefined') {
                showError('Failed to load API module. Please refresh the page.');
            } else {
                console.log('API loaded on retry');
                startApplication();
            }
        }, 1000);
        return;
    }

    console.log('API loaded successfully');
    startApplication();
});

function showError(message) {
    const tableBody = document.getElementById('productsTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">
                    ${message}
                    <br><br>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Refresh Page
                    </button>
                </td>
            </tr>`;
    }
}

function startApplication() {
    console.log('Starting application...');

    loadProducts();

    setupEvents();
}

let editingProductId = null;

function setupEvents() {
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveProduct();
        });
    }

    const newBtn = document.getElementById('newProductBtn');
    if (newBtn) {
        newBtn.addEventListener('click', resetForm);
    }
}

async function loadProducts() {
    try {
        console.log('Loading products from API...');

        const tableBody = document.getElementById('productsTableBody');
        if (!tableBody) {
            console.error('Table body not found');
            return;
        }

        tableBody.innerHTML = '<tr><td colspan="4">Loading products...</td></tr>';

        const products = await api.getProducts();
        console.log('Products loaded:', products);

        if (!products || products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No products found</td></tr>';
            return;
        }

        let html = '';
        products.forEach(product => {
            html += `
                <tr>
                    <td>${product.code || ''}</td>
                    <td>${product.name || ''}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;

    } catch (error) {
        console.error('Error loading products:', error);

        const tableBody = document.getElementById('productsTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="color: red; text-align: center; padding: 20px;">
                        <strong>Error:</strong> ${error.message}
                        <br><br>
                        <button onclick="loadProducts()" class="btn btn-primary">
                            Try Again
                        </button>
                    </td>
                </tr>`;
        }
    }
}

function formatCurrency(value) {
    if (isNaN(value) || value === null) {
        return '$0.00';
    }
    return '$' + parseFloat(value).toFixed(2);
}

function resetForm() {
    editingProductId = null;

    const form = document.getElementById('productForm');
    if (form) {
        form.reset();
    }

    const title = document.getElementById('productFormTitle');
    if (title) {
        title.textContent = 'Create New Product';
    }
}

async function editProduct(id) {
    try {
        console.log('Editing product ID:', id);

        const product = await api.getProduct(id);

        editingProductId = id;

        document.getElementById('productCode').value = product.code || '';
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productValue').value = product.price || '';

        const title = document.getElementById('productFormTitle');
        if (title) {
            title.textContent = 'Edit Product';
        }

        const form = document.getElementById('productForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Error loading product for edit:', error);
        alert('Error: ' + error.message);
    }
}

async function saveProduct() {
    try {
        const code = document.getElementById('productCode').value.trim();
        const name = document.getElementById('productName').value.trim();
        const priceStr = document.getElementById('productValue').value;
        const price = parseFloat(priceStr);

        if (!code) {
            alert('Product code is required');
            return;
        }

        if (!name) {
            alert('Product name is required');
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert('Please enter a valid price (greater than 0)');
            return;
        }

        const data = { code, name, price };

        if (editingProductId) {
            data.id = editingProductId;
            await api.updateProduct(editingProductId, data);
            alert('Product updated successfully!');
        } else {
            await api.createProduct(data);
            alert('Product created successfully!');
        }

        resetForm();
        await loadProducts();

    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error: ' + error.message);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        await api.deleteProduct(id);
        alert('Product deleted successfully!');
        await loadProducts();

        if (editingProductId === id) {
            resetForm();
        }

    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error: ' + error.message);
    }
}
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.loadProducts = loadProducts;
document.addEventListener('DOMContentLoaded', function () {
    console.log('Production Suggestion page loaded');
    loadProductionSuggestion();

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            console.log('Refresh button clicked');
            loadProductionSuggestion();
        });
    }
});

async function getProductionSuggestion() {
    try {
        console.log('Fetching data from /api/production/suggestion');
        const response = await fetch('/api/production/suggestion');

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Full response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching production suggestion:', error);
        throw error;
    }
}

async function loadProductionSuggestion() {
    try {
        console.log('Loading production suggestion...');

        const tableBody = document.getElementById('productionTableBody');
        const totalValueElement = document.getElementById('totalValue');
        const loadingMessage = document.getElementById('loadingMessage');

        if (loadingMessage) loadingMessage.style.display = 'block';
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        if (totalValueElement) totalValueElement.textContent = 'Calculating...';

        const response = await getProductionSuggestion();
        console.log('Response received:', response);

        if (loadingMessage) loadingMessage.style.display = 'none';

        if (tableBody) tableBody.innerHTML = '';

        if (!response.success) {
            console.error('API returned error:', response.message);
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="4" style="color: orange;">${response.message || 'Calculation error'}</td></tr>`;
            }
            if (totalValueElement) {
                totalValueElement.textContent = formatCurrency(0);
            }
            return;
        }

        if (!response.products || response.products.length === 0) {
            console.log('No products to display');
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="4">No products can be produced with current stock.</td></tr>';
            }
            if (totalValueElement) {
                totalValueElement.textContent = formatCurrency(0);
            }
            return;
        }

        console.log(`Processing ${response.products.length} products`);

        response.products.forEach(function (product, index) {
            console.log(`Product ${index}:`, product);
            const row = createProductionRow(product);
            if (tableBody) {
                tableBody.appendChild(row);
            }
        });

        if (totalValueElement) {
            totalValueElement.textContent = formatCurrency(response.totalProductionValue || 0);
        }

        console.log('Production suggestion loaded successfully');

    } catch (error) {
        console.error('Error loading production suggestion:', error);

        const tableBody = document.getElementById('productionTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="color: red;">
                        Error: ${error.message}<br>
                        Please check console for details.
                    </td>
                </tr>`;
        }

        const totalValueElement = document.getElementById('totalValue');
        if (totalValueElement) {
            totalValueElement.textContent = formatCurrency(0);
        }
    }
}

function createProductionRow(product) {
    const row = document.createElement('tr');

    const productNameCell = document.createElement('td');
    productNameCell.textContent = product.productName || 'Unknown Product';
    productNameCell.title = `Code: ${product.productCode || 'N/A'}`;

    const quantityCell = document.createElement('td');
    quantityCell.textContent = product.quantity || 0;

    const unitValueCell = document.createElement('td');
    unitValueCell.textContent = formatCurrency(product.unitPrice || 0);

    const totalValueCell = document.createElement('td');
    const totalValue = product.totalValue || 0;
    totalValueCell.textContent = formatCurrency(totalValue);

    row.appendChild(productNameCell);
    row.appendChild(quantityCell);
    row.appendChild(unitValueCell);
    row.appendChild(totalValueCell);

    if (product.materialsUsed && product.materialsUsed.length > 0) {
        row.title = 'Materials used: ' + product.materialsUsed
            .map(m => `${m.materialName}: ${m.totalUsed}`)
            .join(', ');
    }

    return row;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}
window.loadProductionSuggestion = loadProductionSuggestion;
window.getProductionSuggestion = getProductionSuggestion;
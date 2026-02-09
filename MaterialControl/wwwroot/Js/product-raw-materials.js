let currentRelationshipId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Product-Raw Materials page loaded');
    
    loadData();
    loadProductsForSelect();
    loadRawMaterialsForSelect();
    
    setupEventListeners();
});

function setupEventListeners() {
    const form = document.getElementById('relationshipForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveRelationship();
        });
    }
    
    const newBtn = document.getElementById('newBtn');
    if (newBtn) {
        newBtn.addEventListener('click', resetForm);
    }
    
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
}

async function loadData() {
    try {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const listError = document.getElementById('listError');
        const tableBody = document.getElementById('relationshipsTableBody');
        const noDataMessage = document.getElementById('noDataMessage');
        
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (listError) listError.style.display = 'none';
        
        const relationships = await api.getProductRawMaterials();
        
        if (!relationships || relationships.length === 0) {
            if (noDataMessage) noDataMessage.style.display = 'block';
            if (tableBody) tableBody.innerHTML = '';
            return;
        }
        
        if (noDataMessage) noDataMessage.style.display = 'none';
        
        let html = '';
        relationships.forEach(rel => {
            html += `
                <tr>
                    <td>${rel.productName || 'N/A'}</td>
                    <td>${rel.rawMaterialName || 'N/A'}</td>
                    <td>${formatQuantity(rel.requiredQuantity)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editRelationship(${rel.id})">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRelationship(${rel.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
        
        if (tableBody) tableBody.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading relationships:', error);
        const listError = document.getElementById('listError');
        if (listError) {
            listError.style.display = 'block';
            listError.textContent = 'Error: ' + error.message;
        }
    } finally {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

async function loadProductsForSelect() {
    try {
        const products = await api.getProducts();
        const select = document.getElementById('productId');
        
        if (!select) return;
        
        select.innerHTML = '<option value="">Select a product...</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.code} - ${product.name}`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading products for select:', error);
    }
}

async function loadRawMaterialsForSelect() {
    try {
        const rawMaterials = await api.getRawMaterials();
        const select = document.getElementById('rawMaterialId');
        
        if (!select) return;
        
        select.innerHTML = '<option value="">Select a raw material...</option>';
        
        rawMaterials.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = `${material.code} - ${material.name} (Stock: ${material.stockQuantity})`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading raw materials for select:', error);
    }
}

function formatQuantity(value) {
    if (isNaN(value) || value === null || value === undefined) {
        return '0';
    }
    return Math.round(parseFloat(value)).toString();
}

function resetForm() {
    currentRelationshipId = null;
    
    const form = document.getElementById('relationshipForm');
    if (form) form.reset();
    
    document.getElementById('formTitle').textContent = 'New Relationship';
    document.getElementById('saveBtn').textContent = 'Save Relationship';
    
    const newBtn = document.getElementById('newBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    if (newBtn) newBtn.style.display = 'inline-block';
    if (cancelBtn) cancelBtn.style.display = 'none';
    
    const errorMsg = document.getElementById('formError');
    const successMsg = document.getElementById('successMessage');
    if (errorMsg) errorMsg.style.display = 'none';
    if (successMsg) successMsg.style.display = 'none';
}

async function editRelationship(id) {
    try {
        const relationship = await api.getProductRawMaterial(id);
        
        currentRelationshipId = id;
        
        document.getElementById('productId').value = relationship.productId || '';
        document.getElementById('rawMaterialId').value = relationship.rawMaterialId || '';
        document.getElementById('requiredQuantity').value = relationship.requiredQuantity || '';
        
        document.getElementById('formTitle').textContent = 'Edit Relationship';
        document.getElementById('saveBtn').textContent = 'Update Relationship';
        
        document.getElementById('newBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        const errorMsg = document.getElementById('formError');
        const successMsg = document.getElementById('successMessage');
        if (errorMsg) errorMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading relationship:', error);
        alert('Error: ' + error.message);
    }
}

async function saveRelationship() {
    try {
        const productId = parseInt(document.getElementById('productId').value);
        const rawMaterialId = parseInt(document.getElementById('rawMaterialId').value);
        const requiredQuantity = parseFloat(document.getElementById('requiredQuantity').value);
        
        if (!productId || !rawMaterialId || isNaN(requiredQuantity) || requiredQuantity <= 0) {
            alert('Please fill all fields with valid values');
            return;
        }
        
        const data = {
            productId: productId,
            rawMaterialId: rawMaterialId,
            requiredQuantity: requiredQuantity
        };
        
        const errorMsg = document.getElementById('formError');
        const successMsg = document.getElementById('successMessage');
        if (errorMsg) errorMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
        
        if (currentRelationshipId) {
            data.id = currentRelationshipId;
            await api.updateProductRawMaterial(currentRelationshipId, data);
            
            if (successMsg) {
                successMsg.textContent = 'Relationship updated!';
                successMsg.style.display = 'block';
            }
        } else {
            await api.createProductRawMaterial(data);
            
            if (successMsg) {
                successMsg.textContent = 'Relationship created!';
                successMsg.style.display = 'block';
            }
        }
        
        setTimeout(() => {
            resetForm();
            loadData();
        }, 2000);
        
    } catch (error) {
        console.error('Error saving relationship:', error);
        
        const errorMsg = document.getElementById('formError');
        if (errorMsg) {
            errorMsg.textContent = 'Error: ' + error.message;
            errorMsg.style.display = 'block';
        }
    }
}

async function deleteRelationship(id) {
    if (!confirm('Are you sure you want to delete this relationship?')) {
        return;
    }
    
    try {
        await api.deleteProductRawMaterial(id);
        alert('Relationship deleted!');
        await loadData();
        
        if (currentRelationshipId === id) {
            resetForm();
        }
        
    } catch (error) {
        console.error('Error deleting relationship:', error);
        alert('Error: ' + error.message);
    }
}
window.editRelationship = editRelationship;
window.deleteRelationship = deleteRelationship;
window.loadData = loadData;
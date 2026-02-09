let currentRawMaterialId = null;

document.addEventListener('DOMContentLoaded', function () {
    loadRawMaterials();

    const form = document.getElementById('rawMaterialForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveRawMaterial();
        });
    }

    const newBtn = document.getElementById('newRawMaterialBtn');
    if (newBtn) {
        newBtn.addEventListener('click', resetForm);
    }

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
});

async function loadRawMaterials() {
    try {
        const tableBody = document.getElementById('rawMaterialsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

        const materials = await api.getRawMaterials();

        if (!materials || materials.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No raw materials</td></tr>';
            return;
        }

        let html = '';
        materials.forEach(material => {
            html += `
                <tr>
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td>${material.stockQuantity}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" onclick="editMaterial(${material.id})">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-delete" onclick="deleteMaterial(${material.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;

    } catch (error) {
        console.error('Load error:', error);
        const tableBody = document.getElementById('rawMaterialsTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4">Error loading</td></tr>';
        }
    }
}

function resetForm() {
    currentRawMaterialId = null;

    document.getElementById('rawMaterialForm').reset();
    document.getElementById('rawMaterialFormTitle').textContent = 'Create New Raw Material';

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.textContent = 'Save Raw Material';

    document.getElementById('newRawMaterialBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'none';
}

async function editMaterial(id) {
    try {
        const material = await api.getRawMaterial(id);

        currentRawMaterialId = id;

        document.getElementById('rawMaterialCode').value = material.code;
        document.getElementById('rawMaterialName').value = material.name;
        document.getElementById('rawMaterialStock').value = material.stockQuantity;

        document.getElementById('rawMaterialFormTitle').textContent = 'Edit Raw Material';

        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.textContent = 'Update Raw Material';

        document.getElementById('newRawMaterialBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'inline-block';

    } catch (error) {
        console.error('Edit error:', error);
        alert('Error loading: ' + error.message);
    }
}

async function saveRawMaterial() {
    try {
        const code = document.getElementById('rawMaterialCode').value.trim();
        const name = document.getElementById('rawMaterialName').value.trim();
        const stock = parseFloat(document.getElementById('rawMaterialStock').value);

        if (!code || !name || isNaN(stock) || stock < 0) {
            alert('Invalid data');
            return;
        }

        if (currentRawMaterialId) {
            const data = {
                id: currentRawMaterialId,
                code: code,
                name: name,
                stockQuantity: stock
            };
            await api.updateRawMaterial(currentRawMaterialId, data);
            alert('Updated!');
        } else {
            const data = {
                code: code,
                name: name,
                stockQuantity: stock
            };
            await api.createRawMaterial(data);
            alert('Created!');
        }

        resetForm();
        await loadRawMaterials();

    } catch (error) {
        console.error('Save error:', error);
        alert('Error: ' + error.message);
    }
}

async function deleteMaterial(id) {
    if (!confirm('Delete this?')) return;

    try {
        await api.deleteRawMaterial(id);
        alert('Deleted!');

        if (currentRawMaterialId === id) {
            resetForm();
        }

        await loadRawMaterials();

    } catch (error) {
        console.error('Delete error:', error);
        alert('Error: ' + error.message);
    }
}
window.editMaterial = editMaterial;
window.deleteMaterial = deleteMaterial;
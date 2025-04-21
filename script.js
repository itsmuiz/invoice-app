document.addEventListener('DOMContentLoaded', function() {
    // Initialize invoice number
    document.getElementById('invoiceNumber').value = generateInvoiceNumber();
    document.getElementById('invoiceDate').valueAsDate = new Date();

    // Add event listeners
    document.getElementById('addItem').addEventListener('click', addNewItem);
    document.getElementById('saveInvoice').addEventListener('click', saveInvoice);
    document.getElementById('printInvoice').addEventListener('click', printInvoice);
    document.getElementById('clearInvoice').addEventListener('click', clearInvoice);
    document.getElementById('taxRate').addEventListener('input', updateTotals);
});

function generateInvoiceNumber() {
    return 'INV-' + Date.now().toString().slice(-6);
}

function addNewItem() {
    const tbody = document.getElementById('itemsTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" class="item-description" placeholder="Item description"></td>
        <td><input type="number" class="item-quantity" value="1" min="1"></td>
        <td><input type="number" class="item-rate" value="0.00" step="0.01" min="0"></td>
        <td class="item-amount">0.00</td>
        <td><button class="delete-row">Delete</button></td>
    `;

    tbody.appendChild(row);

    // Add event listeners for the new row
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => calculateRowAmount(row));
    });

    row.querySelector('.delete-row').addEventListener('click', () => {
        row.remove();
        updateTotals();
    });
}

function calculateRowAmount(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
    const amount = quantity * rate;
    row.querySelector('.item-amount').textContent = amount.toFixed(2);
    updateTotals();
}

function updateTotals() {
    const amounts = Array.from(document.getElementsByClassName('item-amount'))
        .map(cell => parseFloat(cell.textContent) || 0);
    
    const subtotal = amounts.reduce((sum, amount) => sum + amount, 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('taxAmount').textContent = taxAmount.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function saveInvoice() {
    const invoiceData = {
        invoiceNumber: document.getElementById('invoiceNumber').value,
        date: document.getElementById('invoiceDate').value,
        seller: {
            name: document.getElementById('sellerName').value,
            email: document.getElementById('sellerEmail').value,
            contact: document.getElementById('sellerContact').value,
            address: document.getElementById('sellerAddress').value
        },
        client: {
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            contact: document.getElementById('clientContact').value,
            address: document.getElementById('clientAddress').value
        },
        items: Array.from(document.getElementById('itemsTableBody').rows).map(row => ({
            description: row.querySelector('.item-description').value,
            quantity: row.querySelector('.item-quantity').value,
            rate: row.querySelector('.item-rate').value,
            amount: row.querySelector('.item-amount').textContent
        })),
        subtotal: document.getElementById('subtotal').textContent,
        taxRate: document.getElementById('taxRate').value,
        taxAmount: document.getElementById('taxAmount').textContent,
        total: document.getElementById('total').textContent,
        notes: document.getElementById('notes').value
    };

    // Save to localStorage
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    savedInvoices.push(invoiceData);
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));

    alert('Invoice saved successfully!');
}

function printInvoice() {
    window.print();
}

function clearInvoice() {
    if (confirm('Are you sure you want to clear all fields?')) {
        // Clear seller details
        document.getElementById('sellerName').value = '';
        document.getElementById('sellerEmail').value = '';
        document.getElementById('sellerContact').value = '';
        document.getElementById('sellerAddress').value = '';

        // Clear client details
        document.getElementById('clientName').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('clientContact').value = '';
        document.getElementById('clientAddress').value = '';

        // Clear other fields
        document.getElementById('itemsTableBody').innerHTML = '';
        document.getElementById('notes').value = '';
        document.getElementById('taxRate').value = '0';
        document.getElementById('invoiceNumber').value = generateInvoiceNumber();
        document.getElementById('invoiceDate').valueAsDate = new Date();
        updateTotals();
    }
} 
function addRow(number = '', size = '') {
  const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  const numberCell = newRow.insertCell(0);
  const sizeCell = newRow.insertCell(1);
  const deleteCell = newRow.insertCell(2);

  numberCell.innerHTML = `<input type="number" value="${number}" oninput="calculateSum()">`;
  sizeCell.innerHTML = `<input type="text" value="${size}" placeholder="300x300">`;
  deleteCell.innerHTML = `<button onclick="deleteRow(this)">ลบ</button>`;

  calculateSum();
}

function deleteRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
  calculateSum();
}

function clearTable() {
  document.querySelector('#dataTable tbody').innerHTML = '';
  calculateSum();
}

function calculateSum() {
  let sum = 0;
  const rows = document.querySelectorAll('#dataTable tbody tr');
  rows.forEach(row => {
    const num = parseFloat(row.cells[0].querySelector('input').value);
    if (!isNaN(num)) {
      sum += num;
    }
  });
  document.getElementById('sum').textContent = sum;
  highlightDuplicates();
}

function highlightDuplicates() {
  const searchValue = document.getElementById('highlightInput').value;
  const rows = document.querySelectorAll('#dataTable tbody tr');
  rows.forEach(row => {
    const numInput = row.cells[0].querySelector('input');
    if (searchValue && numInput.value === searchValue) {
      row.classList.add('highlighted');
    } else {
      row.classList.remove('highlighted');
    }
  });
}

function downloadCSV() {
  let csv = 'ตัวเลข,ขนาด\n';
  const rows = document.querySelectorAll('#dataTable tbody tr');
  rows.forEach(row => {
    const num = row.cells[0].querySelector('input').value;
    const size = row.cells[1].querySelector('input').value;
    csv += `${num},${size}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.csv';
  link.click();
}

function uploadCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n').slice(1); 
    clearTable();
    lines.forEach(line => {
      if (line.trim()) {
        const [num, size] = line.split(',');
        addRow(num, size);
      }
    });
  };
  reader.readAsText(file);
}

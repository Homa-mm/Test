function addRow() {
  let table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
  let newRow = table.insertRow();

  let numberCell = newRow.insertCell(0);
  let sizeCell = newRow.insertCell(1);
  let actionCell = newRow.insertCell(2);

  numberCell.contentEditable = "true";
  sizeCell.contentEditable = "true";

  actionCell.innerHTML = '<button onclick="deleteRow(this)">ลบ</button>';

  updateSums();
}

function deleteRow(btn) {
  let row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
  updateSums();
}

function clearTable() {
  document.querySelector("#dataTable tbody").innerHTML = "";
  updateSums();
}

// ตรวจสอบเลขเหมือนแม้กลับตัว เช่น 95 == 59
function isSameNumber(a, b) {
  let sortedA = a.toString().split('').sort().join('');
  let sortedB = b.toString().split('').sort().join('');
  return sortedA === sortedB;
}

// ไฮไลต์และคำนวณผลรวมขนาดเฉพาะเลขที่ค้นหา
function highlightAndSum() {
  let searchValue = document.getElementById("searchValue").value.trim();
  let table = document.getElementById("dataTable");
  let rows = table.getElementsByTagName("tr");
  let totalNum = 0;
  let totalW = 0, totalH = 0;

  for (let i = 1; i < rows.length; i++) {
    let numberCell = rows[i].getElementsByTagName("td")[0];
    let sizeCell = rows[i].getElementsByTagName("td")[1];
    rows[i].classList.remove("highlight");

    if (numberCell && sizeCell) {
      let num = numberCell.innerText.trim();
      let valNum = parseFloat(num);
      if (!isNaN(valNum)) totalNum += valNum;

      if (isSameNumber(num, searchValue)) {
        rows[i].classList.add("highlight");
        let [w, h] = sizeCell.innerText.split('x').map(Number);
        if (!isNaN(w) && !isNaN(h)) {
          totalW += w;
          totalH += h;
        }
      }
    }
  }

  document.getElementById("sumNumbers").innerText = "ผลรวมตัวเลข: " + totalNum;
  document.getElementById("sumSizes").innerText = totalW > 0 ? `ผลรวมขนาด: ${totalW}x${totalH}` : "ผลรวมขนาด: -";
}

// ดาวน์โหลด CSV
function downloadCSV() {
  let rows = document.querySelectorAll("table tr");
  let csv = [];
  rows.forEach(row => {
    let cols = row.querySelectorAll("td, th");
    let rowData = [];
    cols.forEach(col => rowData.push(col.innerText));
    csv.push(rowData.join(","));
  });

  let csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(csvFile);
  a.download = "table.csv";
  a.click();
}

// อัปโหลด CSV
function uploadCSV(event) {
  let file = event.target.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = function(e) {
    let lines = e.target.result.split("\n");
    let tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";
    lines.slice(1).forEach(line => {
      let cols = line.split(",");
      if (cols.length >= 2) {
        let row = tbody.insertRow();
        row.insertCell(0).innerText = cols[0];
        row.insertCell(1).innerText = cols[1];
        row.insertCell(2).innerHTML = '<button onclick="deleteRow(this)">ลบ</button>';
      }
    });
    highlightAndSum();
  };
  reader.readAsText(file);
}
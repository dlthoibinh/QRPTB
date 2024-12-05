// Pass Key do anh đặt
const correctPassKey = "123456"; // Thay giá trị này bằng Pass Key của anh

// Xử lý xác thực Pass Key
document.getElementById('verifyBtn').addEventListener('click', function () {
    const passKey = document.getElementById('passKey').value;
    const errorMsg = document.getElementById('error-msg');
    if (passKey === correctPassKey) {
        // Pass Key đúng, hiển thị giao diện chính
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        // Pass Key sai, hiển thị thông báo lỗi
        errorMsg.style.display = 'block';
    }
});

// URL Google Sheets (CSV)
const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-Z-uNUdq15XfoS0HBRDy4J2n3yUTpRGmL6MR3-P5Oh4Q44vpMQKxwZFZVTQUHZKjO6e8bYnDMMkGr/pub?output=csv';

// Dữ liệu tải về từ Google Sheets
let data = [];

// Lấy dữ liệu từ Google Sheets
fetch(googleSheetUrl)
    .then(response => response.text())
    .then(csvText => {
        data = csvToJson(csvText);
        createTableHeaders(data[0]); // Tạo tiêu đề bảng từ dữ liệu
    });

// Chuyển CSV thành JSON
function csvToJson(csv) {
    const rows = csv.split('\n');
    const headers = rows.shift().split(',');
    return rows
        .filter(row => row.trim() !== '')
        .map(row => {
            const values = row.split(',');
            return headers.reduce((acc, header, idx) => {
                acc[header.trim()] = values[idx] ? values[idx].trim() : '';
                return acc;
            }, {});
        });
}

// Tạo tiêu đề bảng từ dòng đầu tiên
function createTableHeaders(row) {
    const headers = Object.keys(row);
    const headerRow = document.getElementById('headers');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
}

// Xử lý tìm kiếm và hiển thị gợi ý
document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (query) {
        const filtered = data.filter(item =>
            Object.values(item).some(value => value.toLowerCase().includes(query))
        );

        filtered.slice(0, 10).forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item['Mã Trạm']} - ${item['Tên Trạm']}`;
            li.onclick = () => showResult(item);
            suggestions.appendChild(li);
        });
    }
});

// Hiển thị kết quả chi tiết
function showResult(item) {
    const resultTable = document.getElementById('resultTable');
    const resultBody = document.getElementById('resultBody');
    const suggestions = document.getElementById('suggestions');

    resultBody.innerHTML = '';
    const row = document.createElement('tr');
    Object.values(item).forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        row.appendChild(td);
    });

    resultBody.appendChild(row);
    resultTable.style.display = 'table';
    suggestions.innerHTML = ''; // Xóa gợi ý khi hiển thị kết quả
}

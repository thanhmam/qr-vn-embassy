document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('queueForm');
    const nameInput = document.getElementById('nameInput');
    const resultMessage = document.getElementById('resultMessage');
    const submitButton = document.getElementById('submitButton');

    // --- QUAN TRỌNG ---
    // Lấy URL từ tab "Production URL" trong n8n của bạn và dán vào đây
    const webhookUrl = 'https://n8n.thanhnam.com/webhook/qr-form'; 
    // Ví dụ: 'https://n8n.thanhnam.com/webhook/qr-form'

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Ngăn trang tự tải lại
        
        const name = nameInput.value.trim().toUpperCase();
        if (!name) {
            alert('Vui lòng nhập tên!');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'ĐANG GỬI...';
        resultMessage.textContent = '';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name }),
            });

            if (!response.ok) {
                throw new Error(`Lỗi từ máy chủ: ${response.statusText}`);
            }

            // n8n trả về số thứ tự trong body, ví dụ: { "queueNumber": 15 }
            const data = await response.json(); 
            
            resultMessage.textContent = `Xin chào ${name}, Your queue number is ${data.queueNumber}`;
            nameInput.value = ''; // Xóa tên đã nhập

        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            resultMessage.textContent = 'Có lỗi xảy ra, vui lòng thử lại!';
            resultMessage.style.color = 'red';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Gửi';
        }
    });
});

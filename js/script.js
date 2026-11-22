
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('#destinationsGrid .card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
           
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedFilter = button.getAttribute('data-filter');

            
            destinationCards.forEach(card => {
                const cardTier = card.getAttribute('data-tier');
                if (selectedFilter === 'all' || cardTier === selectedFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date().toISOString().split('T')[0];
        travelDateInput.setAttribute('min', today);
    }

   
    calculateTotal();
});


function switchPortalMode(mode) {
    const bookingForm = document.getElementById('bookingForm');
    const inquiryForm = document.getElementById('inquiryForm');
    const tabBooking = document.getElementById('tabBooking');
    const tabInquiry = document.getElementById('tabInquiry');
    const receiptContainer = document.getElementById('receiptContainer');
    const inquiryReceiptContainer = document.getElementById('inquiryReceiptContainer');

    
    receiptContainer.style.display = 'none';
    inquiryReceiptContainer.style.display = 'none';

    if (mode === 'booking') {
        bookingForm.style.display = 'flex';
        inquiryForm.style.display = 'none';
        tabBooking.classList.add('active');
        tabInquiry.classList.remove('active');
    } else {
        bookingForm.style.display = 'none';
        inquiryForm.style.display = 'flex';
        tabInquiry.classList.add('active');
        tabBooking.classList.remove('active');
    }
}


function calculateTotal() {
    const selectElement = document.getElementById('nationSelect');
    const pricePerPerson = parseInt(selectElement.value, 10);
    const paxInput = parseInt(document.getElementById('pax').value, 10);
    const pax = (paxInput >= 1 && paxInput <= 20) ? paxInput : 1;

    
    let originalTotal = pricePerPerson * pax;
    let discount = 0;
    let finalTotal = originalTotal;

    const discountRow = document.getElementById('discountRow');

    
    if (pax >= 5) {
        discount = originalTotal * 0.10;
        finalTotal = originalTotal - discount;
        discountRow.style.display = 'block';
        document.getElementById('discountPrice').innerText = discount.toLocaleString();
    } else {
        discountRow.style.display = 'none';
    }

    document.getElementById('originalPrice').innerText = originalTotal.toLocaleString();
    document.getElementById('totalPrice').innerText = finalTotal.toLocaleString();

    
    const paymentType = document.getElementById('paymentType').value;
    const installmentGroup = document.getElementById('installmentGroup');
    const installmentMonths = parseInt(document.getElementById('installmentMonths').value, 10);
    const monthlyBreakdown = document.getElementById('monthlyBreakdown');

    let amountDue = finalTotal;

    if (paymentType === 'full') {
        installmentGroup.style.display = 'none';
        monthlyBreakdown.style.display = 'none';
        amountDue = finalTotal;
    } else if (paymentType === 'downpayment') {
        installmentGroup.style.display = 'none';
        monthlyBreakdown.style.display = 'none';
        amountDue = finalTotal * 0.20;
    } else if (paymentType === 'installment') {
        installmentGroup.style.display = 'block';
        monthlyBreakdown.style.display = 'block';

        const monthly = (finalTotal / installmentMonths).toFixed(2);
        amountDue = parseFloat(monthly);
        document.getElementById('monthlyAmount').innerText = Number(monthly).toLocaleString();
    }

    document.getElementById('amountDue').innerText = amountDue.toLocaleString();
}


function setFieldError(inputId, errorId, isValid) {
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!isValid) {
        inputEl.classList.add('input-error');
        errorEl.style.display = 'block';
    } else {
        inputEl.classList.remove('input-error');
        errorEl.style.display = 'none';
    }
    return isValid;
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
}

function isValidPhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 13;
}


document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const travelDate = document.getElementById('travelDate').value;
    const pax = parseInt(document.getElementById('pax').value, 10);

    
    const todayStr = new Date().toISOString().split('T')[0];
    const validName = setFieldError('fullname', 'errFullname', fullname.length >= 2);
    const validEmail = setFieldError('email', 'errEmail', isValidEmail(email));
    const validPhone = setFieldError('phone', 'errPhone', isValidPhone(phone));
    const validDate = setFieldError('travelDate', 'errDate', travelDate !== '' && travelDate >= todayStr);
    const validPax = setFieldError('pax', 'errPax', !isNaN(pax) && pax >= 1 && pax <= 20);

    if (!validName || !validEmail || !validPhone || !validDate || !validPax) {
        return;
    }

    const selectElement = document.getElementById('nationSelect');
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    const total = document.getElementById('totalPrice').innerText;

    
    const isConfirmed = confirm(
        `Are you sure you want to proceed with this booking?\n\n` +
        `Destination: ${selectedText}\n` +
        `Guests: ${pax} Pax\n` +
        `Total Amount: ${total} PHP\n\n` +
        `Click OK to confirm or Cancel to review your details.`
    );

    if (!isConfirmed) {
        return; 
    }

   
    const originalTotal = document.getElementById('originalPrice').innerText;
    const discountPrice = document.getElementById('discountPrice').innerText;
    const amountDue = document.getElementById('amountDue').innerText;

    const paymentSelect = document.getElementById('paymentType');
    const paymentTypeText = paymentSelect.options[paymentSelect.selectedIndex].text;
    const paymentVal = paymentSelect.value;

    document.getElementById('rNation').innerText = selectedText;
    document.getElementById('rName').innerText = fullname;
    document.getElementById('rEmail').innerText = email;
    document.getElementById('rPhone').innerText = phone;
    document.getElementById('rDate').innerText = travelDate;
    document.getElementById('rPax').innerText = pax;
    document.getElementById('rPaymentType').innerText = paymentTypeText;
    document.getElementById('rOriginal').innerText = originalTotal;

    const rDiscountRow = document.getElementById('rDiscountRow');
    if (pax >= 5) {
        document.getElementById('rDiscount').innerText = discountPrice;
        rDiscountRow.style.display = 'block';
    } else {
        rDiscountRow.style.display = 'none';
    }

    document.getElementById('rTotal').innerText = total;
    document.getElementById('rAmountDue').innerText = amountDue;

    const rMonthlyNote = document.getElementById('rMonthlyNote');
    if (paymentVal === 'installment') {
        const months = document.getElementById('installmentMonths').value;
        const monthlyVal = document.getElementById('monthlyAmount').innerText;
        document.getElementById('rMonthlyText').innerText = `${monthlyVal} PHP / month for ${months} months`;
        rMonthlyNote.style.display = 'block';
    } else {
        rMonthlyNote.style.display = 'none';
    }

    const receiptContainer = document.getElementById('receiptContainer');
    receiptContainer.style.display = 'block';
    receiptContainer.scrollIntoView({ behavior: 'smooth' });
});


document.getElementById('inquiryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const inqName = document.getElementById('inqName').value.trim();
    const inqEmail = document.getElementById('inqEmail').value.trim();
    const inqPhone = document.getElementById('inqPhone').value.trim();
    const inqNation = document.getElementById('inqNation').value;
    const inqMessage = document.getElementById('inqMessage').value.trim();

  
    const validName = setFieldError('inqName', 'errInqName', inqName.length >= 2);
    const validEmail = setFieldError('inqEmail', 'errInqEmail', isValidEmail(inqEmail));
    const validPhone = setFieldError('inqPhone', 'errInqPhone', isValidPhone(inqPhone));
    const validMsg = setFieldError('inqMessage', 'errInqMessage', inqMessage.length >= 10);

    if (!validName || !validEmail || !validPhone || !validMsg) {
        return;
    }

   
    const isConfirmed = confirm(
        `Are you sure you want to submit this inquiry for ${inqNation}?\n\n` +
        `Click OK to send or Cancel to edit your message.`
    );

    if (!isConfirmed) {
        return;
    }

    document.getElementById('irName').innerText = inqName;
    document.getElementById('irEmail').innerText = inqEmail;
    document.getElementById('irPhone').innerText = inqPhone;
    document.getElementById('irNation').innerText = inqNation;
    document.getElementById('irMessage').innerText = inqMessage;

    const inquiryReceipt = document.getElementById('inquiryReceiptContainer');
    inquiryReceipt.style.display = 'block';
    inquiryReceipt.scrollIntoView({ behavior: 'smooth' });
});

function cancelReservation() {
    const confirmCancel = confirm("Are you sure you want to cancel this reservation?");
    if (confirmCancel) {
        document.getElementById('receiptContainer').style.display = 'none';
        document.getElementById('bookingForm').reset();
        calculateTotal();
        alert("Your reservation has been cancelled.");
        document.getElementById('portalSection').scrollIntoView({ behavior: 'smooth' });
    }
}
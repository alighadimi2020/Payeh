document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");
    const phoneInput = document.querySelector("#login-phone");

    if (!form || !phoneInput) {
        return;
    }

    const normalizeDigits = (value) => {
        return value
            .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
            .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
    };

    phoneInput.addEventListener("input", () => {
        phoneInput.value = normalizeDigits(phoneInput.value)
            .replace(/\D/g, "")
            .slice(0, 11);
    });

    form.addEventListener("submit", (event) => {
        const phone = normalizeDigits(phoneInput.value).replace(/\D/g, "");

        phoneInput.value = phone;

        if (!/^09\d{9}$/.test(phone)) {
            event.preventDefault();
            phoneInput.setCustomValidity("شماره موبایل معتبر نیست.");
            phoneInput.reportValidity();
            return;
        }

        phoneInput.setCustomValidity("");
    });

    phoneInput.addEventListener("input", () => {
        phoneInput.setCustomValidity("");
    });
});

document.addEventListener('DOMContentLoaded', () => {
    Array.from(document.querySelectorAll('input,textarea')).forEach((input) => {
        input.addEventListener('blur', (event) => {
            event.target.closest('.form-field').classList.add('form-field--touched');
        });
    });

    var phAndEmail = Array.from(document.querySelectorAll('#email,#phone'));
    phAndEmail.forEach((input) => {
        input.addEventListener('input', (event) => {
            phAndEmail.forEach((inpt) => {
                if (inpt === event.target) {
                    return;
                }
                inpt.required = !event.target.value.length;
            });
        });
    });

    document.forms[0].addEventListener('submit', (event) => {
        event.preventDefault();
        // if (!this.querySelector('input[type="checkbox"]').checked) {
        //     return;
        // };
        document.querySelector('button').disabled = true;
        event.target.action = 'https://formspree.io/test@L1.co.nz'; // TODO update email
        event.target.submit();
    });
});
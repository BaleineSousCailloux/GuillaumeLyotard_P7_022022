this.getContactForm = (person) => {

    // DOM elements
    const openBtn = document.getElementById("openForm");
    const contactForm = document.getElementById("contact");
    const formContent = document.getElementById("content");
    const closeBtn = document.getElementById("closeForm");
    const photographerContactName = document.getElementById("contactForm-photographer-name");
    const formulaire = document.getElementById("form")
    const sendConfirm = document.getElementById("confirm")
    const firstName = document.getElementById("first");
    const lastName = document.getElementById("last");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const counter = document.getElementById("message-counter");

    // variables definitions
    let charLength = 0;
    counter.innerText = charLength;

    const maxLengthMessage = message.getAttribute("maxlength");

    photographerContactName.innerHTML = `Contactez ${person.name}`;
    photographerContactName.setAttribute("aria-label", `${person.name}`);
    photographerContactName.setAttribute("tabindex", 1);


    // open contact form modal
    function launchContactForm() {
        sendConfirm.style.display = "none";
        contactForm.style.display = "flex";
        formContent.focus();

        document.getElementById("body").setAttribute("aria-hidden", true);
        document.getElementById("body").classList.add("hidden");

        // keyboard events to kkep focus in modal and to close
        closeBtn.addEventListener("keydown", e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.keyCode === 9 && closeBtn.contains(document.activeElement)) {
                photographerContactName.focus();
            } else if (e.keyCode === 13 || e.keyCode === 32) {
                closeBtn.click();
            }
        });
        contactForm.addEventListener("keydown", e => {
            if (e.keyCode === 27 && formContent.contains(document.activeElement)) {
                e.preventDefault();
                e.stopPropagation();
                closeBtn.click();
            }
        })
    }

    // delay to close functions
    function manualCloseDelay() {
        setTimeout(closeContactForm, 200);
    }
    function autoCloseDelay() {
        setTimeout(closeContactForm, 5000);
    }

    // close contact form
    function closeContactForm() {
        document.getElementById("body").setAttribute("aria-hidden", false);
        document.getElementById("body").classList.remove("hidden");

        contactForm.style.display = "none";

        document.getElementById("first-error").style.display = 'none';
        document.getElementById("last-error").style.display = 'none';
        document.getElementById("email-error").style.display = 'none';
        document.getElementById("message-error").style.display = 'none';
    }


    // Events listener on buttons to launch or close modal
    openBtn.addEventListener("click", launchContactForm);
    closeBtn.addEventListener("click", manualCloseDelay);

    // Event Listener for message bos character cunt
    message.addEventListener('input', event => {
        charLength = event.target.value.length;
        if (charLength > maxLengthMessage) {
            return;
        }
        counter.innerText = charLength;
    })


    // global form control on submit
    formulaire.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        let firstNameIsValid = false;
        if (/^[A-Z|a-z|-]{2,}$/g.test(firstName.value)) {
            firstNameIsValid = true;
            document.getElementById("first-error").style.display = 'none';
        } else {
            document.getElementById("first-error").style.display = 'block';
        }

        let lastNameIsValid = false;
        if (/^[A-Z|a-z|-]{1,}$/g.test(lastName.value)) {
            lastNameIsValid = true;
            document.getElementById("last-error").style.display = 'none';
        } else {
            document.getElementById("last-error").style.display = 'block';
        }

        let emailIsValid = false;
        if (/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(email.value.trim().toLowerCase())) {
            emailIsValid = true;
            document.getElementById("email-error").style.display = 'none';
        } else {
            document.getElementById("email-error").style.display = 'block';
        }

        let messageIsValid = false;
        if (message.value !== "") {
            messageIsValid = true;
            document.getElementById("message-error").style.display = 'none';
        } else {
            document.getElementById("message-error").style.display = 'block';
        }

        if (firstNameIsValid && lastNameIsValid && emailIsValid && messageIsValid) {
            autoCloseDelay(); // rappel de la fonction de clotûre de la modale automatique
            sendConfirm.style.display = 'block';
            sendConfirm.focus();
            console.log("prénom : " + firstName.value); // Affichage des données saisies dans la console
            console.log("nom : " + lastName.value);
            console.log("email : " + email.value);
            console.log("message : " + message.value);
            console.log("envoyer à : " + person.name.replace(" ", '') + "@gmail.com")
            formulaire.reset(); // vider le formulaire
        }
    })
}
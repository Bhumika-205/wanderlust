// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)
    })
})()

// for index.ejs - tax-toggle-button
let taxSwitch = document.getElementById("switchCheckDefault");
if(taxSwitch) {
    taxSwitch.addEventListener("click", () => {
        let taxInfo = document.getElementsByClassName("tax-info");
        for(info of taxInfo){
            if(info.style.display != "inline"){
                info.style.display = "inline";
            }else{
                info.style.display = "none";
            }
        }
    });
}

// for wishlist icon on index.ejs
document.querySelectorAll(".wishlist-icon").forEach(icon => {
    icon.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = icon.dataset.id;

        if (icon.classList.contains("fa-solid")) {
        // REMOVE
        await fetch(`/wishlist/${id}`, { method: "DELETE" });

        icon.classList.remove("fa-solid", "active");
        icon.classList.add("fa-regular");
        } else {
        // ADD
        await fetch(`/wishlist/${id}`, { method: "POST" });

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid", "active");
        }
    });
});

// for removing from wishlist
document.querySelectorAll(".remove-wishlist").forEach(icon => {
    icon.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = icon.dataset.id;

        await fetch(`/wishlist/${id}`, {
        method: "DELETE"
        });

        // remove card from UI instantly
        icon.closest(".listing-card-wrapper").remove();
    });
});
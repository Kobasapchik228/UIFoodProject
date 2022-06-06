window.addEventListener("DOMContentLoaded", () => {
    //Tabs
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    function hideAllTabs() {
        tabsContent.forEach((item) => {
            item.style.display = "none"
        })

        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active")
        })


    }

    function showTab(i = 0) {
        tabsContent[i].style.display = "block"
        tabs[i].classList.add("tabheader__item_active")
    }

    hideAllTabs()
    showTab()

    tabsParent.addEventListener("click", (e) => {
        let target = e.target
        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideAllTabs()
                    showTab(i)
                }
            })
        }
    })

    //Modal window
    const modalOpen = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector(".modal")

    modalOpen.forEach(item => {
        item.addEventListener("click", () => {
            // modal.classList.add('show')
            // modal.classList.remove('hide')
            modal.style.display = "block"
            document.body.style.overflow = "hidden"
        })
    })
    function closeModal() {
        modal.style.display = "none"
        document.body.style.overflow = ""
    }

    document.querySelector('[data-close]').addEventListener("click", () => {
        // modal.classList.add('hide')
        //modal.classList.remove('show')
        closeModal()
    })

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal()
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" /**&& modal.classList.contains('show')*/) {
            closeModal()
        }
    })

})


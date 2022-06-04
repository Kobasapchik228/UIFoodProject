window.addEventListener("DOMContentLoaded", () => {
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
})


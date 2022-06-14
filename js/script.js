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

    function openModal() {
        modal.style.display = "block"
        document.body.style.overflow = "hidden"
        clearInterval(modalTimerId)
    }

    modalOpen.forEach(item => {
        item.addEventListener("click", () => {
            // modal.classList.add('show')
            // modal.classList.remove('hide')
            openModal()
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

    // const modalTimerId = setTimeout(openModal, 15000)

    //Функція що відображає модалку один раз у випадку, якщо проскролили до кінця сторінки
    function showModalByScrool() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal()
            window.removeEventListener("scroll", showModalByScrool)
        }
    }
    window.addEventListener("scroll", showModalByScrool)


    //Використовуємо класи для карток
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.kurs = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.kurs
        }

        render() {
            const element = document.createElement('div')
            if (this.classes.length === 0) {
                element.classList.add('menu__item')
            } else {
                this.classes.forEach(className => element.classList.add(className))
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
        `;
            this.parent.append(element)
            this.price = this.price * 28
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        10,
        ".menu .container",


    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        15,
        ".menu .container",
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12,
        ".menu .container",
        'menu__item'
    ).render();
    //Forms

    const forms = document.querySelectorAll(`form`)

    const message = {
        loading: `Загрузка`,
        success: `Дякую, скоро ми з Вами зв'яжемось`,
        failure: `Щось пішло не так `
    }

    forms.forEach(item => {
        postData(item)
    })

    function postData(form) {

        form.addEventListener(`submit`, (e) => {
            e.preventDefault()
            const statusMessage = document.createElement(`div`)
            statusMessage.classList.add(`status`)
            statusMessage.textContent = message.loading
            form.append(statusMessage)

            const request = new XMLHttpRequest()
            request.open(`POST`, `server.php`)

            // request.setRequestHeader(`Content-type`, `multipart/form-data`)
            const formData = new FormData(form)

            request.send(formData)

            request.addEventListener(`load`, () => {
                if (request.status === 200) {
                    console.log(request.response)
                    statusMessage.textContent = message.success
                } else {
                    statusMessage.textContent = message.failure
                }
            })
        })
    }
})


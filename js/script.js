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
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalOpen.forEach(item => {
        item.addEventListener("click", () => {
            openModal()
        })
    })
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }



    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.getAttribute(`data-close`) == ``) {
            closeModal()
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal()
        }
    })

    const modalTimerId = setTimeout(openModal, 50000)

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

    //Функція для отримання даних із сервера
    const getResource = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`)
        }

        return await res.json()
    }

    getResource(`http://localhost:3000/menu`)
        .then(data => {
            data.forEach(({ img, alt, title, descr, price }) => {
                new MenuCard(img, alt, title, descr, price, '.menu .container').render()
            })
        })

        //Функція коли не потрібна шаблонізація і немає класу, знизу

    // getResource(`http://localhost:3000/menu`)
    //     .then(data =>
    //         createCard(data))

    // function createCard(data) {
    //     data.forEach(({img, alt, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${alt}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }



    //Forms

    const forms = document.querySelectorAll(`form`)

    const message = {
        loading: `img/form/spinner.svg`,
        success: `Дякую, скоро ми з Вами зв'яжемось`,
        failure: `Щось пішло не так `
    }

    forms.forEach(item => {
        bindPostData(item)
    })


    //Оскільки проміс це асинхронний код то потрібно використовувати async/await, бо 
    //якщо ми цього не зробило при return буде помилка

    //Фкнція для того, щоб запостити дані на сервер 
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json()
    }



    function bindPostData(form) {

        form.addEventListener(`submit`, (e) => {
            e.preventDefault()
            const statusMessage = document.createElement(`img`)
            statusMessage.src = message.loading
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto
            `
            form.append(statusMessage)


            // request.setRequestHeader(`Content-type`, `multipart/form-data`) 
            //При формдаті заголовки не потрібні

            const formData = new FormData(form)
            //--------------------------------Перетворення формДати в JSON------------
            // const object = {}
            // formData.forEach(function (value, key) {
            //     object[key] = value
            // })

            const json = JSON.stringify(Object.fromEntries(formData.entries()))






            //--------------------------------Fetch------------
            postData(`http://localhost:3000/requests`, json)
                .then(data => {
                    console.log(data)
                    showThanksModal(message.success)
                    statusMessage.remove()
                })
                .catch(() => {
                    showThanksModal(message.failure)
                })
                .finally(() => {
                    form.reset()
                })


            //--------------------------XMLHTTPSREquest----------------------------
            // const request = new XMLHttpRequest()
            // request.open(`POST`, `server.php`)
            // const formData = new FormData(form) //Якщо розкоменуємо беремо до уваги що зверху є формдата
            // request.addEventListener(`load`, () => {
            //     if (request.status === 200) {
            //         console.log(request.response)
            //         showThanksModal(message.success)
            //         form.reset()
            //         statusMessage.remove()
            //     } else {
            //         showThanksModal(message.failure)
            //     }
            // })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector(`.modal__dialog`)

        prevModalDialog.classList.add('hide')
        openModal()

        const thanksModal = document.createElement(`div`)
        thanksModal.classList.add(`modal__dialog`)
        thanksModal.innerHTML = `
        <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
        </div>
        `
        document.querySelector(`.modal`).append(thanksModal)
        setTimeout(() => {
            thanksModal.remove()
            prevModalDialog.classList.add('show')
            prevModalDialog.classList.remove('hide')
            closeModal()
        }, 4000)
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res))


})


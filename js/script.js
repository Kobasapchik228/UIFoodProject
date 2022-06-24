window.addEventListener("DOMContentLoaded", () => {
    //-----------------------------------------Tabs---------------------------
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

    //--------------------------------------------Modal window-----------------------
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


    //---------------------------------------Use class for cards
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



    //---------------------------------------------Forms

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

    //Фунція для того, щоб запостити дані на сервер 
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

    //-----------------------------Sliders and nav for slides-----------------
    //----------------------------Slider  first version

    // const slides = document.querySelectorAll('.offer__slide'),
    //     prev = document.querySelector('.offer__slider-prev'),
    //     next = document.querySelector('.offer__slider-next'),
    //     total = document.querySelector('#total'),
    //     current = document.querySelector('#current')
    // let slideIndex = 1;


    // showSlide(slideIndex);
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`
    // } else {
    //     total.textContent = slides.length
    // }


    // function showSlide(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1
    //     }
    //     if (n < 1) {
    //         slideIndex = slides.length
    //     }

    //     slides.forEach(item => item.style.display = 'none')

    //     slides[slideIndex - 1].style.display = 'block'

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`
    //     } else {
    //         current.textContent = slideIndex
    //     }
    // }


    // function plusSlide(n) {
    //     showSlide(slideIndex += n)
    // }


    // prev.addEventListener('click', () => {
    //     plusSlide(-1)
    // })
    // next.addEventListener('click', () => {
    //     plusSlide(1)
    // })


    //-----------------------------------------------Slider second version---------------------------------
    //---------------------------with nav for slides-------------------------------------------------------
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector(`.offer__slider-wrapper`),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`
        current.textContent = `0${slideIndex}`
    } else {
        total.textContent = slides.length
        current.textContent = slideIndex
    }

    slidesField.style.width = 100 * slides.length + '%'
    slidesField.style.display = 'flex'
    slidesField.style.transition = `0.5s all`
    slidesWrapper.style.overflow = 'hidden'

    slides.forEach(slide => {
        slide.style.width = width
    })

    //added nav 
    slider.style.position = `relative`

    const indicators = document.createElement('ol'),
        dots = []
    indicators.classList.add('carousel-indicators')
    indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li')
        dot.setAttribute(`data-slide-to`, i + 1)
        dot.style.cssText = `
        box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
        `
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot)
        dots.push(dot)
    }

    function appointCurrentValue() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        }
    }

    function appointDotsOppacity() {
        dots.forEach(dot => dot.style.opacity = `.5`);
        dots[slideIndex - 1].style.opacity = 1;
    }

    function changeValueWithRegular(string) {
        return +string.replace(/\D/g, '')
    }


    next.addEventListener('click', () => {
        if (offset == changeValueWithRegular(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += changeValueWithRegular(width)
        }
        slidesField.style.transform = `translateX(-${offset}px)`

        if (slideIndex == slides.length) {
            slideIndex = 1
        } else {
            slideIndex++
        }

        appointCurrentValue()
        appointDotsOppacity()

    })

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = changeValueWithRegular(width) * (slides.length - 1)
        } else {
            offset -= changeValueWithRegular(width)
        }

        slidesField.style.transform = `translateX(-${offset}px)`

        if (slideIndex == 1) {
            slideIndex = slides.length
        } else {
            slideIndex--
        }

        appointCurrentValue()
        appointDotsOppacity()
    })

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute(`data-slide-to`)

            slideIndex = slideTo
            offset = changeValueWithRegular(width) * (slideTo - 1)
            slidesField.style.transform = `translateX(-${offset}px)`

            appointCurrentValue()
            appointDotsOppacity()
        })
    })


    //---------------------------------------------------CALC-----------------------------

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ration;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex')
    } else {
        sex = 'female'
        localStorage.setItem('sex', 'female')
    }

    if (localStorage.getItem('ration')) {
        ration = localStorage.getItem('ration')
    } else {
        ration = 1.375
        localStorage.setItem('ration', 1.375)
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector)

        elements.forEach(elem => {
            elem.classList.remove(activeClass)
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass)
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ration')) {
                elem.classList.add(activeClass)
            }
        })
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active')
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active')

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ration) {
            result.textContent = `_____`;
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ration)
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ration)
        }
    }
    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ration = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ration', +e.target.getAttribute('data-ratio'))
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'))
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);
                calcTotal();

            });
        });

    }
    getStaticInformation('#gender div', 'calculating__choose-item_active')
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active')

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector)


        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red'
            } else {
                input.style.border = 'none'
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value
                    break;
                case 'weight':
                    weight = +input.value
                    break;
                case 'age':
                    age = +input.value
                    break;

            }
            calcTotal()
        })
    }
    getDynamicInformation('#height')
    getDynamicInformation('#weight')
    getDynamicInformation('#age')



})


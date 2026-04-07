import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './styles/main.scss'

document.documentElement.classList.add('is-loaded')

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href')

    if (!targetId || targetId === '#') {
      return
    }

    const target = document.querySelector(targetId)

    if (!target) {
      return
    }

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', targetId)
  })
})

const tourSwiper = document.querySelector('.js-tour-swiper')

if (tourSwiper) {
  new Swiper(tourSwiper, {
    modules: [Pagination],
    slidesPerView: 1,
    spaceBetween: 24,
    speed: 650,
    pagination: {
      el: '.tour-swiper__pagination',
      clickable: true,
    },
  })
}

document.querySelectorAll('.js-service-swiper').forEach((element) => {
  const prevEl = element.querySelector('.service-media__nav--prev')
  const nextEl = element.querySelector('.service-media__nav--next')

  new Swiper(element, {
    modules: [Navigation],
    loop: true,
    slidesPerView: 1,
    speed: 650,
    watchOverflow: true,
    observer: true,
    observeParents: true,
    navigation: {
      prevEl,
      nextEl,
    },
  })
})

const trophiesSwiper = document.querySelector('.js-trophies-swiper')

if (trophiesSwiper) {
  new Swiper(trophiesSwiper, {
    modules: [Navigation],
    loop: true,
    centeredSlides: true,
    slidesPerView: 1.18,
    spaceBetween: 24,
    speed: 700,
    navigation: {
      prevEl: '.trophies-swiper__nav--prev',
      nextEl: '.trophies-swiper__nav--next',
    },
    breakpoints: {
      641: {
        slidesPerView: 1.45,
        spaceBetween: 28,
      },
      1024: {
        slidesPerView: 1.95,
        spaceBetween: 34,
      },
    },
  })
}

import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './styles/main.scss'

document.documentElement.classList.add('is-loaded')

const siteHeader = document.querySelector('.js-site-header')
const burgerButton = document.querySelector('.hero-header__burger')
const mobileBreakpoint = window.matchMedia('(max-width: 800px)')
const bookingModal = document.querySelector('.booking-modal')
const bookingTriggers = document.querySelectorAll('.js-booking-trigger')
const bookingCloseButtons = document.querySelectorAll('.js-booking-close')

const syncHeaderHeight = () => {
  const headerHeight = siteHeader?.offsetHeight ?? 0
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
}

const closeMobileMenu = () => {
  if (!siteHeader || !burgerButton) {
    return
  }

  siteHeader.classList.remove('is-menu-open')
  burgerButton.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('menu-open')
}

const toggleMobileMenu = () => {
  if (!siteHeader || !burgerButton) {
    return
  }

  const isOpen = siteHeader.classList.toggle('is-menu-open')
  burgerButton.setAttribute('aria-expanded', String(isOpen))
  document.body.classList.toggle('menu-open', isOpen)
}

const openBookingModal = () => {
  if (!bookingModal) {
    return
  }

  bookingModal.classList.add('is-open')
  bookingModal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('menu-open')
}

const closeBookingModal = () => {
  if (!bookingModal) {
    return
  }

  bookingModal.classList.remove('is-open')
  bookingModal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('menu-open')
}

syncHeaderHeight()
window.addEventListener('resize', syncHeaderHeight)

if (burgerButton) {
  burgerButton.addEventListener('click', toggleMobileMenu)
}

mobileBreakpoint.addEventListener('change', (event) => {
  if (!event.matches) {
    closeMobileMenu()
  }

  syncHeaderHeight()
})

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

    const headerOffset = siteHeader?.offsetHeight ?? 0
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' })
    window.history.replaceState(null, '', targetId)

    if (mobileBreakpoint.matches) {
      closeMobileMenu()
    }
  })
})

bookingTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault()
    closeMobileMenu()
    openBookingModal()
  })
})

bookingCloseButtons.forEach((button) => {
  button.addEventListener('click', closeBookingModal)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeBookingModal()
  }
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
    loop: false,
    rewind: true,
    initialSlide: 1,
    centeredSlides: true,
    slidesPerView: 1.18,
    spaceBetween: 24,
    speed: 520,
    watchSlidesProgress: true,
    roundLengths: true,
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

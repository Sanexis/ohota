import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './styles/main.scss'
import heroVideoDesktop from './video/video.mp4'
import heroVideoMobile from './video/video-mobile.mp4'

document.documentElement.classList.add('is-loaded')

const siteHeader = document.querySelector('.js-site-header')
const burgerButton = document.querySelector('.hero-header__burger')
const mobileBreakpoint = window.matchMedia('(max-width: 800px)')
const heroVideo = document.querySelector('.js-hero-video')
const heroVideoBreakpoint = window.matchMedia('(max-width: 640px)')
const bookingModal = document.querySelector('.booking-modal')
const bookingTriggers = document.querySelectorAll('.js-booking-trigger')
const bookingCloseButtons = document.querySelectorAll('.js-booking-close')
const mapModal = document.querySelector('.map-modal')
const mapOpenButtons = document.querySelectorAll('.js-map-open')
const mapCloseButtons = document.querySelectorAll('.js-map-close')
const mapCanvas = document.querySelector('.js-map-canvas')
const mapCenter = [54.994496353338285, 29.822718879316966]
const mapMarkerIcon = new URL('../public/logo.png', import.meta.url).href

let interactiveMap = null
let mapInitRequested = false

const initInteractiveMap = () => {
  if (!mapCanvas || interactiveMap) {
    return
  }

  if (!window.ymaps) {
    if (!mapInitRequested) {
      mapInitRequested = true
      window.setTimeout(() => {
        mapInitRequested = false
        initInteractiveMap()
      }, 250)
    }

    return
  }

  window.ymaps.ready(() => {
    if (interactiveMap || !mapCanvas) {
      return
    }

    interactiveMap = new window.ymaps.Map(
      mapCanvas,
      {
        center: mapCenter,
        zoom: 8,
        controls: ['zoomControl', 'typeSelector', 'trafficControl', 'fullscreenControl', 'geolocationControl'],
      },
      {
        suppressMapOpenBlock: true,
      },
    )

    const placemark = new window.ymaps.Placemark(
      mapCenter,
      {},
      {
        iconLayout: 'default#image',
        iconImageHref: mapMarkerIcon,
        iconImageSize: [64, 64],
        iconImageOffset: [-32, -64],
      },
    )

    interactiveMap.geoObjects.add(placemark)
  })
}

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

const openMapModal = () => {
  if (!mapModal) {
    return
  }

  mapModal.classList.add('is-open')
  mapModal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('menu-open')
  initInteractiveMap()
}

const closeMapModal = () => {
  if (!mapModal) {
    return
  }

  mapModal.classList.remove('is-open')
  mapModal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('menu-open')
}

const syncHeroVideo = () => {
  if (!heroVideo) {
    return
  }

  const nextSrc = heroVideoBreakpoint.matches ? heroVideoMobile : heroVideoDesktop

  if (heroVideo.getAttribute('src') === nextSrc) {
    return
  }

  heroVideo.setAttribute('src', nextSrc)
  heroVideo.load()

  const playPromise = heroVideo.play()

  if (playPromise instanceof Promise) {
    playPromise.catch(() => {})
  }
}

syncHeaderHeight()
syncHeroVideo()
window.addEventListener('resize', syncHeaderHeight)
heroVideoBreakpoint.addEventListener('change', syncHeroVideo)

if (burgerButton) {
  burgerButton.addEventListener('click', toggleMobileMenu)
}

document.addEventListener('click', (event) => {
  if (!siteHeader || !burgerButton || !mobileBreakpoint.matches) {
    return
  }

  if (!siteHeader.classList.contains('is-menu-open')) {
    return
  }

  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (burgerButton.contains(target) || siteHeader.querySelector('.hero-header__panel')?.contains(target)) {
    return
  }

  closeMobileMenu()
})

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

mapOpenButtons.forEach((button) => {
  button.addEventListener('click', openMapModal)
})

mapCloseButtons.forEach((button) => {
  button.addEventListener('click', closeMapModal)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeBookingModal()
    closeMapModal()
  }
})

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
const trophiesAuthor = document.querySelector('.js-trophies-author')
const trophiesText = document.querySelector('.js-trophies-text')

const syncTrophiesQuote = (swiper) => {
  const activeSlide = swiper?.slides?.[swiper.activeIndex]

  if (!activeSlide || !trophiesAuthor || !trophiesText) {
    return
  }

  const { author, quote } = activeSlide.dataset

  if (author) {
    trophiesAuthor.textContent = author
  }

  if (quote) {
    trophiesText.textContent = `«${quote}»`
  }
}

if (trophiesSwiper) {
  const trophiesSlider = new Swiper(trophiesSwiper, {
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

  syncTrophiesQuote(trophiesSlider)
  trophiesSlider.on('slideChange', () => syncTrophiesQuote(trophiesSlider))
}

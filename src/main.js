import Swiper from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './styles/main.scss'

document.documentElement.classList.add('is-loaded')

const heroVideo = document.querySelector('.hero-video')

if (heroVideo) {
  const heroVideoSource = heroVideo.querySelector('source')
  const mobileMediaQuery = window.matchMedia('(max-width: 525px)')

  const updateHeroVideo = () => {
    const nextSrc = mobileMediaQuery.matches
      ? heroVideo.dataset.videoMobile
      : heroVideo.dataset.videoDesktop

    if (!heroVideoSource || !nextSrc || heroVideoSource.getAttribute('src') === nextSrc) {
      return
    }

    heroVideoSource.setAttribute('src', nextSrc)
    heroVideo.load()

    const playPromise = heroVideo.play()

    if (playPromise?.catch) {
      playPromise.catch(() => {})
    }
  }

  updateHeroVideo()

  if (mobileMediaQuery.addEventListener) {
    mobileMediaQuery.addEventListener('change', updateHeroVideo)
  } else {
    mobileMediaQuery.addListener(updateHeroVideo)
  }
}

const toTopButton = document.querySelector('.to-top')

if (toTopButton) {
  const toggleToTopButton = () => {
    const doc = document.documentElement
    const scrollableHeight = doc.scrollHeight - window.innerHeight
    const middlePoint = scrollableHeight * 0.5

    toTopButton.classList.toggle('is-visible', window.scrollY >= middlePoint)
  }

  window.addEventListener('scroll', toggleToTopButton, { passive: true })
  toggleToTopButton()

  toTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

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

document.querySelectorAll('.js-service-swiper').forEach((element) => {
  const slider = element.closest('.service-slider')
  if (!slider) return

  new Swiper(element, {
    modules: [Autoplay, Navigation],
    loop: true,
    slidesPerView: 1,

    speed: 900,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    navigation: {
      prevEl: slider.querySelector('[data-slider-prev]'),
      nextEl: slider.querySelector('[data-slider-next]'),
    },

    allowTouchMove: true,
    simulateTouch: true,
    grabCursor: true,
  })
})

const trophySwiperElement = document.querySelector('.js-trophy-swiper')

if (trophySwiperElement) {
  const slider = trophySwiperElement.closest('.trophy-slider')

  new Swiper(trophySwiperElement, {
    modules: [Autoplay, Navigation],
    loop: false,
    speed: 700,
    spaceBetween: 16,
    slidesPerView: 1,
    allowTouchMove: false,
    simulateTouch: false,
    grabCursor: false,
    watchOverflow: true,
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      prevEl: slider?.querySelector('[data-slider-prev]'),
      nextEl: slider?.querySelector('[data-slider-next]'),
    },
    breakpoints: {
      0: {
        allowTouchMove: true,
        simulateTouch: true,
        grabCursor: true,
      },
      641: {
        slidesPerView: 2,
        allowTouchMove: false,
        simulateTouch: false,
        grabCursor: false,
      },
      901: {
        slidesPerView: 3,
        allowTouchMove: false,
        simulateTouch: false,
        grabCursor: false,
      },
    },
  })
}

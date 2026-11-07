import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/** GSAP, ScrollTrigger y Lenis juntos. Se cargan aparte (loadMotion) para no frenar la primera pintura. */
export { gsap, Lenis, ScrollTrigger }

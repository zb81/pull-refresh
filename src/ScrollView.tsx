import { PropsWithChildren, TouchEvent, useRef } from "react"
import carImg from './assets/car.gif'

interface ScrollViewProps {
  treshold?: number
  height: number
  onRefresh?: () => Promise<unknown>
}


const REFRESH_TRESHOLD = 70

let pullFromTop = false
let startY = 0

function ScrollView({ treshold = REFRESH_TRESHOLD, children, height, onRefresh }: PropsWithChildren<ScrollViewProps>) {
  const scrollViewRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const carRef = useRef<HTMLImageElement>(null)

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    startY = e.changedTouches[0].clientY
    pullFromTop = scrollViewRef.current!.scrollTop === 0
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    const isPullDown = e.changedTouches[0].clientY > startY
    if (pullFromTop && isPullDown) {
      carRef.current!.style.transition = 'none'
      const delta = e.changedTouches[0].clientY - startY
      feedbackRef.current!.style.transition = 'none'
      feedbackRef.current!.style.height = `${Math.min(delta, treshold)}px`
      carRef.current!.style.left = `${Math.min(delta, treshold) / treshold * 50}%`
    }
  }

  const recover = () => {
    pullFromTop = false
    feedbackRef.current!.style.transition = 'height 0.3s ease-in'
    feedbackRef.current!.style.height = '0px'
  }

  async function handleTouchEnd() {
    // 如果超过阈值，触发下拉刷新
    if (pullFromTop && feedbackRef.current!.clientHeight >= treshold) {
      console.log('refresh')
      if (onRefresh) {
        await onRefresh()
        carRef.current!.style.transition = 'left 0.2s ease-in'
        carRef.current!.style.left = '200%'
        recover()
      }
    } else {
      recover()
    }
  }

  return (
    <div ref={scrollViewRef} className="scroll-view" style={{ height }}>
      <div ref={feedbackRef} className="feedback">
        <img ref={carRef} className="car" src={carImg} />
      </div>

      <div
        className="content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

export default ScrollView

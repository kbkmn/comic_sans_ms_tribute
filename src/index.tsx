import { render } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"
import Audio from "./components/Audio"

import "./style.css"

const text = "Comic Sans MS"
const scaleFactor = 1.1
const maxScale = 1000

const colors = [
  "rgb(255, 0, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(255, 255, 0)",
  "rgb(255, 0, 255)",
  "rgb(0, 255, 255)",
]
const queue: Drawing[] = []

class Drawing {
  _context: CanvasRenderingContext2D
  _fillIdx: number
  _strokeIdx: number
  _progress: number

  constructor(context: CanvasRenderingContext2D, progress?: number) {
    this._context = context
    this._fillIdx = Math.floor(Math.random() * colors.length)
    this._strokeIdx = (() => {
      let random = Math.floor(Math.random() * colors.length)

      while (random === this._fillIdx) {
        random = Math.floor(Math.random() * colors.length)
      }

      return random
    })()
    this._progress = progress || 0.00001
  }

  draw() {
    const scale = maxScale * this._progress

    this._context.fillStyle = colors[this._fillIdx]
    this._context.strokeStyle = colors[this._strokeIdx]

    this._context.save()
    this._context.translate(
      this._context.canvas.width / 2,
      this._context.canvas.height / 2
    )

    this._context.scale(scale, scale)
    this._context.fillText(text, 0, 0)
    this._context.strokeText(text, 0, 0)
    this._context.restore()

    this._progress *= scaleFactor

    if (scale >= maxScale) {
      queue.shift()
      queue.push(new Drawing(this._context))
    }
  }
}

export const App = () => {
  const ref = useRef<HTMLCanvasElement>()
  const [play, setPlay] = useState(false)

  const updateQueue = () => {
    for (let item of queue) {
      item.draw()
    }

    requestAnimationFrame(updateQueue)
  }

  useEffect(() => {
    if (!ref || !ref.current || !play) return

    const canvas = ref.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const context = canvas.getContext("2d")

    context.textAlign = "center"
    context.textBaseline = "middle"
    context.font = "bold 48px ComicSansMs"

    queue.push(new Drawing(context, 0))

    updateQueue()
  }, [ref, play])

  return (
    <>
      {play ? (
        <>
          <canvas ref={ref} />
          <Audio />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            height: "100dvh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setPlay(true)}
            style={{
              display: "flex",
              padding: "0.5rem 1rem",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              style={{ width: "2rem", height: "2rem" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>

            <span>Sound warning!</span>
          </button>
        </div>
      )}
    </>
  )
}

render(<App />, document.getElementById("app"))

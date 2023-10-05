import { useEffect } from "preact/hooks"

import { sound } from "./sound"

const AudioComponent = () => {
  function handleBuffer() {
    var buffer = 0.3

    if (this.currentTime >= this.duration - buffer) {
      this.currentTime = 0.1
      this.play()
    }
  }

  useEffect(() => {
    const audio = new Audio(`data:audio/mpeg;base64,${sound}`)
    audio.currentTime = 0.15
    audio.volume = 0.7
    audio.play()

    audio.addEventListener("timeupdate", handleBuffer)
    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", handleBuffer)
    }
  }, [])

  return <span>AUDIO</span>
}

export default AudioComponent

import React, {useState} from "react"
import Button from "react-bootstrap/Button"
import Fade from "react-bootstrap/Fade"
import ChevronUpIcon from "./icons/ChevronUpIcon"

function useScrollTrigger() {
  const threshold = 100
  const [triggered, setTriggered] = useState(false)
  if (typeof window !== "undefined") {
    window.onscroll = function () {
      if (
        document.body.scrollTop > threshold ||
        document.documentElement.scrollTop > threshold
      ) {
        setTriggered(true)
      } else if (triggered) {
        setTriggered(false)
      }
    }
  }
  return triggered
}

const ScrollTop = () => {
  const trigger = useScrollTrigger()

  const handleClick = () => {
    const anchor = document.querySelector("#top-anchor")
    anchor.scrollIntoView({behavior: "smooth", block: "center"})
  }

  return (
    <>
      <div id="top-anchor" />
      <Fade in={trigger}>
        <div>
          <Button
            className="rounded-circle position-fixed bottom-0 end-0 z-1 mb-3 me-3"
            aria-label="scroll back to top"
            onClick={handleClick}
            variant="secondary"
          >
            <ChevronUpIcon className="align-baseline" />
          </Button>
        </div>
      </Fade>
    </>
  )
}
export default ScrollTop

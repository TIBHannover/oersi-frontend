import React, {useState} from "react"
import Button from "react-bootstrap/Button"
import Fade from "react-bootstrap/Fade"

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
      <Fade in={trigger} mountOnEnter unmountOnExit>
        <div>
          <Button
            className="rounded-circle position-fixed mb-3 me-3"
            aria-label="scroll back to top"
            onClick={handleClick}
            style={{bottom: 0, right: 0, zIndex: 1000}}
            variant={"secondary"}
          >
            <i className="bi bi-chevron-up"></i>
          </Button>
        </div>
      </Fade>
    </>
  )
}
export default ScrollTop

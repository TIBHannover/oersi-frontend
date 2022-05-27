import {ResultCard} from "@appbaseio/reactivesearch"
import React from "react"
import {useRouter} from "next/router"

export const Test = (props) => {
  const {item} = props
  const router = useRouter()

  return (
    <ResultCard onClick={() => router.push(item._id)}>
      <ResultCard.Image src={item.image} />
      <ResultCard.Title>{item.name}</ResultCard.Title>
    </ResultCard>
  )
}

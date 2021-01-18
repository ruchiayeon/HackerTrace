import React from 'react'
import RingLoader from "react-spinners/RingLoader";

const Loading = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <section className="spinner-center">
        <RingLoader color={'#321fdb'} loading={true} size={200} />
      </section>
    </div>
  )
}

export default Loading

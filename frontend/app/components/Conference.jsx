import React from 'react'

const Conference = ({ conference }) => {
  console.log(conference)

  return (
    <div style={{ margin: '20vh' }}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${conference.url.split('/').pop()}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default Conference
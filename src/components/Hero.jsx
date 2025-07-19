import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const words = ["Community", "Culture", "Vibe", "Trend", "Style"]

const Hero = () => {
  const [index, setIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [speed, setSpeed] = useState(150)

  useEffect(() => {
    const currentWord = words[index % words.length]
    let timeout

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1))
        setSpeed(75)
      }, speed)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(prev => currentWord.slice(0, prev.length + 1))
        setSpeed(150)
      }, speed)
    }

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1000)
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false)
      setIndex(prev => (prev + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, index])

  return (
    <section className='max-padd-container bg-hero bg-cover bg-center bg-no-repeat h-[811px] w-full'>
      <div className='flex flex-col h-full justify-center max-w-[777px] pt-8'>
        <h3 className='h3 text-secondary font-paci font-thin'>
          Friends Don't forget friends!
        </h3>
        <h2 className='uppercase h2 !mb-0 tracking-[0.22rem]'>
          Join our
          <span className='bg-secondary px-1 inline-block rotate-[-2deg] ml-2.5 !bold-40'>
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </h2>
        <h1 className='h1 max-w-[699px] font-[800]'>
          ScottyUzi!
        </h1>
        <Link
          to={'/collections'}
          className="inline-flex text-white flexCenter btn-secondary mt-6 w-max rounded-full"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}

export default Hero

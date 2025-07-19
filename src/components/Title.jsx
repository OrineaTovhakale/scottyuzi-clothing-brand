import React from 'react'

const Title = ({
  title1,
  title2, 
  titleStyles,
  title1Styles, 
  paraStyles,
  para,
}) => {
  return (
    <div className={`${titleStyles}`}>
      <h3 className={`${title1Styles} h3`}>
        {title1}
        <span className='text-secondary !font-light underline'>{title2}</span>
      </h3>
      <p className={`${paraStyles} max-w-md`}>
        {para? para: "Explore our wide range of products and view our latest collection of stylish clothing, lets qwa the qwe!"}
      </p>
    </div>
  )
}

export default Title



/*
import React from 'react'
import Title from './Title'
import { categories } from '../assets/data'
import { ShopContext } from '../context/ShopContext'

const Categories = () => {
  return (
    <section className='max-padd-container pt-16'>
      <Title
        title1={"Categories"}
        title2={"List"}
        titleStyles={"pb-10"}
        paraStyles={"hidden"}
      />
      {/* container */ //}
      /*<div>
        {categories.map((cat) => (
          <div key={cat.name}
          onClick={() => navigate(`/collections/category/${cat.name.toLowerCase()}`)}
          className='flexCenter flex-col cursor-pointer group'
          >
            <div>
              <img src={cat.image} alt="" height={201} width={201} className='w-24 h-24 object-cover group-hover:scale-105 transition' />
            </div>
            <div>
              <h5 className='h5 uppercase'>{cat.name}</h5>
            </div>

          </div>
        ))}

        
      </div>
    </section>
  )
}

export default Categories
import { useNavigate } from 'react-router-dom'
*/

import React from 'react'
import Title from './Title'
import { categories } from '../assets/data'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className='max-padd-container pt-16'>
      <Title
        title1={"Categories"}
        title2={"List"}
        titleStyles={"pb-10"}
        paraStyles={"hidden"}
      />

      {/* Grid Container */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center'>
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => navigate(`/collections/category/${cat.name.toLowerCase()}`)}
            className='flexCenter flex-col cursor-pointer group'
          >
            <div>
              <img
                src={cat.image}
                alt={cat.name}
                height={201}
                width={201}
                className='w-24 h-24 object-cover group-hover:scale-105 transition duration-300'
              />
            </div>
            <div>
              <h5 className='h5 uppercase mt-2'>{cat.name}</h5>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories

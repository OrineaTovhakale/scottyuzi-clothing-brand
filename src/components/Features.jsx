import React from 'react'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { MdCurrencyExchange } from 'react-icons/md'
import { BiSupport } from 'react-icons/bi'
import { TbPackageImport } from 'react-icons/tb'
const Features = () => {
  return (
    <section className='max-padd-container mt-10'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
        <div className='flexCenter gap-x-4'>
          <LiaShippingFastSolid className='text-4xl text-secondary' />
          <div>
             <h5 className='medium-15'>
               Fast Shipping
             </h5>
             <p className='text-secondary'>On orders above R700</p>
          </div>
        </div>
        <div className='flexCenter gap-x-4'>
          <MdCurrencyExchange className='text-4xl text-secondary' />
          <div>
             <h5 className='medium-15'>
               Discounts
             </h5>
             <p className='text-secondary'>Discount available for members</p>
          </div>
        </div>
        <div className='flexCenter gap-x-4'>
          <BiSupport className='text-4xl text-secondary' />
          <div>
             <h5 className='medium-15'>
               Fast Support
             </h5>
             <p className='text-secondary'>24/7 Customer support for all members</p>

          </div>
        </div>
        <div className='flexCenter gap-x-4'>
          <TbPackageImport className='text-4xl text-secondary' />
          <div>
             <h5 className='medium-15'>
               Packaging
             </h5>
             <p className='text-secondary'>Safe and secure packaging for all orders</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features


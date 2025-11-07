import React from 'react'
import deleted from '../img/deleted.png';

function deleteButton() {
  return (
    <>
        <div className="w-[36px] h-[36px] inline-block bg-white border-gray-300 rounded-md border border-solid 
        hover:bg-gray-100 
        disabled:bg-gray-300 disabled:border-gray-300  
        active:bg-gray-100 
        focus:bg-white focus:border-gray-500">
            <a className='w-full h-full flex justify-center justify-items-center items-center rounded-md' href="/"><img className='w-[24px] h-[24px]' src={deleted} alt="플러스" /></a>
        </div>
    </>
  )
}

export default deleteButton
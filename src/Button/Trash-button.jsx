import React from 'react'
import deleted from '../img/deleted.svg';


function Trashbutton() {
  return (
    <>
        <button className="w-[36px] h-[36px] inline-block bg-white border-gray-300 rounded-md border border-solid 
        hover:bg-gray-100 
        disabled:bg-gray-300 disabled:border-gray-300  
        active:bg-gray-100 active:border-gray-500
        focus:bg-white">
            <div className='w-full h-full flex justify-center justify-items-center items-center rounded-md'><img src={deleted} alt="" /></div>
        </button>
    </>
  )
}

export default Trashbutton
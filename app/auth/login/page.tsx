import LoginQuiz from '@/components/LoginQuiz'
import NavbarQuiz from '@/components/NavbarQuiz'
import PublicNav from '@/components/PublicNav'
import React from 'react'

export default function page() {
  return (
    <div className='mt-20'>
      {/* <NavbarQuiz/> */}
      <PublicNav/>
      <LoginQuiz/>
    </div>
  )
}

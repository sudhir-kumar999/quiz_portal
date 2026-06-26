import LoginQuiz from '@/components/LoginQuiz'
import NavbarQuiz from '@/components/NavbarQuiz'
import React from 'react'

export default function page() {
  return (
    <div className='mt-20'>
      <NavbarQuiz/>
      <LoginQuiz/>
    </div>
  )
}

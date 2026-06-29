import AdminLogin from '@/components/AdminLogin'
import NavbarQuiz from '@/components/NavbarQuiz'
import PublicNav from '@/components/PublicNav'
import React from 'react'

export default function page() {
  return (
    <div>
      {/* <NavbarQuiz/> */}
      <PublicNav/>
      <AdminLogin/>
    </div>
  )
}

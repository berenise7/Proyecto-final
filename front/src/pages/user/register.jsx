import UserRegisterFormik from '@/components/FormikComponents/Register/UserRegisterFormik'
import Header from '@/components/Header/Header'
import React from 'react'

export default function register() {
  return (
    <div>
      <Header/>
      <UserRegisterFormik/>
    </div>
  )
}

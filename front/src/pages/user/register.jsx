import UserRegisterFormik from '@/components/FormikComponents/Register/UserRegisterFormik'
import HeaderAndSearch from '@/components/Header/HeaderAndSearch'
import React from 'react'

export default function register() {
  return (
    <div>
      <HeaderAndSearch/>
      <UserRegisterFormik/>
    </div>
  )
}

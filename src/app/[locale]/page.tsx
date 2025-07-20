import React from 'react'
import HomePageHero from '@/components/Heros/HomePageHero'
import WitchRestaurant from '@/components/WitchRestaurant/WitchRestaurant'
import MenuCategoriesSection from '../../components/Menu/MenuCategoriesSection'
// import CardContainer from '@/components/DishesCards/CardContainer'

export default function Homepage() {
  return (
    <main className='bg-stone-100'>


      <HomePageHero />
      <WitchRestaurant />
      <MenuCategoriesSection />

    </main>
  )
}

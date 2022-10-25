import Image from 'next/image'
import React from 'react'
import { ArrowDownRightIcon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, Bars4Icon, ChatBubbleLeftIcon, ChevronDoubleDownIcon, ChevronDownIcon, HomeIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { BellIcon, ChatBubbleBottomCenterIcon, GlobeAltIcon, PlusIcon, SparklesIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link'

const Header = () => {
  // catching session info with useSession from next-auth
  const { data: session } = useSession()
  const [open,setOpen] = React.useState<boolean>(false)
  return (
    <div className="sticky top-0 z-50">
    <div className='z-50 flex bg-white px-0 md:px-4 py-2 shadow-sm h-14'>
      <div className="h-15 w-40 flex-shrink-0 cursor-pointer relative left-[-40px] md:left-[10px] top-0">
        <Link href='/'>
        <Image src="https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?width=640&crop=smart&auto=webp&s=bfd318557bf2a5b3602367c9c4d9cd84d917ccd5" 
        alt="reddit logo"
        layout='fill'
        objectFit='contain'
        />
        </Link>
      </div>

      <div className='items-center mx-2 xl:min-w-[120px] gap-4 hidden md:flex'>
        <HomeIcon className='w-5 h-5'/>
        <ChevronDownIcon className='w-5 h-5 font-bold'/>
      </div>

      <form className='flex flex-1 min-w-[200px] ml-[-90px] md:ml-[0px] items-center gap-5 border border-gray-75 rounded-sm py-1 px-3 bg-gray-50 md:mr-2 mr-1'>
      <MagnifyingGlassIcon className='w-6 h-6 text-gray-400'/>
      <input type="text" placeholder='Search on Reddit' className="hidden md:inline flex-1 p-3 bg-transparent outline-none"/>
      <button type='submit' hidden />
      </form>

      <div className='items-center gap-1 lg:gap-2 text-gray-500 hidden lg:inline-flex'>
        <SparklesIcon className='icon'/>
        <GlobeAltIcon className='icon'/>
        <VideoCameraIcon className='icon'/>
        <hr className='h-10 border border-gray-100'/>
        <ChatBubbleLeftIcon className='icon'/>
        <BellIcon className='icon'/>
        <PlusIcon className='icon'/>
        <PhoneIcon className='icon'/>
      </div>
      <div className='flex items-center text-gray-500 lg:hidden' onClick={() => setOpen(!open)}>
        <Bars4Icon className='icon bg-gray-50 rounded-md border border-gray-150 w-10 p-1'/>
      </div>
      { // if session exists, show logout logic, if not, show login logic
        session ? (
          <div className='hidden lg:flex items-center bg-gray-50 rounded-md border border-gray-150 ml-2'>
            <div onClick={() => signOut()}>
              <ArrowRightOnRectangleIcon className='icon'/>
            </div>
            <div className='flex flex-col items-center p-2 truncate '>
            <p className='text-sm font-semibold'>{session?.user?.name}</p>
            <p className='text-gray-400 text-xs'>3 new messeges</p>
            </div>
          </div>
        ) : (
          <div className='hidden lg:flex items-center' onClick={() => signIn()}>
            <hr className='h-10 border border-gray-100 ml-2 mr-2'/>
            <ArrowLeftOnRectangleIcon className='icon bg-gray-50 rounded-md border border-gray-150'/>
          </div>
        )
      }
    </div>
    {open && (
      <div className="lg:hidden absolute bg-white right-2 z-100 w-[120px] p-2 flex items-center justify-center border rounded-md md:right-4">
        <div>
        <SparklesIcon className='icon'/>
        <GlobeAltIcon className='icon'/>
        <VideoCameraIcon className='icon'/>
        <ChatBubbleLeftIcon className='icon'/>
        <BellIcon className='icon'/>
        <PlusIcon className='icon'/>
        <PhoneIcon className='icon'/>
        {session ? (
          <div className='flex items-center bg-gray-50 rounded-md border border-gray-150'>
            <div onClick={() => signOut()}>
              <ArrowRightOnRectangleIcon className='icon'/>
            </div>
            <div className='flex flex-col items-center truncate '>
            </div>
          </div>
        ) : (
          <div className='flex items-center' onClick={() => signIn()}>
            <hr className='h-10 border border-gray-100 ml-2 mr-2'/>
            <ArrowLeftOnRectangleIcon className='icon bg-gray-50 rounded-md border border-gray-150'/>
          </div>
        )}
        </div>
      </div>
      )}
    </div>
  )
}

export default Header
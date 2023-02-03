import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import '/src/index.css'
import bg from '/src/assets/bg.mp4'
import logo from '/src/assets/logo.webp'
import accessories from '/src/assets/acessories.webp'
import backpack from '/src/assets/backpack.webp'
import digitalnomad from '/src/assets/digitalnomad.webp'
import clothing from '/src/assets/clothing.webp'
import community from '/src/assets/communitydiscussions.webp'
import find from '/src/assets/findjobs.webp'
import post from '/src/assets/postjobs.webp'
import clothing2 from '/src/assets/clothing2.webp'
import digitalnomad2 from '/src/assets/digitalnomad2.webp'
import backpacks2 from '/src/assets/backpacks2.webp'
import accessories2 from '/src/assets/acessories2.webp'
import dn from '/src/assets/dn.webp'
import funnydn from '/src/assets/funnydn.webp'

const currencies = ['CAD', 'USD', 'AUD', 'EUR', 'GBP']
const navigation = {
  categories: [
    {
      name: 'Our Products',
      featured: [
        {
          name: 'Clothing',
          href: '#',
          imageSrc: clothing,
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Backpacks',
          href: '#',
          imageSrc: backpack,
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
        {
          name: 'Digital Nomad Gear',
          href: '#',
          imageSrc: digitalnomad,
          imageAlt: 'Model wearing minimalist watch with black wristband and white watch face.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc: accessories,
          imageAlt: 'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
      ],
    },
    {
      name: 'Community',
      featured: [
        {
          name: 'Find Remote Jobs',
          href: '#',
          imageSrc: find,
          imageAlt: 'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
        },
        {
          name: 'Post Remote Jobs',
          href: '#',
          imageSrc: post,
          imageAlt: 'Model wearing light heather gray t-shirt.',
        },
        {
          name: 'Community Discussions',
          href: '#',
          imageSrc: community,
          imageAlt:
            'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
        },
        
      ],
    },
  ],
  pages: [
    { name: 'Remote Jobs', href: '#' },
    { name: 'About Us', href: '#' },
  ],
}
const categories = [
  {
    name: 'Clothing',
    href: '#',
    imageSrc: clothing2,
  },
  {
    name: 'Backpacks',
    href: '#',
    imageSrc: backpacks2,
  },
  {
    name: 'DN Gear',
    href: '#',
    imageSrc: digitalnomad2,
  },
  {
    name: 'Accessories',
    href: '#',
    imageSrc: accessories2,
  },
  
]
const collections = [
  {
    name: 'Handcrafted Collection',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg',
    imageAlt: 'Brown leather key ring with brass metal loops and rivets on wood table.',
    description: 'Keep your phone, keys, and wallet together, so you can lose everything at once.',
  },
  {
    name: 'Organized Desk Collection',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg',
    imageAlt: 'Natural leather mouse pad on white desk next to porcelain mug and keyboard.',
    description: 'The rest of the house will still be a mess, but your desk will look great.',
  },
  {
    name: 'Focus Collection',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg',
    imageAlt: 'Person placing task list card into walnut card holder next to felt carrying case on leather desk pad.',
    description: 'Be more productive than enterprise project managers with a single piece of paper.',
  },
]
const footerNavigation = {
  shop: [
    { name: 'Bags', href: '#' },
    { name: 'Tees', href: '#' },
    { name: 'Objects', href: '#' },
    { name: 'Home Goods', href: '#' },
    { name: 'Accessories', href: '#' },
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
  account: [
    { name: 'Manage Account', href: '#' },
    { name: 'Returns & Exchanges', href: '#' },
    { name: 'Redeem a Gift Card', href: '#' },
  ],
  connect: [
    { name: 'Contact Us', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Pinterest', href: '#' },
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected ? 'text-indigo-600 border-indigo-600' : 'text-gray-900 border-transparent',
                              'flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-lg'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel key={category.name} className="space-y-12 px-4 py-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative">
                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                              </div>
                              <a href={item.href} className="mt-6 block text-sm font-medium text-gray-900">
                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  <div className="flow-root">
                    <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                      Create an account
                    </a>
                  </div>
                  <div className="flow-root">
                    <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </a>
                  </div>
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {/* Currency selector */}
                  <form>
                    <div className="inline-block">
                      <label htmlFor="mobile-currency" className="sr-only">
                        Currency
                      </label>
                      <div className="group relative -ml-2 rounded-md border-transparent focus-within:ring-2 focus-within:ring-white">
                        <select
                          id="mobile-currency"
                          name="currency"
                          className="flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-800"
                        >
                          {currencies.map((currency) => (
                            <option key={currency}>{currency}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Hero section */}
      <div className="relative bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <video
            autoPlay={true}
            loop
            muted
            src={bg}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

        {/* Navigation */}
        <header className="relative z-10">
          <nav aria-label="Top">
            {/* Top navigation */}
            <div className="bg-gray-900">
              <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
               

                
              </div>
            </div>

            {/* Secondary navigation */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md backdrop-filter">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                  <div className="flex h-16 items-center justify-between">
                    {/* Logo (lg+) */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center">
                      <a href="#">
                        <span className="sr-only">Your Company</span>
                        <img
                          className="h-16 w-auto"
                          src={logo}
                          alt=""
                        />
                      </a>
                    </div>

                    <div className="hidden h-full lg:flex text-[white] h">
                      {/* Flyout menus */}
                      <Popover.Group className="inset-x-0 bottom-0 px-4">
                        <div className="flex h-full justify-center space-x-8">
                          {navigation.categories.map((category) => (
                            <Popover key={category.name} className="flex">
                              {({ open }) => (
                                <>
                                  <div className="relative flex">
                                    <Popover.Button className="relative z-10 flex items-center justify-center text-sm font-medium text-[white] transition-colors duration-200 ease-out text-main">
                                      {category.name}
                                      <span
                                        className={classNames(
                                          open ? 'bg-white' : '',
                                          'absolute inset-x-0 -bottom-px h-0.5 transition duration-200 ease-out'
                                        )}
                                        aria-hidden="true"
                                      />
                                    </Popover.Button>
                                  </div>

                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                      {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                      <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                                      <div className="relative bg-white">
                                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                          <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                                            {category.featured.map((item) => (
                                              <div key={item.name} className="group relative">
                                                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                                  <img
                                                    src={item.imageSrc}
                                                    alt={item.imageAlt}
                                                    className="object-cover object-center"
                                                  />
                                                </div>
                                                <a href={item.href} className="mt-4 block font-medium text-gray-900">
                                                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                                                  {item.name}
                                                </a>
                                                <p aria-hidden="true" className="mt-1">
                                                  Shop now
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </Popover.Panel>
                                  </Transition>
                                </>
                              )}
                            </Popover>
                          ))}

                          {navigation.pages.map((page) => (
                            <a
                              key={page.name}
                              href={page.href}
                              className="flex items-center text-sm font-medium text-[white]"
                            >
                              {page.name}
                            </a>
                          ))}
                        </div>
                      </Popover.Group>
                    </div>

                    {/* Mobile menu and search (lg-) */}
                    <div className="flex flex-1 items-center lg:hidden text-[white] hover:text-koromiko-main">
                      <button type="button" className="-ml-2 p-2 text-[white]" onClick={() => setMobileMenuOpen(true)}>
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Search */}
                      <a href="#" className="ml-2 p-2 text-[white]">
                        <span className="sr-only">Search</span>
                        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                      </a>
                    </div>

                    {/* Logo (lg-) */}
                    <a href="#" className="lg:hidden">
                      <span className="sr-only">Your Company</span>
                      <img src={logo} alt="" className="h-8 w-auto" />
                    </a>

                    <div className="flex flex-1 items-center justify-end">
                    

                      <div className="flex items-center lg:ml-8">
                        {/* Help */}
                       
                       

                        {/* Cart */}
                        <div className="ml-4 flow-root lg:ml-8">
                          <a href="#" className="group -m-2 flex items-center p-2">
                            <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-[white]" aria-hidden="true" />
                            <span className="ml-2 text-sm font-medium text-[white]">2</span>
                            <span className="sr-only">items in cart, view bag</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center py-10 px-6 text-center h-[100vh] lg:px-0">
        <img
                          className="h-[200px] w-auto"
                          src={logo}
                          alt=""
                        />
                      
          <h1 className="text-4xl font-bold tracking-tight text-[white] lg:text-4xl capitalize text-koromiko-main"> Go <span className='text-[white]'>Everywhere, </span> See <span className='text-[white]'>Everything </span></h1>
          <p className="mt-4 text-l text-[white] capitalize w-[105%]">
            A gathering place for digital nomads:  Jobs, Gear,  travel guides & A Like-minded Community
          </p>
          <div className="flex justify-between align-bottom gap-5 pt-20">
          <a
            href="#"
            className="mt-8 inline-block rounded-md border  bg-white py-3 px-8 text-base font-medium bg-koromiko-main text-[white] hover:bg-[white] hover:text-[black] "> 
            Find Remote Jobs
          </a>
          <a
            href="#"
            className="mt-8 inline-block rounded-md bg-white py-3 px-8 text-base font-medium bg-[white] text-[black] hover:bg-koromiko-main border border-[black]"
          >
            Visit Shop
          </a>
          </div>
        </div>
      </div>

      <main>
        {/* Category section */}
        <section aria-labelledby="category-heading" className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8">
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2 id="category-heading" className="text-2xl font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="mt-4 flow-root">
            <div className="-my-2">
              <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
                <div className="min-w-screen-xl absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0 ">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto text-koromiko-main  p-4"
                    >
                      <span aria-hidden="true" className="absolute inset-0 mb-14">
                        <img src={category.imageSrc} alt="" className="h-full w-full object-cover object-center" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                      />
                      <span className="relative mt-auto text-center text-xl font-bold ">{category.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 px-4 sm:hidden">
            <a href="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </section>

        {/* Featured section */}
        <section
          aria-labelledby="social-impact-heading"
          className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src={funnydn}
                alt=""
                className="h-full w-full object-cover object-center opacity-80 bg-[black]"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 id="social-impact-heading" className="text-3xl font-bold tracking-tight sm:text-4xl text-koromiko-main">
                  <span className="block sm:inline">Find Remote Jobs,</span> &nbsp;
                  <span className="block sm:inline">Hire Remote Workers</span>
                </h2>
                <p className="mt-3 text-xl text-[white] capitalize font-bold">
                  Leverage our community. Find your dream job, find you dream employee. 
                </p>
              
                <a
                  href="#"
                  className="mt-8 block w-full rounded-md border border-transparent bg-white py-3 px-8   text-koromiko-main font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Visit Job Center
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Collection section */}
        <section
          aria-labelledby="collection-heading"
          className="mx-auto max-w-xl px-4 pt-24 sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8"
        >
          <h2 id="collection-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Shop by Collection
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Each season, we collaborate with world-class designers to create a collection inspired by the natural world.
          </p>

          <div className="mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
            {collections.map((collection) => (
              <a key={collection.name} href={collection.href} className="group block">
                <div
                  aria-hidden="true"
                  className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg group-hover:opacity-75 lg:aspect-w-5 lg:aspect-h-6"
                >
                  <img
                    src={collection.imageSrc}
                    alt={collection.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{collection.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{collection.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Featured section */}
        <section aria-labelledby="comfort-heading" className="mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src="https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-02.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 id="comfort-heading" className="text-3xl font-bold tracking-tight text-[white] sm:text-4xl">
                  Simple productivity
                </h2>
                <p className="mt-3 text-xl text-[white]">
                  Endless tasks, limited hours, a single piece of paper. Not really a haiku, but we're doing our best
                  here. No kanban boards, burndown charts, or tangled flowcharts with our Focus system. Just the
                  undeniable urge to fill empty circles.
                </p>
                <a
                  href="#"
                  className="mt-8 block w-full rounded-md border border-transparent bg-white py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Shop Focus
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-gray-900">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium  text-koromiko-main">Shop</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.shop.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a href={item.href} className="text-gray-300 hover:text-[white]">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium  text-koromiko-main">Company</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a href={item.href} className="text-gray-300 hover:text-[white]">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium  text-koromiko-main">Account</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.account.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a href={item.href} className="text-gray-300 hover:text-[white]">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium  text-koromiko-main">Connect</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.connect.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a href={item.href} className="text-gray-300 hover:text-[white]">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 md:mt-16 xl:mt-0">
              <h3 className="text-sm font-medium  text-koromiko-main">Sign up for our newsletter</h3>
              <p className="mt-6 text-sm text-gray-300">The latest deals and savings, sent to your inbox weekly.</p>
              <form className="mt-2 flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="text"
                  autoComplete="email"
                  required
                  className="w-full min-w-0 appearance-none rounded-md border border-white bg-white py-2 px-4 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                />
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-base font-medium  text-koromiko-main"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 py-10">
            <p className="text-sm text-gray-400">Copyright &copy; 2021 Your Company, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
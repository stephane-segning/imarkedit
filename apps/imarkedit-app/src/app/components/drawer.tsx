import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { twMerge } from 'tailwind-merge';
import { NavLink, Outlet } from 'react-router-dom';
import { usePlatform } from '../services/platform';
import { useFindManyNote } from '../services/api/hooks';
import { DrawerLink } from './drawer-link';
import { ListGroup } from './list';

const navigation = [
  { name: 'Bookmarks', href: 'bookmarks', icon: BookmarkIcon, current: true },
  { name: 'Notes', href: 'notes', icon: PaperClipIcon, current: false }
];
const userNavigation = [
  { name: 'Your profile', href: '/settings#profile' },
  { name: 'Sign out', href: '#' }
];

export function Container() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const platform = usePlatform();
  const { data: recentNotes$ } = useFindManyNote();
  const recentNotes = recentNotes$ ?? [];

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=white"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <ListGroup>
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <DrawerLink to={'/' + item.href}>
                              <item.icon className="icon" aria-hidden="true" />
                              {item.name}
                            </DrawerLink>
                          </li>
                        ))}
                      </ListGroup>

                      <ListGroup heading="Your notes">
                        {recentNotes.map((note) => (
                          <li key={note.id}>
                            <NavLink to={'/notes/' + note.id}>
                              <span className="truncate">{note.title}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ListGroup>

                      <ListGroup className="mt-auto">
                        <li>
                          <DrawerLink to="/settings">
                            <Cog6ToothIcon className="icon" aria-hidden="true" />
                            Settings
                          </DrawerLink>
                        </li>
                        <li>
                          <DrawerLink>
                            <DevicePhoneMobileIcon className="icon" aria-hidden="true" />
                            You're on {platform}
                          </DrawerLink>
                        </li>
                      </ListGroup>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=white"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <ListGroup>
                {navigation.map((item) => (
                  <li key={item.name}>
                    <DrawerLink to={'/' + item.href}>
                      <item.icon className="icon" aria-hidden="true" />
                      {item.name}
                    </DrawerLink>
                  </li>
                ))}
              </ListGroup>

              <ListGroup heading="Your notes">
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <DrawerLink to={'/notes/' + note.id}>
                      <span className="truncate">{note.title}</span>
                    </DrawerLink>
                  </li>
                ))}
              </ListGroup>

              <ListGroup className="mt-auto">
                <li>
                  <DrawerLink to="/settings">
                    <Cog6ToothIcon className="icon" aria-hidden="true" />
                    Settings
                  </DrawerLink>
                </li>
                <li>
                  <DrawerLink>
                    <DevicePhoneMobileIcon className="icon" aria-hidden="true" />
                    You're on {platform}
                  </DrawerLink>
                </li>
              </ListGroup>

            </ul>
          </nav>
        </div>
      </div>

      <div className="md:pl-72">
        <div
          className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 md:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="h-6 w-px bg-gray-900/10 md:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch md:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 md:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="hidden md:block md:h-6 md:w-px md:bg-gray-900/10"
                aria-hidden="true"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="hidden md:flex md:items-center">
                    <span
                      className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      aria-hidden="true"
                    >
                      Tom Cook
                    </span>
                    <ChevronDownIcon
                      className="ml-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <NavLink
                            to={item.href}
                            className={twMerge(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            {item.name}
                          </NavLink>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

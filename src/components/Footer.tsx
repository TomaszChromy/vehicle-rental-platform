'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* O firmie */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                {/* Modern logo */}
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  VehicleRent
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Nowoczesna platforma wynajmu pojazdów oferująca samochody, rowery i hulajnogi w całej Polsce.
                <span className="text-orange-300 font-semibold">Szybko, bezpiecznie i wygodnie.</span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">O firmie</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    O nas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Nasza misja
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Zespół
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Kariera
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Usługi */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Usługi</h3>
            <ul className="space-y-4">
              <li>
                <a href="/booking" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Rezerwacja
                </a>
              </li>
              <li>
                <a href="/map" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Mapa pojazdów
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Centrum pomocy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-all duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Regulamin
                </a>
              </li>
            </ul>
          </div>

          {/* Śledź nas */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Śledź nas</h3>
            <div className="flex space-x-4 mb-8">
              {/* Facebook */}
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                  {/* Facebook background */}
                  <circle cx="24" cy="24" r="24" fill="#1877F2"/>

                  {/* Facebook 'f' */}
                  <path d="M26.5 25.5H30L31 20.5H26.5V18C26.5 16.47 26.5 15 29 15H31V10.87C30.42 10.8 28.837 10.5 27.5 10.5C24.24 10.5 22 12.305 22 17.5V20.5H18V25.5H22V37.5H26.5V25.5Z" fill="white"/>
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                  {/* Twitter background */}
                  <circle cx="24" cy="24" r="24" fill="#1DA1F2"/>

                  {/* Twitter bird */}
                  <path d="M36 16.5C35 17 34 17.2 33 17.3C34 16.7 34.8 15.8 35.1 14.7C34.1 15.3 33 15.7 31.8 15.9C30.8 14.8 29.3 14.2 27.7 14.2C24.6 14.2 22.1 16.7 22.1 19.8C22.1 20.3 22.2 20.7 22.3 21.1C17.9 20.9 14 18.7 11.5 15.3C11 16.1 10.7 17 10.7 18C10.7 19.9 11.7 21.5 13.2 22.5C12.3 22.5 11.5 22.2 10.8 21.8V21.9C10.8 24.6 12.7 26.9 15.3 27.4C14.8 27.5 14.3 27.6 13.7 27.6C13.3 27.6 12.9 27.6 12.5 27.5C13.3 29.8 15.4 31.4 17.9 31.4C16 32.9 13.6 33.8 11 33.8C10.5 33.8 10 33.8 9.5 33.7C12 35.3 15 36.2 18.2 36.2C27.7 36.2 32.9 27.7 32.9 20.5C32.9 20.2 32.9 19.9 32.9 19.6C33.9 18.9 34.8 18 35.5 17" fill="white"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                  {/* Instagram gradient background */}
                  <defs>
                    <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#833AB4"/>
                      <stop offset="50%" stopColor="#FD1D1D"/>
                      <stop offset="100%" stopColor="#FCB045"/>
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="24" fill="url(#instagramGradient)"/>

                  {/* Instagram camera */}
                  <rect x="12" y="12" width="24" height="24" rx="6" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="24" cy="24" r="6" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="30" cy="18" r="1.5" fill="white"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                  {/* LinkedIn background */}
                  <circle cx="24" cy="24" r="24" fill="#0077B5"/>

                  {/* LinkedIn 'in' */}
                  <rect x="12" y="18" width="4" height="18" fill="white"/>
                  <circle cx="14" cy="14" r="2" fill="white"/>
                  <path d="M20 18V36H24V27C24 25 25 24 27 24C29 24 30 25 30 27V36H34V26C34 22 32 20 28 20C26 20 24 21 23 22V18H20Z" fill="white"/>
                </svg>
              </a>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-white mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Zapisz się do naszego newslettera i otrzymuj najnowsze oferty oraz promocje.
              </p>
              <div className="flex rounded-xl overflow-hidden shadow-lg">
                <input
                  type="email"
                  placeholder="Twój email"
                  className="flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                />
                <button
                  type="submit"
                  title="Zapisz się do newslettera"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
              <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
                VehicleRent
              </div>
              <p className="text-gray-400 mb-2 text-center md:text-left">
                © {currentYear} VehicleRent. Wszystkie prawa zastrzeżone.
              </p>
              <p className="text-xs text-gray-500 font-bold tracking-wider">
                POWERED BY TOMASZ CHROMY
              </p>
            </div>

            <div className="flex flex-col space-y-4 text-sm">
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-105">
                  Warunki użytkowania
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-105">
                  Polityka prywatności
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-105">
                  Cookies
                </a>
                <a href="/admin" className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold hover:from-orange-400 hover:to-red-400 transition-all duration-300 hover:scale-105">
                  Panel Admin
                </a>
              </div>
              <p className="text-gray-500 text-xs text-center md:text-right italic">
                Ta strona jest wersją pokazową i nie stanowi oferty handlowej
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">MyApp</div>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link href="/" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/sign-in" className="hover:text-blue-600 transition">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-blue-600 transition">
                Sign Up
              </Link>
            </li>
            <li>
              <Link href="/manage" className="hover:text-blue-600 transition">
                Manage
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex items-center justify-center mt-20 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MyApp 👋</h1>
          <p className="text-gray-600 text-lg">
            This is the homepage. Use the navigation bar to sign in, sign up, or visit the admin page.
          </p>
        </div>
      </main>
    </div>
  );
}

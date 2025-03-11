const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-200">
      <main className="flex-grow p-8">
        {/* Welcome Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-green-700">
            Welcome to <span className="text-green-600">FarmConnect</span>
          </h1>
          <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
            A platform to connect buyers, sellers, and renters for farm-related products and services.
          </p>
        </section>

        {/* Static Products Showcase */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold text-green-600 text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Card 1 */}
            <div className="p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <img
                src="https://imgs.search.brave.com/0LS4xgm4euw72lb_qvwxjAG1HKClXLXFndHk2ql3NFQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9yZW5k/ZXIuZmluZWFydGFt/ZXJpY2EuY29tL2lt/YWdlcy9yZW5kZXJl/ZC9zZWFyY2gvcHJp/bnQvOC81LjUvYnJl/YWsvaW1hZ2VzLW1l/ZGl1bS01L3RvbWF0/by1ncmVlbmhvdXNl/LXNqby5qcGc"
                alt="Organic Tomatoes"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700">Organic Tomatoes</h3>
              <p className="mt-2 text-gray-600">Freshly picked organic tomatoes from local farms.</p>
              <p className="mt-2 text-green-700 font-bold">₹50/kg</p>
            </div>
            {/* Product Card 2 */}
            <div className="p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <img
                src="https://imgs.search.brave.com/BDu-oeKapNAJkxitvqynxcC0LVC_MoKb7C_DVzNmRjQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcz/OTQwOTY4L3Bob3Rv/L21pbGsuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPW9fN2hy/WkVZVVRCVktPMC1V/Vnk1Z1FOWldYak1q/dXdsd0ZvVnh6d05x/VVE9"
                alt="Fresh Milk"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700">Fresh Milk</h3>
              <p className="mt-2 text-gray-600">100% pure and fresh milk from grass-fed cows.</p>
              <p className="mt-2 text-green-700 font-bold">₹60/liter</p>
            </div>
            {/* Product Card 3 */}
            <div className="p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <img
                src="https://imgs.search.brave.com/dr-w0BTiI4JwT3ywo3Q5T9_OiLz9Efuh6NPT8LTGkWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE5/NTAyMDAzMy9waG90/by9kZWFsZXJzaGlw/LXRyYWN0b3JzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1u/Wm9faVhLOGpuUnhO/bHNiZ29EX2ZoNlFL/blZuSDJ1U2J5Vzhl/V2hzbmpNPQ"
                alt="Farm Equipment Rental"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700">Farm Equipment Rental</h3>
              <p className="mt-2 text-gray-600">Rent modern farm equipment for increased productivity.</p>
              <p className="mt-2 text-green-700 font-bold">Starting at ₹500/day</p>
            </div>
            {/* Product Card 4 */}
            <div className="p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <img
                src="https://imgs.search.brave.com/SnRYwRP5WtAJ6D1g1mPC3tG-uHJIRyXRYkHkM5c0-GI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Ym9idmlsYS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MDkvVGhlLUJlc3Qt/T3JnYW5pYy1GZXJ0/aWxpemVyLU9wdGlv/bnMuanBnP3F1YWxp/dHk9ODUmdz0xMjAw"
                alt="Organic Fertilizers"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700">Organic Fertilizers</h3>
              <p className="mt-2 text-gray-600">Boost your crop yield with eco-friendly fertilizers.</p>
              <p className="mt-2 text-green-700 font-bold">₹400/pack</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold text-green-600 text-center mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-8 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <h3 className="text-2xl font-semibold text-green-700">Buy & Sell</h3>
              <p className="mt-2 text-gray-600">
                Connect buyers and sellers for seamless farm product transactions.
              </p>
            </div>
            <div className="p-8 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <h3 className="text-2xl font-semibold text-green-700">Rent Equipment</h3>
              <p className="mt-2 text-gray-600">
                Save money by renting farm tools and machinery when needed.
              </p>
            </div>
            <div className="p-8 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
              <h3 className="text-2xl font-semibold text-green-700">Community Support</h3>
              <p className="mt-2 text-gray-600">
                Get advice, share knowledge, and collaborate with other farmers.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center bg-green-50 py-16">
          <h2 className="text-4xl font-semibold text-green-700 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Join our growing community and start trading farm products today.
          </p>
          <a
            href="/signup"
            className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition"
          >
            Get Started
          </a>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

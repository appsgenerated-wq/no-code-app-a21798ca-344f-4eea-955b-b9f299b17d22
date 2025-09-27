import React, { useState, useEffect, useCallback } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', cuisine: 'Other' });
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '' });

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Restaurant').find({ include: ['owner'] });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    const fetchDishes = async () => {
      if (selectedRestaurant) {
        try {
          const response = await manifest.from('Dish').find({ filter: { restaurant: selectedRestaurant.id } });
          setDishes(response.data);
        } catch (error) {
          console.error('Failed to fetch dishes:', error);
        }
      }
    };
    fetchDishes();
  }, [selectedRestaurant, manifest]);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await manifest.from('Restaurant').create(newRestaurant);
      setNewRestaurant({ name: '', description: '', cuisine: 'Other' });
      fetchRestaurants();
    } catch (error) {
      console.error('Failed to create restaurant:', error);
    }
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    try {
      await manifest.from('Dish').create({ ...newDish, price: parseFloat(newDish.price), restaurant: selectedRestaurant.id });
      setNewDish({ name: '', description: '', price: '' });
      const response = await manifest.from('Dish').find({ filter: { restaurant: selectedRestaurant.id } });
      setDishes(response.data);
    } catch (error) {
      console.error('Failed to create dish:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FlavorFind Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}!</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Admin Panel</a>
            <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Restaurant</h2>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <input type="text" placeholder="Restaurant Name" value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} required className="w-full p-2 border rounded-md" />
                <textarea placeholder="Description" value={newRestaurant.description} onChange={e => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full p-2 border rounded-md"></textarea>
                <select value={newRestaurant.cuisine} onChange={e => setNewRestaurant({...newRestaurant, cuisine: e.target.value})} className="w-full p-2 border rounded-md">
                  {['Italian', 'Mexican', 'Asian', 'American', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">Add Restaurant</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Restaurants</h2>
              {isLoading ? <p>Loading...</p> : (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {restaurants.map(r => (
                    <li key={r.id} onClick={() => setSelectedRestaurant(r)} className={`p-3 rounded-md cursor-pointer transition-colors ${selectedRestaurant?.id === r.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                      <p className="font-semibold text-gray-800">{r.name}</p>
                      <p className="text-sm text-gray-500">{r.cuisine}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            {selectedRestaurant ? (
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedRestaurant.name}</h2>
                <p className="text-gray-600 mb-2">Owned by: {selectedRestaurant.owner.name}</p>
                <p className="text-gray-500 mb-6">{selectedRestaurant.description}</p>
                <hr className="my-6" />
                
                {selectedRestaurant.owner.id === user.id && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-lg font-semibold mb-3">Add a Dish</h3>
                        <form onSubmit={handleCreateDish} className="flex items-end gap-4">
                            <input type="text" placeholder="Dish Name" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} required className="flex-grow p-2 border rounded-md" />
                            <input type="number" step="0.01" placeholder="Price" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} required className="w-24 p-2 border rounded-md" />
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">Add Dish</button>
                        </form>
                    </div>
                )}

                <h3 className="text-xl font-semibold mb-4">Menu</h3>
                {dishes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dishes.map(d => (
                      <div key={d.id} className="border p-4 rounded-lg">
                        <p className="font-bold">{d.name}</p>
                        <p className="text-sm text-gray-600">{d.description}</p>
                        <p className="mt-2 font-semibold text-green-700">${d.price}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No dishes found for this restaurant.</p>}
              </div>
            ) : <p className="text-center text-gray-500 py-20">Select a restaurant to see details.</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

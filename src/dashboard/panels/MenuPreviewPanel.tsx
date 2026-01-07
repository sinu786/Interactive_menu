import { useState } from 'react';
import { menuItems, categories } from '../../data/menu';
import { restaurantConfig } from '../../data/restaurant.config';

export function MenuPreviewPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewMode, setPreviewMode] = useState<'list' | 'customer'>('list');

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Menu Management</h3>
          <p className="text-sm text-stone-500">{menuItems.length} items across {categories.length} categories</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                previewMode === 'list' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setPreviewMode('customer')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                previewMode === 'customer' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              Customer View
            </button>
          </div>
          
          <button className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors">
            + Add Item
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {previewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase">Item</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase">Calories</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase">3D Model</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-xl">
                        🍽️
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className={`scale-75 ${item.veg ? 'badge-veg' : 'badge-nonveg'}`} />
                          {item.spicyLevel > 0 && (
                            <span className="text-xs">{'🌶️'.repeat(item.spicyLevel)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-stone-900">
                      {restaurantConfig.currencySymbol}{item.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-stone-600">{item.calories} cal</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Customer Preview */
        <div className="bg-white rounded-2xl p-6">
          <div className="max-w-md mx-auto">
            {/* Phone Frame */}
            <div className="border-8 border-stone-900 rounded-[3rem] overflow-hidden bg-stone-50 shadow-2xl">
              {/* Status Bar */}
              <div className="bg-stone-900 text-white text-xs px-6 py-2 flex justify-between">
                <span>9:41</span>
                <div className="flex gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.5 0-8.27 2.57-10.02 6.32-.09.2-.09.43 0 .64C3.73 13.43 7.5 16 12 16s8.27-2.57 10.02-6.32c.09-.2.09-.43 0-.64C20.27 5.57 16.5 3 12 3zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="7" width="18" height="10" rx="2"/>
                    <path d="M22 10v4"/>
                  </svg>
                </div>
              </div>

              {/* App Content */}
              <div className="h-[500px] overflow-y-auto bg-stone-50">
                {/* Header */}
                <div className="bg-white p-4 border-b border-stone-200 sticky top-0 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center">
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{restaurantConfig.name}</p>
                      <p className="text-xs text-stone-500">{restaurantConfig.tagline}</p>
                    </div>
                  </div>
                  
                  {/* Category Pills */}
                  <div className="flex gap-2 overflow-x-auto">
                    {['All', ...categories.slice(0, 4)].map((cat, i) => (
                      <span
                        key={cat}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          i === 0 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 space-y-3">
                  {menuItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-3 flex gap-3 shadow-sm">
                      <div className="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-stone-900 text-sm truncate">{item.name}</p>
                          <div className={`scale-75 ${item.veg ? 'badge-veg' : 'badge-nonveg'}`} />
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-stone-400">{item.calories} cal</span>
                          <span className="font-bold text-stone-900 text-sm">
                            {restaurantConfig.currencySymbol}{item.price.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="p-4 pb-8">
                  <div className="bg-stone-900/80 text-white text-xs py-2 px-4 rounded-full text-center">
                    Tap any item for 3D view & AR
                  </div>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="bg-white py-2 flex justify-center">
                <div className="w-32 h-1 bg-stone-900 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
            <div className="w-24 h-24 bg-stone-900 rounded-lg flex items-center justify-center">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="3" height="3"/>
                <rect x="18" y="14" width="3" height="3"/>
                <rect x="14" y="18" width="3" height="3"/>
                <rect x="18" y="18" width="3" height="3"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold mb-2">Your Menu QR Code</h4>
            <p className="text-stone-300 mb-4">
              Print this QR code on your tables for customers to instantly access your AR menu
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button className="px-4 py-2 bg-white text-stone-900 rounded-lg font-medium text-sm hover:bg-stone-100 transition-colors">
                Download PNG
              </button>
              <button className="px-4 py-2 bg-stone-800 text-white rounded-lg font-medium text-sm hover:bg-stone-600 transition-colors">
                Download PDF
              </button>
              <button className="px-4 py-2 bg-stone-800 text-white rounded-lg font-medium text-sm hover:bg-stone-600 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { EmptyState } from '../../components/common/EmptyState';

export const WishlistPage: React.FC = () => {
  const { items, removeItem } = useWishlist();

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Saved Wishlist</h1>
          <p className="text-xs text-stone-500">Your favorite tours, destinations, and Sri Lankan activities.</p>
        </div>

        <Link
          to="/tours"
          className="text-xs font-bold text-[#0D3B2E] hover:underline"
        >
          Explore More &rarr;
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeItem(item.targetId)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-md transition-colors"
                  title="Remove from Saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0D3B2E] text-[#E5C378] capitalize">
                  {item.type}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#082F24] line-clamp-1">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-xs text-stone-500 line-clamp-1">{item.subtitle}</p>
                  )}
                  {item.duration && (
                    <p className="text-xs text-[#8C6D2B] font-semibold mt-1">{item.duration}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  {item.price ? (
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">From</span>
                      <span className="font-serif text-lg font-bold text-[#082F24]">${item.price.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <Link
                    to={item.type === 'tour' ? `/tours/${item.slug}` : item.type === 'destination' ? `/destinations/${item.slug}` : `/activities/${item.slug}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Click the heart icon on any tour, destination, or activity to save it to your trip wishlist."
          actionText="Discover Tours"
          actionHref="/tours"
        />
      )}

    </div>
  );
};

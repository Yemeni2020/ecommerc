// Persistent wishlist save counts (simulates server-side aggregation)
// In a real app this would be a DB query; here we use localStorage + seed data.

const KEY = "wishlist_counts"; // Corrected casing to KEY

// Seed with some initial counts for demo purposes
const SEED = {
    "carbon-phone-mount" : 487,
    "leather-seat-cover" : 312,
    "led-ambient-kit": 256,
    "alloy-wheel-set": 198,
};

// Load the wishlist counts from localStorage, merging with seed data
function load(){
    try { // Corrected casing to KEY
        const stored = localStorage.getItem(KEY);// Load from localStorage
        if(stored) return {...SEED, ...JSON.parse(stored)}; // Merge with seed data
    }catch{} // If parsing fails, ignore and use seed
    return {...SEED}; // Return seed data if no stored data
};
/*** 
 * Saves the wishlist counts to localStorage
 * @param {Object} counts - The wishlist counts to save
 */
function save(counts){
    try{
        localStorage.setItem(KEY, JSON.stringify(counts));
    } catch{}
}
// Get the current wishlist counts for all products
export function getCounts(){
    return load();
};

// Increment the wishlist count for a product and save it
export function incrementCount(productId){
    const counts = load();
    counts[productId] = (counts[productId] || 0) + 1;
    save(counts);
};

// Decrement the wishlist count for a product and save it
export function decrementCount(productId){
    const counts = load();
    counts[productId] = Math.max((counts[productId] || 0) - 1, 0); // Prevent negative counts
    save(counts);
};

// Get the sorted product IDs by wishlist count
export function getSortedProductsByWishCount(productIds){
    const counts = load();
    return productIds
        .map((id) => ({id, count: counts[id] || 0})) // Map to objects with id and count
        .sort((a, b) => b.count - a.count); // Sort descending by count
}
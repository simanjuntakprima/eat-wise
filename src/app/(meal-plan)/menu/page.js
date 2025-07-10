import FoodModal from "./foodModal"


const foods = [
  {
    title: 'Nasi Goreng',
    image: '/nasi-goreng.jpg',
    nutrition: '500 kalori',
    ingredients: ['Nasi', 'Telur', 'Bawang'],
    steps: ['Panaskan wajan', 'Masukkan bahan', 'Aduk dan sajikan'],
  },
 
]

export default function WeeklyMenu() {
  return (
    <div className="p-6">
      <p className="mb-2 font-medium bg-yellow-100 px-2 py-1 w-fit rounded text-sm">Week-1</p>

      <FoodModal foods={foods} />

      <p className="text-sm text-gray-700 mt-6">Estimated Daily Cost = Rp... .</p>
    </div>
  )
}

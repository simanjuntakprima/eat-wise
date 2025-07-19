import ExportMealPlanPDFButton from '@/app/_components/pdf/ExportMealPlanPDFButton';
import { prepareMealJson } from '@/app/utils/prepareMealJson';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import FoodModal from '../foodModal';
import { getMealPlanHistoryDetail } from './action';

export default async function HistMenuDetail({ params }) {
  const { id } = await params;
  const itemsMenu = await getMealPlanHistoryDetail(id);

  if (!itemsMenu?.length) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">No meal details found.</p>
      </div>
    );
  }

  const dayData = itemsMenu.map((d) => {
    const breakfast = prepareMealJson(d.breakfast);
    const lunch = prepareMealJson(d.lunch);
    const dinner = prepareMealJson(d.dinner);

    const cards = [
      { label: 'Breakfast', food: breakfast },
      { label: 'Lunch', food: lunch },
      { label: 'Dinner', food: dinner },
    ].filter((c) => c.food);

    return {
      value: `day-${d.day}`,
      label: `Day ${d.day}`,
      cards,
    };
  });

  const defaultValue = dayData[0]?.value ?? 'day-1';

  return (
    <div className="w-full p-6">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-[#dfd5c0] p-0">
          {dayData.map((d) => (
            <TabsTrigger
              key={d.value}
              value={d.value}
              className="bg-background data-[state=active]:border-primary h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {dayData.map((d) => (
          <TabsContent key={d.value} value={d.value} className="grid grid-cols-3 gap-4">
            {d.cards.map((c) => (
              <div key={c.label} className="flex flex-col">
                <p className="mt-4 mb-4 font-semibold text-gray-500 text-center">{c.label}</p>
                <FoodModal foods={[c.food]} />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-10 flex w-full justify-end">
        <ExportMealPlanPDFButton itemsMenu={itemsMenu} />
      </div>
    </div>
  );
}

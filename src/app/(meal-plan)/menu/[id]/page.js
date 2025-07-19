import FoodModal from "../foodModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMealPlanHistoryDetail } from "./action";
import { prepareMealJson } from "@/app/utils/prepareMealJson";

export default async function HistMenuDetail({ params: { id } }) {
  const itemsMenu = await getMealPlanHistoryDetail(id); 

  if (!itemsMenu?.length) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">No meal details found.</p>
      </div>
    );
  }

  const dayData = itemsMenu.map((d) => {
    const breakfast = prepareMealJson(d.breakfast);
    const lunch = prepareMealJson(d.lunch);
    const dinner = prepareMealJson(d.dinner);

    const cards = [
      { label: "Breakfast", food: breakfast },
      { label: "Lunch", food: lunch },
      { label: "Dinner", food: dinner },
    ].filter((c) => c.food); 

    return {
      value: `day-${d.day}`,
      label: `Day ${d.day}`,
      cards,
    };
  });

  const defaultValue = dayData[0]?.value ?? "day-1";

  return (
    <div className="m-auto flex w-full items-start justify-center rounded-2xl bg-[#ffffff] p-24">
      <div className="w-full max-w-6xl rounded-xl bg-[#ffffff] p-8">
        <Tabs defaultValue={defaultValue} className="w-full">
          <TabsList className="no-scrollbar flex w-full gap-2 overflow-x-auto bg-[#DED2B3] p-0">
            {dayData.map((d) => (
              <TabsTrigger
                key={d.value}
                value={d.value}
                className="min-w-[80px] flex-1 border-b-2 border-[#DED2B3] px-4 py-2 text-sm font-bold text-gray-600 data-[state=active]:border-[#494236] data-[state=active]:text-zinc-950"
              >
                {d.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {dayData.map((d) => (
            <TabsContent key={d.value} value={d.value} className="mt-6">
              <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                {d.cards.map((c) => (
                  <p key={c.label} className="font-semibold text-gray-600">
                    {c.label}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {d.cards.map((c) => (
                  <div
                    key={c.label}
                    className="flex flex-col items-center justify-center rounded-lg bg-[#DED2B3] p-6 transition-all hover:shadow-md"
                  >
                    <FoodModal foods={[c.food]} />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

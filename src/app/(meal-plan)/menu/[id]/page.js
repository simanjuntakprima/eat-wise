import FoodModal from "../foodModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMealPlanHistoryDetail } from "./action";
import { prepareMealJson } from "@/app/utils/prepareMealJson";

export default async function HistMenuDetail({ params: { id } }) {
  const itemsMenu = await getMealPlanHistoryDetail(id); 
  console.log("ini item menu yawww", itemsMenu);

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
    <div className="p-6">
      <Tabs defaultValue={defaultValue} className="w-full max-w-xl">
        <TabsList className="flex flex-wrap gap-1">
          {dayData.map((d) => (
            <TabsTrigger key={d.value} value={d.value}>
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {dayData.map((d) => (
          <TabsContent key={d.value} value={d.value}>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {d.cards.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center gap-2 bg-yellow-100 px-4 py-3 rounded"
                >
                  <p className="font-medium text-sm">{c.label}</p>
                  <FoodModal foods={[c.food]} />
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

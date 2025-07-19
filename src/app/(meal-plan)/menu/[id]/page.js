import FoodModal from "../foodModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMealPlanHistoryDetail } from "./action";
import { prepareMealJson } from "@/app/utils/prepareMealJson";
import ExportMealPlanPDFButton from "@/app/_components/pdf/ExportMealPlanPDFButton";

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
    <div className="p-6 w-full max-w-xl" >
      <Tabs defaultValue={defaultValue} className="w-full max-w-xl">
        <TabsList className="w-full p-0 bg-[#dfd5c0] justify-start border-b rounded-none">          
          {dayData.map((d) => (
            <TabsTrigger 
              key={d.value} value={d.value}
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary">
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {dayData.map((d) => (
          <TabsContent key={d.value} value={d.value}>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 text-center font-semibold text-gray-500 mb-4">
              {d.cards.map((c) => (
                <p key={c.label}>{c.label}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center w-full">
              {d.cards.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center justify-center bg-yellow-100 rounded-lg p-4 w-64 h-40 shadow"
                >
                  <FoodModal foods={[c.food]} />
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
        <div className="mt-10 w-full flex justify-end">
          <ExportMealPlanPDFButton itemsMenu={itemsMenu}/>
        </div>
    </div>
  );
}

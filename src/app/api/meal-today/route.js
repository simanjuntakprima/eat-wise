import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

function toStartOfDay(d) {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function computeDates(plan) {
  const start = plan.startDate ? new Date(plan.startDate) : new Date(plan.createdAt);
  const end = plan.endDate ? new Date(plan.endDate) : new Date(start.getTime() + (plan.days - 1) * 24 * 60 * 60 * 1000);
  return { startDate: start, endDate: end };
}

function mapMeal(jsonObj) {
  if (!jsonObj) return null;
  const title = jsonObj.dishName || jsonObj.name || jsonObj.title || 'Untitled Dish';
  return { title };
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Not authenticated (no session cookie).' }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionCookie },
    select: { id: true, userId: true, expiresAt: true },
  });

  if (!session) {
    return NextResponse.json({ error: 'Session not found.' }, { status: 401 });
  }

  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
  }

  const userId = session.userId;
  const plans = await prisma.mealPlan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      title: true,
      days: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!plans.length) {
    return NextResponse.json({
      mealData: null,
      plan: null,
      message: 'No meal plans found. Please generate one.',
    });
  }

  const today = toStartOfDay(new Date());

  let activePlan = null;
  for (const p of plans) {
    const { startDate, endDate } = computeDates(p);
    const start = toStartOfDay(startDate);
    const end = toStartOfDay(endDate);
    if (today >= start && today <= end) {
      activePlan = { ...p, startDate: start, endDate: end };
      break;
    }
  }

  if (!activePlan) {
    return NextResponse.json({
      mealData: null,
      plan: null,
      message: 'No active meal plan for today. Generate or start a new plan.',
    });
  }

  const diffMs = today - activePlan.startDate;
  const dayNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (dayNumber > activePlan.days) {
    return NextResponse.json({
      mealData: null,
      plan: {
        id: activePlan.id,
        title: activePlan.title,
        days: activePlan.days,
        startDate: activePlan.startDate,
        endDate: activePlan.endDate,
        status: activePlan.status,
        dayNumber,
      },
      message: 'Meal plan has ended. Please generate a new one.',
    });
  }

  const detail = await prisma.mealPlanDetail.findFirst({
    where: { mealPlanId: activePlan.id, day: dayNumber },
    select: {
      day: true,
      breakfast: true,
      lunch: true,
      dinner: true,
    },
  });

  if (!detail) {
    return NextResponse.json({
      mealData: { breakfast: [], lunch: [], dinner: [] },
      plan: {
        id: activePlan.id,
        title: activePlan.title,
        days: activePlan.days,
        startDate: activePlan.startDate,
        endDate: activePlan.endDate,
        status: activePlan.status,
        dayNumber,
      },
      message: 'Meals for today not generated yet.',
    });
  }

  const bObj = detail.breakfast ? mapMeal(detail.breakfast) : null;
  const lObj = detail.lunch ? mapMeal(detail.lunch) : null;
  const dObj = detail.dinner ? mapMeal(detail.dinner) : null;

  const mealData = {
    breakfast: bObj ? [bObj] : [],
    lunch: lObj ? [lObj] : [],
    dinner: dObj ? [dObj] : [],
  };

  return NextResponse.json({
    mealData,
    plan: {
      id: activePlan.id,
      title: activePlan.title,
      days: activePlan.days,
      startDate: activePlan.startDate,
      endDate: activePlan.endDate,
      status: activePlan.status,
      dayNumber,
    },
    message: null,
  });
}

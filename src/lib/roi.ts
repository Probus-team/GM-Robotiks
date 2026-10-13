// "¿Cuánto te cuesta limpiar/servir?" — the savings estimate on the home page.
// Every assumption is listed in the calculator next to the result, and the
// visitor can change the main ones. It does not subtract the robot's price:
// that comparison happens in the quote, with the client's own numbers.

export interface Assumptions {
  /** Paid hours per person per month: 8 h × 26 working days. */
  hoursPerMonth: number;
  workDays: number;
  cleaning: {
    /** m² one person mops per hour. An assumption to adjust, not a measurement. */
    manualRate: number;
    /** Share of the floor the robot can cover; edges and corners stay manual. */
    robotShare: number;
    /** Lower bound of the CC1 coverage Pudu publishes (700–1,000 m²/h). */
    robotRate: number;
    /** Hours of work per robot per day before another unit is needed. */
    robotHoursPerDay: number;
    /** Person-time per robot per day to empty tanks and move it between areas. */
    supervisionHoursPerRobotDay: number;
  };
  serving: {
    /** Minutes for one kitchen-to-table round trip on foot. */
    minutesPerTrip: number;
    /** Share of trips a delivery robot can make; the rest still need a person. */
    robotShare: number;
  };
}

export const defaultAssumptions: Assumptions = {
  hoursPerMonth: 208,
  workDays: 26,
  cleaning: {
    manualRate: 250,
    robotShare: 0.8,
    robotRate: 700,
    robotHoursPerDay: 8,
    supervisionHoursPerRobotDay: 0.5,
  },
  serving: {
    minutesPerTrip: 2,
    robotShare: 0.7,
  },
};

export interface CleaningInput {
  /** Floor area cleaned, in m². */
  area: number;
  /** Times the floor is cleaned per day. */
  passes: number;
  /** Monthly cost of one person, MXN. */
  wage: number;
}

export interface ServingInput {
  /** Kitchen-to-table round trips per shift. */
  trips: number;
  shifts: number;
  wage: number;
}

export interface Estimate {
  hourly: number;
  /** Person-hours per month the task takes today. */
  manualHours: number;
  /** What those hours cost per month today, MXN. */
  currentCost: number;
  /** Person-hours per month a robot can take over, net of supervision. */
  freedHours: number;
  /** freedHours at the hourly cost, MXN per month. */
  savings: number;
}

export interface CleaningEstimate extends Estimate {
  robotHoursPerDay: number;
  robots: number;
}

export function estimateCleaning(input: CleaningInput, a: Assumptions = defaultAssumptions): CleaningEstimate {
  const hourly = input.wage / a.hoursPerMonth;
  const manualHours = ((input.area * input.passes) / a.cleaning.manualRate) * a.workDays;
  const robotHoursPerDay = (input.area * a.cleaning.robotShare * input.passes) / a.cleaning.robotRate;
  const robots = Math.max(1, Math.ceil(robotHoursPerDay / a.cleaning.robotHoursPerDay));
  const supervisionHours = robots * a.cleaning.supervisionHoursPerRobotDay * a.workDays;
  const freedHours = Math.max(0, manualHours * a.cleaning.robotShare - supervisionHours);
  return {
    hourly,
    manualHours,
    currentCost: manualHours * hourly,
    robotHoursPerDay,
    robots,
    freedHours,
    savings: freedHours * hourly,
  };
}

export function estimateServing(input: ServingInput, a: Assumptions = defaultAssumptions): Estimate {
  const hourly = input.wage / a.hoursPerMonth;
  const manualHours = ((input.trips * input.shifts * a.serving.minutesPerTrip) / 60) * a.workDays;
  const freedHours = manualHours * a.serving.robotShare;
  return {
    hourly,
    manualHours,
    currentCost: manualHours * hourly,
    freedHours,
    savings: freedHours * hourly,
  };
}

/** Money shown to the visitor: rounded to the nearest hundred pesos. */
export function roundMoney(value: number): number {
  return Math.round(value / 100) * 100;
}

import { prisma } from "@/lib/prisma";

export const SCORE_RULES = {
  RUN_POINTS_PER_KM: 10,
  WALK_POINTS_PER_KM: 5,
  TRAINING_ATTENDANCE: 30,
  WORKSHOP_OR_LECTURE_ATTENDANCE: 20
};

export function calculateActivityPoints(type: string, distanceKm: number) {
  const multiplier =
    type === "RUN"
      ? SCORE_RULES.RUN_POINTS_PER_KM
      : SCORE_RULES.WALK_POINTS_PER_KM;

  return Math.round(distanceKm * multiplier);
}

export function calculateEventAttendancePoints(type: string, customPoints?: number) {
  if (typeof customPoints === "number" && customPoints > 0) {
    return customPoints;
  }

  if (type === "TRAINING") {
    return SCORE_RULES.TRAINING_ATTENDANCE;
  }

  if (type === "WORKSHOP" || type === "LECTURE") {
    return SCORE_RULES.WORKSHOP_OR_LECTURE_ATTENDANCE;
  }

  return 0;
}

type ScoreRow = {
  participantId: string;
  activityId?: string;
  eventId?: string;
  source: string;
  points: number;
  description: string;
};

export async function recalculateParticipantScores(participantId: string) {
  const [activities, attendances] = await Promise.all([
    prisma.activity.findMany({
      where: {
        participantId,
        status: "APPROVED"
      },
      orderBy: { activityDate: "asc" }
    }),
    prisma.attendance.findMany({
      where: { participantId },
      include: { event: true },
      orderBy: { confirmedAt: "asc" }
    })
  ]);

  const scoreRows: ScoreRow[] = activities.map((activity) => ({
    participantId,
    activityId: activity.id,
    source: "ACTIVITY",
    points: calculateActivityPoints(activity.type, activity.distanceKm),
    description: `${activity.type === "RUN" ? "Corrida" : "Caminhada"} aprovada: ${activity.distanceKm} km`
  }));

  const attendanceUpdates = attendances.map((attendance) => {
    const points = calculateEventAttendancePoints(
      attendance.event.type,
      attendance.event.points
    );

    if (points > 0) {
      scoreRows.push({
        participantId,
        eventId: attendance.eventId,
        source: "EVENT_ATTENDANCE",
        points,
        description: `Presenca em ${attendance.event.title}`
      });
    }

    return prisma.attendance.update({
      where: { id: attendance.id },
      data: { pointsGranted: points }
    });
  });

  await prisma.$transaction([
    prisma.score.deleteMany({ where: { participantId } }),
    ...attendanceUpdates,
    ...(scoreRows.length > 0 ? [prisma.score.createMany({ data: scoreRows })] : [])
  ]);

  await recalculateGeneralRanking();
}

export async function recalculateGeneralRanking() {
  const participants = await prisma.participant.findMany({
    include: {
      scores: true,
      activities: {
        where: { status: "APPROVED" }
      }
    }
  });

  const ordered = participants
    .map((participant) => ({
      participantId: participant.id,
      totalPoints: participant.scores.reduce(
        (total, score) => total + score.points,
        0
      ),
      totalDistance: participant.activities.reduce(
        (total, activity) => total + activity.distanceKm,
        0
      )
    }))
    .sort((first, second) => {
      if (second.totalPoints !== first.totalPoints) {
        return second.totalPoints - first.totalPoints;
      }

      return second.totalDistance - first.totalDistance;
    });

  await prisma.$transaction([
    prisma.ranking.deleteMany({
      where: {
        scope: "GENERAL",
        category: "GERAL",
        period: "GENERAL"
      }
    }),
    ...ordered.map((entry, index) =>
      prisma.ranking.create({
        data: {
          participantId: entry.participantId,
          scope: "GENERAL",
          category: "GERAL",
          period: "GENERAL",
          position: index + 1,
          totalPoints: entry.totalPoints,
          totalDistance: entry.totalDistance
        }
      })
    )
  ]);
}

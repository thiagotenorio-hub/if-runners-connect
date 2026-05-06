const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.ranking.deleteMany();
  await prisma.score.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.event.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.adminUser.deleteMany();

  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.create({
    data: {
      name: "Coordenacao IF RUNNERS",
      email: "admin@ifrunners.local",
      passwordHash: adminPasswordHash
    }
  });

  const ana = await prisma.participant.create({
    data: {
      fullName: "Ana Beatriz Silva",
      email: "ana.beatriz@ifpe.edu.br",
      phone: "(87) 99999-1001",
      age: 19,
      sex: "FEMININO",
      bond: "ESTUDANTE",
      classOrSector: "2 periodo de Informatica",
      projectGoal: "Criar rotina de caminhada e melhorar condicionamento.",
      initialCondition: "Sedentaria, sem lesoes informadas.",
      registeredAt: new Date("2026-04-10T09:00:00")
    }
  });

  const bruno = await prisma.participant.create({
    data: {
      fullName: "Bruno Henrique Costa",
      email: "bruno.costa@ifpe.edu.br",
      phone: "(87) 99999-1002",
      age: 23,
      sex: "MASCULINO",
      bond: "ESTUDANTE",
      classOrSector: "6 periodo de Engenharia Eletrica",
      projectGoal: "Preparar-se para correr 5 km.",
      initialCondition: "Ativo, corre ocasionalmente.",
      registeredAt: new Date("2026-04-11T10:30:00")
    }
  });

  const carla = await prisma.participant.create({
    data: {
      fullName: "Carla Mendes Rocha",
      email: "carla.rocha@ifpe.edu.br",
      phone: "(87) 99999-1003",
      age: 35,
      sex: "FEMININO",
      bond: "SERVIDOR",
      classOrSector: "Biblioteca",
      projectGoal: "Participar dos treinos coletivos e reduzir estresse.",
      initialCondition: "Caminha duas vezes por semana.",
      registeredAt: new Date("2026-04-12T14:20:00")
    }
  });

  const diego = await prisma.participant.create({
    data: {
      fullName: "Diego Alves Santos",
      email: "diego.santos@comunidade.local",
      phone: "(87) 99999-1004",
      age: 41,
      sex: "MASCULINO",
      bond: "COMUNIDADE_EXTERNA",
      classOrSector: "Comunidade externa",
      projectGoal: "Voltar a praticar corrida com acompanhamento.",
      initialCondition: "Ja correu anteriormente, retornando apos pausa.",
      registeredAt: new Date("2026-04-13T16:45:00")
    }
  });

  const treino = await prisma.event.create({
    data: {
      title: "Treino orientado no campus",
      description: "Treino leve com orientacao para iniciantes.",
      type: "TRAINING",
      startsAt: new Date("2026-05-09T06:30:00"),
      endsAt: new Date("2026-05-09T07:30:00"),
      location: "IFPE Campus Garanhuns",
      points: 30,
      capacity: 40,
      qrToken: "treino-campus-2026-05-09"
    }
  });

  const oficina = await prisma.event.create({
    data: {
      title: "Oficina de prevencao de lesoes",
      description: "Orientacoes basicas sobre aquecimento, mobilidade e recuperacao.",
      type: "WORKSHOP",
      startsAt: new Date("2026-05-14T15:00:00"),
      endsAt: new Date("2026-05-14T17:00:00"),
      location: "Auditorio do IFPE Campus Garanhuns",
      points: 20,
      capacity: 60,
      qrToken: "oficina-lesoes-2026-05-14"
    }
  });

  const anaWalk = await prisma.activity.create({
    data: {
      participantId: ana.id,
      type: "WALK",
      distanceKm: 3.2,
      durationMinutes: 42,
      activityDate: new Date("2026-04-20T17:40:00"),
      gpsLink: "https://strava.example/activities/ana-001",
      proofUploadPath: "/uploads/ana-caminhada-001.png",
      status: "APPROVED",
      reviewedAt: new Date("2026-04-21T09:00:00")
    }
  });

  const brunoRun = await prisma.activity.create({
    data: {
      participantId: bruno.id,
      type: "RUN",
      distanceKm: 5,
      durationMinutes: 31,
      activityDate: new Date("2026-04-21T06:20:00"),
      gpsLink: "https://garmin.example/activities/bruno-001",
      proofUploadPath: "/uploads/bruno-corrida-001.png",
      status: "APPROVED",
      reviewedAt: new Date("2026-04-21T11:30:00")
    }
  });

  await prisma.activity.create({
    data: {
      participantId: carla.id,
      type: "WALK",
      distanceKm: 2.5,
      durationMinutes: 35,
      activityDate: new Date("2026-04-22T18:10:00"),
      gpsLink: "https://adidas-running.example/activities/carla-001",
      proofUploadPath: "/uploads/carla-caminhada-001.png",
      status: "PENDING"
    }
  });

  await prisma.activity.create({
    data: {
      participantId: diego.id,
      type: "RUN",
      distanceKm: 4.4,
      durationMinutes: 29,
      activityDate: new Date("2026-04-23T06:10:00"),
      gpsLink: "https://strava.example/activities/diego-001",
      proofUploadPath: "/uploads/diego-corrida-001.png",
      status: "REJECTED",
      reviewNote: "Comprovante enviado sem data visivel.",
      reviewedAt: new Date("2026-04-23T13:00:00")
    }
  });

  await prisma.attendance.createMany({
    data: [
      {
        eventId: treino.id,
        participantId: ana.id,
        confirmedAt: new Date("2026-05-09T06:35:00"),
        pointsGranted: 30
      },
      {
        eventId: treino.id,
        participantId: bruno.id,
        confirmedAt: new Date("2026-05-09T06:34:00"),
        pointsGranted: 30
      },
      {
        eventId: oficina.id,
        participantId: carla.id,
        confirmedAt: new Date("2026-05-14T15:05:00"),
        pointsGranted: 20
      }
    ]
  });

  await prisma.score.createMany({
    data: [
      {
        participantId: ana.id,
        activityId: anaWalk.id,
        source: "ACTIVITY",
        points: 16,
        description: "Caminhada aprovada: 3.2 km"
      },
      {
        participantId: ana.id,
        eventId: treino.id,
        source: "EVENT_ATTENDANCE",
        points: 30,
        description: "Presenca no treino orientado"
      },
      {
        participantId: bruno.id,
        activityId: brunoRun.id,
        source: "ACTIVITY",
        points: 50,
        description: "Corrida aprovada: 5 km"
      },
      {
        participantId: bruno.id,
        eventId: treino.id,
        source: "EVENT_ATTENDANCE",
        points: 30,
        description: "Presenca no treino orientado"
      },
      {
        participantId: carla.id,
        eventId: oficina.id,
        source: "EVENT_ATTENDANCE",
        points: 20,
        description: "Presenca na oficina de prevencao de lesoes"
      }
    ]
  });

  await prisma.ranking.createMany({
    data: [
      {
        participantId: bruno.id,
        scope: "GENERAL",
        category: "GERAL",
        period: "GENERAL",
        position: 1,
        totalPoints: 80,
        totalDistance: 5
      },
      {
        participantId: ana.id,
        scope: "GENERAL",
        category: "GERAL",
        period: "GENERAL",
        position: 2,
        totalPoints: 46,
        totalDistance: 3.2
      },
      {
        participantId: carla.id,
        scope: "GENERAL",
        category: "GERAL",
        period: "GENERAL",
        position: 3,
        totalPoints: 20,
        totalDistance: 0
      },
      {
        participantId: diego.id,
        scope: "GENERAL",
        category: "GERAL",
        period: "GENERAL",
        position: 4,
        totalPoints: 0,
        totalDistance: 0
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

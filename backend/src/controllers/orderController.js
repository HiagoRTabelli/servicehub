const prisma = require("../config/prisma");

const orderInclude = {
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  report: {
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  teamMembers: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};

async function createOrder(req, res) {
  try {
    const { code, title, description, location, equipment, priority } = req.body;

    const order = await prisma.serviceOrder.create({
      data: {
        code,
        title,
        description,
        location,
        equipment,
        priority,
        status: "AVAILABLE",
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao criar OS",
    });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await prisma.serviceOrder.findMany({
      include: orderInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(orders);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao listar OS",
    });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      include: orderInclude,
    });

    if (!order) {
      return res.status(404).json({
        error: "OS não encontrada",
      });
    }

    return res.json(order);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao buscar OS",
    });
  }
}

async function acceptOrder(req, res) {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        error: "OS não encontrada",
      });
    }

    if (existingOrder.status !== "AVAILABLE") {
      return res.status(400).json({
        error: "Só é possível aceitar OS disponíveis",
      });
    }

    const order = await prisma.serviceOrder.update({
      where: { id },
      data: {
        assignedToId: req.userId,
        status: "IN_PROGRESS",
      },
      include: orderInclude,
    });

    return res.json(order);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao aceitar OS",
    });
  }
}

async function finishOrder(req, res) {
  try {
    const { id } = req.params;

    const order = await prisma.serviceOrder.update({
      where: { id },
      data: {
        status: "FINISHED",
        finishedAt: new Date(),
      },
      include: orderInclude,
    });

    return res.json(order);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao finalizar OS",
    });
  }
}

async function addTeamMember(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const order = await prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({
        error: "OS não encontrada",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "TECHNICIAN" || !user.active) {
      return res.status(400).json({
        error: "Técnico inválido ou inativo",
      });
    }

    await prisma.orderTeamMember.create({
      data: {
        orderId: id,
        userId,
      },
    });

    const updatedOrder = await prisma.serviceOrder.findUnique({
      where: { id },
      include: orderInclude,
    });

    return res.status(201).json(updatedOrder);
  } catch (error) {
    console.log(error);

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Esse técnico já está na equipe desta OS",
      });
    }

    return res.status(500).json({
      error: "Erro ao adicionar técnico à equipe",
    });
  }
}

async function removeTeamMember(req, res) {
  try {
    const { id, memberId } = req.params;

    await prisma.orderTeamMember.delete({
      where: {
        id: memberId,
      },
    });

    const updatedOrder = await prisma.serviceOrder.findUnique({
      where: { id },
      include: orderInclude,
    });

    return res.json(updatedOrder);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao remover técnico da equipe",
    });
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  acceptOrder,
  finishOrder,
  addTeamMember,
  removeTeamMember,
};
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

async function listUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        employeeCode: true,
        photoUrl: true, 
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar usuários" });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role, employeeCode, photoUrl } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "TECHNICIAN",
        employeeCode,
        photoUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        employeeCode: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
}

async function deactivateUser(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: { active: false },
    });

    return res.json({ message: "Usuário desativado", user });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao desativar usuário" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    return res.json({ message: "Usuário excluído" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir usuário" });
  }
}


async function listActiveTechnicians(req, res) {
  try {
    const technicians = await prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        employeeCode: true,
        photoUrl: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json(technicians);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro ao listar técnicos ativos",
    });
  }
}


module.exports = {
  listUsers,
  createUser,
  deactivateUser,
  deleteUser,
  listActiveTechnicians,
  updateUser,
  
};

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, employeeCode, photoUrl, active } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        employeeCode,
        photoUrl,
        active,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        employeeCode: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}
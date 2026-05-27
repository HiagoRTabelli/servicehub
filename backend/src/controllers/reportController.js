const prisma = require("../config/prisma");

async function createReport(req, res) {
  try {
    const { orderId } = req.params;

    const {
      serviceType,
      actionTaken,
      equipmentServed,
      finalStatus,
      observations,
    } = req.body;

    const attachmentUrl = req.file ? req.file.filename : null;

    const report = await prisma.serviceReport.create({
      data: {
        orderId,
        technicianId: req.userId,
        serviceType,
        actionTaken,
        equipmentServed,
        finalStatus,
        observations,
        attachmentUrl,
      },
    });

    await prisma.serviceOrder.update({
      where: { id: orderId },
      data: {
        status: "FINISHED",
        finishedAt: new Date(),
      },
    });

    return res.status(201).json(report);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao criar relatório" });
  }
}

module.exports = {
  createReport,
};
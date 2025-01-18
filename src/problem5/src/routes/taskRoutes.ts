import { Router } from "express";
import { getRepository } from "typeorm";
import { Task } from "../entities/Task";
import { validate } from "class-validator";

const router = Router();

router.post("/", async (req, res) => {
  const resource = new Task();
  resource.name = req.body.name;
  resource.description = req.body.description;

  const errors = await validate(resource);
  if (errors.length > 0) {
    res.status(400).json(errors);

    return;
  }

  const taskRepository = getRepository(Task);
  await taskRepository.save(resource);
  res.status(201).json(resource);
});

router.get("/", async (req, res) => {
  const taskRepository = getRepository(Task);
  const resources = await taskRepository.find();
  res.json(resources);
});

router.get("/:id", async (req, res) => {
  const taskRepository = getRepository(Task);
  const resource = await taskRepository.findOne({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res.json(resource);
});

router.put("/:id", async (req, res) => {
  const taskRepository = getRepository(Task);
  const resource = await taskRepository.findOne({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  resource.name = req.body.name;
  resource.description = req.body.description;

  const errors = await validate(resource);
  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  await taskRepository.save(resource);
  res.json(resource);
});

router.delete("/:id", async (req, res) => {
  const taskRepository = getRepository(Task);
  const result = await taskRepository.delete(req.params.id);

  if (result.affected === 0) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res.status(204).send();
});

export default router;

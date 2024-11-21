import * as k8s from "@kubernetes/client-node";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { validateToken } from "./middlewares";

// Criar o cliente da API de pods
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const metricsClient = kc.makeApiClient(k8s.CustomObjectsApi);

dotenv.config();
// Configuracoes
const PORT = process.env.PORT || 3333;

// App
const app = express();

// Middlewares
app.use(validateToken);
app.use(express.json());

// Rotas
app
  /* Listar pods */
  .post("/listPodForAllNamespaces", async (_req: Request, res: Response) => {
    await k8sApi
      .listPodForAllNamespaces()
      .then((response) => res.json(response.body.items))
      .catch((err) => res.json(err));
  })
  /* Listar volumes persistentes */
  .post("/listPersistentVolume", async (_req: Request, res: Response) => {
    await k8sApi
      .listPersistentVolume()
      .then((response) => res.json(response.body.items))
      .catch((err) => res.json(err));
  })
  .post("/getPodMetrics", async (req: Request, res: Response) => {
    const { namespace, podName } = req.body;

    if (!namespace || !podName) {
      res.status(400).json({ error: "Namespace e podName obrigatórios" });
      return;
    }

    await metricsClient
      .getNamespacedCustomObject(
        "metrics.k8s.io",
        "v1beta1",
        namespace,
        "pods",
        podName
      )
      .then((metricsResponse: any) => {
        res.json(metricsResponse.body.containers[0].usage);
      })
      .catch((err) => res.json(err));
  })

  .post("/listNamespacedPod", async (req: Request, res: Response) => {
    const { namespace } = req.body;

    if (!namespace) {
      res.status(400).json({ error: "Namespace e obrigatórios" });
      return;
    }

    await k8sApi
      .listNamespacedPod(namespace)
      .then(async (data: any) => {
        res.status(200).json(data);
      })
      .catch((err) => res.json(err));
  });

// Servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

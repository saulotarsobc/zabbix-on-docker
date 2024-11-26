import * as k8s from "@kubernetes/client-node";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { IncomingMessage } from "http";
import { log, validateToken } from "./middlewares";

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
app.use(log);
app.use(validateToken);
app.use(express.json());

// Rotas
app
  /* Listar pods */
  .post("/listPodForAllNamespaces", async (_req: Request, res: Response) => {
    await k8sApi
      .listPodForAllNamespaces()
      .then((data) => {
        res.json(data.body.items);
      })
      .catch((err) => {
        console.error("listPodForAllNamespaces", err);
        res.json(err);
      });
  })

  /* Listar volumes persistentes */
  .post("/listPersistentVolume", async (_req: Request, res: Response) => {
    await k8sApi
      .listPersistentVolume()
      .then(
        (data: {
          response: IncomingMessage;
          body: k8s.V1PersistentVolumeList;
        }) => {
          res.json(data.body.items);
        }
      )
      .catch((err) => {
        console.error("listPersistentVolume", err);
        res.json(err);
      });
  })

  /* Obter metrics */
  .post("/getPodMetrics", async (req: Request, res: Response) => {
    const { namespace, podName } = req.body;

    if (!namespace || !podName) {
      console.error("getPodMetrics", "Namespace e podName obrigatórios");
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
      .then((data: { response: IncomingMessage; body: object | any }) => {
        res.json({
          ...data.body.containers[0].usage,
          data: data.body,
        });
      })
      .catch((err) => {
        console.error("getPodMetrics", err);
        res.json(err);
      });
  })

  /* Listar pods */
  .post("/listNamespacedPod", async (req: Request, res: Response) => {
    const { namespace } = req.body;

    if (!namespace) {
      res.status(400).json({ error: "Namespace é obrigatório" });
      return;
    }

    await k8sApi
      .listNamespacedPod(namespace)
      .then((data: { response: IncomingMessage; body: k8s.V1PodList }) => {
        res.status(200).send(data.body.items);
      })
      .catch((err) => {
        console.error("listNamespacedPod", err);
        res.json(err);
      });
  });

// Servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

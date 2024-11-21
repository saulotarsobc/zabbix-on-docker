import * as k8s from "@kubernetes/client-node";
import { IncomingMessage } from "http";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Cria o cliente para a API de pods
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

async function listContainers() {
  try {
    const response: {
      response: IncomingMessage;
      body: k8s.V1PodList;
    } = await k8sApi.listPodForAllNamespaces();
    const pods = response.body.items;
    const apiContainers: any = [];

    pods.forEach((pod: k8s.V1Pod) => {
      const metadata = pod.metadata;
      const spec = pod.spec;
      const status = pod.status;
      if (
        status &&
        spec &&
        spec &&
        metadata &&
        metadata?.name?.includes("api")
      ) {
        pod?.spec?.containers.forEach((container: any) => {
          if (container.name === "api") {
            apiContainers.push({
              namespace: metadata?.namespace,
              podName: metadata.name,
              containerName: container.name,
              image: container.image,
              nodeName: spec.nodeName,
              status: status.phase,
            });
          }
        });
      }
    });
    return apiContainers;
  } catch (error) {
    console.error("Erro ao obter pods:", (error as Error).message);
  }
}

async function getContainerMetrics(container: any): Promise<any> {
  const metricsClient = kc.makeApiClient(k8s.CustomObjectsApi);

  const metricsResponse: any = await metricsClient.getNamespacedCustomObject(
    "metrics.k8s.io",
    "v1beta1",
    container.namespace,
    "pods",
    container.podName
  );

  const containerMetrics = metricsResponse.body.containers.find(
    (c: any) => c.name === container.containerName
  );

  return metricsResponse.body.containers[0].usage;
}

async function main() {
  const apiContainers = await listContainers();

  for (const container of apiContainers) {
    const metrics = await getContainerMetrics(container);
    console.log(JSON.stringify(metrics, null, 2));
  }
}

main();

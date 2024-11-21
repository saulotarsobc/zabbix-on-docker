import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

async function listContainers() {
  try {
    const response = await k8sApi.listPodForAllNamespaces();
    // const pods = response.body.items;
    // const apiContainers: any = [];

    // pods.forEach((pod: k8s.V1Pod) => {
    //   const metadata: k8s.V1ObjectMeta | undefined = pod.metadata;
    //   const spec: k8s.V1PodSpec | undefined = pod.spec;
    //   const status: k8s.V1PodStatus | undefined = pod.status;
    //   if (status && spec && spec && metadata) {
    //     pod?.spec?.containers.forEach((container: any) => {
    //       apiContainers.push({
    //         namespace: metadata.namespace,
    //         podName: metadata.name,
    //         containerName: container.name,
    //         image: container.image,
    //         nodeName: spec.nodeName,
    //         status: status,
    //       });
    //     });
    //   }
    // });
    // return apiContainers;

    return response.body;
  } catch (error) {
    console.error("Erro ao obter pods:", (error as Error).message);
  }
}

async function getContainerMetrics(
  namespace: string,
  podName: string
): Promise<any> {
  const metricsClient = kc.makeApiClient(k8s.CustomObjectsApi);

  const metricsResponse: any = await metricsClient.getNamespacedCustomObject(
    "metrics.k8s.io",
    "v1beta1",
    namespace,
    "pods",
    podName
  );

  return metricsResponse.body.containers[0].usage;
}

async function main() {
  const containers = await listContainers();

  console.log(JSON.stringify(containers, null, 2));

  if (!containers) {
    console.log("Nenhum container encontrado.");
    return;
  }

  for (const container of containers?.items) {
    const metrics = await getContainerMetrics(
      container?.metadata?.namespace || "",
      container?.metadata?.name || ""
    );

    console.log(
      container?.metadata?.name || "",
      JSON.stringify(metrics, null, 2)
    );
  }
}

main();

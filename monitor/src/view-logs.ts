import * as k8s from "@kubernetes/client-node";

async function main() {
  // Carrega a configuração do kubeconfig padrão
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  // Cria o cliente para a API de pods
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  try {
    console.log("Obtendo informações de pods com contêineres 'api'...");

    // Lista todos os pods no cluster
    const response = await k8sApi.listPodForAllNamespaces();
    const pods = response.body.items;

    // Filtrar contêineres com o nome 'api'
    const apiContainers: any = [];
    pods.forEach((pod: any) => {
      pod.spec.containers.forEach((container: any) => {
        if (container.name === "api") {
          apiContainers.push({
            namespace: pod.metadata.namespace,
            podName: pod.metadata.name,
            containerName: container.name,
            image: container.image,
            nodeName: pod.spec.nodeName,
            status: pod.status.phase,
          });
        }
      });
    });

    console.log("Contêineres 'api' encontrados:");
    console.log(JSON.stringify(apiContainers, null, 2));
  } catch (error: any) {
    console.error("Erro ao interagir com o cluster:", error.message);
  }

  const logs = new k8s.Log(kc);
  const stream = await logs.log(
    "hcode",
    process.env.POD_NAME || "api-xxx-yyy",
    "api",
    process.stdout,
    { follow: true }
  );

  stream.on("error", (error: any) => {
    console.error("Erro ao obter logs:", error.message);
  });

  stream.on("data", (data: any) => {
    console.log(data.toString());
  });
  stream.on("close", () => {
    console.log("Conexão encerrada.");
  });
}

main();

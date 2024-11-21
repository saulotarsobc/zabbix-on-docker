const k8s = require("@kubernetes/client-node");

async function main() {
  // Carregar o kubeconfig
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault(); // Certifique-se de que você configurou o kubeconfig localmente

  // Criar o cliente da API de pods
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  try {
    console.log("Obtendo pods...");
    const response = await k8sApi.listPodForAllNamespaces();

    const containers: any = [];
    response.body.items.forEach((pod: any) => {
      pod.spec.containers.forEach((container: any) => {
        containers.push({
          namespace: pod.metadata.namespace,
          podName: pod.metadata.name,
          containerName: container.name,
          image: container.image,
          status: pod.status.phase,
        });
      });
    });

    console.log("Contêineres encontrados:");
    console.log(JSON.stringify(containers, null, 2));
  } catch (error: any) {
    console.error("Erro ao obter pods:", error.message);
  }
}

main();

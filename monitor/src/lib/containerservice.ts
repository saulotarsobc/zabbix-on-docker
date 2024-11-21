require("dotenv").config();
import { ContainerServiceClient } from "@azure/arm-containerservice";
import { DefaultAzureCredential } from "@azure/identity";

async function main() {
  // Obter as credenciais
  const credential = new DefaultAzureCredential();

  // ID da assinatura do Azure (configure no .env ou substitua diretamente aqui)
  const subscriptionId =
    process.env.AZURE_SUBSCRIPTION_ID || "SEU_SUBSCRIPTION_ID";

  // Inicializa o cliente do Azure Kubernetes Service
  const containerServiceClient = new ContainerServiceClient(
    credential,
    subscriptionId
  );

  try {
    console.log("Listando clusters AKS...");

    // Listar todos os clusters AKS
    const clusters = [];
    for await (const cluster of containerServiceClient.managedClusters.list()) {
      clusters.push({
        id: cluster.id,
        name: cluster.name,
        location: cluster.location,
        kubernetesVersion: cluster.kubernetesVersion,
      });
    }

    console.log("Clusters AKS encontrados:");
    console.log(JSON.stringify(clusters, null, 2));

    // Caso queira detalhes de um cluster específico
    const RESOURCE_GROUP = "aaaaaaa"; // Nome do grupo de recursos
    const CLUSTER_NAME = "bbbbbbb"; // Nome do cluster

    console.log(`Obtendo detalhes do cluster: ${CLUSTER_NAME}...`);
    const clusterDetails = await containerServiceClient.managedClusters.get(
      RESOURCE_GROUP,
      CLUSTER_NAME
    );

    console.log("Detalhes do cluster:");
    console.log(JSON.stringify(clusterDetails, null, 2));
  } catch (error: any) {
    console.error(
      "Erro ao listar ou obter detalhes do cluster AKS:",
      error.message
    );
  }
}

main().catch((err) => {
  console.error("Erro no programa:", err.message);
});

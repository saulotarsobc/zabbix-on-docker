require("dotenv").config();
import { DefaultAzureCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";

async function main() {
  // Obter as credenciais do Azure
  const credential = new DefaultAzureCredential();

  // ID da assinatura do Azure (configure no .env ou substitua diretamente aqui)
  const subscriptionId =
    process.env.AZURE_SUBSCRIPTION_ID || "SEU_SUBSCRIPTION_ID";

  // Cliente de Gerenciamento de Recursos
  const resourceClient = new ResourceManagementClient(
    credential,
    subscriptionId
  );

  // Filtro por tipo de recurso
  const filter =
    "resourceType eq 'Microsoft.ContainerService/managedClusters' or resourceType eq 'Microsoft.ContainerInstance/containerGroups'";

  const containerResources = [];

  // Listar recursos com o filtro aplicado
  for await (const resource of resourceClient.resources.list({ filter })) {
    containerResources.push({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      location: resource.location,
    });
  }

  console.log("Recursos de contêiner encontrados:");
  console.log(JSON.stringify(containerResources, null, 2));

  for (const resource of containerResources) {
    try {
      // Obter informações detalhadas do recurso
      const resourceDetails = await resourceClient.resources.getById(
        String(resource.id),
        "2024-07-01"
      );

      console.log("Detalhes do recurso:");
      console.log(JSON.stringify(resourceDetails, null, 2));
    } catch (error: any) {
      console.error("Erro ao obter detalhes do recurso:", error.message);
    }
  }
}

main().catch((err) => {
  console.error("Erro:", err.message);
});

# metricnames

## Pods status

- Pending
- Failed
- Running
- Succeeded
- Unknown
- ??? CrashLoopBackOff

## VM's

```txt
Percentage CPU
Network In
Network Out
Disk Read Bytes
Disk Write Bytes
Disk Read Operations/Sec
Disk Write Operations/Sec
CPU Credits Remaining
CPU Credits Consumed
Data Disk Read Bytes/sec
Data Disk Write Bytes/sec
Data Disk Read Operations/Sec
Data Disk Write Operations/Sec
Data Disk Queue Depth
Data Disk Latency
Data Disk Bandwidth Consumed Percentage
Data Disk IOPS Consumed Percentage
Data Disk Target Bandwidth
Data Disk Target IOPS
Data Disk Max Burst Bandwidth
Data Disk Max Burst IOPS
Data Disk Used Burst BPS Credits Percentage
Data Disk Used Burst IO Credits Percentage
OS Disk Read Bytes/sec
OS Disk Write Bytes/sec
OS Disk Read Operations/Sec
OS Disk Write Operations/Sec
OS Disk Queue Depth
OS Disk Latency
OS Disk Bandwidth Consumed Percentage
OS Disk IOPS Consumed Percentage
OS Disk Target Bandwidth
OS Disk Target IOPS
OS Disk Max Burst Bandwidth
OS Disk Max Burst IOPS
OS Disk Used Burst BPS Credits Percentage
OS Disk Used Burst IO Credits Percentage
Temp Disk Latency
Temp Disk Read Bytes/sec
Temp Disk Write Bytes/sec
Temp Disk Read Operations/Sec
Temp Disk Write Operations/Sec
Temp Disk Queue Depth
Inbound Flows
Outbound Flows
Inbound Flows Maximum Creation Rate
Outbound Flows Maximum Creation Rate
Premium Data Disk Cache Read Hit
Premium Data Disk Cache Read Miss
Premium OS Disk Cache Read Hit
Premium OS Disk Cache Read Miss
VM Cached Bandwidth Consumed Percentage
VM Cached IOPS Consumed Percentage
VM Uncached Bandwidth Consumed Percentage
VM Uncached IOPS Consumed Percentage
Network In Total
Network Out Total
Available Memory Bytes
VmAvailabilityMetric
VM Remote Used Burst IO Credits Percentage
VM Remote Used Burst BPS Credits Percentage
VM Local Used Burst IO Credits Percentage
VM Local Used Burst BPS Credits Percentage
```

## metric namespace

```txt
Microsoft.AppPlatform/Spring
Microsoft.Purview/accounts
Microsoft.StorageSync/storageSyncServices
Microsoft.DataFactory/factories
Microsoft.DBforMySQL/servers
Microsoft.DBforMySQL/flexibleServers
Microsoft.MachineLearningServices/workspaces
Microsoft.Network/dnszones
Microsoft.Network/frontdoors
Microsoft.Network/virtualNetworkGateways
Microsoft.Network/connections
Microsoft.Network/applicationGateways
Microsoft.Network/expressRouteCircuits
Microsoft.Network/vpnGateways
Microsoft.Network/p2sVpnGateways
Microsoft.Network/expressRouteGateways
Microsoft.Network/expressRoutePorts
Microsoft.Network/azureFirewalls
Microsoft.Network/virtualRouters
Microsoft.Network/privateDnsZones
Microsoft.Network/trafficmanagerprofiles
Microsoft.Network/virtualNetworks
Microsoft.Network/natGateways
Microsoft.Network/publicIPAddresses
Microsoft.Network/networkInterfaces
Microsoft.Network/privateEndpoints
Microsoft.Network/loadBalancers
Microsoft.Network/networkWatchers/connectionMonitors
Microsoft.Network/privateLinkServices
Microsoft.DBforPostgreSQL/servers
Microsoft.DBforPostgreSQL/flexibleServers
Microsoft.AVS/privateClouds
Microsoft.ContainerRegistry/registries
Microsoft.Cdn/profiles
Microsoft.Cdn/CdnWebApplicationFirewallPolicies
Microsoft.Storage/storageAccounts
Microsoft.Storage/storageAccounts/blobServices
Microsoft.Storage/storageAccounts/tableServices
Microsoft.Storage/storageAccounts/queueServices
Microsoft.Storage/storageAccounts/fileServices
Microsoft.EventGrid/eventSubscriptions
Microsoft.EventGrid/topics
Microsoft.EventGrid/domains
Microsoft.EventGrid/extensionTopics
Microsoft.EventGrid/systemTopics
Microsoft.EventGrid/namespaces
Microsoft.EventGrid/partnerNamespaces
Microsoft.EventGrid/partnerTopics
Microsoft.MixedReality/spatialAnchorsAccounts
Microsoft.MixedReality/remoteRenderingAccounts
Microsoft.SignalRService/SignalR
Microsoft.SignalRService/WebPubSub
Microsoft.SignalRService/SignalR/replicas
Microsoft.SignalRService/WebPubSub/replicas
Microsoft.DataShare/accounts
Microsoft.Relay/namespaces
Microsoft.Logic/workflows
Microsoft.Logic/integrationServiceEnvironments
Microsoft.ServiceBus/namespaces
Microsoft.Media/mediaservices
Microsoft.Media/mediaservices/streamingEndpoints
Microsoft.Media/mediaservices/liveEvents
Microsoft.Peering/peerings
Microsoft.Peering/peeringServices
microsoft.insights/components
microsoft.insights/autoscalesettings
Microsoft.PowerBIDedicated/capacities
Microsoft.Search/searchServices
Microsoft.DocumentDB/databaseAccounts
Microsoft.Cache/Redis
Microsoft.Cache/redisEnterprise
Microsoft.CognitiveServices/accounts
Microsoft.DataLakeStore/accounts
Microsoft.ApiManagement/service
Microsoft.DBforMariaDB/servers
Microsoft.AnalysisServices/servers
Microsoft.NotificationHubs/namespaces/notificationHubs
Microsoft.Maps/accounts
Microsoft.Batch/batchAccounts
Microsoft.Web/staticSites
Microsoft.Web/serverFarms
Microsoft.Web/sites
Microsoft.Web/sites/slots
Microsoft.Web/hostingEnvironments
Microsoft.Web/hostingEnvironments/multiRolePools
Microsoft.Web/hostingEnvironments/workerPools
Microsoft.Web/connections
Microsoft.CustomProviders/resourceProviders
Microsoft.DataLakeAnalytics/accounts
Microsoft.IoTCentral/IoTApps
Microsoft.ClassicStorage/storageAccounts
Microsoft.ClassicStorage/storageAccounts/blobServices
Microsoft.ClassicStorage/storageAccounts/tableServices
Microsoft.ClassicStorage/storageAccounts/fileServices
Microsoft.ClassicStorage/storageAccounts/queueServices
Microsoft.HDInsight/clusters
Microsoft.OperationalInsights/workspaces
Microsoft.EventHub/namespaces
Microsoft.EventHub/clusters
Microsoft.ContainerService/managedClusters
Microsoft.DigitalTwins/digitalTwinsInstances
Microsoft.StreamAnalytics/streamingjobs
Microsoft.Kusto/clusters
Microsoft.NetApp/netAppAccounts/capacityPools
Microsoft.NetApp/netAppAccounts/capacityPools/volumes
Microsoft.Automation/automationAccounts
Microsoft.Compute/virtualMachines
Microsoft.Compute/virtualMachineScaleSets
Microsoft.Compute/virtualMachineScaleSets/virtualMachines
Microsoft.Compute/cloudServices
Microsoft.Compute/cloudServices/roles
Microsoft.ContainerInstance/containerGroups
Microsoft.HealthcareApis/services
Microsoft.HealthcareApis/workspaces/dicomservices
Microsoft.HealthcareApis/workspaces/iotconnectors
Microsoft.HealthcareApis/workspaces/fhirservices
Microsoft.ClassicCompute/domainNames/slots/roles
Microsoft.ClassicCompute/virtualMachines
Microsoft.DataBoxEdge/DataBoxEdgeDevices
Microsoft.Synapse/workspaces
Microsoft.Synapse/workspaces/bigDataPools
Microsoft.Synapse/workspaces/sqlPools
Microsoft.Synapse/workspaces/kustoPools
Microsoft.Devices/IotHubs
Microsoft.Devices/ProvisioningServices
Microsoft.Sql/servers
Microsoft.Sql/servers/databases
Microsoft.Sql/servers/elasticpools
Microsoft.Sql/managedInstances
Microsoft.KeyVault/vaults
Microsoft.KeyVault/managedHSMs
Microsoft.Orbital/terminals
Microsoft.Orbital/contactProfiles
Microsoft.Orbital/spacecrafts
Microsoft.NetworkCloud/clusterManagers
Microsoft.NetworkCloud/storageAppliances
Microsoft.NetworkCloud/bareMetalMachines
Microsoft.NetworkCloud/clusters
microsoft.purview/accounts
Microsoft.AppPlatform/spring
Microsoft.DevCenter/devcenters
Microsoft.StorageTasks/storageTasks
Microsoft.MachineLearningServices/workspaces/onlineEndpoints
Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments
Microsoft.StorageMover/storageMovers
Microsoft.Network/networkinterfaces
Microsoft.Network/natgateways
Microsoft.Network/dnsForwardingRulesets
microsoft.network/p2svpngateways
Microsoft.Network/applicationgateways
Microsoft.Network/publicIPPrefixes
Microsoft.Network/dnsResolverPolicies
microsoft.network/virtualnetworkgateways
Microsoft.Network/networkManagers/ipamPools
microsoft.network/bastionHosts
Microsoft.Network/dnsResolvers
microsoft.network/vpngateways
Microsoft.Network/virtualHubs
microsoft.network/expressroutegateways
Microsoft.Network/dnsResolverDomainLists
Microsoft.DBForPostgreSQL/serverGroupsv2
microsoft.avs/privateClouds
Microsoft.azurestackhci/clusters
microsoft.kubernetes/connectedClusters
microsoft.securitydetonation/chambers
Microsoft.ConnectedVehicle/platformAccounts
Microsoft.Cdn/cdnwebapplicationfirewallpolicies
Microsoft.App/managedEnvironments
Microsoft.App/containerapps
Microsoft.App/jobs
Microsoft.Storage/storageTasks
Microsoft.Storage/storageAccounts/objectReplicationPolicies
Microsoft.Monitor/accounts
Microsoft.ServiceNetworking/trafficControllers
Microsoft.Communication/CommunicationServices
microsoft.experimentation/experimentWorkspaces
Microsoft.HybridContainerService/provisionedClusters
Microsoft.MobileNetwork/packetcorecontrolplanes
Microsoft.MobileNetwork/mobilenetworks/sites
Microsoft.MobileNetwork/radioAccessNetworks
Microsoft.MobileNetwork/packetcorecontrolplanes/packetcoredataplanes
Microsoft.AppConfiguration/configurationStores
Microsoft.DevOpsInfrastructure/pools
Microsoft.Dashboard/grafana
Microsoft.Logic/IntegrationServiceEnvironments
Microsoft.Logic/Workflows
Microsoft.ServiceBus/Namespaces
Microsoft.Insights/datacollectionrules
Microsoft.DocumentDB/cassandraClusters
Microsoft.DocumentDB/DatabaseAccounts
Microsoft.DocumentDB/mongoClusters
Microsoft.Cache/redis
Microsoft.ElasticSan/elasticSans
Microsoft.CognitiveSearch/indexes
microsoft.singularity/accounts
Oracle.Database/autonomousDatabases
Oracle.Database/cloudVmClusters
Microsoft.VoiceServices/CommunicationsGateways
Microsoft.StorageActions/storageTasks
Microsoft.MessagingConnectors/connectors
Microsoft.Batch/batchaccounts
Microsoft.Web/staticsites
Microsoft.Web/serverfarms
Microsoft.Web/hostingenvironments/multirolepools
Microsoft.Web/hostingenvironments/workerpools
Microsoft.Web/containerapps
Microsoft.NetworkFunction/azureTrafficCollectors
microsoft.hybridnetwork/networkfunctions
Microsoft.NetworkAnalytics/DataConnectors
Microsoft.ConnectedCache/enterpriseMccCustomers
Microsoft.ConnectedCache/ispCustomers
Microsoft.ConnectedCache/CacheNodes
Microsoft.EventHub/Namespaces
Microsoft.CodeSigning/codesigningaccounts
microsoft.kubernetesconfiguration/extensions
Microsoft.Databricks/workspaces
Wandisco.Fusion/migrators/liveDataMigrations
Wandisco.Fusion/migrators/dataTransferAgents
Wandisco.Fusion/migrators
Wandisco.Fusion/migrators/metadataMigrations
Microsoft.StorageCache/amlFilesystems
Microsoft.StorageCache/caches
Microsoft.DataProtection/BackupVaults
Microsoft.Cloudtest/pools
Microsoft.Cloudtest/hostedpools
Microsoft.Compute/cloudservices
Microsoft.Compute/virtualmachineScaleSets
microsoft.compute/disks
Microsoft.ContainerInstance/containerScaleSets
Microsoft.HealthModel/healthmodels
Microsoft.ManagedNetworkFabric/internetGateways
Microsoft.ManagedNetworkFabric/l3IsolationDomains
Microsoft.ManagedNetworkFabric/networkDevices
Microsoft.RecoveryServices/Vaults
Microsoft.PlayFab/titles
Microsoft.AAD/DomainServices
Microsoft.Sql/servers/jobAgents
Microsoft.ProviderHub/providerRegistrations
Microsoft.ProviderHub/providerMonitorSettings
microsoft.aadiam/azureADMetrics
microsoft.keyvault/managedhsms
```
